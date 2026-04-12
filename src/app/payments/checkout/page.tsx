"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  CreditCard,
  Music,
  DollarSign,
  Shield,
  Clock,
} from "lucide-react";
import { Header, Footer, GoldButton } from "@/components/shared";

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const amount = searchParams.get("amount");
  
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      fetchPaymentDetails();
    }
  }, [submissionId]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`/api/payments?submissionId=${submissionId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPayment(data.payment);
      } else {
        setError(data.error || "Failed to load payment details");
      }
    } catch (err) {
      setError("An error occurred while loading payment details");
      console.error(err);
    }
  };

  const handleApprovePayment = async () => {
    if (!payment) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: payment.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process payment");
      }

      setPayment(data.payment);
      setIsApproved(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment processing failed";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!submissionId || !amount) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Missing Payment Information</h1>
            <p className="text-luxury-gray mb-6">Unable to process payment without submission details.</p>
            <Link href="/">
              <GoldButton>Back to Home</GoldButton>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!payment && !error) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-gold mx-auto mb-4" />
            <p className="text-luxury-gray">Loading payment details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center"
          >
            <div className="bg-luxury-dark border border-green-500/30 rounded-2xl p-8 md:p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-2">Payment Approved!</h1>
              <p className="text-luxury-gray mb-6">
                Your payment has been successfully processed and approved.
              </p>

              <div className="bg-luxury-lighter rounded-lg p-6 mb-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Amount:</span>
                  <span className="text-gold font-semibold">£{Number(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Status:</span>
                  <span className="text-green-400 font-semibold">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-gray">Reference:</span>
                  <span className="text-white font-mono text-sm">{payment?.id.substring(0, 12)}...</span>
                </div>
              </div>

              <p className="text-sm text-luxury-gray mb-6">
                Your submission is now active and your promotion campaign will begin shortly.
              </p>

              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1">
                  <GoldButton className="w-full">View Dashboard</GoldButton>
                </Link>
                <Link href="/" className="flex-1">
                  <button className="w-full px-6 py-3 bg-luxury-lighter text-white font-semibold rounded-lg hover:bg-luxury-lighter/80 transition-all">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-16 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Confirm <span className="text-gold">Payment</span>
            </h1>
            <p className="text-lg text-luxury-gray">
              Review and confirm your payment to activate your promotion campaign
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3"
            >
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-luxury-dark border border-gold/10 rounded-2xl p-6 md:p-8 mb-6"
          >
            {/* Track Info */}
            {payment?.submission && (
              <div className="mb-8 pb-8 border-b border-gold/10">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-gold" />
                  Track Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-luxury-gray">Title</p>
                    <p className="text-white font-medium">{payment.submission.title}</p>
                  </div>
                  {payment.submission.artist && (
                    <div>
                      <p className="text-sm text-luxury-gray">Artist</p>
                      <p className="text-white font-medium">{payment.submission.artist}</p>
                    </div>
                  )}
                  {payment.submission.plan && (
                    <div>
                      <p className="text-sm text-luxury-gray">Plan</p>
                      <p className="text-gold font-medium">{payment.submission.plan.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="mb-8 pb-8 border-b border-gold/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold" />
                Payment Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-luxury-gray">Subtotal</span>
                  <span className="text-white">£{Number(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-luxury-gray">Processing Fee</span>
                  <span className="text-white">£0.00</span>
                </div>
                <div className="h-px bg-gold/10"></div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-gold text-2xl font-bold">£{Number(amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">Secure Payment</p>
                  <p className="text-xs text-luxury-gray">SSL Encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">Instant Approval</p>
                  <p className="text-xs text-luxury-gray">Auto-processed</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleApprovePayment}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gold text-luxury-black font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Confirm and Complete Payment
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-center text-luxury-gray mt-6">
              By confirming this payment, you agree to our{" "}
              <Link href="/terms" className="text-gold hover:text-brand-orange transition-colors">
                Terms of Service
              </Link>
            </p>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-luxury-dark border border-gold/10 rounded-xl"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" />
              What Happens Next?
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-gold font-bold flex-shrink-0">✓</span>
                <span className="text-luxury-gray">
                  <strong className="text-white">Payment confirmed</strong> instantly
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold flex-shrink-0">✓</span>
                <span className="text-luxury-gray">
                  <strong className="text-white">Promotion starts</strong> within hours
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold flex-shrink-0">✓</span>
                <span className="text-luxury-gray">
                  <strong className="text-white">Weekly reports</strong> sent to your email
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
