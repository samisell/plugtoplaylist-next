import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { randomBytes } from "crypto";
import { sendWelcomeEmail, sendNewUserAdminNotification } from "@/lib/email";

// POST - Register or Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (action === "register") {
      // Check if user exists
      let { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();
      
      if (!existingUser) {
        const { data: altUser } = await supabase.from("User").select("id").eq("email", email).single();
        if (altUser) existingUser = altUser;
      }

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      // Generate referral code
      const referralCode = randomBytes(4).toString("hex").toUpperCase();

      // Create user
      let { data: user, error } = await supabase
        .from("users")
        .insert({
          email,
          name: name || null,
          password, // In production, hash this!
          referralCode,
        })
        .select()
        .single();

      if (error) {
         const { data: altUser, error: altError } = await supabase
           .from("User")
           .insert({ email, name: name || null, password, referralCode })
           .select()
           .single();
         if (altError) throw error;
         user = altUser;
      }

      // Send notification emails
      if (user) {
        await sendWelcomeEmail(user.email, user.name || 'New User');
        await sendNewUserAdminNotification(user.email);
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          referralCode: user.referralCode,
        },
      }, { status: 201 });
    }

    if (action === "login") {
      // Find user
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
      
      if (error) {
         const { data: altUser } = await supabase.from("User").select("*").eq("email", email).single();
         if (altUser) {
            user = altUser;
            error = null;
         }
      }

      if (error || !user || user.password !== password) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          referralCode: user.referralCode,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// GET - Get current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, avatar, phone, referralCode, referralEarnings, createdAt")
      .eq("id", userId)
      .single();
    
    if (error) {
        const { data: altUser } = await supabase
          .from("User")
          .select("id, email, name, role, avatar, phone, referralCode, referralEarnings, createdAt")
          .eq("id", userId)
          .single();
        if (altUser) {
            user = altUser;
            error = null;
        }
    }

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}