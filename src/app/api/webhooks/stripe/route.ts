import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPaymentConfirmationEmail, sendNewPaymentAdminNotification } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { submissionId } = session.metadata!;

    try {
      // Find the payment associated with the submission
      const payment = await db.payment.findFirst({
        where: { submissionId },
        include: { submission: true },
      });

      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      // Update payment and submission status
      const updatedPayment = await db.payment.update({
        where: { id: payment.id },
        data: {
          status: "completed",
          paidAt: new Date(),
          providerRef: session.payment_intent as string,
        },
      });

      await db.submission.update({
        where: { id: payment.submissionId },
        data: {
          paymentStatus: "paid",
        },
      });

      // Send notification emails
      const userEmail = payment.userId ? (await db.user.findUnique({ where: { id: payment.userId } }))?.email : payment.submission?.guestEmail;
      if (userEmail) {
        await sendPaymentConfirmationEmail(userEmail, updatedPayment.amount, updatedPayment.currency);
      }
      await sendNewPaymentAdminNotification(updatedPayment.id, updatedPayment.amount, updatedPayment.currency);

      return NextResponse.json({ status: "success" });
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ignored" });
}