import { NextRequest, NextResponse } from "next/server";
import { supabase, createServerClient } from "@/lib/supabase/client";
import { sendSubmissionConfirmationEmail, sendNewSubmissionAdminNotification } from "@/lib/email";
import { getTrackMetadata } from "@/lib/metadata";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// GET - List submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    // Use Admin Client
    const adminSupabase = createServerClient();

    let query = adminSupabase
      .from("submissions")
      .select(`
        *,
        plan:plans (*),
        payment:payments (*)
      `)
      .order("created_at", { ascending: false });
    
    if (userId) query = query.eq("user_id", userId);
    if (status) query = query.eq("status", status);

    const { data: submissions, error } = await query;

    if (error) {
       console.error("Fetch submissions error:", error);
       throw error;
    }

    // Map snake_case to camelCase for frontend compatibility if needed
    // But for now, just returning as is
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
    console.log("Submission attempt started (SnakeCase Sync)...");
    const body = await request.json();
    
    let {
      userId,
      trackUrl,
      trackType, // from frontend
      title,
      artist,
      album,
      coverImage,
      duration,
      planId,
      guestName,
      guestEmail
    } = body;

    if (!trackUrl || !planId) {
      return NextResponse.json({ error: "Track URL and Plan ID are required" }, { status: 400 });
    }

    // Validate userId is a UUID (prevents legacy guest_ crash)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (userId && !uuidRegex.test(userId)) {
        console.warn("Legacy ID detected:", userId);
        return NextResponse.json({ 
            error: "Session expired", 
            details: "Your guest session format is outdated. Please refresh the page and try again." 
        }, { status: 401 });
    }

    // Metadata enrichment
    try {
        const metadata = await getTrackMetadata(trackUrl);
        if (metadata) {
            title = title || metadata.title;
            artist = artist || metadata.artist;
            album = album || metadata.album;
            coverImage = coverImage || metadata.coverImage;
            duration = duration || metadata.duration;
            trackType = trackType || metadata.trackType;
        }
    } catch (e) {
        console.warn("Metadata skip:", e);
    }

    // ACTUAL Supabase Insert Payload (SnakeCase)
    // Map existing fields to DB columns
    const subData: any = {
        user_id: userId,
        plan_id: planId,
        track_title: title || "Unknown Track",
        artist_name: artist || "Unknown Artist",
        spotify_url: trackUrl.includes("spotify") ? trackUrl : null,
        youtube_url: trackUrl.includes("youtube") || trackUrl.includes("youtu.be") ? trackUrl : null,
        cover_art_url: coverImage,
        duration_seconds: duration ? Math.floor(duration) : null,
        status: "pending",
        metadata: { 
            album: album || null, 
            guest_name: guestName || null, 
            guest_email: guestEmail || null 
        }
    };

    const adminSupabase = createServerClient();

    // Ensure the user exists in the database to prevent foreign key errors (e.g., stale local storage UUIDs)
    if (userId) {
        const { data: existingUser } = await adminSupabase.from("users").select("id").eq("id", userId).single();
        if (!existingUser) {
            console.log(`User ${userId} not found in DB. Searching by email...`);
            
            if (guestEmail) {
                const { data: userByEmail } = await (adminSupabase.from("users").select("id").eq("email", guestEmail).single() as any);
                if (userByEmail) {
                    console.log(`Found existing user by email: ${userByEmail.id}. Linking to submission.`);
                    userId = userByEmail.id;
                    subData.user_id = userId;
                } else {
                    console.log(`Upserting entirely new guest...`);
                    await (adminSupabase.from("users").insert({
                        id: userId,
                        email: guestEmail || `guest_${userId.substring(0, 8)}@ptp.com`,
                        display_name: guestName || "Guest User",
                        role: "user",
                        metadata: { is_guest: true }
                    } as any) as any);
                }
            } else {
                await (adminSupabase.from("users").insert({
                    id: userId,
                    email: `guest_${userId.substring(0, 8)}@ptp.com`,
                    display_name: guestName || "Guest User",
                    role: "user",
                    metadata: { is_guest: true }
                } as any) as any);
            }
        }
    }

    console.log("Inserting submission data to snake_case table...");
    const { data: submission, error: submissionError } = await (adminSupabase
      .from("submissions")
      .insert(subData)
      .select(`*, plan:plans (*)`)
      .single() as any);

    if (submissionError) {
        console.error("Submissions insert fail:", submissionError);
        return NextResponse.json({ error: "Database insert failed", details: submissionError.message }, { status: 500 });
    }

    // Get plan price for Stripe
    let { data: plan, error: planError } = await (adminSupabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single() as any);

    if (planError || !plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Create Payment Record (SnakeCase)
    const payData: any = {
        user_id: userId,
        submission_id: (submission as any).id,
        plan_id: planId,
        amount: (plan as any).price,
        currency: "GBP",
        status: "pending",
        payment_method: "card",
        metadata: { submission_id: (submission as any).id }
    };

    await adminSupabase.from("payments").insert(payData);

    // Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
          price_data: {
            currency: "gbp",
            product_data: { 
                name: (plan as any).name, 
                description: (submission as any).track_title 
            },
            unit_amount: Math.round((plan as any).price * 100),
          },
          quantity: 1,
      }],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/dashboard/submissions?success=true`,
      cancel_url: `${request.headers.get("origin")}/submit?canceled=true`,
      metadata: { submissionId: (submission as any).id },
    });

    return NextResponse.json({ submission, checkoutUrl: session.url }, { status: 201 });
  } catch (error) {
    console.error("CRITICAL Submission Error:", error);
    return NextResponse.json({ error: "Internal failure" }, { status: 500 });
  }
}

// PATCH - Update submission status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const adminSupabase = createServerClient();
    const { data: submission, error } = await adminSupabase
      .from("submissions")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}