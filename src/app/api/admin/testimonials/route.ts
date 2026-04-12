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

    // Query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "recent";

    // Fetch testimonials with filters
    const testimonials = await db.testimonial.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy:
        sortBy === "recent"
          ? { createdAt: "desc" }
          : sortBy === "oldest"
            ? { createdAt: "asc" }
            : sortBy === "rating"
              ? { rating: "desc" }
              : { createdAt: "desc" },
    });

    // Calculate statistics
    const totalTestimonials = await db.testimonial.count();
    const visibleTestimonials = await db.testimonial.count({
      where: { isVisible: true },
    });
    const hiddenTestimonials = totalTestimonials - visibleTestimonials;

    // Calculate average rating
    const avgRating =
      testimonials.length > 0
        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
        : "0";

    // Count by rating
    const ratingCounts = {
      5: testimonials.filter((t) => t.rating === 5).length,
      4: testimonials.filter((t) => t.rating === 4).length,
      3: testimonials.filter((t) => t.rating === 3).length,
      2: testimonials.filter((t) => t.rating === 2).length,
      1: testimonials.filter((t) => t.rating === 1).length,
    };

    const stats = [
      {
        title: "Total Testimonials",
        value: totalTestimonials.toString(),
        icon: "MessageCircle",
        color: "gold",
      },
      {
        title: "Average Rating",
        value: avgRating,
        icon: "Star",
        color: "green",
      },
      {
        title: "Visible",
        value: visibleTestimonials.toString(),
        icon: "Eye",
        color: "blue",
      },
      {
        title: "Hidden",
        value: hiddenTestimonials.toString(),
        icon: "EyeOff",
        color: "orange",
      },
    ];

    return NextResponse.json({
      testimonials,
      stats,
      summary: {
        total: totalTestimonials,
        visible: visibleTestimonials,
        hidden: hiddenTestimonials,
        avgRating: parseFloat(avgRating),
        ratingCounts,
      },
    });
  } catch (error) {
    console.error("Testimonials fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
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
    const { name, role, avatar, content, rating, isVisible } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        role: role || null,
        avatar: avatar || null,
        content,
        rating: rating || 5,
        isVisible: isVisible !== false,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Testimonial creation error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
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
    const { id, name, role, avatar, content, rating, isVisible } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        name: name || undefined,
        role: role !== undefined ? role : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
        content: content || undefined,
        rating: rating || undefined,
        isVisible: isVisible !== undefined ? isVisible : undefined,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
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

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
