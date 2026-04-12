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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search") || "";

    let emailTemplates = [];
    let coupons = [];

    // Fetch email templates if type includes "templates" or "all"
    if (type === "all" || type === "templates") {
      emailTemplates = await db.emailTemplate.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { subject: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
      });
    }

    // Fetch coupons if type includes "coupons" or "all"
    if (type === "all" || type === "coupons") {
      coupons = await db.coupon.findMany({
        where: search
          ? {
              code: { contains: search, mode: "insensitive" },
            }
          : undefined,
        orderBy: { createdAt: "desc" },
      });
    }

    // Calculate statistics
    const totalTemplates = await db.emailTemplate.count();
    const totalCoupons = await db.coupon.count();
    const activeCoupons = await db.coupon.count({
      where: { isActive: true },
    });

    const stats = [
      {
        title: "Email Templates",
        value: totalTemplates.toString(),
        icon: "Mail",
        color: "gold",
      },
      {
        title: "Active Coupons",
        value: activeCoupons.toString(),
        icon: "Tag",
        color: "green",
      },
      {
        title: "Total Coupons",
        value: totalCoupons.toString(),
        icon: "Ticket",
        color: "blue",
      },
      {
        title: "Content Items",
        value: (totalTemplates + totalCoupons).toString(),
        icon: "FileText",
        color: "orange",
      },
    ];

    return NextResponse.json({
      emailTemplates,
      coupons,
      stats,
      summary: {
        totalTemplates,
        totalCoupons,
        activeCoupons,
      },
    });
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
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
    const { type, name, subject, htmlBody, textBody, code, discount, maxUses, expiresAt } = body;

    if (type === "template") {
      if (!name || !subject || !htmlBody) {
        return NextResponse.json(
          { error: "Name, subject, and htmlBody are required" },
          { status: 400 }
        );
      }

      const template = await db.emailTemplate.create({
        data: {
          name,
          subject,
          htmlBody,
          textBody: textBody || "",
        },
      });

      return NextResponse.json(template, { status: 201 });
    } else if (type === "coupon") {
      if (!code || discount === undefined) {
        return NextResponse.json(
          { error: "Code and discount are required" },
          { status: 400 }
        );
      }

      const coupon = await db.coupon.create({
        data: {
          code: code.toUpperCase(),
          discount,
          maxUses: maxUses || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

      return NextResponse.json(coupon, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Content creation error:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
    const { id, type, name, subject, htmlBody, textBody, code, discount, maxUses, expiresAt, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === "template") {
      const template = await db.emailTemplate.update({
        where: { id },
        data: {
          name: name || undefined,
          subject: subject || undefined,
          htmlBody: htmlBody || undefined,
          textBody: textBody !== undefined ? textBody : undefined,
        },
      });

      return NextResponse.json(template);
    } else if (type === "coupon") {
      const coupon = await db.coupon.update({
        where: { id },
        data: {
          code: code ? code.toUpperCase() : undefined,
          discount: discount !== undefined ? discount : undefined,
          maxUses: maxUses !== undefined ? maxUses : undefined,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          isActive: isActive !== undefined ? isActive : undefined,
        },
      });

      return NextResponse.json(coupon);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json(
        { error: "ID and type are required" },
        { status: 400 }
      );
    }

    if (type === "template") {
      await db.emailTemplate.delete({
        where: { id },
      });
    } else if (type === "coupon") {
      await db.coupon.delete({
        where: { id },
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content deletion error:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
