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
    const role = searchParams.get("role");
    const searchQuery = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};

    if (role && role !== "all") {
      where.role = role;
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Fetch users with pagination
    const users = await db.user.findMany({
      where,
      include: {
        _count: {
          select: { submissions: true },
        },
        payments: {
          where: { status: "paid" },
          select: { amount: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await db.user.count({ where });

    // Get stats
    const totalUsers = await db.user.count();
    const activeUsers = await db.user.count({
      where: { emailVerified: { not: null } },
    });
    const premiumUsers = await db.user.count({
      where: { role: "premium" },
    });

    // Calculate total revenue (sum of paid payments)
    const paidPayments = await db.payment.findMany({
      where: { status: "paid" },
    });
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    // Format users for response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "Unknown User",
      email: user.email,
      avatar: user.profileImage || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
      role: user.role || "user",
      status: user.emailVerified ? "active" : "inactive",
      submissions: user._count.submissions || 0,
      spent: Math.round(user.payments.reduce((sum, p) => sum + p.amount, 0)),
      joinedAt: user.createdAt.toISOString().split("T")[0],
      lastActive: user.lastLogin ? user.lastLogin.toISOString().split("T")[0] : "N/A",
      totalSpent: user.payments.reduce((sum, p) => sum + p.amount, 0),
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalUsers,
        activeUsers,
        premiumUsers,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
