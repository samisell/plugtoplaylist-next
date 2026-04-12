import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function mapUser(user: any) {
  return {
    ...user,
    display_name: user.name,
    avatar_url: user.avatar,
    referralCode: user.referralCode,
    metadata: {
      referral_code: user.referralCode,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: mapUser(user) });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const data: any = {};
    if (typeof updates.name === "string") data.name = updates.name;
    if (typeof updates.avatar === "string") data.avatar = updates.avatar;
    if (typeof updates.phone === "string") data.phone = updates.phone;
    if (typeof updates.role === "string") data.role = updates.role;
    if (typeof updates.referralCode === "string") data.referralCode = updates.referralCode;

    const user = await db.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({ user: mapUser(user), message: "Profile updated" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
