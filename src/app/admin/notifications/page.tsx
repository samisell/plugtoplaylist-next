"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Send,
  Users,
  Mail,
  Check,
  X,
  Clock,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import { AdminLayout, StatCard } from "@/components/admin/AdminLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Sent", value: "12,847", icon: Send, color: "gold" as const },
  { title: "Open Rate", value: "68.2%", icon: Eye, color: "green" as const },
  { title: "Pending", value: "3", icon: Clock, color: "orange" as const },
  { title: "Templates", value: "8", icon: Mail, color: "blue" as const },
];

const mockNotifications = [
  {
    id: "notif_1",
    title: "New Feature: Instagram Promotion Now Available!",
    message: "We've added Instagram promotion to all Premium and Professional plans. Users can now reach audiences on Instagram...",
    type: "announcement",
    audience: "all",
    status: "sent",
    sentAt: "2024-01-21 09:00:00",
    opens: 1842,
    clicks: 456,
  },
  {
    id: "notif_2",
    title: "Campaign Started: Your track is now live!",
    message: "Your campaign for 'Blinding Lights' has been approved and is now active...",
    type: "transactional",
    audience: "user",
    status: "sent",
    sentAt: "2024-01-20 14:30:00",
    opens: 1,
    clicks: 0,
  },
  {
    id: "notif_3",
    title: "Holiday Special: 20% Off All Plans",
    message: "Celebrate the holidays with 20% off any promotion plan. Use code HOLIDAY20...",
    type: "promotional",
    audience: "premium",
    status: "scheduled",
    scheduledFor: "2024-12-25 00:00:00",
    opens: 0,
    clicks: 0,
  },
  {
    id: "notif_4",
    title: "Payment Successful",
    message: "Your payment of $149 for the Premium plan has been processed successfully...",
    type: "transactional",
    audience: "user",
    status: "sent",
    sentAt: "2024-01-19 16:45:00",
    opens: 1,
    clicks: 0,
  },
  {
    id: "notif_5",
    title: "Campaign Completed",
    message: "Your 4-week campaign for 'Shape of You' has been completed. Check your results...",
    type: "transactional",
    audience: "user",
    status: "sent",
    sentAt: "2024-01-18 10:00:00",
    opens: 1,
    clicks: 1,
  },
];

const templates = [
  { id: "tmpl_1", name: "Welcome Email", type: "transactional", uses: 847 },
  { id: "tmpl_2", name: "Payment Confirmation", type: "transactional", uses: 1247 },
  { id: "tmpl_3", name: "Campaign Started", type: "transactional", uses: 892 },
  { id: "tmpl_4", name: "Campaign Completed", type: "transactional", uses: 654 },
  { id: "tmpl_5", name: "Weekly Newsletter", type: "promotional", uses: 12 },
  { id: "tmpl_6", name: "Promo Offer", type: "promotional", uses: 8 },
];

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "templates">("notifications");
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      announcement: "bg-blue-500/20 text-blue-400",
      transactional: "bg-green-500/20 text-green-400",
      promotional: "bg-brand-orange/20 text-brand-orange",
    };
    return (
      <span className={cn("px-2 py-0.5 text-xs font-medium rounded", styles[type] || styles.transactional)}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      sent: "bg-green-500/20 text-green-400",
      scheduled: "bg-brand-orange/20 text-brand-orange",
      draft: "bg-luxury-lighter text-luxury-gray",
    };
    return (
      <span className={cn("px-2 py-0.5 text-xs font-medium rounded", styles[status] || styles.draft)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Manage email notifications and templates"
      actions={
        <GoldButton size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </GoldButton>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "notifications"
              ? "bg-gold text-luxury-black"
              : "bg-luxury-lighter text-luxury-gray hover:text-white"
          )}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "templates"
              ? "bg-gold text-luxury-black"
              : "bg-luxury-lighter text-luxury-gray hover:text-white"
          )}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Templates
        </button>
      </div>

      {/* Content */}
      {activeTab === "notifications" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {mockNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedNotification(notification)}
              className="bg-luxury-dark border border-gold/10 rounded-xl p-4 hover:border-gold/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeBadge(notification.type)}
                    {getStatusBadge(notification.status)}
                  </div>
                  <h4 className="font-medium text-white mb-1 truncate">{notification.title}</h4>
                  <p className="text-sm text-luxury-gray truncate">{notification.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-luxury-gray">
                    <span>To: {notification.audience}</span>
                    <span>•</span>
                    <span>
                      {notification.status === "scheduled"
                        ? `Scheduled: ${notification.scheduledFor}`
                        : `Sent: ${notification.sentAt}`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">{notification.opens}</div>
                  <div className="text-xs text-luxury-gray">opens</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-luxury-dark border border-gold/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{template.name}</h4>
                  <p className="text-xs text-luxury-gray capitalize">{template.type}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-luxury-gray hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-luxury-gray">Used {template.uses} times</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-gold hover:text-brand-orange">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-luxury-gray hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Template */}
          <button className="h-full min-h-[100px] border-2 border-dashed border-gold/20 rounded-xl flex flex-col items-center justify-center gap-2 text-luxury-gray hover:border-gold/50 hover:text-gold transition-all">
            <Plus className="w-6 h-6" />
            <span className="text-sm">Create Template</span>
          </button>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreating || selectedNotification) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsCreating(false);
              setSelectedNotification(null);
            }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-luxury-dark border border-gold/20 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gold/10 sticky top-0 bg-luxury-dark z-10">
                <h3 className="text-lg font-semibold text-white">
                  {isCreating ? "Create Notification" : "Notification Details"}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedNotification(null);
                  }}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {isCreating ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white">Subject</Label>
                      <Input
                        placeholder="Notification subject..."
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Message</Label>
                      <textarea
                        placeholder="Notification message..."
                        className="w-full h-32 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Type</Label>
                        <select className="w-full h-10 bg-luxury-lighter border border-gold/20 rounded-lg px-3 text-white focus:border-gold focus:outline-none">
                          <option value="announcement">Announcement</option>
                          <option value="transactional">Transactional</option>
                          <option value="promotional">Promotional</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Audience</Label>
                        <select className="w-full h-10 bg-luxury-lighter border border-gold/20 rounded-lg px-3 text-white focus:border-gold focus:outline-none">
                          <option value="all">All Users</option>
                          <option value="premium">Premium Users</option>
                          <option value="user">Specific User</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : selectedNotification ? (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      {getTypeBadge(selectedNotification.type)}
                      {getStatusBadge(selectedNotification.status)}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{selectedNotification.title}</h4>
                    <p className="text-luxury-gray">{selectedNotification.message}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-luxury-lighter/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-white">{selectedNotification.opens}</div>
                        <div className="text-xs text-luxury-gray">Opens</div>
                      </div>
                      <div className="bg-luxury-lighter/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gold">{selectedNotification.clicks}</div>
                        <div className="text-xs text-luxury-gray">Clicks</div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gold/10 sticky bottom-0 bg-luxury-dark">
                <GoldButton
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedNotification(null);
                  }}
                >
                  Cancel
                </GoldButton>
                <GoldButton>
                  {isCreating ? "Send Notification" : "Save Changes"}
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
