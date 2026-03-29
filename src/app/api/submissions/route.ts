import { NextRequest, NextResponse } from "next/server";
import { supabase, createAdminClient } from "@/lib/supabase/client";
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
      .from("submissions")
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

    const { data: submissions, error } = await query;

    if (error) throw error;

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
    const adminClient = createAdminClient();
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

    // Create submission
    const { data: submission, error: submissionError } = await adminClient
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

    if (submissionError) throw submissionError;

    // Get plan price for payment
    const { data: plan, error: planError } = await adminClient
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Create pending payment
    const { error: paymentError } = await adminClient
      .from("payments")
      .insert({
        userId: userId || null,
        submissionId: submission.id,
        amount: plan.price,
        currency: "USD",
        status: "pending",
        provider: "stripe",
      });

    if (paymentError) throw paymentError;

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
      const { data: userData } = await adminClient
        .from("users")
        .select("email")
        .eq("id", userId)
        .single();
      if (userData) userEmail = userData.email;
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
    const adminClient = createAdminClient();
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

    const { data: submission, error } = await adminClient
      .from("submissions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}