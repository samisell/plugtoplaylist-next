import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendGuestSubmissionConfirmation } from "@/lib/email";

const prisma = new PrismaClient();

// Simple metadata extraction from URLs
const extractSpotifyId = (url: string): string | null => {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

const extractYoutubeId = (url: string): string | null => {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const validateGuestSubmission = (data: Record<string, unknown>): { isValid: boolean; error?: string } => {
  const { guestName, guestEmail, trackUrl, trackType } = data;

  if (!guestName || typeof guestName !== "string" || guestName.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (!guestEmail || typeof guestEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (!trackUrl || typeof trackUrl !== "string" || trackUrl.trim().length < 10) {
    return { isValid: false, error: "Please enter a valid track URL" };
  }

  if (!trackType || (trackType !== "spotify" && trackType !== "youtube")) {
    return { isValid: false, error: "Invalid track platform" };
  }

  // Validate URL format
  try {
    new URL(trackUrl);
  } catch {
    return { isValid: false, error: "Invalid URL format" };
  }

  // Validate platform matches URL
  if (trackType === "spotify" && !trackUrl.includes("spotify.com")) {
    return { isValid: false, error: "Invalid Spotify URL" };
  }

  if (trackType === "youtube" && !trackUrl.includes("youtube.com") && !trackUrl.includes("youtu.be")) {
    return { isValid: false, error: "Invalid YouTube URL" };
  }

  return { isValid: true };
};

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { guestName, guestEmail, trackUrl, trackType } = body;

    // Validate input
    const validation = validateGuestSubmission({ guestName, guestEmail, trackUrl, trackType });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Extract track ID based on platform
    let trackId: string | null = null;
    if (trackType === "spotify") {
      trackId = extractSpotifyId(trackUrl);
    } else if (trackType === "youtube") {
      trackId = extractYoutubeId(trackUrl);
    }

    if (!trackId) {
      return NextResponse.json(
        { error: "Could not extract track ID from URL. Please check the link." },
        { status: 400 }
      );
    }

    // Create submission record in database
    const submission = await prisma.submission.create({
      data: {
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        trackUrl: trackUrl.trim(),
        trackType,
        trackId,
        status: "pending",
        paymentStatus: "pending",
      },
    });

    // Send confirmation email to guest
    try {
      await sendGuestSubmissionConfirmation(
        guestEmail.trim().toLowerCase(),
        guestName.trim(),
        submission.id
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your song has been submitted successfully! We'll review it and contact you via email within 24 hours.",
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guest submission error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your submission. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
