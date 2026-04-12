"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, Eye, EyeOff, Loader2, Music } from "lucide-react";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { forgotPassword, resetPassword } = useAuth();

  // Get token and email from query params
  const initialToken = searchParams.get("token");
  const initialEmail = searchParams.get("email");

  // If token and email are in URL, go directly to reset step
  useEffect(() => {
    if (initialToken && initialEmail) {
      setToken(initialToken);
      setEmail(initialEmail);
      setStep("reset");
    }
  }, [initialToken, initialEmail]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast({
        title: "Success",
        description: "Check your email for password reset instructions",
      });
      setStep("reset");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Error",
        description: "Reset token is missing. Please request a new one.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, token, password);
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password. The link may have expired.",
        variant: "destructive",
      });
      setStep("request");
    } finally {
      setIsLoading(false);
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
                  <Lock className="w-8 h-8 text-gold" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Reset Your Password
              </h2>
              <p className="text-sm text-luxury-gray text-center mb-8">
                {step === "request"
                  ? "Enter your email address and we'll send you a reset link"
                  : "Enter your new password"}
              </p>

              {step === "request" ? (
                <form onSubmit={handleRequestReset} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                      required
                      autoFocus
                    />
                    <p className="text-xs text-luxury-gray">
                      We'll send a password reset link to this email
                    </p>
                  </div>

                  <GoldButton
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </GoldButton>

                  <div className="text-center">
                    <p className="text-sm text-luxury-gray">
                      Remember your password?{" "}
                      <Link href="/login" className="text-gold hover:text-brand-orange font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 pr-10 text-white placeholder:text-luxury-gray"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-luxury-gray">
                      At least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 pr-10 text-white placeholder:text-luxury-gray"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <GoldButton
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </GoldButton>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    className="w-full text-sm text-luxury-gray hover:text-gold transition-colors"
                  >
                    Back to email verification
                  </button>
                </form>
              )}
            </GlowCard>

            {/* Additional Info */}
            <div className="mt-6 p-4 rounded-lg bg-gold/5 border border-gold/20">
              <p className="text-xs text-luxury-gray text-center">
                For security, we'll send a confirmation to your email address
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
