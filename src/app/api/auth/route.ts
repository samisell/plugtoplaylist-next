import { NextRequest, NextResponse } from "next/server";
import { randomBytes, randomUUID, randomInt } from "crypto";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "ptp_user_id";

function userPayload(user: any) {
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

function withSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: userId,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, token, userId: guestId, newPassword } = body;

    if (action === "guest") {
      const fallbackEmail = email || `guest_${(guestId || randomUUID()).slice(0, 8)}@ptp.com`;
      let user = await db.user.findUnique({ where: { email: fallbackEmail } });

      if (!user) {
        user = await db.user.create({
          data: {
            id: guestId || randomUUID(),
            email: fallbackEmail,
            name: name || "Guest User",
            password: randomBytes(24).toString("hex"), // Guest users don't need real passwords
            role: "user",
            referralCode: randomBytes(4).toString("hex").toUpperCase(),
            emailVerified: new Date(), // Guest emails are considered verified
          },
        });
      }

      const response = NextResponse.json({ user: { ...userPayload(user), isGuest: true } });
      return withSessionCookie(response, user.id);
    }

    if (action === "signup") {
      console.log("[Auth:Signup] Initiating signup for email:", email);
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const exists = await db.user.findUnique({ where: { email } });
      if (exists) {
        console.log("[Auth:Signup] User already exists:", email);
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = randomInt(100000, 1000000).toString();
      const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      console.log("[Auth:Signup] Attempting database insertion...");
      const user = await db.user.create({
        data: {
          email,
          name: name || null,
          password: hashedPassword,
          role: "user",
          referralCode: randomBytes(4).toString("hex").toUpperCase(),
          verificationToken,
          verificationTokenExpiry,
        },
      });
      console.log("[Auth:Signup] User created successfully with ID:", user.id);

      console.log("[Auth:Signup] Attempting to send verification email...");
      try {
        await sendVerificationEmail(user.email, verificationToken);
        console.log("[Auth:Signup] Verification email sent successfully.");
      } catch (emailError: any) {
        console.error("[Auth:Signup] Email sending failed:", emailError.message);
        // Don't fail signup if email fails - user can resend later
      }

      return NextResponse.json(
        {
          message: "Registration successful. Please check your email to verify your account. If you didn't receive an email, you can request a new one.",
          userId: user.id,
        },
        { status: 201 }
      );
    }

    if (action === "resend-verification") {
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.emailVerified) {
        return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
      }

      const verificationToken = randomInt(100000, 1000000).toString();
      const verificationTokenExpiry = new Date(Date.now() + 3600000);

      await db.user.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationTokenExpiry,
        },
      });

      await sendVerificationEmail(user.email, verificationToken);

      return NextResponse.json({ message: "Verification code resent successfully." });
    }

    if (action === "verify-email") {
      if (!email || !token) {
        return NextResponse.json({ error: "Email and token are required" }, { status: 400 });
      }

      const user = await db.user.findUnique({ where: { email } });

      if (!user || user.verificationToken !== token || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
        return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
      }

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });

      const response = NextResponse.json({ message: "Email verified successfully.", user: userPayload(updatedUser) });
      return withSessionCookie(response, updatedUser.id);
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      if (!user.emailVerified) {
        return NextResponse.json({ error: "Please verify your email address first." }, { status: 403 });
      }

      const response = NextResponse.json({
        message: "Login successful.",
        user: userPayload(user),
      });

      return withSessionCookie(response, user.id);
    }

    if (action === "logout") {
      const response = NextResponse.json({ message: "Logged out successfully" });
      response.cookies.set(SESSION_COOKIE, "", { maxAge: 0 });
      return response;
    }

    if (action === "forgot-password") {
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const user = await db.user.findUnique({ where: { email } });

      if (user) {
        const passwordResetToken = randomBytes(32).toString("hex");
        const passwordResetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await db.user.update({
          where: { id: user.id },
          data: {
            passwordResetToken,
            passwordResetTokenExpiry,
          },
        });
        await sendPasswordResetEmail(user.email, passwordResetToken);
      }

      return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    if (action === "reset-password") {
      if (!email || !token || !newPassword) {
        return NextResponse.json({ error: "Email, token, and new password are required" }, { status: 400 });
      }

      const user = await db.user.findUnique({ where: { email } });

      if (!user || user.passwordResetToken !== token || !user.passwordResetTokenExpiry || user.passwordResetTokenExpiry < new Date()) {
        return NextResponse.json({ error: "Invalid or expired password reset token" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
        },
      });

      return NextResponse.json({ message: "Password has been reset successfully." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: error.message || "Auth failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || request.cookies.get(SESSION_COOKIE)?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: userPayload(user) });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null });
  }
}