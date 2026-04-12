import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Fetch payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { submission: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Check if already approved
    if (payment.status === "completed") {
      return NextResponse.json(
        { error: "Payment is already approved", payment },
        { status: 409 }
      );
    }

    // Auto-approve payment as "completed"
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "completed",
        paidAt: new Date(),
      },
      include: {
        submission: {
          include: { plan: true },
        },
      },
    });

    // Update submission payment status
    await prisma.submission.update({
      where: { id: updatedPayment.submissionId },
      data: { paymentStatus: "paid" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment approved successfully",
        payment: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment approval error:", error);
    return NextResponse.json(
      { error: "An error occurred while approving the payment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
