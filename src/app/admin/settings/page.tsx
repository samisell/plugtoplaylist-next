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

interface Settings {
  // General Settings
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;

  // Feature Flags
  guestSubmissionsEnabled: boolean;
  referralSystemEnabled: boolean;
  couponCodesEnabled: boolean;
  aiPlanSuggestionEnabled: boolean;

  // Payment Settings
  testModeEnabled: boolean;
  autoRefundFailedCampaigns: boolean;
  paystackConnected: boolean;
  flutterwaveConnected: boolean;
  paystackPublicKey: string;
  paystackSecretKey: string;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;

  // Email Settings
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  emailNotificationsEnabled: boolean;
  newUserRegistrationEmail: boolean;
  newSubmissionEmail: boolean;
  paymentReceivedEmail: boolean;
  campaignStartedEmail: boolean;
  campaignCompletedEmail: boolean;
  refundProcessedEmail: boolean;

  // Third-party Integrations
  spotifyApiConnected: boolean;
  youtubeApiConnected: boolean;
  sendgridConnected: boolean;
  twilioConnected: boolean;
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/settings");
      const data = await response.json();

      if (response.ok) {
        setSettings(data.settings);
      } else {
        setError(data.error || "Failed to load settings");
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        setSaveSuccess(true);
        await fetchSettings();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleField = (field: keyof Settings) => {
    setSettings(prev => prev ? { ...prev, [field]: !prev[field] } : null);
  };

  const updateField = (field: keyof Settings, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  const togglePasswordField = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || "Failed to load settings"}</p>
          <Button onClick={fetchSettings} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage platform configuration and preferences</p>
          </motion.div>

          {/* Success Message */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg flex items-center gap-2 text-green-400"
            >
              <Check className="w-5 h-5" />
              <span>Settings saved successfully!</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center gap-2 text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSaveForm}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden sticky top-8">
                  <div className="p-3 space-y-1">
                    {settingSections.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          activeSection === section.id
                            ? "bg-blue-600/20 text-blue-400 border border-blue-600/50"
                            : "text-gray-400 hover:text-white hover:bg-slate-700/50"
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
                    {/* Site Information */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Site Name</Label>
                          <Input
                            value={settings.siteName}
                            onChange={(e) => updateField("siteName", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Site URL</Label>
                          <Input
                            type="url"
                            value={settings.siteUrl}
                            onChange={(e) => updateField("siteUrl", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Support Email</Label>
                          <Input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => updateField("supportEmail", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Support Phone</Label>
                          <Input
                            value={settings.supportPhone}
                            onChange={(e) => updateField("supportPhone", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Mode */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Maintenance Mode</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Enable Maintenance Mode</p>
                          <p className="text-sm text-gray-400">Temporarily disable the site for maintenance</p>
                        </div>
                        <Switch
                          checked={settings.maintenanceMode}
                          onCheckedChange={() => toggleField("maintenanceMode")}
                        />
                      </div>
                    </div>

                    {/* Feature Flags */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Feature Flags</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <div>
                            <p className="text-white">Enable Guest Submissions</p>
                            <p className="text-sm text-gray-400">Allow submissions without account</p>
                          </div>
                          <Switch
                            checked={settings.guestSubmissionsEnabled}
                            onCheckedChange={() => toggleField("guestSubmissionsEnabled")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <div>
                            <p className="text-white">Enable Referral System</p>
                            <p className="text-sm text-gray-400">Allow users to earn referral bonuses</p>
                          </div>
                          <Switch
                            checked={settings.referralSystemEnabled}
                            onCheckedChange={() => toggleField("referralSystemEnabled")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <div>
                            <p className="text-white">Enable Coupon Codes</p>
                            <p className="text-sm text-gray-400">Allow discount codes at checkout</p>
                          </div>
                          <Switch
                            checked={settings.couponCodesEnabled}
                            onCheckedChange={() => toggleField("couponCodesEnabled")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-white">Enable AI Plan Suggestion</p>
                            <p className="text-sm text-gray-400">Use AI to recommend plans</p>
                          </div>
                          <Switch
                            checked={settings.aiPlanSuggestionEnabled}
                            onCheckedChange={() => toggleField("aiPlanSuggestionEnabled")}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Payment Settings */}
                {activeSection === "payments" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Paystack Configuration */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Paystack</h3>
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded",
                          settings.paystackConnected
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-700 text-gray-400"
                        )}>
                          {settings.paystackConnected ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Public Key</Label>
                          <Input
                            value={settings.paystackPublicKey}
                            onChange={(e) => updateField("paystackPublicKey", e.target.value)}
                            placeholder="Enter Paystack public key"
                            className="bg-slate-700 border-slate-600 text-white font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Secret Key</Label>
                          <div className="relative">
                            <Input
                              type={showPassword.paystack ? "text" : "password"}
                              value={settings.paystackSecretKey}
                              onChange={(e) => updateField("paystackSecretKey", e.target.value)}
                              placeholder="Enter Paystack secret key"
                              className="bg-slate-700 border-slate-600 text-white font-mono text-xs pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordField("paystack")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword.paystack ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flutterwave Configuration */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Flutterwave</h3>
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded",
                          settings.flutterwaveConnected
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-700 text-gray-400"
                        )}>
                          {settings.flutterwaveConnected ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Public Key</Label>
                          <Input
                            value={settings.flutterwavePublicKey}
                            onChange={(e) => updateField("flutterwavePublicKey", e.target.value)}
                            placeholder="Enter Flutterwave public key"
                            className="bg-slate-700 border-slate-600 text-white font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Secret Key</Label>
                          <div className="relative">
                            <Input
                              type={showPassword.flutterwave ? "text" : "password"}
                              value={settings.flutterwaveSecretKey}
                              onChange={(e) => updateField("flutterwaveSecretKey", e.target.value)}
                              placeholder="Enter Flutterwave secret key"
                              className="bg-slate-700 border-slate-600 text-white font-mono text-xs pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordField("flutterwave")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword.flutterwave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Payment Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <div>
                            <p className="text-white">Enable Test Mode</p>
                            <p className="text-sm text-gray-400">Use test payment credentials</p>
                          </div>
                          <Switch
                            checked={settings.testModeEnabled}
                            onCheckedChange={() => toggleField("testModeEnabled")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-white">Auto-Refund Failed Campaigns</p>
                            <p className="text-sm text-gray-400">Automatically refund if campaign doesn't start within 7 days</p>
                          </div>
                          <Switch
                            checked={settings.autoRefundFailedCampaigns}
                            onCheckedChange={() => toggleField("autoRefundFailedCampaigns")}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Email Settings */}
                {activeSection === "email" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* SMTP Configuration */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">SMTP Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">SMTP Host</Label>
                          <Input
                            value={settings.smtpHost}
                            onChange={(e) => updateField("smtpHost", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">SMTP Port</Label>
                          <Input
                            type="number"
                            value={settings.smtpPort}
                            onChange={(e) => updateField("smtpPort", parseInt(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Username</Label>
                          <Input
                            value={settings.smtpUsername}
                            onChange={(e) => updateField("smtpUsername", e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Password</Label>
                          <div className="relative">
                            <Input
                              type={showPassword.smtp ? "text" : "password"}
                              value={settings.smtpPassword}
                              onChange={(e) => updateField("smtpPassword", e.target.value)}
                              placeholder="••••••••••••"
                              className="bg-slate-700 border-slate-600 text-white pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordField("smtp")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword.smtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email Notifications */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <div>
                            <p className="text-white">Enable Email Notifications</p>
                            <p className="text-sm text-gray-400">Enable all email notifications</p>
                          </div>
                          <Switch
                            checked={settings.emailNotificationsEnabled}
                            onCheckedChange={() => toggleField("emailNotificationsEnabled")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <p className="text-white">New User Registration</p>
                          <Switch
                            checked={settings.newUserRegistrationEmail}
                            onCheckedChange={() => toggleField("newUserRegistrationEmail")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <p className="text-white">New Submission</p>
                          <Switch
                            checked={settings.newSubmissionEmail}
                            onCheckedChange={() => toggleField("newSubmissionEmail")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <p className="text-white">Payment Received</p>
                          <Switch
                            checked={settings.paymentReceivedEmail}
                            onCheckedChange={() => toggleField("paymentReceivedEmail")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <p className="text-white">Campaign Started</p>
                          <Switch
                            checked={settings.campaignStartedEmail}
                            onCheckedChange={() => toggleField("campaignStartedEmail")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                          <p className="text-white">Campaign Completed</p>
                          <Switch
                            checked={settings.campaignCompletedEmail}
                            onCheckedChange={() => toggleField("campaignCompletedEmail")}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <p className="text-white">Refund Processed</p>
                          <Switch
                            checked={settings.refundProcessedEmail}
                            onCheckedChange={() => toggleField("refundProcessedEmail")}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* API Keys */}
                {activeSection === "api" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Third-Party Integrations</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: "Spotify API", key: "spotifyApiConnected", icon: "🎵" },
                          { label: "YouTube Data API", key: "youtubeApiConnected", icon: "▶️" },
                          { label: "SendGrid", key: "sendgridConnected", icon: "📧" },
                          { label: "Twilio", key: "twilioConnected", icon: "📱" },
                        ].map((integration) => (
                          <div
                            key={integration.key}
                            className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{integration.icon}</span>
                              <div>
                                <div className="text-white font-medium">{integration.label}</div>
                                <div className="text-xs text-gray-400">
                                  {settings[integration.key as keyof Settings] ? "Connected" : "Not Connected"}
                                </div>
                              </div>
                            </div>
                            <Switch
                              checked={settings[integration.key as keyof Settings] as boolean}
                              onCheckedChange={() => toggleField(integration.key as keyof Settings)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications - Placeholder */}
                {activeSection === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg"
                  >
                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Notification Settings</h3>
                    <p className="text-gray-400">Configure notification preferences here.</p>
                  </motion.div>
                )}

                {/* Security - Placeholder */}
                {activeSection === "security" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg"
                  >
                    <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Security Settings</h3>
                    <p className="text-gray-400">Configure your security preferences here.</p>
                  </motion.div>
                )}

                {/* Database - Placeholder */}
                {activeSection === "database" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg"
                  >
                    <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Database Settings</h3>
                    <p className="text-gray-400">Configure database preferences here.</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-4 mt-8"
            >
              <Button
                type="button"
                onClick={fetchSettings}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-white"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
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
