"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Mail,
  Phone,
  Camera,
  Save,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Trash2,
  Download,
  Loader2,
} from "lucide-react";
import { UserLayout } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settingSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function UserSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    genre: "",
    location: "",
    referralCode: "",
    walletBalance: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);

        // Fetch user profile
        const userRes = await fetch(`/api/user?userId=${user.id}`);
        const { user: profile } = await userRes.json();
        if (profile) {
          setProfileData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            bio: profile.bio || "",
            genre: profile.genre || "",
            location: profile.location || "",
            referralCode: profile.referralCode || "",
            walletBalance: profile.walletBalance || 0,
          });
        }

        // Fetch payments
        const payRes = await fetch(`/api/payments?userId=${user.id}`);
        const { payments: history } = await payRes.json();
        setPayments(history || []);
      } catch (error) {
        console.error("Error fetching settings data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
          genre: profileData.genre,
          location: profileData.location,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      // Update local storage name if changed
      const updatedUser = { ...user, name: profileData.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <UserLayout title="Settings" subtitle="Manage your account preferences">
        <div className="flex items-center justify-center py-20">
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
        <GoldButton onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </GoldButton>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
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
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Personal Info */}
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white text-left block">Full Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-left block">Email (Read-only)</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-luxury-lighter border-gold/10 text-luxury-gray opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Phone</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-white">Location</Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 text-left">
                    <Label className="text-white">Bio</Label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full h-24 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </GlowCard>

              {/* Referral Info */}
              <GlowCard variant="premium" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Referral System</h3>
                <div className="p-4 bg-gold/5 border border-gold/10 rounded-lg">
                  <p className="text-sm text-luxury-gray mb-2">Your unique referral code:</p>
                  <div className="text-2xl font-bold text-gold tracking-widest uppercase">
                    {profileData.referralCode || "GETTING..."}
                  </div>
                  <p className="text-xs text-luxury-gray mt-2">
                    Earn rewards for every user you refer to PlugToPlaylist!
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Billing Section */}
          {activeSection === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left"
            >
              {/* Wallet Card */}
              <GlowCard variant="premium" className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Wallet Balance</h3>
                    <p className="text-luxury-gray text-sm">Credits available for promotion</p>
                  </div>
                  <div className="text-3xl font-bold text-gold">
                    ${profileData.walletBalance.toFixed(2)}
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <GoldButton size="sm">Add Funds</GoldButton>
                  <GoldButton variant="outline" size="sm">Redeem Coupon</GoldButton>
                </div>
              </GlowCard>

              {/* Billing History */}
              <GlowCard variant="default" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Billing History</h3>
                </div>
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
                          <td colSpan={4} className="py-8 text-center text-luxury-gray text-sm">
                            No billing history found.
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment.id} className="border-b border-gold/5">
                            <td className="py-3 text-sm text-luxury-gray">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-sm text-white">
                              {payment.submission?.plan?.name || "Service Payment"}
                              {payment.submission?.title && ` - ${payment.submission.title}`}
                            </td>
                            <td className="py-3 text-sm text-gold font-medium">
                              ${payment.amount.toFixed(2)}
                            </td>
                            <td className="py-3 text-right">
                              <span className={cn(
                                "px-2 py-0.5 text-xs rounded",
                                payment.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-brand-orange/20 text-brand-orange"
                              )}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
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

          {/* Simple notifications / security placeholders */}
          {(activeSection === "notifications" || activeSection === "security") && (
            <div className="py-20 text-center text-luxury-gray bg-luxury-dark rounded-xl border border-gold/10">
              This feature is coming soon in the next update.
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
