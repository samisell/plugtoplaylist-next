"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Mail,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Music,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Gift,
  Sparkles,
  Loader2,
  User,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  important: boolean;
  icon: any;
  actionLabel?: string;
  actionHref?: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24)  return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("all");
  const [showSettings, setShowSettings]   = useState(false);
  const [userProfile, setUserProfile]     = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        // Get user
        let userId: string | null = null;
        let user: any = null;
        const stored = localStorage.getItem("user");
        if (stored) {
          user = JSON.parse(stored);
          userId = user?.id;
        }
        if (!userId) {
          const sr = await fetch("/api/auth/session");
          if (sr.ok) { const { user: u } = await sr.json(); user = u; userId = u?.id; }
        }
        if (!userId) { setLoading(false); return; }
        setUserProfile(user);

        // Fetch submissions + payments in parallel
        const [subRes, payRes] = await Promise.all([
          fetch(`/api/submissions?userId=${userId}`),
          fetch(`/api/payments?userId=${userId}`),
        ]);
        const { submissions = [] } = subRes.ok   ? await subRes.json() : {};
        const { payments   = [] } = payRes.ok    ? await payRes.json() : {};

        // Build notification list from real events
        const notifs: Notification[] = [];

        // One notification per submission
        submissions.forEach((sub: any) => {
          const date = sub.created_at || new Date().toISOString();
          notifs.push({
            id:        `sub-${sub.id}`,
            type:      "campaign",
            title:     sub.status === "active"    ? "Campaign Is Live! 🚀"
                     : sub.status === "completed" ? "Campaign Completed ✅"
                     : "Submission Received",
            message:   sub.status === "active"
                         ? `Your campaign for "${sub.track_title || "your track"}" is now live and running.`
                         : sub.status === "completed"
                         ? `Your campaign for "${sub.track_title || "your track"}" has ended. View your results!`
                         : `We've received your submission for "${sub.track_title || "your track"}". Our team will review it within 24 hours.`,
            time:      timeAgo(date),
            read:      sub.status !== "pending",
            important: sub.status === "active",
            icon:      Music,
            actionLabel: "View Submissions",
            actionHref:  "/dashboard/submissions",
          });
        });

        // One notification per payment
        payments.forEach((pay: any) => {
          const date = pay.created_at || new Date().toISOString();
          notifs.push({
            id:        `pay-${pay.id}`,
            type:      "payment",
            title:     pay.status === "completed" || pay.status === "paid"
                         ? "Payment Successful ✅"
                         : "Payment Pending",
            message:   `Your payment of £${Number(pay.amount).toFixed(2)} has been ${pay.status === "completed" || pay.status === "paid" ? "processed successfully" : "received and is being processed"}.`,
            time:      timeAgo(date),
            read:      pay.status === "completed" || pay.status === "paid",
            important: false,
            icon:      DollarSign,
            actionLabel: "View Billing",
            actionHref:  "/dashboard/settings",
          });
        });

        // Welcome notification always shown (account created)
        notifs.push({
          id:        "welcome",
          type:      "system",
          title:     "Welcome to PlugToPlaylist! 🎵",
          message:   "Your account is set up and ready. Submit your first track to start growing your audience.",
          time:      "when you joined",
          read:      true,
          important: false,
          icon:      User,
          actionLabel: "Submit a Track",
          actionHref:  "/dashboard/submit",
        });

        // Sort: unread first, then by date
        notifs.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
        setNotifications(notifs);
      } catch (e) {
        console.error("Notifications error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered    = notifications.filter(n => filter === "all" || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead   = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()          => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const remove     = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const typeColors: Record<string, string> = {
    campaign: "bg-blue-500/20 text-blue-400",
    payment:  "bg-green-500/20 text-green-400",
    system:   "bg-luxury-lighter text-luxury-gray",
    referral: "bg-brand-orange/20 text-brand-orange",
  };

  const stats = [
    { title: "Total",    value: notifications.length.toString(), icon: Bell,        color: "gold"   as const },
    { title: "Unread",   value: unreadCount.toString(),          icon: Mail,        color: "orange" as const },
    { title: "Payments", value: notifications.filter(n=>n.type==="payment").length.toString(),  icon: DollarSign,  color: "green"  as const },
    { title: "Campaigns",value: notifications.filter(n=>n.type==="campaign").length.toString(), icon: Music,       color: "blue"   as const },
  ];

  if (loading) {
    return (
      <UserLayout title="Notifications" subtitle="Loading…" user={userProfile}>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
      user={userProfile}
      actions={
        <div className="flex items-center gap-2">
          <GoldButton variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </GoldButton>
          <Button variant="ghost" size="sm" className="text-luxury-gray hover:text-white" onClick={() => setShowSettings(s => !s)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <UserStatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden">
            <GlowCard variant="default" className="p-5">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold" />
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Campaign Updates",  description: "Status changes on your campaigns", defaultChecked: true },
                  { label: "Payment Alerts",    description: "Confirmations and receipts",        defaultChecked: true },
                  { label: "Milestone Alerts",  description: "Stream milestones reached",         defaultChecked: true },
                  { label: "Referral Bonuses",  description: "When you earn referral rewards",    defaultChecked: true },
                  { label: "Marketing Emails",  description: "Promotions and special offers",     defaultChecked: false },
                  { label: "System Messages",   description: "Account and platform updates",      defaultChecked: true },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-luxury-lighter/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white">{s.label}</div>
                      <div className="text-xs text-luxury-gray">{s.description}</div>
                    </div>
                    <Switch defaultChecked={s.defaultChecked} />
                  </div>
                ))}
              </div>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { label: "All",      value: "all" },
          { label: "Campaign", value: "campaign" },
          { label: "Payment",  value: "payment" },
          { label: "System",   value: "system" },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filter === f.value ? "bg-gold text-luxury-black" : "bg-luxury-lighter text-luxury-gray hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
            <p className="text-luxury-gray">You&apos;re all caught up!</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "group relative bg-luxury-dark border rounded-xl p-4 transition-all cursor-pointer hover:border-gold/30",
                n.read ? "border-gold/10" : "border-gold/30 bg-gold/5"
              )}
              onClick={() => markRead(n.id)}
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", typeColors[n.type] || typeColors.system)}>
                  <n.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn("font-medium text-sm", n.read ? "text-white" : "text-gold")}>{n.title}</h4>
                    {n.important && (
                      <span className="px-1.5 py-0.5 text-xs bg-brand-orange/20 text-brand-orange rounded">Important</span>
                    )}
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-luxury-gray mb-2 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-luxury-gray">{n.time}</span>
                    {n.actionLabel && n.actionHref && (
                      <a
                        href={n.actionHref}
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-gold hover:text-brand-orange transition-colors"
                      >
                        {n.actionLabel} →
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10" onClick={e => { e.stopPropagation(); markRead(n.id); }}>
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={e => { e.stopPropagation(); remove(n.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </UserLayout>
  );
}
