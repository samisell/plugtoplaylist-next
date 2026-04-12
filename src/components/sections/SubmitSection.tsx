"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Link2, 
  Music, 
  User, 
  Mail, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap
} from "lucide-react";
import { GoldButton, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Plan data
const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    features: ["5 Playlists", "2 Weeks", "Basic Analytics"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 149,
    features: ["15 Playlists", "4 Weeks", "Priority Support"],
    popular: true,
  },
  {
    id: "professional",
    name: "Pro",
    price: 349,
    features: ["50+ Playlists", "8 Weeks", "24/7 Support"],
  },
];

// Mock track data for demo
const mockTrackData = {
  spotify: {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    duration: "3:20",
  },
  youtube: {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    duration: "4:24",
  },
};

export function SubmitSection() {
  const [step, setStep] = useState(1);
  const [trackUrl, setTrackUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackData, setTrackData] = useState<null | typeof mockTrackData.spotify>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const detectPlatform = (url: string): "spotify" | "youtube" | null => {
    if (url.includes("spotify.com")) return "spotify";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    return null;
  };

  const handleFetchMetadata = async () => {
    if (!trackUrl) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const platform = detectPlatform(trackUrl);
    if (platform) {
      setTrackData(mockTrackData[platform]);
      setStep(2);
    }
    
    setIsLoading(false);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !guestInfo.name || !guestInfo.email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="submit" className="py-20 md:py-32 bg-luxury-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-dark border border-green-500/30 rounded-2xl p-8 md:p-12"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Submission Received!
            </h2>
            <p className="text-luxury-gray mb-6">
              Thank you for your submission. We'll review your track and get back to you within 24 hours with your campaign details.
            </p>
            <GoldButton variant="outline" onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setTrackUrl("");
              setTrackData(null);
              setSelectedPlan(null);
            }}>
              Submit Another Track
            </GoldButton>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="submit" className="py-20 md:py-32 bg-gradient-to-b from-luxury-dark to-luxury-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Submit Your <span className="text-gold">Music</span>
          </h2>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto mb-8">
            Paste your Spotify or YouTube link and we'll automatically fetch your track details.
          </p>
          
          {/* Quick Submit CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <p className="text-luxury-gray text-sm">💨 In a hurry?</p>
            <Link href="/submit/quick">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/50 text-gold font-semibold rounded-lg hover:bg-gold/20 hover:border-gold transition-all">
                <Zap className="w-4 h-4" />
                Fast Guest Submission (30 sec)
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step >= s
                    ? "bg-gold text-luxury-black"
                    : "bg-luxury-lighter text-luxury-gray border border-gold/20"
                )}
              >
                {s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "w-8 md:w-16 h-0.5 mx-1",
                  step > s ? "bg-gold" : "bg-luxury-lighter"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Paste Link */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlowCard variant="premium" hover={false} className="p-6 md:p-8">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-gold" />
                    Paste Your Track Link
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://open.spotify.com/track/..."
                        value={trackUrl}
                        onChange={(e) => setTrackUrl(e.target.value)}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold focus:ring-gold/30 h-12 pl-4 pr-4 text-white placeholder:text-luxury-gray"
                      />
                    </div>
                    
                    {/* Platform Icons */}
                    <div className="flex items-center gap-4 justify-center">
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                        trackUrl.includes("spotify.com")
                          ? "bg-green-500/20 border-green-500/30 text-green-400"
                          : "bg-luxury-lighter border-gold/10 text-luxury-gray"
                      )}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        <span className="text-sm">Spotify</span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                        trackUrl.includes("youtube.com") || trackUrl.includes("youtu.be")
                          ? "bg-red-500/20 border-red-500/30 text-red-400"
                          : "bg-luxury-lighter border-gold/10 text-luxury-gray"
                      )}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="text-sm">YouTube</span>
                      </div>
                    </div>

                    <GoldButton
                      onClick={handleFetchMetadata}
                      disabled={!trackUrl || isLoading}
                      loading={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Fetching Track Info..." : "Fetch Track Info"}
                    </GoldButton>
                  </div>
                </GlowCardContent>
              </GlowCard>
            </motion.div>
          )}

          {/* Step 2: Confirm Track & Select Plan */}
          {step === 2 && trackData && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Track Preview */}
              <GlowCard variant="premium" hover={false} className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={trackData.cover}
                    alt={trackData.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{trackData.title}</h3>
                    <p className="text-luxury-gray">{trackData.artist}</p>
                    <p className="text-sm text-luxury-gray">{trackData.album} • {trackData.duration}</p>
                  </div>
                  <button
                    onClick={() => {
                      setTrackData(null);
                      setStep(1);
                    }}
                    className="text-sm text-gold hover:text-brand-orange"
                  >
                    Change
                  </button>
                </div>
              </GlowCard>

              {/* Plan Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={cn(
                      "relative rounded-xl p-6 text-left transition-all duration-300",
                      selectedPlan === plan.id
                        ? "bg-gold/20 border-2 border-gold shadow-gold-glow"
                        : "bg-luxury-dark border border-gold/20 hover:border-gold/40"
                    )}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold text-luxury-black text-xs font-medium rounded">
                        Popular
                      </span>
                    )}
                    <h4 className={cn(
                      "text-lg font-semibold mb-2",
                      selectedPlan === plan.id ? "text-gold" : "text-white"
                    )}>
                      {plan.name}
                    </h4>
                    <div className="text-2xl font-bold text-white mb-4">
                      ${plan.price}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-luxury-gray">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <GoldButton
                onClick={() => selectedPlan && setStep(3)}
                disabled={!selectedPlan}
                className="w-full"
              >
                Continue to Payment
                <ChevronRight className="w-5 h-5" />
              </GoldButton>
            </motion.div>
          )}

          {/* Step 3: Guest Info */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlowCard variant="premium" hover={false} className="p-6 md:p-8">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle>Your Information</GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={guestInfo.name}
                          onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                          className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 text-white placeholder:text-luxury-gray"
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
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                          className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-10 text-white placeholder:text-luxury-gray"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-luxury-gray">
                      By submitting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                    <div className="flex gap-4">
                      <GoldButton
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1"
                      >
                        Back
                      </GoldButton>
                      <GoldButton
                        onClick={() => setStep(4)}
                        disabled={!guestInfo.name || !guestInfo.email}
                        className="flex-1"
                      >
                        Continue
                      </GoldButton>
                    </div>
                  </div>
                </GlowCardContent>
              </GlowCard>
            </motion.div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GlowCard variant="premium" hover={false} className="p-6 md:p-8">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle>Complete Payment</GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  {/* Order Summary */}
                  <div className="bg-luxury-lighter rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-luxury-gray mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{plans.find(p => p.id === selectedPlan)?.name} Plan</span>
                        <span className="text-white">${plans.find(p => p.id === selectedPlan)?.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-luxury-gray">Processing Fee</span>
                        <span className="text-luxury-gray">$0.00</span>
                      </div>
                      <div className="border-t border-gold/10 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">Total</span>
                          <span className="text-gold">${plans.find(p => p.id === selectedPlan)?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gold/20 bg-luxury-lighter hover:border-gold/40 transition-colors">
                      <svg className="w-8 h-8" viewBox="0 0 100 30" fill="none">
                        <rect width="100" height="30" rx="4" fill="#00B3FF"/>
                        <text x="50" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Paystack</text>
                      </svg>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gold/20 bg-luxury-lighter hover:border-gold/40 transition-colors">
                      <svg className="w-8 h-8" viewBox="0 0 100 30" fill="none">
                        <rect width="100" height="30" rx="4" fill="#F5A623"/>
                        <text x="50" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Flutterwave</text>
                      </svg>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <GoldButton
                      variant="outline"
                      onClick={() => setStep(3)}
                      className="flex-1"
                    >
                      Back
                    </GoldButton>
                    <GoldButton
                      onClick={handleSubmit}
                      disabled={isLoading}
                      loading={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Processing..." : "Pay Now"}
                    </GoldButton>
                  </div>

                  <p className="text-xs text-luxury-gray text-center mt-4">
                    🔒 Secure payment powered by Paystack & Flutterwave
                  </p>
                </GlowCardContent>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
