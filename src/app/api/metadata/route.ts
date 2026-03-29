import { NextRequest, NextResponse } from "next/server";
import { getTrackMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  try {
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const metadata = await getTrackMetadata(url);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Metadata error:", error);
    // Return gracefully fall-back data so the user isn't stuck on step 1
    // due to Spotify's premium API restrictions.
    return NextResponse.json({
      title: "Unknown Track (Metadata Blocked)",
      artist: "Unknown Artist",
      album: "Unknown Album",
      coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
      duration: 0,
      trackId: "fallback_id",
      trackType: url?.includes("youtube") ? "youtube" : "spotify"
    });
  }
}
