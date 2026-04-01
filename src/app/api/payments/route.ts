import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET - Fetch payment history (SnakeCase Sync)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    const adminSupabase = createAdminClient() as any;
    
    // Primary plural 'payments' - snakeCase standardized
    const { data: payments, error } = await adminSupabase
      .from("payments" as any)
      .select(`*, submission:submissions(track_title, plan:plans(name))`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
       console.error("Fetch payments error:", error);
       throw error;
    }

    // Map snake_case to frontend camelCase expectations for easier consumption
    const mappedPayments = payments.map((p: any) => ({
        ...p,
        submission: {
            title: p.submission?.track_title,
            planName: p.submission?.plan?.name
        }
    }));

    return NextResponse.json({ payments: mappedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}