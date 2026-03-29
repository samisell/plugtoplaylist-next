import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
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
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { submissionId } = session.metadata!;

    try {
      // Find the payment associated with the submission - Try singular first
      let { data: payment, error: paymentError } = await adminClient
        .from("Payment")
        .select(`
          *,
          submission:submissionId (*)
        `)
        .eq("submissionId", submissionId)
        .single();

      if (paymentError) {
        const { data: altPayment, error: altError } = await adminClient.from("payments").select("*, submission:submissionId(*)").eq("submissionId", submissionId).single();
        if (!altError) payment = altPayment;
        else return NextResponse.json({ error: "Payment not found" }, { status: 404 });
      }

      // Update payment and submission status
      let { data: updatedPayment, error: updatePaymentError } = await adminClient
        .from("Payment")
        .update({
          status: "completed",
          paidAt: new Date().toISOString(),
          providerRef: session.payment_intent as string,
        })
        .eq("id", payment.id)
        .select()
        .single();
      
      if (updatePaymentError) {
          const { data: altUpdate, error: altUpdateError } = await adminClient
            .from("payments")
            .update({ status: "completed", paidAt: new Date().toISOString(), providerRef: session.payment_intent as string })
            .eq("id", payment.id)
            .select()
            .single();
          if (altUpdateError) throw updatePaymentError;
          updatedPayment = altUpdate;
      }

      const { error: updateSubmissionError } = await adminClient
        .from("Submission")
        .update({
          paymentStatus: "paid",
        })
        .eq("id", payment.submissionId);

      if (updateSubmissionError) {
          await adminClient.from("submissions").update({ paymentStatus: "paid" }).eq("id", payment.submissionId);
      }

      // Send notification emails
      let userEmail = payment.submission?.guestEmail;
      if (payment.userId) {
        let { data: userData } = await adminClient.from("User").select("email").eq("id", payment.userId).single();
        if (!userData) {
            const { data: altUser } = await adminClient.from("users").select("email").eq("id", payment.userId).single();
            userData = altUser;
        }
        if (userData) userEmail = userData.email;
      }

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