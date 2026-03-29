import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

// GET - Admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const adminClient = createAdminClient();
    
    // In production, add admin authentication check here
    
    // Attempt to get counts using prioritized table names (Prisma style)
    const getCounts = async () => {
        const tables = ["User", "Submission", "Payment"];
        const results: Record<string, any> = {};
        
        for (const table of tables) {
            let { count, error } = await adminClient.from(table).select("*", { count: "exact", head: true });
            
            if (error && (error.code === 'PGRST204' || error.code === 'PGRST205')) {
                // Try plural fallback
                const pluralName = `${table.toLowerCase()}s`;
                const { count: altCount, error: altError } = await adminClient.from(pluralName).select("*", { count: "exact", head: true });
                if (!altError) count = altCount;
            }
            results[table] = count || 0;
        }
        return results;
    };

    const counts = await getCounts();

    // Get specific status counts for submissions
    const getSubmissionStats = async () => {
        const stats = { pending: 0, active: 0, completed: 0 };
        const statuses = ["pending", "active", "completed"] as const;
        
        for (const status of statuses) {
            let { count, error } = await adminClient.from("Submission").select("*", { count: "exact", head: true }).eq("status", status);
            if (error && (error.code === 'PGRST204' || error.code === 'PGRST205')) {
                const { count: altCount, error: altError } = await adminClient.from("submissions").select("*", { count: "exact", head: true }).eq("status", status);
                if (!altError) count = altCount;
            }
            stats[status] = count || 0;
        }
        return stats;
    };

    const subStats = await getSubmissionStats();

    // Get paid payments for revenue
    let { data: paidPayments, error: paymentError } = await adminClient.from("Payment").select("amount").eq("status", "paid");
    if (paymentError && (paymentError.code === 'PGRST204' || paymentError.code === 'PGRST205')) {
        const { data: altPayments } = await adminClient.from("payments").select("amount").eq("status", "paid");
        paidPayments = altPayments;
    }

    const totalRevenue = paidPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Get recent submissions
    let { data: recentSubmissions, error: recentError } = await adminClient
      .from("Submission")
      .select(`
        *,
        plan:planId (*),
        payment:submissionId (amount, currency, status, provider)
      `)
      .order("createdAt", { ascending: false })
      .limit(10);

    if (recentError && (recentError.code === 'PGRST204' || recentError.code === 'PGRST205')) {
        const { data: altSubmissions } = await adminClient
          .from("submissions")
          .select(`
            *,
            plan:planId (*),
            payment:submissionId (amount, currency, status, provider)
          `)
          .order("createdAt", { ascending: false })
          .limit(10);
        recentSubmissions = altSubmissions;
    }

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    let { data: payments } = await adminClient
      .from("Payment")
      .select("amount, paidAt")
      .eq("status", "paid")
      .gte("paidAt", sixMonthsAgo.toISOString());
    
    if (!payments) {
       const { data: altPayments } = await adminClient.from("payments").select("amount, paidAt").eq("status", "paid").gte("paidAt", sixMonthsAgo.toISOString());
       payments = altPayments;
    }

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
        totalUsers: counts["User"],
        totalSubmissions: counts["Submission"],
        pendingSubmissions: subStats.pending,
        activeSubmissions: subStats.active,
        completedSubmissions: subStats.completed,
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
