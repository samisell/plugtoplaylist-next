"use client";

import { useState } from "react";
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
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Rivera",
    email: "alex@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Independent artist passionate about creating music that moves people.",
    genre: "Pop, R&B",
    location: "Los Angeles, CA",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  };

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
              {/* Avatar */}
              <GlowCard variant="premium" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-xl bg-gold/20 border-2 border-gold/30 flex items-center justify-center">
                      <User className="w-12 h-12 text-gold" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gold text-luxury-black flex items-center justify-center hover:bg-gold/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Alex Rivera</p>
                    <p className="text-sm text-luxury-gray mb-3">JPG, PNG or GIF. Max 2MB.</p>
                    <GoldButton variant="outline" size="sm">
                      Upload Photo
                    </GoldButton>
                  </div>
                </div>
              </GlowCard>

              {/* Personal Info */}
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Full Name</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Email</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Phone</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Location</Label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white">Bio</Label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full h-24 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Genre(s)</Label>
                    <Input
                      value={profileData.genre}
                      onChange={(e) => setProfileData({ ...profileData, genre: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                </div>
              </GlowCard>

              {/* Social Links */}
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
                <div className="space-y-4">
                  {[
                    { label: "Spotify Artist URL", placeholder: "https://open.spotify.com/artist/..." },
                    { label: "YouTube Channel", placeholder: "https://youtube.com/@..." },
                    { label: "Instagram", placeholder: "https://instagram.com/..." },
                    { label: "Twitter/X", placeholder: "https://twitter.com/..." },
                  ].map((social, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-white">{social.label}</Label>
                      <Input
                        placeholder={social.placeholder}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white placeholder:text-luxury-gray"
                      />
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Change Password */}
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-gold" />
                  Change Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label className="text-white">Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <GoldButton size="sm">Update Password</GoldButton>
                </div>
              </GlowCard>

              {/* Two-Factor Auth */}
              <GlowCard variant="default" className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-luxury-gray mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </GlowCard>

              {/* Sessions */}
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: "MacBook Pro - Chrome", location: "Los Angeles, CA", current: true },
                    { device: "iPhone 14 - Safari", location: "Los Angeles, CA", current: false },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-luxury-lighter/50 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{session.device}</div>
                        <div className="text-xs text-luxury-gray">{session.location}</div>
                      </div>
                      {session.current ? (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                          Current
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </GlowCard>

              {/* Danger Zone */}
              <GlowCard variant="default" className="p-5 border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-luxury-gray mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </GlowCard>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: "Campaign Updates", description: "Progress and status changes", enabled: true },
                    { label: "Payment Receipts", description: "Confirmations and invoices", enabled: true },
                    { label: "Milestone Alerts", description: "When you reach streaming goals", enabled: true },
                    { label: "Weekly Summary", description: "Weekly performance report", enabled: false },
                    { label: "Marketing Emails", description: "Promotions and offers", enabled: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gold/5 last:border-0">
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-sm text-luxury-gray">{item.description}</div>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: "Campaign Alerts", description: "Real-time campaign updates", enabled: true },
                    { label: "New Messages", description: "Support and system messages", enabled: true },
                    { label: "Referral Bonuses", description: "When you earn rewards", enabled: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gold/5 last:border-0">
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-sm text-luxury-gray">{item.description}</div>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Billing Section */}
          {activeSection === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Current Plan */}
              <GlowCard variant="premium" className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Current Plan</h3>
                    <p className="text-luxury-gray text-sm">Your active subscription</p>
                  </div>
                  <span className="px-3 py-1 bg-gold/20 text-gold rounded-lg text-sm font-medium">
                    Free Plan
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <div className="flex items-center justify-between">
                    <span className="text-luxury-gray">Total spent</span>
                    <span className="text-gold font-semibold">$747.00</span>
                  </div>
                </div>
              </GlowCard>

              {/* Payment Methods */}
              <GlowCard variant="default" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                  <GoldButton variant="outline" size="sm">
                    Add New
                  </GoldButton>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-luxury-lighter/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <div className="text-white text-sm">•••• •••• •••• 4242</div>
                        <div className="text-xs text-luxury-gray">Expires 12/26</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                        Default
                      </span>
                    </div>
                  </div>
                </div>
              </GlowCard>

              {/* Billing History */}
              <GlowCard variant="default" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Billing History</h3>
                  <Button variant="ghost" size="sm" className="text-luxury-gray hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
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
                      {[
                        { date: "Jan 21, 2024", desc: "Premium Plan", amount: "$149.00", status: "paid" },
                        { date: "Jan 18, 2024", desc: "Starter Plan", amount: "$49.00", status: "paid" },
                        { date: "Jan 10, 2024", desc: "Professional Plan", amount: "$349.00", status: "paid" },
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-gold/5">
                          <td className="py-3 text-sm text-luxury-gray">{item.date}</td>
                          <td className="py-3 text-sm text-white">{item.desc}</td>
                          <td className="py-3 text-sm text-gold font-medium">{item.amount}</td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
