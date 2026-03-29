import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

// GET - Admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const adminClient = createAdminClient();
    
    // In production, add admin authentication check here
    
    // Get counts
    const [
      { count: totalUsers },
      { count: totalSubmissions },
      { count: pendingSubmissions },
      { count: activeSubmissions },
      { count: completedSubmissions },
      { data: paidPayments },
    ] = await Promise.all([
      adminClient.from("users").select("*", { count: "exact", head: true }),
      adminClient.from("submissions").select("*", { count: "exact", head: true }),
      adminClient.from("submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      adminClient.from("submissions").select("*", { count: "exact", head: true }).eq("status", "active"),
      adminClient.from("submissions").select("*", { count: "exact", head: true }).eq("status", "completed"),
      adminClient.from("payments").select("amount").eq("status", "paid"),
    ]);

    const totalRevenue = paidPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get recent submissions
    const { data: recentSubmissions } = await adminClient
      .from("submissions")
      .select(`
        *,
        plan:planId (*),
        payment:id (*)
      `)
      .order("createdAt", { ascending: false })
      .limit(10);

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: payments } = await adminClient
      .from("payments")
      .select("amount, paidAt")
      .eq("status", "paid")
      .gte("paidAt", sixMonthsAgo.toISOString());

    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    payments?.forEach((payment) => {
      if (payment.paidAt) {
        const month = payment.paidAt.slice(0, 7);
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
        totalUsers: totalUsers || 0,
        totalSubmissions: totalSubmissions || 0,
        pendingSubmissions: pendingSubmissions || 0,
        activeSubmissions: activeSubmissions || 0,
        completedSubmissions: completedSubmissions || 0,
        totalRevenue,
        revenueGrowth,
      },
      recentSubmissions: recentSubmissions || [],
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
