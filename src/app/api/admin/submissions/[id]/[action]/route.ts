import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
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

    const submissionId = params.id;
    const action = params.action;

    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      include: { payment: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    let newStatus = submission.status;

    switch (action) {
      case "approve":
        if (submission.status !== "pending") {
          return NextResponse.json({ error: "Only pending submissions can be approved" }, { status: 400 });
        }
        newStatus = "active";
        break;

      case "reject":
        if (submission.status !== "pending") {
          return NextResponse.json({ error: "Only pending submissions can be rejected" }, { status: 400 });
        }
        newStatus = "rejected";
        break;

      case "complete":
        if (submission.status !== "active") {
          return NextResponse.json({ error: "Only active submissions can be completed" }, { status: 400 });
        }
        newStatus = "completed";
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update submission status
    const updatedSubmission = await db.submission.update({
      where: { id: submissionId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        plan: true,
        payment: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Submission ${action}ed successfully`,
      submission: {
        id: updatedSubmission.id,
        status: updatedSubmission.status,
        title: updatedSubmission.title,
      },
    });
  } catch (error) {
    console.error("Submission action error:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}
