"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Link2, 
  Music, 
  User, 
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Loader2
} from "lucide-react";
import { UserLayout } from "@/components/user/UserLayout";
import { GoldButton, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardSubmitPage() {
  const [step, setStep] = useState(1);
  const [trackUrl, setTrackUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trackData, setTrackData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "", phone: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [platform, setPlatform] = useState<"spotify" | "youtube">("spotify");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/plans");
        const { plans: data } = await res.json();
        setPlans(data || []);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    }
    fetchPlans();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserProfile(user);
      setGuestInfo({ 
          name: user.name || user.user_metadata?.full_name || user.display_name || "", 
          email: user.email || "", 
          phone: user.phone || "" 
      });
    }
  }, []);

  const handleFetchMetadata = async () => {
    if (!trackUrl) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(trackUrl)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setTrackData({
        ...data,
        cover: data.coverImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
      });
      setStep(2);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not fetch track metadata. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !guestInfo.name || !guestInfo.email) return;
    setIsLoading(true);
    try {
      let userId = userProfile?.id;
      if (!userId) {
          throw new Error("You must be logged in to submit a track from here.");
      }

      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          trackUrl,
          trackType: platform,
          planId: selectedPlan,
          title: trackData.title,
          artist: trackData.artist,
          album: trackData.album,
          coverImage: trackData.cover,
          duration: trackData.duration,
          guestName: guestInfo.name,
          guestEmail: guestInfo.email,
        }),
      });

      const result = await subRes.json();
      if (!subRes.ok) throw new Error(result.error || "Submission failed");
      
      if (result.checkoutUrl) {
         window.location.href = result.checkoutUrl;
         return;
      }
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong with your submission.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <UserLayout title="Submit a Track" user={userProfile}>
        <div className="flex items-center justify-center p-4">
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
                <Link href="/dashboard" className="flex-1">
                  <GoldButton variant="outline" className="w-full">
                    Dashboard
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
        </div>
      </UserLayout>
    );
  }

  const activePlan = plans.find(p => p.id === selectedPlan);

  return (
    <UserLayout
      title="Submit a Track"
      subtitle="Start your promotion journey in just a few steps"
      user={userProfile}
    >
        {/* Progress Steps */}
        <section className="py-6 bg-luxury-dark border border-gold/10 rounded-xl mb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                        step > s ? "bg-gold text-luxury-black" : step === s ? "bg-gold text-luxury-black shadow-gold-glow" : "bg-luxury-lighter text-luxury-gray border border-gold/20"
                    )}>
                      {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    <span className={cn("text-xs mt-2 hidden sm:block", step >= s ? "text-gold" : "text-luxury-gray")}>
                      {s === 1 ? "Link" : s === 2 ? "Plan" : s === 3 ? "Info" : "Payment"}
                    </span>
                  </div>
                  {s < 4 && <div className={cn("w-12 sm:w-24 h-0.5 mx-2", step > s ? "bg-gold" : "bg-luxury-lighter")} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="max-w-4xl mx-auto">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {errorMessage}
              </div>
            )}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <GlowCard variant="premium" className="p-6 md:p-8">
                    <GlowCardHeader className="pb-4">
                      <GlowCardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-gold" />
                        </div>
                        Paste Your Track Link
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <GlowCardContent className="text-left">
                      <div className="space-y-6">
                        <div className="flex gap-4 p-1 bg-luxury-lighter rounded-lg border border-gold/10">
                          <button
                            onClick={() => setPlatform("spotify")}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all",
                              platform === "spotify" ? "bg-gold text-luxury-black shadow-gold-glow" : "text-luxury-gray hover:text-white"
                            )}
                          >
                            <Music className="w-5 h-5" />
                            <span className="font-semibold uppercase text-xs tracking-wider">Spotify</span>
                          </button>
                          <button
                            onClick={() => setPlatform("youtube")}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-all",
                              platform === "youtube" ? "bg-red-600 text-white shadow-lg" : "text-luxury-gray hover:text-white"
                            )}
                          >
                            <Music className="w-5 h-5" />
                            <span className="font-semibold uppercase text-xs tracking-wider">YouTube</span>
                          </button>
                        </div>

                        <div>
                          <Label className="text-white mb-2 block font-medium capitalize">{platform} URL</Label>
                          <Input
                            type="url"
                            placeholder={platform === "spotify" ? "https://open.spotify.com/track/..." : "https://youtube.com/watch?v=..."}
                            value={trackUrl}
                            onChange={(e) => setTrackUrl(e.target.value)}
                            className="bg-luxury-lighter border-gold/20 focus:border-gold focus:ring-gold/30 h-14 text-white text-lg"
                          />
                        </div>
                        <GoldButton onClick={handleFetchMetadata} disabled={!trackUrl || isLoading} loading={isLoading} className="w-full" size="lg">
                          Fetch Track Info
                        </GoldButton>
                      </div>
                    </GlowCardContent>
                  </GlowCard>
                </motion.div>
              )}

              {step === 2 && trackData && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <GlowCard variant="premium" className="p-4 text-left">
                    <div className="flex items-center gap-4">
                      <img src={trackData.cover} alt="Cover" className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{trackData.title}</h3>
                        <p className="text-sm text-luxury-gray truncate">{trackData.artist}</p>
                      </div>
                      <Button variant="ghost" className="text-gold" onClick={() => setStep(1)}>Change</Button>
                    </div>
                  </GlowCard>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <button key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={cn(
                          "relative rounded-xl p-5 text-left transition-all border",
                          selectedPlan === plan.id ? "bg-gold/10 border-gold shadow-gold-glow" : "bg-luxury-dark border-gold/20 hover:border-gold/40"
                      )}>
                        <h4 className={cn("text-lg font-semibold mb-1", selectedPlan === plan.id ? "text-gold" : "text-white")}>{plan.name}</h4>
                        <div className="text-2xl font-bold text-white mb-4">£{plan.price}</div>
                        <p className="text-xs text-luxury-gray leading-tight">{plan.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <GoldButton variant="outline" onClick={() => setStep(1)} className="flex-1">Back</GoldButton>
                    <GoldButton onClick={() => setStep(3)} disabled={!selectedPlan} className="flex-1">
                      Continue <ChevronRight className="w-5 h-5 ml-1" />
                    </GoldButton>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <GlowCard variant="premium" className="p-6 md:p-8 text-left">
                    <GlowCardHeader className="pb-4">
                      <GlowCardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-gold" />
                        </div>
                        Confirm Detail
                      </GlowCardTitle>
                    </GlowCardHeader>
                    <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Full Name *</Label>
                            <Input value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} className="bg-luxury-lighter border-gold/20" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white">Email Address *</Label>
                            <Input disabled type="email" value={guestInfo.email} onChange={e => setGuestInfo({...guestInfo, email: e.target.value})} className="bg-luxury-lighter border-gold/20 opacity-70 cursor-not-allowed" />
                          </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <GoldButton variant="outline" onClick={() => setStep(2)} className="flex-1">Back</GoldButton>
                          <GoldButton onClick={() => setStep(4)} disabled={!guestInfo.name || !guestInfo.email} className="flex-1">Checkout</GoldButton>
                        </div>
                    </div>
                  </GlowCard>
                </motion.div>
              )}

              {step === 4 && activePlan && (
                 <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <GlowCard variant="premium" className="p-6 md:p-8 text-left">
                      <GlowCardHeader className="pb-4">
                        <GlowCardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gold" />
                          </div>
                          Review & Pay
                        </GlowCardTitle>
                      </GlowCardHeader>
                      <div className="space-y-6 pt-4">
                         <div className="bg-luxury-lighter rounded-xl p-5 border border-gold/10">
                            <div className="flex justify-between mb-2">
                               <span className="text-luxury-gray">{activePlan.name} Plan</span>
                               <span className="text-white font-bold">£{activePlan.price}</span>
                            </div>
                            <div className="border-t border-gold/10 pt-3 mt-3 flex justify-between text-xl">
                               <span className="text-gold font-bold">Total</span>
                               <span className="text-gold font-black">£{activePlan.price}</span>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <GoldButton variant="outline" onClick={() => setStep(3)} className="flex-1">Back</GoldButton>
                            <GoldButton onClick={handleSubmit} loading={isLoading} className="flex-1">Pay Now</GoldButton>
                         </div>
                      </div>
                   </GlowCard>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
    </UserLayout>
  );
}
