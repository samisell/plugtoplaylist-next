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
    const { submissionId, amount, currency = "GBP" } = body;

    // Validate input
    if (!submissionId || !amount) {
      return NextResponse.json(
        { error: "Submission ID and amount are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Fetch submission to get userId
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Check if payment already exists for this submission
    const existingPayment = await prisma.payment.findUnique({
      where: { submissionId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment already exists for this submission", paymentId: existingPayment.id },
        { status: 409 }
      );
    }

    // Create payment with "pending" status initially
    const payment = await prisma.payment.create({
      data: {
        userId: submission.userId,
        submissionId,
        amount,
        currency,
        status: "pending",
        provider: "manual",
        providerRef: `PTP-${Date.now()}-${submissionId.substring(0, 8)}`,
      },
      include: {
        submission: {
          include: { plan: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment created successfully",
        paymentId: payment.id,
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the payment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");
    const submissionId = searchParams.get("submissionId");

    if (!paymentId && !submissionId) {
      return NextResponse.json(
        { error: "Payment ID or Submission ID is required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findFirst({
      where: paymentId ? { id: paymentId } : { submissionId },
      include: {
        submission: {
          include: { plan: true },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
