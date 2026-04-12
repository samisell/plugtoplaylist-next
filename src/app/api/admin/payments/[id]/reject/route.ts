import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params;
    const cookieStore = await cookies();
    const adminId = cookieStore.get("ptp_admin_id")?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get payment
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { submission: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update payment status to failed
    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        status: "failed",
      },
      include: {
        submission: {
          include: { plan: true },
        },
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    // Update submission back to pending
    await db.submission.update({
      where: { id: payment.submissionId },
      data: { paymentStatus: "pending" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment rejected successfully",
        payment: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin payment rejection error:", error);
    return NextResponse.json(
      { error: "Failed to reject payment" },
      { status: 500 }
    );
  }
}
