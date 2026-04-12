"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Music,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Clock,
  Shield,
} from "lucide-react";
import { Header, Footer, GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const features = [
  { icon: Zap, text: "No login needed" },
  { icon: Clock, text: "Takes 30 seconds" },
  { icon: Shield, text: "Secure & safe" },
];

export default function QuickSubmitPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackType, setTrackType] = useState<"spotify" | "youtube">("spotify");
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    trackUrl: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "guestName":
        return value.trim().length < 2 ? "Name must be at least 2 characters" : null;
      case "guestEmail":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email" : null;
      case "trackUrl":
        if (!value.trim() || value.trim().length < 10) {
          return "Please enter a valid track URL";
        }
        try {
          new URL(value);
        } catch {
          return "Invalid URL format";
        }
        // Check platform matches URL
        if (
          trackType === "spotify" &&
          !value.includes("spotify.com")
        ) {
          return "URL must be from Spotify";
        }
        if (
          trackType === "youtube" &&
          !value.includes("youtube.com") &&
          !value.includes("youtu.be")
        ) {
          return "URL must be from YouTube";
        }
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    const error = validateField(field, value);
    setFieldErrors({
      ...fieldErrors,
      [field]: error || "",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isFormValid = true;

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      setFieldErrors(newErrors);
      setError("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/guest-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: formData.guestName.trim(),
          guestEmail: formData.guestEmail.trim().toLowerCase(),
          trackUrl: formData.trackUrl.trim(),
          trackType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit song");
      }

      setFormData({ guestName: "", guestEmail: "", trackUrl: "" });
      setFieldErrors({});
      setIsSubmitted(true);

      // Auto-reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Song Submitted! 🎵
              </h1>
              <p className="text-luxury-gray mb-6">
                Your song has been successfully submitted to {process.env.NEXT_PUBLIC_SITE_NAME || "PlugToPlaylist"}.
              </p>

              <div className="bg-luxury-lighter rounded-lg p-4 mb-6 text-left space-y-2">
                <p className="text-sm text-luxury-gray">
                  <strong className="text-gold">✓ Confirmation email sent</strong> to your inbox
                </p>
                <p className="text-sm text-luxury-gray">
                  <strong className="text-gold">✓ We'll review</strong> your song within 24 hours
                </p>
                <p className="text-sm text-luxury-gray">
                  <strong className="text-gold">✓ Contact you</strong> with promotion options
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <button className="w-full px-6 py-3 bg-luxury-lighter text-white font-semibold rounded-lg hover:bg-luxury-lighter/80 transition-all duration-300">
                    Back to Home
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setTrackType("spotify");
                    setFormData({
                      guestName: "",
                      guestEmail: "",
                      trackUrl: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gold text-luxury-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300"
                >
                  Submit Another
                </button>
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

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Submit Your <span className="text-gold">Song</span>
              </h1>
              <p className="text-lg text-luxury-gray mb-6">
                No login needed. Takes just 30 seconds.
              </p>

              {/* Quick Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <feature.icon className="w-4 h-4 text-gold" />
                    <span className="text-sm text-luxury-gray">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-luxury-dark border border-gold/10 rounded-2xl p-6 md:p-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <Label className="text-white mb-3 block font-medium">Choose Platform</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setTrackType("spotify");
                        setFieldErrors({ ...fieldErrors, trackUrl: "" });
                        setError(null);
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all font-semibold",
                        trackType === "spotify"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-gold/20 text-luxury-gray hover:border-gold/50 hover:text-gold"
                      )}
                    >
                      <Music className="w-5 h-5" />
                      Spotify
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackType("youtube");
                        setFieldErrors({ ...fieldErrors, trackUrl: "" });
                        setError(null);
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all font-semibold",
                        trackType === "youtube"
                          ? "border-red-600 bg-red-600/10 text-red-400"
                          : "border-red-600/20 text-luxury-gray hover:border-red-600/50 hover:text-red-400"
                      )}
                    >
                      <Music className="w-5 h-5" />
                      YouTube
                    </button>
                  </div>
                </div>

                {/* Track URL */}
                <div className="space-y-2">
                  <Label htmlFor="trackUrl" className="text-white">
                    Song Link
                  </Label>
                  <Input
                    id="trackUrl"
                    type="url"
                    placeholder={
                      trackType === "spotify"
                        ? "https://open.spotify.com/track/..."
                        : "https://youtube.com/watch?v=..."
                    }
                    value={formData.trackUrl}
                    onChange={(e) => handleChange("trackUrl", e.target.value)}
                    className={`bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray ${
                      fieldErrors.trackUrl ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {fieldErrors.trackUrl && (
                    <p className="text-red-400 text-xs">{fieldErrors.trackUrl}</p>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="guestName" className="text-white">
                    Your Name
                  </Label>
                  <Input
                    id="guestName"
                    placeholder="John Doe"
                    value={formData.guestName}
                    onChange={(e) => handleChange("guestName", e.target.value)}
                    className={`bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray ${
                      fieldErrors.guestName ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {fieldErrors.guestName && (
                    <p className="text-red-400 text-xs">{fieldErrors.guestName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="guestEmail" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.guestEmail}
                    onChange={(e) => handleChange("guestEmail", e.target.value)}
                    className={`bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray ${
                      fieldErrors.guestEmail ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {fieldErrors.guestEmail && (
                    <p className="text-red-400 text-xs">{fieldErrors.guestEmail}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gold text-luxury-black font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Music className="w-5 h-5" />
                      Submit Song Now
                    </>
                  )}
                </button>

                {/* Terms notice */}
                <p className="text-xs text-center text-luxury-gray">
                  By submitting, you agree to our{" "}
                  <Link href="/terms" className="text-gold hover:text-brand-orange transition-colors">
                    Terms of Service
                  </Link>
                </p>
              </form>
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 bg-luxury-dark border border-gold/10 rounded-xl"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-gold" />
                What Happens Next?
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-gold font-bold">1.</span>
                  <span className="text-luxury-gray">
                    <strong className="text-white">We review</strong> your song within 24 hours
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold font-bold">2.</span>
                  <span className="text-luxury-gray">
                    <strong className="text-white">We contact you</strong> with promotion options
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold font-bold">3.</span>
                  <span className="text-luxury-gray">
                    <strong className="text-white">Choose a plan</strong> and get promoted!
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
