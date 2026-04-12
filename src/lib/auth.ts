import { NextRequest, NextResponse } from "next/server";
import { db } from "./db";

const SESSION_COOKIE = "ptp_user_id";

export async function getSessionUser(request: NextRequest) {
  const userId = request.cookies.get(SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest) => {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, user);
  };
}

export function userPayload(user: any) {
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

export function withSessionCookie(response: NextResponse, userId: string) {
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
