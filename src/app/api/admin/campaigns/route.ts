import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get("ptp_admin_id")?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const searchQuery = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause - campaigns are submissions with status "active" or "completed"
    const where: any = {
      status: { in: ["active", "completed"] },
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { artist: { contains: searchQuery, mode: "insensitive" } },
        { user: { email: { contains: searchQuery, mode: "insensitive" } } },
      ];
    }

    // Fetch campaigns with pagination
    const campaigns = await db.submission.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        plan: { select: { id: true, name: true, price: true } },
        payment: { select: { id: true, amount: true, status: true, currency: true } },
      },
      orderBy: { startDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await db.submission.count({ where });

    // Get stats
    const totalCampaigns = await db.submission.count({
      where: { status: { in: ["active", "completed"] } },
    });

    const activeCampaigns = await db.submission.count({
      where: { status: "active" },
    });

    const completedCampaigns = await db.submission.count({
      where: { status: "completed" },
    });

    // Calculate total revenue from campaigns
    const campaignPayments = await db.payment.findMany({
      where: {
        submission: {
          status: { in: ["active", "completed"] },
        },
      },
    });

    const totalRevenue = campaignPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Format campaigns for response
    const formattedCampaigns = campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title || "Untitled",
      artist: campaign.artist || "Unknown Artist",
      trackType: campaign.trackType,
      trackUrl: campaign.trackUrl,
      status: campaign.status,
      paymentStatus: campaign.paymentStatus,
      plan: campaign.plan?.name || "Unknown Plan",
      amount: campaign.payment?.amount || 0,
      currency: campaign.payment?.currency || "USD",
      user: campaign.user?.email || "Unknown User",
      userId: campaign.user?.id || "Unknown",
      userName: campaign.user?.name || "Unknown User",
      startDate: campaign.startDate?.toISOString().split("T")[0] || "N/A",
      endDate: campaign.endDate?.toISOString().split("T")[0] || "N/A",
      notes: campaign.notes || "",
      createdAt: campaign.createdAt.toISOString().split("T")[0],
      updatedAt: campaign.updatedAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      campaigns: formattedCampaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Campaigns fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get("ptp_admin_id")?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, notes, endDate } = body;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    // Update campaign
    const updatedCampaign = await db.submission.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
        plan: { select: { id: true, name: true, price: true } },
        payment: { select: { id: true, amount: true, status: true, currency: true } },
      },
    });

    return NextResponse.json({
      success: true,
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title || "Untitled",
        artist: updatedCampaign.artist || "Unknown Artist",
        status: updatedCampaign.status,
        paymentStatus: updatedCampaign.paymentStatus,
        amount: updatedCampaign.payment?.amount || 0,
        startDate: updatedCampaign.startDate?.toISOString().split("T")[0] || "N/A",
        endDate: updatedCampaign.endDate?.toISOString().split("T")[0] || "N/A",
        notes: updatedCampaign.notes || "",
      },
    });
  } catch (error) {
    console.error("Campaign update error:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}
