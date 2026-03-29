import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { sendSubmissionConfirmationEmail, sendNewSubmissionAdminNotification } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// GET - List submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query = supabase
      .from("Submission") // Try singular first
      .select(`
        *,
        plan:planId (*),
        payment:id (amount, currency, status, provider)
      `)
      .order("createdAt", { ascending: false });
    
    if (userId) {
      query = query.eq("userId", userId);
    }
    
    if (status) {
      query = query.eq("status", status);
    }

    let { data: submissions, error } = await query;

    if (error && (error.code === 'PGRST204' || error.code === 'PGRST205')) {
       // Try plural fallback if singular fails
       let altQuery = supabase
        .from("submissions")
        .select(`
            *,
            plan:planId (*),
            payment:submissionId (amount, currency, status, provider)
        `)
        .order("createdAt", { ascending: false });
       
       if (userId) altQuery = altQuery.eq("userId", userId);
       if (status) altQuery = altQuery.eq("status", status);
       
       const { data: altData, error: altError } = await altQuery;
       if (!altError) submissions = altData;
       else throw error;
    } else if (error) {
       throw error;
    }

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST - Create a new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      guestEmail,
      guestName,
      trackUrl,
      trackType,
      trackId,
      title,
      artist,
      album,
      coverImage,
      duration,
      planId,
    } = body;

    // Validate required fields
    if (!trackUrl || !title || !artist || !planId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create submission - Try singular first
    let { data: submission, error: submissionError } = await supabase
      .from("Submission")
      .insert({
        userId: userId || null,
        guestEmail: guestEmail || null,
        guestName: guestName || null,
        trackUrl,
        trackType: trackType || "spotify",
        trackId: trackId || null,
        title,
        artist,
        album: album || null,
        coverImage: coverImage || null,
        duration: duration || null,
        planId,
        status: "pending",
        paymentStatus: "pending",
      })
      .select(`
        *,
        plan:planId (*)
      `)
      .single();

    if (submissionError) {
        // Try plural fallback
        const { data: altData, error: altError } = await supabase
          .from("submissions")
          .insert({
            userId: userId || null,
            guestEmail: guestEmail || null,
            guestName: guestName || null,
            trackUrl,
            trackType: trackType || "spotify",
            trackId: trackId || null,
            title,
            artist,
            album: album || null,
            coverImage: coverImage || null,
            duration: duration || null,
            planId,
            status: "pending",
            paymentStatus: "pending",
          })
          .select(`
            *,
            plan:planId (*)
          `)
          .single();
        
        if (altError) throw submissionError;
        submission = altData;
    }

    // Get plan price for payment - Try singular first
    let { data: plan, error: planError } = await supabase
      .from("Plan")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError) {
        const { data: altData } = await supabase.from("plans").select("*").eq("id", planId).single();
        if (altData) plan = altData;
        else {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }
    }

    // Create pending payment - Try singular first
    const { error: paymentError } = await supabase
      .from("Payment")
      .insert({
        userId: userId || null,
        submissionId: submission.id,
        amount: plan.price,
        currency: "USD",
        status: "pending",
        provider: "stripe",
      });

    if (paymentError) {
        await supabase.from("payments").insert({
            userId: userId || null,
            submissionId: submission.id,
            amount: plan.price,
            currency: "USD",
            status: "pending",
            provider: "stripe",
        });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: submission.title || "Song Submission",
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/dashboard/submissions?success=true`,
      cancel_url: `${request.headers.get("origin")}/submit?canceled=true`,
      metadata: {
        submissionId: submission.id,
      },
    });

    // Send notification emails
    let userEmail = guestEmail;
    if (userId) {
      const { data: userData } = await supabase
        .from("User")
        .select("email")
        .eq("id", userId)
        .single();
      if (userData) userEmail = userData.email;
      else {
        const { data: altUserData } = await supabase.from("users").select("email").eq("id", userId).single();
        if (altUserData) userEmail = altUserData.email;
      }
    }

    if (userEmail) {
      await sendSubmissionConfirmationEmail(userEmail, submission.id);
    }
    await sendNewSubmissionAdminNotification(submission.id, submission.trackUrl);

    return NextResponse.json({ submission, checkoutUrl: session.url }, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}

// PATCH - Update submission status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    
    if (status) {
      updateData.status = status;
      
      // Set dates based on status
      if (status === "active") {
        updateData.startDate = new Date().toISOString();
      }
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    let { data: submission, error } = await supabase
      .from("Submission")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
        const { data: altData, error: altError } = await supabase
          .from("submissions")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();
        
        if (altError) throw error;
        submission = altData;
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}