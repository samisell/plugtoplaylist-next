interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  duration?: number; // in seconds
  trackId: string;
  trackType: "spotify" | "youtube";
}

let spotifyToken: { value: string; expires: number } | null = null;

async function getSpotifyToken() {
  const now = Date.now();
  if (spotifyToken && spotifyToken.expires > now) {
    return spotifyToken.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === "your_spotify_client_id") {
    throw new Error("Spotify credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get Spotify token");
  }

  const data = await response.json();
  spotifyToken = {
    value: data.access_token,
    expires: now + data.expires_in * 1000 - 60000, // expire 1 min early
  };

  return spotifyToken.value;
}

export async function fetchSpotifyMetadata(url: string, isRetry = false): Promise<TrackMetadata> {
  // Extract track ID from URL
  const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/);
  if (!trackIdMatch) {
    throw new Error("Invalid Spotify track URL");
  }
  const trackId = trackIdMatch[1];

  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // If unauthorized due to an expired token, clear cache and retry once
  if (response.status === 401 && !isRetry) {
    console.log("Spotify token expired. Refreshing token and retrying...");
    spotifyToken = null; // Clear the invalid token
    return fetchSpotifyMetadata(url, true);
  }

  if (!response.ok) {
    // Spotify's Developer API is blocking access (e.g., Premium requirement). 
    // Fallback to Spotify's public oEmbed API which requires no tokens!
    try {
        console.log("Spotify dev API blocked. Falling back to public oEmbed API...");
        const fallbackRes = await fetch(`https://open.spotify.com/oembed?url=spotify:track:${trackId}`);
        if (fallbackRes.ok) {
            const embedData = await fallbackRes.json();
            return {
                title: embedData.title,
                artist: embedData.author_name || "Spotify Artist", // oEmbed sometimes provides author_name
                album: "Spotify Single",
                coverImage: embedData.thumbnail_url,
                duration: 0,
                trackId: trackId,
                trackType: "spotify"
            };
        }
    } catch(err) {
        console.log("oEmbed fallback also failed.");
    }

    const errorText = await response.text().catch(() => "Could not read error body");
    throw new Error(`Failed to fetch Spotify track metadata: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  return {
    title: data.name,
    artist: data.artists.map((a: any) => a.name).join(", "),
    album: data.album.name,
    coverImage: data.album.images[0]?.url,
    duration: Math.floor(data.duration_ms / 1000),
    trackId: data.id,
    trackType: "spotify",
  };
}

export async function fetchYouTubeMetadata(url: string): Promise<TrackMetadata> {
  // Extract video ID from URL
  let videoId = "";
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === "your_youtube_api_key") {
    throw new Error("YouTube API key not configured");
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube metadata");
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("YouTube video not found");
  }

  const item = data.items[0];
  const snippet = item.snippet;
  
  // Parse ISO 8601 duration (e.g., PT3M45S)
  const durationMatch = item.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(durationMatch[1] || "0");
  const minutes = parseInt(durationMatch[2] || "0");
  const seconds = parseInt(durationMatch[3] || "0");
  const durationInSeconds = hours * 3600 + minutes * 60 + seconds;

  return {
    title: snippet.title,
    artist: snippet.channelTitle, // For YouTube, we use channel name as artist by default
    coverImage: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url,
    duration: durationInSeconds,
    trackId: videoId,
    trackType: "youtube",
  };
}

export async function getTrackMetadata(url: string): Promise<TrackMetadata> {
  if (url.includes("spotify.com")) {
    return fetchSpotifyMetadata(url);
  } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return fetchYouTubeMetadata(url);
  } else {
    throw new Error("Unsupported URL platform. Use Spotify or YouTube.");
  }
}
