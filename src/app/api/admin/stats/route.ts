import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    // In production, add admin authentication check here
    
    // Get counts
    const [
      totalUsers,
      totalSubmissions,
      pendingSubmissions,
      activeSubmissions,
      completedSubmissions,
      totalPayments,
    ] = await Promise.all([
      db.user.count(),
      db.submission.count(),
      db.submission.count({ where: { status: "pending" } }),
      db.submission.count({ where: { status: "active" } }),
      db.submission.count({ where: { status: "completed" } }),
      db.payment.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
    ]);

    // Get recent submissions
    const recentSubmissions = await db.submission.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        plan: true,
        payment: true,
      },
    });

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await db.payment.findMany({
      where: {
        status: "paid",
        paidAt: { gte: sixMonthsAgo },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    });

    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    payments.forEach((payment) => {
      if (payment.paidAt) {
        const month = payment.paidAt.toISOString().slice(0, 7);
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.amount;
      }
    });

    // Calculate growth rates
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);
    
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const twoMonthsAgoStr = twoMonthsAgo.toISOString().slice(0, 7);

    const lastMonthRevenue = monthlyRevenue[lastMonthStr] || 0;
    const prevMonthRevenue = monthlyRevenue[twoMonthsAgoStr] || 1;
    const revenueGrowth = ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSubmissions,
        pendingSubmissions,
        activeSubmissions,
        completedSubmissions,
        totalRevenue: totalPayments._sum.amount || 0,
        revenueGrowth,
      },
      recentSubmissions,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
