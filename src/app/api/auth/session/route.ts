import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "ptp_user_id";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        display_name: user.name,
        role: user.role,
        metadata: {
          referral_code: user.referralCode,
          referralCode: user.referralCode,
        },
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
