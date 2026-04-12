import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendContactFormConfirmation, sendContactFormNotification } from "@/lib/email";

const prisma = new PrismaClient();

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateContactForm = (data: Record<string, unknown>): { isValid: boolean; error?: string } => {
  const { name, email, subject, message } = data;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (!email || typeof email !== "string" || !validateEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
    return { isValid: false, error: "Subject must be at least 3 characters" };
  }

  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return { isValid: false, error: "Message must be at least 10 characters" };
  }

  // Check for spam patterns
  if (message.trim().length > 5000) {
    return { isValid: false, error: "Message is too long (max 5000 characters)" };
  }

  return { isValid: true };
};

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
    const { name, email, subject, message } = body;

    // Validate input
    const validation = validateContactForm({ name, email, subject, message });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create contact record in database
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: "new",
      },
    });

    // Send confirmation email to user
    try {
      await sendContactFormConfirmation(
        email.trim().toLowerCase(),
        name.trim(),
        subject.trim()
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    // Send notification email to admin
    try {
      await sendContactFormNotification(
        name.trim(),
        email.trim().toLowerCase(),
        subject.trim(),
        message.trim()
      );
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if admin email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully. We'll get back to you within 24 hours.",
        contactId: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  // Prevent GET requests to this endpoint
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
