"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Music, Check, Loader2 } from "lucide-react";
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
import { createClient } from "@/app/api/auth/client";

const benefits = [
  "Track all your submissions in one place",
  "Get detailed analytics and reports",
  "Priority support from our team",
  "Exclusive discounts and offers",
];

export default function RegisterPage() {
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast({
        title: "Registration successful",
        description: "Please check your email for the verification code.",
      });
      setShowOtpForm(true);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify",
          email: formData.email,
          token: otp,
          type: "signup",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      toast({
        title: "Account verified successfully",
        description: "Welcome to PlugToPlaylist!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
                <Music className="w-6 h-6 text-luxury-black" />
              </div>
              <span className="text-2xl font-bold text-white">
                PlugTo<span className="text-gold">Playlist</span>
              </span>
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Your Music Journey Today
            </h1>
            <p className="text-luxury-gray mb-8">
              Join thousands of artists who have already transformed their careers with our platform.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-white">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: "10K+", label: "Artists" },
                { value: "50M+", label: "Streams" },
                { value: "98%", label: "Satisfaction" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-gold">{stat.value}</div>
                  <div className="text-sm text-luxury-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Back Link - Mobile Only */}
          <Link 
            href="/" 
            className="lg:hidden inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <Music className="w-5 h-5 text-luxury-black" />
              </div>
              <span className="text-xl font-bold text-white">
                PlugTo<span className="text-gold">Playlist</span>
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlowCard variant="premium" hover={false} className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {showOtpForm ? "Verify Your Email" : "Create Account"}
                </h2>
                <p className="text-sm text-luxury-gray">
                  {showOtpForm 
                    ? "Enter the 6-digit code sent to your email" 
                    : "Join thousands of artists promoting their music"
                  }
                </p>
              </div>

              {showOtpForm ? (
                /* OTP Verification Form */
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-white">Verification Code</Label>
                    <InputOTP
                      maxLength={8}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      id="otp"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <GoldButton type="submit" className="w-full" size="lg" loading={isOtpLoading}>
                    {isOtpLoading ? "Verifying..." : "Verify Account"}
                  </GoldButton>

                  <button
                    type="button"
                    onClick={() => setShowOtpForm(false)}
                    className="w-full text-sm text-luxury-gray hover:text-gold transition-colors"
                  >
                    Back to registration
                  </button>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 text-white placeholder:text-luxury-gray"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 text-white placeholder:text-luxury-gray"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 pr-10 text-white placeholder:text-luxury-gray"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 text-white placeholder:text-luxury-gray"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 rounded border-gold/30 bg-luxury-lighter text-gold focus:ring-gold/30"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-luxury-gray">
                      I agree to the{" "}
                      <Link href="/terms" className="text-gold hover:text-brand-orange">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-gold hover:text-brand-orange">Privacy Policy</Link>
                    </label>
                  </div>

                  <GoldButton type="submit" className="w-full" size="lg" loading={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </GoldButton>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gold/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-luxury-dark px-2 text-luxury-gray">or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleSocialLogin("google")}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gold/20 bg-luxury-lighter hover:border-gold/40 hover:bg-luxury-lighter/50 transition-colors text-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm">Google</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin("github")}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gold/20 bg-luxury-lighter hover:border-gold/40 hover:bg-luxury-lighter/50 transition-colors text-white"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.82-.26.82-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm">GitHub</span>
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-luxury-gray mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-gold hover:text-brand-orange font-medium">
                  Sign in
                </Link>
              </p>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}