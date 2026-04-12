"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Database,
  Key,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const settingSections = [
  { id: "general", label: "General", icon: Globe },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API Keys", icon: Key },
  { id: "email", label: "Email", icon: Mail },
  { id: "database", label: "Database", icon: Database },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
  };

  return (
    <AdminLayout
      title="Settings"
      subtitle="Manage platform configuration"
      actions={
        <GoldButton onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </GoldButton>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-luxury-dark border border-gold/10 rounded-xl overflow-hidden">
            <div className="p-3 space-y-1">
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
          {/* General Settings */}
          {activeSection === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Site Name</Label>
                    <Input
                      defaultValue="PlugToPlaylist"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Site URL</Label>
                    <Input
                      defaultValue="https://plugtoplaylist.com"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Support Email</Label>
                    <Input
                      defaultValue="support@plugtoplaylist.com"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Support Phone</Label>
                    <Input
                      defaultValue="+1 (555) 123-4567"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                </div>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Maintenance Mode</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Enable Maintenance Mode</p>
                    <p className="text-sm text-luxury-gray">Temporarily disable the site for maintenance</p>
                  </div>
                  <Switch />
                </div>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Feature Flags</h3>
                <div className="space-y-4">
                  {[
                    { label: "Enable Guest Submissions", description: "Allow submissions without account", enabled: true },
                    { label: "Enable Referral System", description: "Allow users to earn referral bonuses", enabled: true },
                    { label: "Enable Coupon Codes", description: "Allow discount codes at checkout", enabled: false },
                    { label: "Enable AI Plan Suggestion", description: "Use AI to recommend plans", enabled: true },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                      <div>
                        <p className="text-white">{feature.label}</p>
                        <p className="text-sm text-luxury-gray">{feature.description}</p>
                      </div>
                      <Switch defaultChecked={feature.enabled} />
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Payment Settings */}
          {activeSection === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlowCard variant="premium" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Paystack</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">Connected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Public Key</Label>
                    <Input
                      defaultValue="pk_live_xxxxxxxxxxxxxxxxxxxxxx"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Secret Key</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxxx"
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white font-mono text-xs pr-10"
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
                </div>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Flutterwave</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-luxury-lighter text-luxury-gray rounded">Not Connected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Public Key</Label>
                    <Input
                      placeholder="Enter your Flutterwave public key"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Secret Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter your Flutterwave secret key"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white font-mono text-xs"
                    />
                  </div>
                </div>
                <GoldButton variant="outline" size="sm" className="mt-4">
                  Connect Flutterwave
                </GoldButton>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Enable Test Mode</p>
                      <p className="text-sm text-luxury-gray">Use test payment credentials</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Auto-Refund Failed Campaigns</p>
                      <p className="text-sm text-luxury-gray">Automatically refund if campaign doesn&apos;t start within 7 days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* API Keys */}
          {activeSection === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlowCard variant="default" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">API Keys</h3>
                  <GoldButton variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Key
                  </GoldButton>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Production Key", key: "pk_live_xxxxxxxxxxxxxxxxxxxxxx", created: "Jan 15, 2024" },
                    { name: "Test Key", key: "pk_test_xxxxxxxxxxxxxxxxxxxxxxx", created: "Jan 10, 2024" },
                  ].map((apiKey, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-luxury-lighter/50 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-medium">{apiKey.name}</div>
                        <div className="text-xs text-luxury-gray font-mono">{apiKey.key}</div>
                        <div className="text-xs text-luxury-gray mt-1">Created: {apiKey.created}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-luxury-gray hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Third-Party Integrations</h3>
                <div className="space-y-4">
                  {[
                    { name: "Spotify API", status: "connected", icon: "🎵" },
                    { name: "YouTube Data API", status: "connected", icon: "▶️" },
                    { name: "SendGrid", status: "not_connected", icon: "📧" },
                    { name: "Twilio", status: "not_connected", icon: "📱" },
                  ].map((integration, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-luxury-lighter/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{integration.icon}</span>
                        <div>
                          <div className="text-white font-medium">{integration.name}</div>
                          <div className="text-xs text-luxury-gray capitalize">{integration.status.replace("_", " ")}</div>
                        </div>
                      </div>
                      {integration.status === "connected" ? (
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <Check className="w-3 h-3" />
                          Connected
                        </span>
                      ) : (
                        <GoldButton variant="outline" size="sm">
                          Connect
                        </GoldButton>
                      )}
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Email Settings */}
          {activeSection === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">SMTP Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">SMTP Host</Label>
                    <Input
                      defaultValue="smtp.sendgrid.net"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">SMTP Port</Label>
                    <Input
                      defaultValue="587"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Username</Label>
                    <Input
                      defaultValue="apikey"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                </div>
                <GoldButton variant="outline" size="sm" className="mt-4">
                  Send Test Email
                </GoldButton>
              </GlowCard>

              <GlowCard variant="default" className="p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: "New User Registration", enabled: true },
                    { label: "New Submission", enabled: true },
                    { label: "Payment Received", enabled: true },
                    { label: "Campaign Started", enabled: true },
                    { label: "Campaign Completed", enabled: true },
                    { label: "Refund Processed", enabled: false },
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                      <p className="text-white">{notification.label}</p>
                      <Switch defaultChecked={notification.enabled} />
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Default content for other sections */}
          {!["general", "payments", "api", "email"].includes(activeSection) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{settingSections.find(s => s.id === activeSection)?.label} Settings</h3>
              <p className="text-luxury-gray">Configure your {activeSection} preferences here.</p>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
