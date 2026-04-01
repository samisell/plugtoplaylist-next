import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";
import { sendWelcomeEmail, sendNewUserAdminNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

// POST - Register, Login, Verify, Forgot Password, Guest
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const { action, email, password, name, token, type, userId: guestId } = body;

    // Handle Guest User
    if (action === "guest") {
      const adminClient = createAdminClient() as any;
      
      // Prevent duplicate email errors by checking if they already exist
      const { data: existingUser } = await adminClient.from("users" as any).select("id, display_name").eq("email", email).single();
      
      const finalGuestId = existingUser?.id || crypto.randomUUID();
      const displayName = name || existingUser?.display_name || "Guest User";

      if (!existingUser) {
        await adminClient.from("users" as any).insert({
          id: finalGuestId,
          email: email || `guest_${guestId.slice(0, 8)}@ptp.com`,
          display_name: displayName,
          role: "user",
          metadata: { is_guest: true }
        });
      }

      return NextResponse.json({
        user: {
          id: finalGuestId,
          display_name: displayName,
          role: "user",
          isGuest: true
        }
      });
    }

    // Standard Auth Actions
    if (action === "register") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (authError) throw authError;

      // 2. Sync to our custom User table (SnakeCase)
      if (authData.user) {
        const adminClient = createAdminClient() as any;
        
        await adminClient.from("users" as any).upsert({
          id: authData.user.id,
          email: authData.user.email!,
          display_name: name || null,
          role: "user",
          metadata: { 
            referral_code: randomBytes(4).toString("hex").toUpperCase() 
          }
        }, { onConflict: "id" });
      }

      return NextResponse.json({
        message: "Registration successful. Please check your email.",
        userId: authData.user?.id
      }, { status: 201 });
    }

    if (action === "verify") {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: (type as any) || "signup",
      });
      if (error) throw error;
      return NextResponse.json({ session: data.session, user: data.user });
    }

    if (action === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const adminClient = createAdminClient() as any;
      const { data: profile } = await adminClient.from("users" as any).select("*").eq("id", data.user.id).single();

      return NextResponse.json({
        session: data.session,
        user: {
          ...data.user,
          ...(profile || {})
        }
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - Get current user (SnakeCase Mapping)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const adminSupabase = createAdminClient() as any;
    const { data: user, error } = await adminSupabase
      .from("users" as any)
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Map snake_case to what the frontend expects if necessary
    // But for simplicity letting the keys stay as they are from the DB
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}