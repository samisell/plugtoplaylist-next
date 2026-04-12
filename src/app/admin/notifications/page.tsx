"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { AdminLayout, StatCard } from "@/components/admin/AdminLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  audience: string;
  status: string;
  sentAt?: string;
  scheduledFor?: string;
  opens: number;
  clicks: number;
}

interface Template {
  id: string;
  name: string;
  type: string;
  uses: number;
}

interface NotificationsData {
  notifications: Notification[];
  templates: Template[];
  stats: Array<{
    title: string;
    value: string;
    icon: string;
    color: string;
  }>;
}

const iconMap: Record<string, any> = {
  Send,
  Eye,
  Clock,
  Mail,
};

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "templates">("notifications");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<NotificationsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ subject: "", message: "", type: "announcement", audience: "all" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/notifications");

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Notifications error:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (formData: {
    subject: string;
    message: string;
    type: string;
    audience: string;
  }) => {
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.subject,
          message: formData.message,
          type: formData.type,
          audience: formData.audience,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      setIsCreating(false);
      await fetchNotifications(); // Refresh the list
    } catch (err) {
      console.error("Error creating notification:", err);
      setError("Failed to create notification");
    }
  };

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

  if (loading) {
    return (
      <AdminLayout title="Notifications" subtitle="Manage email notifications and templates">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout title="Notifications" subtitle="Manage email notifications and templates">
        <div className="text-center text-red-400">Error: {error || "No data available"}</div>
      </AdminLayout>
    );
  }

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
        {data.stats.map((stat, index) => {
          const Icon = iconMap[stat.icon] || Bell;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatCard {...stat} icon={Icon} color={stat.color as "gold" | "green" | "orange" | "blue"} />
            </motion.div>
          );
        })}
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
          {data.notifications.length > 0 ? (
            data.notifications.map((notification, index) => (
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
            ))
          ) : (
            <div className="text-center text-luxury-gray py-8">No notifications yet</div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {data.templates.length > 0 ? (
            <>
              {data.templates.map((template, index) => (
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
            </>
          ) : (
            <div className="col-span-3 text-center text-luxury-gray py-8">No templates yet</div>
          )}
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
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Message</Label>
                      <textarea
                        placeholder="Notification message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full h-32 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Type</Label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full h-10 bg-luxury-lighter border border-gold/20 rounded-lg px-3 text-white focus:border-gold focus:outline-none"
                        >
                          <option value="announcement">Announcement</option>
                          <option value="transactional">Transactional</option>
                          <option value="promotional">Promotional</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Audience</Label>
                        <select
                          value={formData.audience}
                          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                          className="w-full h-10 bg-luxury-lighter border border-gold/20 rounded-lg px-3 text-white focus:border-gold focus:outline-none"
                        >
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
                    setFormData({ subject: "", message: "", type: "announcement", audience: "all" });
                  }}
                >
                  Cancel
                </GoldButton>
                <GoldButton
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (isCreating) {
                      setIsSubmitting(true);
                      await handleCreateNotification(formData);
                      setFormData({ subject: "", message: "", type: "announcement", audience: "all" });
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "Sending..." : isCreating ? "Send Notification" : "Save Changes"}
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
