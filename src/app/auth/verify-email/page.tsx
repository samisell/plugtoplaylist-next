"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, Loader2, Music } from "lucide-react";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();

  // Pre-fill email from query params if available
  const initialEmail = searchParams.get("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setStep("code");
    setResendCountdown(60);

    // Start countdown
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(email, otp);
      toast({
        title: "Success",
        description: "Your email has been verified successfully!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await resendVerification(email);
      toast({
        title: "Success",
        description: "A new verification code has been sent to your email",
      });
      setResendCountdown(60);

      // Start countdown
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlowCard variant="premium" hover={false} className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gold" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-luxury-gray text-center mb-8">
                {step === "email"
                  ? "Enter your email address to verify your account"
                  : "Enter the 6-digit code sent to your email"}
              </p>

              {step === "email" ? (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email || initialEmail || ""}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                      required
                      autoFocus
                    />
                  </div>

                  <GoldButton type="submit" className="w-full" size="lg">
                    Continue
                  </GoldButton>

                  <div className="text-center">
                    <p className="text-sm text-luxury-gray">
                      Don't have an account?{" "}
                      <Link href="/register" className="text-gold hover:text-brand-orange font-medium">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="otp" className="text-white">
                      Verification Code
                    </Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        id="otp"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-xs text-luxury-gray text-center">
                      Check your email for the verification code
                    </p>
                  </div>

                  <GoldButton
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </GoldButton>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCountdown > 0 || isResending}
                      className="text-sm text-gold hover:text-brand-orange disabled:text-luxury-gray transition-colors"
                    >
                      {isResending ? (
                        <span className="flex items-center justify-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Resending...
                        </span>
                      ) : resendCountdown > 0 ? (
                        `Resend code in ${resendCountdown}s`
                      ) : (
                        "Didn't receive the code? Resend"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setResendCountdown(0);
                      }}
                      className="text-sm text-luxury-gray hover:text-gold transition-colors"
                    >
                      Use a different email
                    </button>
                  </div>
                </form>
              )}
            </GlowCard>

            {/* Additional Info */}
            <div className="mt-6 p-4 rounded-lg bg-gold/5 border border-gold/20">
              <p className="text-xs text-luxury-gray text-center">
                Check your spam/junk folder if you don't see the verification email
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
