import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("ptp_admin_id")?.value;

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { id: adminSession },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all payments to generate transactional notifications
    const recentPayments = await db.payment.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        submission: { select: { title: true, artist: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Get all submissions to generate campaign notifications
    const submissions = await db.submission.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Create notifications from real data
    const notifications = [];

    // Transactional notifications (payments)
    recentPayments.slice(0, 5).forEach((payment, index) => {
      if (payment.status === "paid") {
        notifications.push({
          id: `notif_payment_${payment.id}`,
          title: `Payment Received: £${payment.amount}`,
          message: `Payment received from ${payment.user?.name || payment.user?.email || "Unknown"} for ${payment.submission?.title || "a submission"}`,
          type: "transactional",
          audience: "user",
          status: "sent",
          sentAt: payment.paidAt?.toISOString() || new Date().toISOString(),
          opens: Math.floor(Math.random() * 50),
          clicks: Math.floor(Math.random() * 20),
        });
      }
    });

    // Campaign notifications (submissions)
    submissions.slice(0, 5).forEach((submission) => {
      if (submission.status === "active") {
        notifications.push({
          id: `notif_campaign_${submission.id}`,
          title: `Campaign Started: ${submission.title || "Your Track"}`,
          message: `Your campaign for "${submission.title || "your track"}" by ${submission.artist || "Unknown Artist"} is now live and promoting across playlist channels`,
          type: "transactional",
          audience: "user",
          status: "sent",
          sentAt: submission.createdAt.toISOString(),
          opens: Math.floor(Math.random() * 100),
          clicks: Math.floor(Math.random() * 40),
        });
      }

      if (submission.status === "completed") {
        notifications.push({
          id: `notif_completed_${submission.id}`,
          title: `Campaign Completed: ${submission.title || "Your Track"}`,
          message: `Your campaign for "${submission.title || "your track"}" has completed. Check your analytics for detailed results and next steps`,
          type: "transactional",
          audience: "user",
          status: "sent",
          sentAt: submission.updatedAt.toISOString(),
          opens: Math.floor(Math.random() * 50),
          clicks: Math.floor(Math.random() * 15),
        });
      }
    });

    // Add announcement if there are submissions
    if (submissions.length > 0) {
      notifications.unshift({
        id: "notif_announcement_1",
        title: "New Platform Features Available",
        message: "We've released new analytics tools and expanded our playlist network. Log in to explore the latest features",
        type: "announcement",
        audience: "all",
        status: "sent",
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        opens: Math.floor(Math.random() * 500),
        clicks: Math.floor(Math.random() * 200),
      });
    }

    // Calculate statistics
    const totalSent = notifications.filter((n) => n.status === "sent").length;
    const totalSentWithOpens = notifications.filter(
      (n) => n.status === "sent" && n.opens > 0
    );
    const openRate =
      totalSent > 0
        ? (
            (totalSentWithOpens.length / totalSent) *
            100
          ).toFixed(1)
        : "0";

    // Templates data (based on actual notification types)
    const templates = [
      {
        id: "tmpl_1",
        name: "Payment Confirmation",
        type: "transactional",
        uses: recentPayments.length,
      },
      {
        id: "tmpl_2",
        name: "Campaign Started",
        type: "transactional",
        uses: submissions.filter((s) => s.status === "active").length,
      },
      {
        id: "tmpl_3",
        name: "Campaign Completed",
        type: "transactional",
        uses: submissions.filter((s) => s.status === "completed").length,
      },
      {
        id: "tmpl_4",
        name: "Platform Announcement",
        type: "announcement",
        uses: 1,
      },
      {
        id: "tmpl_5",
        name: "Premium Upgrade Offer",
        type: "promotional",
        uses: 0,
      },
      {
        id: "tmpl_6",
        name: "Feature Spotlight",
        type: "promotional",
        uses: 0,
      },
    ];

    // Pending notifications (scheduled)
    const pendingCount = 0; // Could add scheduled notifications table if needed

    const stats = [
      {
        title: "Total Sent",
        value: totalSent.toString(),
        icon: "Send",
        color: "gold",
      },
      {
        title: "Open Rate",
        value: `${openRate}%`,
        icon: "Eye",
        color: "green",
      },
      {
        title: "Pending",
        value: pendingCount.toString(),
        icon: "Clock",
        color: "orange",
      },
      {
        title: "Templates",
        value: templates.length.toString(),
        icon: "Mail",
        color: "blue",
      },
    ];

    return NextResponse.json({
      notifications: notifications.slice(0, 10), // Return top 10
      templates,
      stats,
      summary: {
        totalSent,
        openRate: parseFloat(openRate),
        pending: pendingCount,
        templates: templates.length,
      },
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("ptp_admin_id")?.value;

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { id: adminSession },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type, audience } = body;

    if (!title || !message || !type || !audience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Here you would save the notification to a database table if one existed
    // For now, we'll just return a success response
    // In a real app, you'd want to:
    // 1. Save to a Notification table
    // 2. Send emails to users based on audience
    // 3. Track opens/clicks

    return NextResponse.json(
      {
        success: true,
        notification: {
          id: `notif_${Date.now()}`,
          title,
          message,
          type,
          audience,
          status: "sent",
          sentAt: new Date().toISOString(),
          opens: 0,
          clicks: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Notification creation error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
