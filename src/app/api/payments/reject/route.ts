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
    const { paymentId, reason = "No reason provided" } = body;

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

    // Check if payment can be rejected (not already processed)
    if (payment.status === "refunded") {
      return NextResponse.json(
        { error: "Payment is already refunded", payment },
        { status: 409 }
      );
    }

    // Reject payment and set status to "failed"
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "failed",
      },
      include: {
        submission: {
          include: { plan: true },
        },
      },
    });

    // Update submission payment status back to pending
    await prisma.submission.update({
      where: { id: updatedPayment.submissionId },
      data: { paymentStatus: "pending" },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Payment rejected: ${reason}`,
        payment: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment rejection error:", error);
    return NextResponse.json(
      { error: "An error occurred while rejecting the payment" },
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
