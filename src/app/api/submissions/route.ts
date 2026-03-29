import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendSubmissionConfirmationEmail, sendNewSubmissionAdminNotification } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// GET - List submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }

    const submissions = await db.submission.findMany({
      where,
      include: {
        plan: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

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

    // Create submission
    const submission = await db.submission.create({
      data: {
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
      },
      include: {
        plan: true,
      },
    });

    // Get plan price for payment
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Create pending payment
    const payment = await db.payment.create({
      data: {
        userId: userId || null,
        submissionId: submission.id,
        amount: plan.price,
        currency: "USD",
        status: "pending",
        provider: "stripe",
      },
    });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: submission.title,
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
    const userEmail = userId ? (await db.user.findUnique({ where: { id: userId } }))?.email : guestEmail;
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
        updateData.startDate = new Date();
      }
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const submission = await db.submission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}