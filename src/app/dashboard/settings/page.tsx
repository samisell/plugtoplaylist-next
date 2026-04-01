"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  Loader2,
  Copy,
  CheckCheck,
  Crown,
} from "lucide-react";
import { UserLayout } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const settingSections = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "security",      label: "Security",      icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing",       label: "Billing",       icon: CreditCard },
];

export default function UserSettingsPage() {
  const [activeSection, setActiveSection]   = useState("profile");
  const [loading,  setLoading]              = useState(true);
  const [saving,   setSaving]               = useState(false);
  const [saved,    setSaved]                = useState(false);
  const [error,    setError]                = useState("");
  const [codeCopied, setCodeCopied]         = useState(false);
  const [payments, setPayments]             = useState<any[]>([]);
  const [userId,   setUserId]               = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name:          "",
    email:         "",
    phone:         "",
    bio:           "",
    genre:         "",
    location:      "",
    referralCode:  "",
    walletBalance: 0,
  });

  // ─── Load user on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 1. Try localStorage (populated when visiting /dashboard)
        let uid: string | null = null;
        const stored = localStorage.getItem("user");
        if (stored) {
          const local = JSON.parse(stored);
          uid = local?.id;
        }

        // 2. Fall back to live session API
        if (!uid) {
          const sRes = await fetch("/api/auth/session");
          if (sRes.ok) {
            const { user: su } = await sRes.json();
            uid = su?.id ?? null;
          }
        }

        if (!uid) { setLoading(false); return; }
        setUserId(uid);

        // 3. Fetch full profile from DB
        const [pRes, payRes] = await Promise.all([
          fetch(`/api/user?userId=${uid}`),
          fetch(`/api/payments?userId=${uid}`),
        ]);

        const { user: profile } = await pRes.json();
        const { payments: hist } = payRes.ok ? await payRes.json() : { payments: [] };

        setPayments(hist || []);

        if (profile) {
          setProfileData({
            name:          profile.display_name || profile.name || "",
            email:         profile.email || "",
            phone:         profile.phone || "",
            bio:           profile.bio   || "",
            genre:         profile.genre || "",
            location:      profile.location || "",
            referralCode:  profile.metadata?.referral_code || profile.referralCode || "",
            walletBalance: profile.wallet_balance || profile.walletBalance || 0,
          });
        }
      } catch (e) {
        console.error("Settings load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ─── Save profile ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!userId) return;
    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/user", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name:     profileData.name,
          phone:    profileData.phone,
          bio:      profileData.bio,
          genre:    profileData.genre,
          location: profileData.location,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to update profile");
      }

      // Update localStorage so sidebar reflects change immediately
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem("user", JSON.stringify({
        ...parsed,
        name:         profileData.name,
        display_name: profileData.name,
        phone:        profileData.phone,
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const copyReferralCode = () => {
    if (profileData.referralCode) {
      navigator.clipboard.writeText(profileData.referralCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <UserLayout title="Settings" subtitle="Manage your account preferences">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout
      title="Settings"
      subtitle="Manage your account preferences"
      actions={
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Saved!
            </span>
          )}
          {error && <span className="text-red-400 text-sm">{error}</span>}
          <GoldButton onClick={handleSave} loading={saving} disabled={!userId}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </GoldButton>
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-luxury-dark border border-gold/10 rounded-xl overflow-hidden">
            <div className="p-2 space-y-1">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeSection === section.id
                      ? "bg-gold/10 text-gold"
                      : "text-luxury-gray hover:text-white hover:bg-luxury-lighter"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ── Profile ── */}
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Avatar + name header */}
              <GlowCard variant="premium" className="p-5">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gold" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">{profileData.name || "Your Name"}</h3>
                    <p className="text-sm text-luxury-gray">{profileData.email}</p>
                    <p className="text-xs text-gold mt-1">Registered user</p>
                  </div>
                </div>
              </GlowCard>

              {/* Personal info form */}
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-5 text-left">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Full Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Your full name"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Email Address <span className="text-luxury-gray text-xs">(read-only)</span></Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-luxury-lighter border-gold/10 text-luxury-gray opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Phone Number</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Location</Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Genre / Style</Label>
                    <Input
                      value={profileData.genre}
                      onChange={(e) => setProfileData({ ...profileData, genre: e.target.value })}
                      placeholder="e.g. R&B, Hip-Hop, Pop"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 text-left">
                    <Label className="text-white">Bio</Label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us a bit about yourself and your music..."
                      rows={3}
                      className="w-full bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </GlowCard>

              {/* Referral code */}
              <GlowCard variant="premium" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 text-left">
                  <Crown className="w-5 h-5 text-gold" />
                  Your Referral Code
                </h3>
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 text-left">
                  <p className="text-sm text-luxury-gray mb-3">
                    Share your unique code and earn rewards for every user you bring to PlugToPlaylist!
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-luxury-lighter rounded-lg px-4 py-3 font-mono text-2xl font-bold text-gold tracking-widest uppercase select-all">
                      {profileData.referralCode || "—"}
                    </div>
                    <button
                      onClick={copyReferralCode}
                      disabled={!profileData.referralCode}
                      className="p-3 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold transition-colors disabled:opacity-40"
                    >
                      {codeCopied ? <CheckCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  {codeCopied && <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* ── Billing ── */}
          {activeSection === "billing" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
              <GlowCard variant="premium" className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Wallet Balance</h3>
                    <p className="text-luxury-gray text-sm">Credits available for promotion</p>
                  </div>
                  <div className="text-3xl font-bold text-gold">
                    £{profileData.walletBalance.toFixed(2)}
                  </div>
                </div>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10">
                        <th className="text-left py-2 text-xs font-medium text-luxury-gray">Date</th>
                        <th className="text-left py-2 text-xs font-medium text-luxury-gray">Description</th>
                        <th className="text-left py-2 text-xs font-medium text-luxury-gray">Amount</th>
                        <th className="text-right py-2 text-xs font-medium text-luxury-gray">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-10 text-center text-luxury-gray text-sm">
                            No billing history yet.
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-gold/5">
                            <td className="py-3 text-sm text-luxury-gray">
                              {new Date(payment.created_at || payment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-sm text-white">
                              {payment.submission?.planName || "Service Payment"}
                              {payment.submission?.title && ` — ${payment.submission.title}`}
                            </td>
                            <td className="py-3 text-sm text-gold font-medium">
                              £{Number(payment.amount).toFixed(2)}
                            </td>
                            <td className="py-3 text-right">
                              <span className={cn(
                                "px-2 py-0.5 text-xs rounded",
                                payment.status === "completed" || payment.status === "paid"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-brand-orange/20 text-brand-orange"
                              )}>
                                {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* ── Security / Notifications placeholders ── */}
          {(activeSection === "security" || activeSection === "notifications") && (
            <div className="py-24 text-center text-luxury-gray bg-luxury-dark rounded-xl border border-gold/10">
              <Shield className="w-12 h-12 text-gold/30 mx-auto mb-4" />
              <p className="text-white font-medium mb-1">Coming Soon</p>
              <p className="text-sm">This feature will be available in the next update.</p>
            </div>
          )}

        </div>
      </div>
    </UserLayout>
  );
}
