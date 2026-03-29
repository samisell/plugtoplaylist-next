import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    // If no plans exist, seed default plans
    if (plans.length === 0) {
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

  const createdPlans = await Promise.all(
    plans.map((plan) => db.plan.create({ data: plan }))
  );

  return createdPlans;
}
