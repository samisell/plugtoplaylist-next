import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendPaymentConfirmationEmail, sendNewPaymentAdminNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const submissionId = session.metadata?.submissionId;

    if (!submissionId) {
      return NextResponse.json({ error: "No submissionId" }, { status: 400 });
    }

    try {
      const payment = await db.payment.update({
        where: { submissionId },
        data: {
          status: "paid",
          paidAt: new Date(),
          providerRef: String(session.payment_intent || session.id),
        },
      });

      await db.submission.update({
        where: { id: submissionId },
        data: {
          status: "active",
          paymentStatus: "paid",
        },
      });

      const userEmail = session.customer_details?.email;
      if (userEmail) {
        await sendPaymentConfirmationEmail(userEmail, payment.amount, payment.currency);
      }

      await sendNewPaymentAdminNotification(payment.id, payment.amount, payment.currency);

      return NextResponse.json({ status: "success", paymentId: payment.id });
    } catch (error) {
      console.error("Error processing Stripe webhook success:", error);
      return NextResponse.json({ error: "Internal processing failure" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ignored" });
}
