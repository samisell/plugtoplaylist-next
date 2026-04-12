import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const ADMIN_SESSION_COOKIE = "ptp_admin_id";

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const cookieStore = cookies();
    const adminId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: adminId } });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get admin dashboard statistics
    const totalUsers = await db.user.count();
    const totalSubmissions = await db.submission.count();
    const activeSubmissions = await db.submission.count({ where: { status: "active" } });
    const completedSubmissions = await db.submission.count({ where: { status: "completed" } });

    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyPayments = await db.payment.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: "paid",
      },
    });

    const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate success rate
    const successRate = totalSubmissions > 0 ? ((completedSubmissions / totalSubmissions) * 100).toFixed(1) : "0";

    // Get recent submissions (last 5)
    const recentSubmissions = await db.submission.findMany({
      where: { status: { not: "cancelled" } },
      include: { user: true, plan: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Format recent submissions
    const formattedSubmissions = recentSubmissions.map((submission) => ({
      id: submission.id,
      title: submission.title || "Unknown Track",
      artist: submission.artist || "Unknown Artist",
      user: submission.user?.email || submission.guestEmail || "Unknown",
      status: submission.status,
      plan: submission.plan?.name || "Unknown",
      amount: `$${submission.payment?.amount || submission.plan?.price || 0}`,
      submittedAt: new Date(submission.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    // Get revenue data for last 6 months
    const revenueData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthRevenue = monthlyPayments
        .filter((payment) => payment.createdAt >= startOfMonth && payment.createdAt <= endOfMonth)
        .reduce((sum, payment) => sum + payment.amount, 0);

      revenueData.push({
        month: months[i < 5 ? i + 1 : 0],
        value: Math.round(monthRevenue),
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        activeSubmissions,
        monthlyRevenue: Math.round(monthlyRevenue),
        successRate: parseFloat(successRate as string),
      },
      recentSubmissions: formattedSubmissions,
      revenueData,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
