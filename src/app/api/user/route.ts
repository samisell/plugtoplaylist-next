import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET - Fetch user profile (SnakeCase Sync)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const adminSupabase = createAdminClient() as any;
    
    // Primary plural 'users' - snakeCase standardized
    const { data: user, error } = await adminSupabase
      .from("users" as any)
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Map snake_case to frontend camelCase expectations
    const mappedUser = {
        ...user,
        name: user.display_name || (user as any).name, // Fallback for various table versions
        avatar: user.avatar_url || (user as any).avatar,
        referralCode: user.metadata?.referral_code || user.metadata?.referralCode || user.referralCode,
        location: user.location
    };

    return NextResponse.json({ user: mappedUser });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

// PATCH - Update user profile (SnakeCase Sync)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const adminSupabase = createAdminClient() as any;
    
    // Map camelCase frontend fields to actual Supabase snake_case columns
    const snakeCaseUpdates: any = {};
    if (updates.name) snakeCaseUpdates.display_name = updates.name;
    if (updates.avatar) snakeCaseUpdates.avatar_url = updates.avatar;
    if (updates.phone) snakeCaseUpdates.phone = updates.phone;
    if (updates.bio) snakeCaseUpdates.bio = updates.bio;
    if (updates.artist_name) snakeCaseUpdates.artist_name = updates.artist_name;
    if (updates.genre) snakeCaseUpdates.genre = updates.genre;
    if (updates.metadata) snakeCaseUpdates.metadata = updates.metadata;

    // Direct field passthrough for ones that match
    for (const key in updates) {
        if (!snakeCaseUpdates[key] && !["name", "avatar"].includes(key)) {
            snakeCaseUpdates[key] = updates[key];
        }
    }

    const { data, error } = await adminSupabase
      .from("users" as any)
      .update(snakeCaseUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ user: data, message: "Profile updated" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}