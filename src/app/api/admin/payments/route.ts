import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
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

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const searchQuery = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (searchQuery) {
      where.OR = [
        { id: { contains: searchQuery, mode: "insensitive" } },
        { user: { email: { contains: searchQuery, mode: "insensitive" } } },
        { submission: { title: { contains: searchQuery, mode: "insensitive" } } },
      ];
    }

    // Fetch payments with pagination
    const payments = await db.payment.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        submission: { select: { id: true, title: true, artist: true, guestName: true, guestEmail: true, plan: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await db.payment.count({ where });

    // Get payment stats
    const completedPayments = await db.payment.count({ where: { status: "completed" } });
    const pendingPayments = await db.payment.count({ where: { status: "pending" } });
    const failedPayments = await db.payment.count({ where: { status: "failed" } });
    const refundedPayments = await db.payment.count({ where: { status: "refunded" } });

    // Calculate total revenue (sum of completed payments)
    const revenueAgg = await db.payment.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });
    const totalRevenue = revenueAgg._sum.amount || 0;

    // Calculate refunds
    const refundsAgg = await db.payment.aggregate({
      where: { status: "refunded" },
      _sum: { amount: true },
    });
    const totalRefunds = refundsAgg._sum.amount || 0;

    // Format payments for response
    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      submissionId: payment.submissionId,
      user: payment.user?.email || payment.submission?.guestEmail || "Unknown",
      userName: payment.user?.name || payment.submission?.guestName || "Guest User",
      track: payment.submission?.title || "Unknown Track",
      artist: payment.submission?.artist || "Unknown Artist",
      plan: payment.submission?.plan?.name || "Unknown Plan",
      amount: payment.amount,
      currency: payment.currency || "GBP",
      status: payment.status,
      method: payment.provider || "Manual",
      paidAt: payment.paidAt?.toISOString() || null,
      createdAt: payment.createdAt.toISOString(),
    }));

    return NextResponse.json({
      payments: formattedPayments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalRevenue,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        totalRefunds,
      },
    });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { paymentId, action, reason } = body;

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: "Payment ID and action are required" },
        { status: 400 }
      );
    }

    const validActions = ["approve", "reject", "refund"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be approve, reject, or refund" },
        { status: 400 }
      );
    }

    // Get payment
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { submission: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    let updatedPayment;

    switch (action) {
      case "approve":
        // Can only approve pending or failed payments
        if (payment.status === "completed") {
          return NextResponse.json(
            { error: "Payment is already approved" },
            { status: 409 }
          );
        }
        
        updatedPayment = await db.payment.update({
          where: { id: paymentId },
          data: { 
            status: "completed", 
            paidAt: new Date() 
          },
          include: { 
            submission: { 
              include: { plan: true } 
            },
            user: { 
              select: { id: true, email: true, name: true } 
            }
          },
        });

        // Update submission payment status
        await db.submission.update({
          where: { id: payment.submissionId },
          data: { paymentStatus: "paid" },
        });
        break;

      case "reject":
        // Can only reject pending or completed payments
        updatedPayment = await db.payment.update({
          where: { id: paymentId },
          data: { status: "failed" },
          include: { 
            submission: { 
              include: { plan: true } 
            },
            user: { 
              select: { id: true, email: true, name: true } 
            }
          },
        });

        // Update submission back to pending
        await db.submission.update({
          where: { id: payment.submissionId },
          data: { paymentStatus: "pending" },
        });
        break;

      case "refund":
        // Can only refund completed payments
        if (payment.status !== "completed") {
          return NextResponse.json(
            { error: "Can only refund completed payments" },
            { status: 409 }
          );
        }

        updatedPayment = await db.payment.update({
          where: { id: paymentId },
          data: { status: "refunded" },
          include: { 
            submission: { 
              include: { plan: true } 
            },
            user: { 
              select: { id: true, email: true, name: true } 
            }
          },
        });

        // Update submission back to pending
        await db.submission.update({
          where: { id: payment.submissionId },
          data: { paymentStatus: "pending" },
        });
        break;
    }

    return NextResponse.json(
      {
        success: true,
        message: `Payment ${action}ed successfully`,
        payment: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin payment action error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the payment action" },
      { status: 500 }
    );
  }
}
