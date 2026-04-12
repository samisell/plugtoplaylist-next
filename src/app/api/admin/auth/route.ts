import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

const ADMIN_SESSION_COOKIE = "ptp_admin_id";

function adminPayload(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    display_name: user.name,
    role: user.role,
    metadata: {
      referral_code: user.referralCode,
      referralCode: user.referralCode,
    },
  };
}

function withAdminSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: userId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    if (action === "login") {
      console.log("[AdminAuth] Initiating admin login for email:", email);

      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const user = await db.user.findUnique({ where: { email } });

      if (!user) {
        console.log("[AdminAuth] User not found:", email);
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      // Check if user is an admin
      if (user.role !== "admin") {
        console.log("[AdminAuth] User is not admin:", email, "role:", user.role);
        return NextResponse.json({ error: "Admin access required. You do not have administrator privileges." }, { status: 403 });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log("[AdminAuth] Password mismatch for:", email);
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      console.log("[AdminAuth] Admin login successful for:", email);
      const response = NextResponse.json({
        message: "Admin login successful.",
        user: adminPayload(user),
      });

      return withAdminSessionCookie(response, user.id);
    }

    if (action === "logout") {
      console.log("[AdminAuth] Admin logout");
      const response = NextResponse.json({ message: "Logged out successfully" });
      response.cookies.set(ADMIN_SESSION_COOKIE, "", { maxAge: 0 });
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[AdminAuth] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const user = await db.user.findUnique({ where: { id: sessionCookie } });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: adminPayload(user) });
  } catch (error) {
    console.error("[AdminAuth] Error checking admin session:", error);
    return NextResponse.json({ user: null });
  }
}
