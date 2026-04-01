import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPaymentConfirmationEmail, sendNewPaymentAdminNotification } from "@/lib/email";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const adminClient = createAdminClient();
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Processing Stripe event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { submissionId } = session.metadata!;

    if (!submissionId) {
        console.error("No submissionId in session metadata");
        return NextResponse.json({ error: "No submissionId" }, { status: 400 });
    }

    try {
      // 1. Update Payment Record (SnakeCase Sync)
      // Use submission_id to find the payment record
      const { data: payment, error: paymentError } = await (adminClient
        .from("payments") // Use plural
        .update({
          status: "completed",
          paid_at: new Date().toISOString(),
          gateway_reference: session.payment_intent as string,
          metadata: { 
            ...(session.metadata || {}),
            stripe_session_id: session.id 
          }
        } as any)
        .eq("submission_id", submissionId)
        .select(`*, submission:submissions(track_title, user_id)`)
        .single() as any);

      if (paymentError) {
        console.error("Payment update error:", paymentError);
        // Fallback or retry logic can go here
        return NextResponse.json({ error: "Payment record update failed" }, { status: 500 });
      }

      // 2. Update Submission Status (SnakeCase Sync)
      // Transition from 'pending' to 'under_review' upon payment
      const { error: subError } = await (adminClient
        .from("submissions")
        .update({
          status: "under_review" // Using valid SubmissionStatus enum
        } as any)
        .eq("id", submissionId) as any);

      if (subError) {
        console.error("Submission status update error:", subError);
      }

      // 3. Communications
      const userEmail = session.customer_details?.email;
      if (userEmail) {
        await sendPaymentConfirmationEmail(userEmail, (payment as any).amount, (payment as any).currency);
      }
      
      await sendNewPaymentAdminNotification((payment as any).id, (payment as any).amount, (payment as any).currency);

      return NextResponse.json({ status: "success", paymentId: (payment as any).id });
    } catch (error) {
      console.error("Error processing Stripe webhook success:", error);
      return NextResponse.json({ error: "Internal processing failure" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ignored" });
}