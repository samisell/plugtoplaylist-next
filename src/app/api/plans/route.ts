import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // USE THE ADMIN CLIENT (createServerClient) to bypass RLS recursion issues
    // This uses the service_role key which ignores database policies
    const adminSupabase = createServerClient();
    
    // Primary plural 'plans' - confirmed by Postgres hint
    let { data: plans, error } = await adminSupabase
      .from("plans")
      .select("*")
      .order("price", { ascending: true });

    if (error) {
       // Fallback singular 'Plan'
       const { data: altPlans, error: altError } = await adminSupabase
        .from("Plan")
        .select("*")
        .order("price", { ascending: true });
      
       if (!altError) plans = altPlans;
       else throw error; // throw original if both fail
    }

    // Attempt seeding if empty
    if (!plans || plans.length === 0) {
      plans = await seedDefaultPlans(adminSupabase);
    }

    return NextResponse.json({ plans: plans || [] });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function seedDefaultPlans(supabase: any) {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for emerging artists looking to get started",
      price: 49,
      duration: 14,
      features: JSON.stringify([
        "5 Playlist Placements",
        "Basic Social Promotion",
        "2-Week Campaign Duration",
        "Email Support",
        "Basic Analytics",
      ]),
      playlistPlacements: 5,
      socialPromotion: false,
      emailMarketing: false,
      priority: "normal",
      isActive: true
    },
    {
      name: "Premium",
      description: "Our most popular plan for serious artists",
      price: 149,
      duration: 28,
      features: JSON.stringify([
        "15 Playlist Placements",
        "Full Social Promotion",
        "4-Week Campaign Duration",
        "Priority Support",
        "Advanced Analytics",
        "Email Marketing Blast",
        "Dedicated Manager",
      ]),
      playlistPlacements: 15,
      socialPromotion: true,
      emailMarketing: true,
      priority: "high",
      isActive: true
    },
    {
      name: "Professional",
      description: "For established artists seeking maximum exposure",
      price: 349,
      duration: 56,
      features: JSON.stringify([
        "50+ Playlist Placements",
        "Full Social Promotion",
        "8-Week Campaign Duration",
        "24/7 Priority Support",
        "Premium Analytics Dashboard",
        "Full Email Marketing Campaign",
        "PR & Press Coverage",
        "Personal Account Manager",
      ]),
      playlistPlacements: 50,
      socialPromotion: true,
      emailMarketing: true,
      priority: "premium",
      isActive: true
    },
  ];

  // Primary plural 'plans'
  const { data: createdPlans, error } = await supabase
    .from("plans")
    .insert(plans)
    .select();

  if (error) {
     const { data: altCreated, error: altError } = await supabase.from("Plan").insert(plans).select();
     if (altError) throw altError;
     return altCreated;
  }

  return createdPlans;
}
