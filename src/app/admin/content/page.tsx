"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Tag,
  Ticket,
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Loader2,
  Copy,
  Eye,
  Code,
} from "lucide-react";
import { AdminLayout, StatCard } from "@/components/admin/AdminLayout";
import { GoldButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContentData {
  emailTemplates: EmailTemplate[];
  coupons: Coupon[];
  stats: Array<{
    title: string;
    value: string;
    icon: string;
    color: string;
  }>;
}

const iconMap: Record<string, any> = {
  Mail,
  Tag,
  Ticket,
  FileText,
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "coupons">("templates");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EmailTemplate | Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    htmlBody: "",
    textBody: "",
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: 0,
    maxUses: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchContent();
  }, [searchQuery]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/content?search=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Content error:", err);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.htmlBody) {
      setError("Name, subject, and HTML body are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const method = selectedItem && "subject" in selectedItem ? "PUT" : "POST";
      const body = {
        type: "template",
        ...templateForm,
        ...(selectedItem && "subject" in selectedItem && { id: selectedItem.id }),
      };

      const response = await fetch("/api/admin/content", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      setIsCreating(false);
      setSelectedItem(null);
      setTemplateForm({ name: "", subject: "", htmlBody: "", textBody: "" });
      await fetchContent();
    } catch (err) {
      console.error("Error saving template:", err);
      setError("Failed to save template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCoupon = async () => {
    if (!couponForm.code || couponForm.discount === undefined || couponForm.discount <= 0) {
      setError("Code and discount (greater than 0) are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const method = selectedItem && "code" in selectedItem ? "PUT" : "POST";
      const body = {
        type: "coupon",
        code: couponForm.code,
        discount: parseFloat(couponForm.discount.toString()),
        maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses) : null,
        expiresAt: couponForm.expiresAt || null,
        ...(selectedItem && "code" in selectedItem && { id: selectedItem.id }),
      };

      const response = await fetch("/api/admin/content", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save coupon");
      }

      setIsCreating(false);
      setSelectedItem(null);
      setCouponForm({ code: "", discount: 0, maxUses: "", expiresAt: "" });
      await fetchContent();
    } catch (err) {
      console.error("Error saving coupon:", err);
      setError("Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/content?id=${id}&type=${type}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setSelectedItem(null);
      await fetchContent();
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Content Management" subtitle="Manage email templates and promotional content">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  if (error && !data) {
    return (
      <AdminLayout title="Content Management" subtitle="Manage email templates and promotional content">
        <div className="text-center text-red-400">Error: {error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Content Management"
      subtitle="Manage email templates and promotional content"
      actions={
        <GoldButton
          size="sm"
          onClick={() => {
            setIsCreating(true);
            setSelectedItem(null);
            if (activeTab === "templates") {
              setTemplateForm({ name: "", subject: "", htmlBody: "", textBody: "" });
            } else {
              setCouponForm({ code: "", discount: 0, maxUses: "", expiresAt: "" });
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === "templates" ? "Template" : "Coupon"}
        </GoldButton>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data?.stats.map((stat, index) => {
          const Icon = iconMap[stat.icon] || FileText;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatCard {...stat} icon={Icon} color={stat.color as "gold" | "green" | "blue" | "orange"} />
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {["templates", "coupons"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "templates" | "coupons")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              activeTab === tab
                ? "bg-gold text-luxury-black"
                : "bg-luxury-lighter text-luxury-gray hover:text-white"
            )}
          >
            {tab === "templates" ? <Mail className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-luxury-dark border-gold/20 focus:border-gold h-10 pl-10 text-white placeholder:text-luxury-gray"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === "templates" ? (
        <div className="space-y-4">
          {data?.emailTemplates && data.emailTemplates.length > 0 ? (
            data.emailTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-luxury-dark border border-gold/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                    <p className="text-sm text-luxury-gray mb-2 truncate">Subject: {template.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-luxury-gray">
                      <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(template);
                        setIsCreating(false);
                        setTemplateForm({
                          name: template.name,
                          subject: template.subject,
                          htmlBody: template.htmlBody,
                          textBody: template.textBody,
                        });
                      }}
                      className="text-gold hover:text-brand-orange"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id, "template")}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-luxury-gray py-12">No templates found</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.coupons && data.coupons.length > 0 ? (
            data.coupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-luxury-dark border border-gold/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{coupon.code}</h4>
                      {!coupon.isActive && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gold font-medium">{coupon.discount}% off</p>
                  </div>
                  <Ticket className="w-6 h-6 text-gold/50" />
                </div>

                <div className="space-y-2 mb-4 text-sm text-luxury-gray">
                  {coupon.maxUses && (
                    <div>Used {coupon.usedCount} of {coupon.maxUses} times</div>
                  )}
                  {coupon.expiresAt && (
                    <div>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</div>
                  )}
                  <div>Created: {new Date(coupon.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(coupon);
                      setIsCreating(false);
                      setCouponForm({
                        code: coupon.code,
                        discount: coupon.discount,
                        maxUses: coupon.maxUses?.toString() || "",
                        expiresAt: coupon.expiresAt?.split("T")[0] || "",
                      });
                    }}
                    className="text-gold hover:text-brand-orange"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                    }}
                    className="text-luxury-gray hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(coupon.id, "coupon")}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center text-luxury-gray py-12">No coupons found</div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsCreating(false);
              setSelectedItem(null);
            }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-luxury-dark border border-gold/20 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gold/10 sticky top-0 bg-luxury-dark z-10">
                <h3 className="text-lg font-semibold text-white">
                  {selectedItem
                    ? `Edit ${activeTab === "templates" ? "Template" : "Coupon"}`
                    : `Create ${activeTab === "templates" ? "Template" : "Coupon"}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedItem(null);
                  }}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {activeTab === "templates" ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white">Template Name</Label>
                      <Input
                        placeholder="e.g., Welcome Email, Payment Confirmation..."
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Email Subject</Label>
                      <Input
                        placeholder="e.g., Welcome to PlugToPlaylist!"
                        value={templateForm.subject}
                        onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-white">HTML Body</Label>
                        <Code className="w-4 h-4 text-gold" />
                      </div>
                      <textarea
                        placeholder="<html>...</html>"
                        value={templateForm.htmlBody}
                        onChange={(e) => setTemplateForm({ ...templateForm, htmlBody: e.target.value })}
                        className="w-full h-40 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white font-mono text-sm placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Text Body (Optional)</Label>
                      <textarea
                        placeholder="Plain text version..."
                        value={templateForm.textBody}
                        onChange={(e) => setTemplateForm({ ...templateForm, textBody: e.target.value })}
                        className="w-full h-32 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white">Coupon Code</Label>
                      <Input
                        placeholder="e.g., SAVE20, WELCOME10..."
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Discount (%)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 20"
                          min="1"
                          max="100"
                          value={couponForm.discount}
                          onChange={(e) => setCouponForm({ ...couponForm, discount: parseFloat(e.target.value) || 0 })}
                          className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Max Uses (Optional)</Label>
                        <Input
                          type="number"
                          placeholder="Leave blank for unlimited"
                          value={couponForm.maxUses}
                          onChange={(e) => setCouponForm({ ...couponForm, maxUses: e.target.value })}
                          className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Expiration Date (Optional)</Label>
                      <Input
                        type="date"
                        value={couponForm.expiresAt}
                        onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                      />
                    </div>
                  </>
                )}

                {error && <div className="text-red-400 text-sm">{error}</div>}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gold/10 sticky bottom-0 bg-luxury-dark">
                <GoldButton
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedItem(null);
                  }}
                >
                  Cancel
                </GoldButton>
                <GoldButton
                  disabled={isSubmitting}
                  onClick={() => {
                    activeTab === "templates"
                      ? handleSubmitTemplate()
                      : handleSubmitCoupon();
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
