import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEFAULT_PLANS = [
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
];

export async function GET() {
  try {
    let plans = await db.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    if (plans.length === 0) {
      await db.plan.createMany({ data: DEFAULT_PLANS });
      plans = await db.plan.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      });
    }

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
