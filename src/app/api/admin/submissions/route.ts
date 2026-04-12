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

    // Build where clause
    const where: any = {};

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

    // Fetch submissions with pagination
    const submissions = await db.submission.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        plan: { select: { id: true, name: true } },
        payment: { select: { id: true, amount: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await db.submission.count({ where });

    // Get stats
    const totalSubmissions = await db.submission.count();
    const pendingSubmissions = await db.submission.count({ where: { status: "pending" } });
    const activeSubmissions = await db.submission.count({ where: { status: "active" } });
    const completedSubmissions = await db.submission.count({ where: { status: "completed" } });

    // Calculate revenue from paid submissions
    const paidPayments = await db.payment.findMany({
      where: {
        status: "paid",
        submission: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      },
    });

    const monthlyRevenue = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Format submissions for response
    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      title: submission.title,
      artist: submission.artist,
      cover: submission.coverUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
      user: submission.user.email,
      userId: submission.user.id,
      userName: submission.user.name || "Unknown User",
      status: submission.status,
      plan: submission.plan?.name || "Free",
      amount: submission.payment?.amount || 0,
      platform: submission.platform || "spotify",
      submittedAt: submission.createdAt.toISOString().split("T")[0],
      description: submission.description,
      audioUrl: submission.audioUrl,
    }));

    return NextResponse.json({
      submissions: formattedSubmissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalSubmissions,
        pendingSubmissions,
        activeSubmissions,
        completedSubmissions,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Submissions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
