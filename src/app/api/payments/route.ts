import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const payments = await db.payment.findMany({
      where: { userId },
      include: {
        submission: {
          include: { plan: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedPayments = payments.map((p) => ({
      ...p,
      created_at: p.createdAt,
      paid_at: p.paidAt,
      submission: {
        title: p.submission?.title,
        planName: p.submission?.plan?.name,
      },
    }));

    return NextResponse.json({ payments: mappedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
