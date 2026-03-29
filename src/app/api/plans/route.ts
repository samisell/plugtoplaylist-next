import { NextResponse } from "next/server";
import { supabase, createAdminClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data: plans, error } = await supabase
      .from("plans")
      .select("*")
      .eq("isActive", true)
      .order("price", { ascending: true });

    if (error) throw error;

    // If no plans exist, seed default plans
    if (!plans || plans.length === 0) {
      const defaultPlans = await seedDefaultPlans();
      return NextResponse.json({ plans: defaultPlans });
    }

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

async function seedDefaultPlans() {
  const adminClient = createAdminClient();
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
    },
  ];

  const { data: createdPlans, error } = await adminClient
    .from("plans")
    .insert(plans)
    .select();

  if (error) throw error;

  return createdPlans;
}
