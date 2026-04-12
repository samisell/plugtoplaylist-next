import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { randomBytes, randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getTrackMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function mapSubmission(submission: any) {
  const mappedPayment = submission.payment
    ? {
        ...submission.payment,
        created_at: submission.payment.createdAt,
        paid_at: submission.payment.paidAt,
      }
    : null;

  return {
    ...submission,
    created_at: submission.createdAt,
    updated_at: submission.updatedAt,
    user_id: submission.userId,
    plan_id: submission.planId,
    track_title: submission.title,
    artist_name: submission.artist,
    cover_art_url: submission.coverImage,
    duration_seconds: submission.duration,
    metadata: {
      album: submission.album,
      streams: 0,
      progress: submission.status === "active" ? 50 : submission.status === "completed" ? 100 : 0,
      daysRemaining: submission.status === "active" ? 14 : 0,
    },
    payment: mappedPayment ? [mappedPayment] : [],
  };
}

async function ensureUser(userId?: string, guestName?: string, guestEmail?: string) {
  if (!userId) return null;

  const existing = await db.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  if (guestEmail) {
    const byEmail = await db.user.findUnique({ where: { email: guestEmail } });
    if (byEmail) return byEmail;
  }

  return db.user.create({
    data: {
      id: userId,
      email: guestEmail || `guest_${userId.substring(0, 8)}@ptp.com`,
      name: guestName || "Guest User",
      password: randomBytes(24).toString("hex"),
      role: "user",
      referralCode: randomBytes(4).toString("hex").toUpperCase(),
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const status = searchParams.get("status") || undefined;

    const submissions = await db.submission.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        plan: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions: submissions.map(mapSubmission) });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let {
      userId,
      trackUrl,
      trackType,
      title,
      artist,
      album,
      coverImage,
      duration,
      planId,
      guestName,
      guestEmail,
    } = body;

    if (!trackUrl || !planId) {
      return NextResponse.json({ error: "Track URL and Plan ID are required" }, { status: 400 });
    }

    if (!userId) {
      userId = randomUUID();
    }

    // Validate userId is a non-empty string (supports both UUID and Prisma cuid formats)
    if (typeof userId !== "string" || !userId.trim()) {
      return NextResponse.json(
        {
          error: "Session expired",
          details: "Invalid user session. Please refresh the page and try again.",
        },
        { status: 401 }
      );
    }

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
    } catch (error) {
      console.warn("Metadata enrichment skipped:", error);
    }

    const user = await ensureUser(userId, guestName, guestEmail);
    const plan = await db.plan.findUnique({ where: { id: planId } });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const submission = await db.submission.create({
      data: {
        userId: user?.id || null,
        planId,
        guestName: guestName || null,
        guestEmail: guestEmail || null,
        trackUrl,
        trackType: trackType || (trackUrl.includes("youtube") || trackUrl.includes("youtu.be") ? "youtube" : "spotify"),
        title: title || "Unknown Track",
        artist: artist || "Unknown Artist",
        album: album || null,
        coverImage: coverImage || null,
        duration: duration ? Math.floor(Number(duration)) : null,
        status: "pending",
        paymentStatus: "pending",
      },
      include: { plan: true, payment: true },
    });

    await db.payment.create({
      data: {
        userId: user?.id || null,
        submissionId: submission.id,
        amount: plan.price,
        currency: "GBP",
        status: "pending",
        provider: "stripe",
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: plan.name,
              description: submission.title || "Track submission",
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/dashboard/submissions?success=true`,
      cancel_url: `${request.headers.get("origin")}/submit?canceled=true`,
      metadata: { submissionId: submission.id },
    });

    const fullSubmission = await db.submission.findUnique({
      where: { id: submission.id },
      include: { plan: true, payment: true },
    });

    return NextResponse.json(
      {
        submission: fullSubmission ? mapSubmission(fullSubmission) : mapSubmission(submission),
        checkoutUrl: session.url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal failure" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const submission = await db.submission.update({
      where: { id },
      data: { status },
      include: { plan: true, payment: true },
    });

    return NextResponse.json({ submission: mapSubmission(submission) });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
