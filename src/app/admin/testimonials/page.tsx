"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Star,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { AdminLayout, StatCard } from "@/components/admin/AdminLayout";
import { GoldButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonialsData {
  testimonials: Testimonial[];
  stats: Array<{
    title: string;
    value: string;
    icon: string;
    color: string;
  }>;
}

const iconMap: Record<string, any> = {
  MessageCircle,
  Star,
  Eye,
  EyeOff,
};

const StarRating = ({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          disabled={!onRate}
          className={cn("transition-colors", {
            "cursor-pointer": onRate,
            "cursor-default": !onRate,
          })}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? "fill-gold text-gold" : "text-luxury-gray"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function AdminTestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TestimonialsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterVisible, setFilterVisible] = useState<"all" | "visible" | "hidden">("all");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
    content: "",
    rating: 5,
    isVisible: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, [searchQuery]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/admin/testimonials?search=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Testimonials error:", err);
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.content) {
      setError("Name and content are required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedTestimonial && !isCreating) {
        // Update
        const response = await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedTestimonial.id, ...formData }),
        });

        if (!response.ok) {
          throw new Error("Failed to update testimonial");
        }
      } else {
        // Create
        const response = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create testimonial");
        }
      }

      setIsCreating(false);
      setSelectedTestimonial(null);
      setFormData({ name: "", role: "", avatar: "", content: "", rating: 5, isVisible: true });
      await fetchTestimonials();
    } catch (err) {
      console.error("Error saving testimonial:", err);
      setError("Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      setSelectedTestimonial(null);
      await fetchTestimonials();
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Failed to delete testimonial");
    }
  };

  const handleToggleVisibility = async (testimonial: Testimonial) => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: testimonial.id,
          isVisible: !testimonial.isVisible,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      await fetchTestimonials();
    } catch (err) {
      console.error("Error updating visibility:", err);
      setError("Failed to update testimonial");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Testimonials" subtitle="Manage customer testimonials and reviews">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  if (error && !data) {
    return (
      <AdminLayout title="Testimonials" subtitle="Manage customer testimonials and reviews">
        <div className="text-center text-red-400">Error: {error}</div>
      </AdminLayout>
    );
  }

  const filteredTestimonials = (data?.testimonials || []).filter((t) => {
    if (filterVisible === "visible") return t.isVisible;
    if (filterVisible === "hidden") return !t.isVisible;
    return true;
  });

  return (
    <AdminLayout
      title="Testimonials"
      subtitle="Manage customer testimonials and reviews"
      actions={
        <GoldButton size="sm" onClick={() => {
          setIsCreating(true);
          setSelectedTestimonial(null);
          setFormData({ name: "", role: "", avatar: "", content: "", rating: 5, isVisible: true });
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </GoldButton>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data?.stats.map((stat, index) => {
          const Icon = iconMap[stat.icon] || MessageCircle;
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

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
          <Input
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-luxury-dark border-gold/20 focus:border-gold h-10 pl-10 text-white placeholder:text-luxury-gray"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "visible", "hidden"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterVisible(filter)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                filterVisible === filter
                  ? "bg-gold text-luxury-black"
                  : "bg-luxury-lighter text-luxury-gray hover:text-white"
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-luxury-dark border border-gold/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-brand-orange flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white truncate">{testimonial.name}</h4>
                      {!testimonial.isVisible && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    {testimonial.role && (
                      <p className="text-xs text-luxury-gray truncate">{testimonial.role}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleVisibility(testimonial)}
                  className="p-1.5 text-luxury-gray hover:text-gold transition-colors"
                >
                  {testimonial.isVisible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mb-3">
                <StarRating rating={testimonial.rating} />
              </div>

              <p className="text-sm text-luxury-gray mb-4 line-clamp-3">{testimonial.content}</p>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTestimonial(testimonial);
                    setIsCreating(false);
                    setFormData({
                      name: testimonial.name,
                      role: testimonial.role || "",
                      avatar: testimonial.avatar || "",
                      content: testimonial.content,
                      rating: testimonial.rating,
                      isVisible: testimonial.isVisible,
                    });
                  }}
                  className="text-gold hover:text-brand-orange"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center text-luxury-gray py-12">
            No testimonials found
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {(isCreating || selectedTestimonial) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsCreating(false);
              setSelectedTestimonial(null);
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
                  {isCreating ? "Add Testimonial" : "Edit Testimonial"}
                </h3>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedTestimonial(null);
                  }}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Name</Label>
                    <Input
                      placeholder="Customer name..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Role/Title</Label>
                    <Input
                      placeholder="e.g., Artist, Producer..."
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Avatar URL</Label>
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Testimonial Content</Label>
                  <textarea
                    placeholder="What did the customer say?"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full h-32 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Rating</Label>
                  <StarRating
                    rating={formData.rating}
                    onRate={(rating) => setFormData({ ...formData, rating })}
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-luxury-lighter/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded border-gold/20"
                  />
                  <Label htmlFor="visible" className="text-white cursor-pointer">
                    Visible on website
                  </Label>
                </div>

                {error && <div className="text-red-400 text-sm">{error}</div>}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gold/10 sticky bottom-0 bg-luxury-dark">
                <GoldButton
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedTestimonial(null);
                  }}
                >
                  Cancel
                </GoldButton>
                <GoldButton disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? "Saving..." : "Save Testimonial"}
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
