"use client";

import { useState } from "react";
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
  Filter,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Notifications", value: "47", icon: Bell, color: "gold" as const },
  { title: "Unread", value: "5", icon: Mail, color: "orange" as const },
  { title: "This Week", value: "12", icon: Sparkles, color: "green" as const },
  { title: "Important", value: "3", icon: AlertCircle, color: "blue" as const },
];

const mockNotifications = [
  {
    id: "notif_1",
    type: "campaign",
    title: "Campaign Started Successfully!",
    message: "Your campaign for 'Blinding Lights' has been approved and is now live. You can track its progress in the analytics section.",
    time: "5 minutes ago",
    read: false,
    important: true,
    icon: Music,
    action: { label: "View Campaign", href: "/dashboard/submissions" },
  },
  {
    id: "notif_2",
    type: "payment",
    title: "Payment Successful",
    message: "Your payment of $149 for the Premium plan has been processed successfully. Thank you for your submission!",
    time: "2 hours ago",
    read: false,
    important: false,
    icon: DollarSign,
    action: { label: "View Receipt", href: "#" },
  },
  {
    id: "notif_3",
    type: "milestone",
    title: "🎉 50K Streams Milestone!",
    message: "Congratulations! Your track 'Levitating' has reached 50,000 streams. Keep promoting to reach even more listeners!",
    time: "1 day ago",
    read: true,
    important: true,
    icon: TrendingUp,
    action: { label: "View Analytics", href: "/dashboard/analytics" },
  },
  {
    id: "notif_4",
    type: "promotion",
    title: "New Playlist Placement!",
    message: "Your track 'Blinding Lights' has been added to 'Today's Top Hits' playlist with 35M followers. Expect a boost in streams!",
    time: "2 days ago",
    read: true,
    important: false,
    icon: Music,
    action: { label: "View Playlist", href: "#" },
  },
  {
    id: "notif_5",
    type: "referral",
    title: "Referral Bonus Earned!",
    message: "You've earned a $25 bonus! Your friend Maya just made their first submission using your referral code ALEX2024.",
    time: "3 days ago",
    read: true,
    important: false,
    icon: Gift,
    action: { label: "View Referrals", href: "#" },
  },
  {
    id: "notif_6",
    type: "system",
    title: "Profile Updated Successfully",
    message: "Your profile information has been updated. Make sure to keep your contact details current for important notifications.",
    time: "5 days ago",
    read: true,
    important: false,
    icon: Settings,
    action: null,
  },
  {
    id: "notif_7",
    type: "campaign",
    title: "Campaign Completed",
    message: "Your 4-week campaign for 'Shape of You' has ended. Check out your final results and consider a new submission!",
    time: "1 week ago",
    read: true,
    important: false,
    icon: Music,
    action: { label: "View Results", href: "/dashboard/submissions" },
  },
];

const typeFilters = [
  { label: "All", value: "all" },
  { label: "Campaign", value: "campaign" },
  { label: "Payment", value: "payment" },
  { label: "Milestones", value: "milestone" },
  { label: "Promotions", value: "promotion" },
];

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || n.type === filter
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      campaign: "bg-blue-500/20 text-blue-400",
      payment: "bg-green-500/20 text-green-400",
      milestone: "bg-gold/20 text-gold",
      promotion: "bg-purple-500/20 text-purple-400",
      referral: "bg-brand-orange/20 text-brand-orange",
      system: "bg-luxury-lighter text-luxury-gray",
    };
    return colors[type] || colors.system;
  };

  return (
    <UserLayout
      title="Notifications"
      subtitle={`${unreadCount} unread messages`}
      actions={
        <div className="flex items-center gap-2">
          <GoldButton variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </GoldButton>
          <Button
            variant="ghost"
            size="sm"
            className="text-luxury-gray hover:text-white"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <UserStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Notification Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6"
          >
            <GlowCard variant="default" className="p-5">
              <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold" />
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Campaign Updates", description: "Get notified about campaign progress", enabled: true },
                  { label: "Payment Alerts", description: "Payment confirmations and receipts", enabled: true },
                  { label: "Milestone Alerts", description: "Stream milestones and achievements", enabled: true },
                  { label: "Promotion News", description: "New playlist placements", enabled: true },
                  { label: "Referral Bonuses", description: "When you earn referral rewards", enabled: true },
                  { label: "Marketing Emails", description: "Promotions and special offers", enabled: false },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-luxury-lighter/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white">{setting.label}</div>
                      <div className="text-xs text-luxury-gray">{setting.description}</div>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {typeFilters.map((typeFilter) => (
          <button
            key={typeFilter.value}
            onClick={() => setFilter(typeFilter.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              filter === typeFilter.value
                ? "bg-gold text-luxury-black"
                : "bg-luxury-lighter text-luxury-gray hover:text-white"
            )}
          >
            {typeFilter.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
            <p className="text-luxury-gray">You&apos;re all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative bg-luxury-dark border rounded-xl p-4 transition-all cursor-pointer hover:border-gold/30",
                notification.read ? "border-gold/10" : "border-gold/30 bg-gold/5"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", getTypeColor(notification.type))}>
                  <notification.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn("font-medium", notification.read ? "text-white" : "text-gold")}>
                      {notification.title}
                    </h4>
                    {notification.important && (
                      <span className="px-1.5 py-0.5 text-xs bg-brand-orange/20 text-brand-orange rounded">
                        Important
                      </span>
                    )}
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    )}
                  </div>
                  <p className="text-sm text-luxury-gray mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-luxury-gray">{notification.time}</span>
                    {notification.action && (
                      <span className="text-xs text-gold hover:text-brand-orange">
                        {notification.action.label} →
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center mt-6">
          <GoldButton variant="outline" size="sm">
            Load More Notifications
          </GoldButton>
        </div>
      )}
    </UserLayout>
  );
}
