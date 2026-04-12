"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[AdminLogin] Form submitted", { email: formData.email });

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("[AdminLogin] Starting admin login request");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("[AdminLogin] Response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.log("[AdminLogin] Error response:", error);
        throw new Error(error.error || "Admin login failed");
      }

      const data = await response.json();
      console.log("[AdminLogin] Success response:", { userId: data.user?.id, role: data.user?.role });

      toast({
        title: "Success",
        description: "Welcome back, Administrator",
      });

      router.push("/admin");
    } catch (error: any) {
      console.error("[AdminLogin] Error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Unable to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlowCard variant="premium" hover={false} className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-gold" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white text-center mb-2">Admin Portal</h1>
              <p className="text-luxury-gray text-center text-sm mb-8">Sign in to access administrator dashboard</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gold/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-luxury-lighter border-gold/20 focus:border-gold focus:ring-gold/30 text-white placeholder:text-luxury-gray"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gold/50" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 bg-luxury-lighter border-gold/20 focus:border-gold focus:ring-gold/30 text-white placeholder:text-luxury-gray"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gold/50 hover:text-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <GoldButton type="submit" disabled={isLoading} loading={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Sign In as Administrator
                    </>
                  )}
                </GoldButton>
              </form>

              <p className="text-center text-sm text-luxury-gray mt-6">
                Not an admin?{" "}
                <Link href="/login" className="text-gold hover:text-gold/80 font-medium transition-colors">
                  User Login
                </Link>
              </p>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
