"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft,
  Link2, 
  Music, 
  User, 
  Mail, 
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Shield,
  Clock,
  Headphones
} from "lucide-react";
import { Header, Footer, GoldButton, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 50,
    currency: "£",
    playlistPitches: "1–2",
    features: ["1–2 Playlist Pitches", "1-Month Guarantee", "Afrobeats: 6,000+ streams", "Amapiano: 8,000+ streams"],
    highlight: "Perfect for new artists",
  },
  {
    id: "standard",
    name: "Standard",
    price: 100,
    currency: "£",
    playlistPitches: "1–3",
    features: ["1–3 Playlist Pitches", "1-Month Guarantee", "Afrobeats: 10,000+ streams", "Amapiano: 16,000+ streams"],
    popular: true,
    highlight: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium",
    price: 200,
    currency: "£",
    playlistPitches: "1–4",
    features: ["1–4 Playlist Pitches", "1-Month Guarantee", "Afrobeats: 20,000+ streams", "Amapiano: 35,000+ streams"],
    highlight: "Best value",
  },
];

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

const benefits = [
  { icon: Clock, title: "Quick Setup", description: "Get started in under 5 minutes" },
  { icon: Shield, title: "Secure Payment", description: "Protected by industry-standard encryption" },
  { icon: Headphones, title: "24/7 Support", description: "Our team is always here to help" },
];

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [trackUrl, setTrackUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackData, setTrackData] = useState<null | typeof mockTrackData.spotify>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const detectPlatform = (url: string): "spotify" | "youtube" | null => {
    if (url.includes("spotify.com")) return "spotify";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    return null;
  };

  const handleFetchMetadata = async () => {
    if (!trackUrl) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const platform = detectPlatform(trackUrl);
    if (platform) {
      setTrackData(mockTrackData[platform]);
      setStep(2);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !guestInfo.name || !guestInfo.email) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-luxury-black text-white flex flex-col">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
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
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Submission Received!
              </h1>
              <p className="text-luxury-gray mb-6">
                Thank you for your submission. We'll review your track and get back to you within 24 hours with your campaign details.
              </p>
              <div className="bg-luxury-lighter rounded-lg p-4 mb-6 text-left">
                <h4 className="text-sm font-medium text-white mb-2">What happens next:</h4>
                <ul className="space-y-2">
                  {["Track review (within 24 hours)", "Campaign setup", "Promotion begins", "Weekly progress reports"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-luxury-gray">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold">
                        {i + 1}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <GoldButton variant="outline" className="w-full">
                    Back to Home
                  </GoldButton>
                </Link>
                <GoldButton 
                  className="flex-1"
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                    setTrackUrl("");
                    setTrackData(null);
                    setSelectedPlan(null);
                  }}
                >
                  New Submission
                </GoldButton>
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
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-8 border-b border-gold/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Submit Your <span className="text-gold">Music</span>
            </h1>
            <p className="text-luxury-gray">Start your promotion journey in just a few steps</p>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-6 bg-luxury-dark border-b border-gold/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                        step > s
                          ? "bg-gold text-luxury-black"
                          : step === s
                          ? "bg-gold text-luxury-black shadow-gold-glow"
                          : "bg-luxury-lighter text-luxury-gray border border-gold/20"
                      )}
                    >
                      {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 hidden sm:block",
                      step >= s ? "text-gold" : "text-luxury-gray"
                    )}>
                      {s === 1 ? "Link" : s === 2 ? "Plan" : s === 3 ? "Info" : "Payment"}
                    </span>
                  </div>
                  {s < 4 && (
                    <div className={cn(
                      "w-12 sm:w-24 h-0.5 mx-2",
                      step > s ? "bg-gold" : "bg-luxury-lighter"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      <GlowCardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-gold" />
                        </div>
                        Paste Your Track Link
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <div className="space-y-6">
                        <div>
                          <Label className="text-white mb-2 block">Track URL</Label>
                          <Input
                            type="url"
                            placeholder="https://open.spotify.com/track/... or https://youtube.com/watch?v=..."
                            value={trackUrl}
                            onChange={(e) => setTrackUrl(e.target.value)}
                            className="bg-luxury-lighter border-gold/20 focus:border-gold focus:ring-gold/30 h-14 text-white placeholder:text-luxury-gray text-lg"
                          />
                        </div>
                        
                        {/* Platform Detection */}
                        <div className="flex items-center gap-4 justify-center">
                          <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                            trackUrl.includes("spotify.com")
                              ? "bg-green-500/20 border-green-500/30 text-green-400"
                              : "bg-luxury-lighter border-gold/10 text-luxury-gray"
                          )}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                            <span className="text-sm font-medium">Spotify</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                            (trackUrl.includes("youtube.com") || trackUrl.includes("youtu.be"))
                              ? "bg-red-500/20 border-red-500/30 text-red-400"
                              : "bg-luxury-lighter border-gold/10 text-luxury-gray"
                          )}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            <span className="text-sm font-medium">YouTube</span>
                          </div>
                        </div>

                        <GoldButton
                          onClick={handleFetchMetadata}
                          disabled={!trackUrl || isLoading}
                          loading={isLoading}
                          className="w-full"
                          size="lg"
                        >
                          {isLoading ? "Fetching Track Info..." : "Fetch Track Info"}
                        </GoldButton>
                      </div>
                    </GlowCardContent>
                  </GlowCard>
                </motion.div>
              )}

              {/* Step 2: Select Plan */}
              {step === 2 && trackData && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Track Preview */}
                  <GlowCard variant="premium" hover={false} className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={trackData.cover}
                        alt={trackData.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{trackData.title}</h3>
                        <p className="text-sm text-luxury-gray truncate">{trackData.artist}</p>
                        <p className="text-xs text-luxury-gray">{trackData.album} • {trackData.duration}</p>
                      </div>
                      <button
                        onClick={() => {
                          setTrackData(null);
                          setStep(1);
                        }}
                        className="text-sm text-gold hover:text-brand-orange whitespace-nowrap"
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
                        onClick={() => setSelectedPlan(plan.id)}
                        className={cn(
                          "relative rounded-xl p-5 text-left transition-all duration-300",
                          selectedPlan === plan.id
                            ? "bg-gold/20 border-2 border-gold shadow-gold-glow"
                            : "bg-luxury-dark border border-gold/20 hover:border-gold/40"
                        )}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2 right-4 px-2 py-0.5 bg-gold text-luxury-black text-xs font-semibold rounded">
                            Popular
                          </span>
                        )}
                        <h4 className={cn(
                          "text-lg font-semibold mb-1",
                          selectedPlan === plan.id ? "text-gold" : "text-white"
                        )}>
                          {plan.name}
                        </h4>
                        <p className="text-xs text-brand-orange mb-3">{plan.highlight}</p>
                        <div className="text-2xl font-bold text-white mb-4">
                          {plan.currency}{plan.price}
                        </div>
                        <ul className="space-y-1.5">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-luxury-gray">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <GoldButton variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </GoldButton>
                    <GoldButton
                      onClick={() => selectedPlan && setStep(3)}
                      disabled={!selectedPlan}
                      className="flex-1"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </GoldButton>
                  </div>
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
                      <GlowCardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-gold" />
                        </div>
                        Your Information
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Full Name *</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Your name"
                              value={guestInfo.name}
                              onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                              className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={guestInfo.email}
                              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                              className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-white">Phone (Optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={guestInfo.phone}
                            onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                            className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                          />
                        </div>

                        <div className="flex items-center gap-2 p-4 bg-luxury-lighter rounded-lg">
                          <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gold/30 bg-luxury-lighter text-gold focus:ring-gold/30" />
                          <label htmlFor="terms" className="text-sm text-luxury-gray">
                            I agree to the{" "}
                            <Link href="/terms" className="text-gold hover:text-brand-orange">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-gold hover:text-brand-orange">Privacy Policy</Link>
                          </label>
                        </div>

                        <div className="flex gap-4 pt-2">
                          <GoldButton variant="outline" onClick={() => setStep(2)} className="flex-1">
                            Back
                          </GoldButton>
                          <GoldButton
                            onClick={() => setStep(4)}
                            disabled={!guestInfo.name || !guestInfo.email}
                            className="flex-1"
                          >
                            Continue to Payment
                            <ChevronRight className="w-5 h-5" />
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
                      <GlowCardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gold" />
                        </div>
                        Complete Payment
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <GlowCardContent>
                      <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-luxury-lighter rounded-xl p-5">
                          <h4 className="text-sm font-medium text-white mb-4">Order Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-white">{plans.find(p => p.id === selectedPlan)?.name} Plan</span>
                              <span className="text-white">{plans.find(p => p.id === selectedPlan)?.currency}{plans.find(p => p.id === selectedPlan)?.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-luxury-gray">Processing Fee</span>
                              <span className="text-green-400">Free</span>
                            </div>
                            <div className="border-t border-gold/10 pt-3 mt-3">
                              <div className="flex justify-between font-semibold text-lg">
                                <span className="text-white">Total</span>
                                <span className="text-gold">{plans.find(p => p.id === selectedPlan)?.currency}{plans.find(p => p.id === selectedPlan)?.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                          <h4 className="text-sm font-medium text-white mb-3">Select Payment Method</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-gold bg-gold/10 text-gold">
                              <svg className="w-10 h-6" viewBox="0 0 100 30" fill="none">
                                <rect width="100" height="30" rx="4" fill="#00B3FF"/>
                                <text x="50" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Paystack</text>
                              </svg>
                            </button>
                            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-gold/20 bg-luxury-lighter hover:border-gold/40 transition-colors">
                              <svg className="w-10 h-6" viewBox="0 0 100 30" fill="none">
                                <rect width="100" height="30" rx="4" fill="#F5A623"/>
                                <text x="50" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Flutterwave</text>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-luxury-lighter rounded-lg">
                              <benefit.icon className="w-5 h-5 text-gold flex-shrink-0" />
                              <div>
                                <div className="text-xs font-medium text-white">{benefit.title}</div>
                                <div className="text-xs text-luxury-gray">{benefit.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <GoldButton variant="outline" onClick={() => setStep(3)} className="flex-1">
                            Back
                          </GoldButton>
                          <GoldButton
                            onClick={handleSubmit}
                            disabled={isLoading}
                            loading={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? "Processing..." : `Pay £${plans.find(p => p.id === selectedPlan)?.price}`}
                          </GoldButton>
                        </div>

                        <p className="text-xs text-luxury-gray text-center flex items-center justify-center gap-2">
                          <Shield className="w-4 h-4" />
                          Secure payment powered by Paystack & Flutterwave
                        </p>
                      </div>
                    </GlowCardContent>
                  </GlowCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
