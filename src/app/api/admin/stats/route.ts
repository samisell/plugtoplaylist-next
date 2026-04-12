import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      totalUsers,
      totalSubmissions,
      pendingSubmissions,
      activeSubmissions,
      completedSubmissions,
      paidPayments,
      recentSubmissions,
      recentPayments,
    ] = await Promise.all([
      db.user.count(),
      db.submission.count(),
      db.submission.count({ where: { status: "pending" } }),
      db.submission.count({ where: { status: "active" } }),
      db.submission.count({ where: { status: "completed" } }),
      db.payment.findMany({ where: { status: "paid" }, select: { amount: true } }),
      db.submission.findMany({
        include: { plan: true, payment: true, user: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.payment.findMany({
        where: { status: "paid", paidAt: { not: null } },
        select: { amount: true, paidAt: true },
      }),
    ]);

    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    const monthlyRevenue: Record<string, number> = {};
    for (const payment of recentPayments) {
      if (!payment.paidAt) continue;
      const month = payment.paidAt.toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.amount;
    }

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
        totalRevenue,
        revenueGrowth,
      },
      recentSubmissions: recentSubmissions.map((s) => ({
        ...s,
        created_at: s.createdAt,
        track_title: s.title,
        artist_name: s.artist,
      })),
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
