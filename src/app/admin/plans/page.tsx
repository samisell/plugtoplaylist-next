"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Copy,
  Star,
  Crown,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
} from "lucide-react";
import { AdminLayout, StatCard } from "@/components/admin/AdminLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Plans", value: "3", icon: Package, color: "gold" as const },
  { title: "Active Plans", value: "3", icon: Check, color: "green" as const },
  { title: "Most Popular", value: "Premium", icon: Star, color: "orange" as const },
  { title: "Avg. Plan Price", value: "$182", icon: Crown, color: "blue" as const },
];

const mockPlans = [
  {
    id: "plan_1",
    name: "Starter",
    description: "Perfect for emerging artists looking to get started",
    price: 49,
    duration: 14,
    features: [
      "5 Playlist Placements",
      "Basic Social Promotion",
      "2-Week Campaign Duration",
      "Email Support",
      "Basic Analytics",
    ],
    playlistPlacements: 5,
    socialPromotion: false,
    emailMarketing: false,
    priority: "normal",
    isActive: true,
    isPopular: false,
    subscribers: 847,
    revenue: 41503,
  },
  {
    id: "plan_2",
    name: "Premium",
    description: "Our most popular plan for serious artists",
    price: 149,
    duration: 28,
    features: [
      "15 Playlist Placements",
      "Full Social Promotion",
      "4-Week Campaign Duration",
      "Priority Support",
      "Advanced Analytics",
      "Email Marketing Blast",
      "Dedicated Manager",
    ],
    playlistPlacements: 15,
    socialPromotion: true,
    emailMarketing: true,
    priority: "high",
    isActive: true,
    isPopular: true,
    subscribers: 1423,
    revenue: 212027,
  },
  {
    id: "plan_3",
    name: "Professional",
    description: "For established artists seeking maximum exposure",
    price: 349,
    duration: 56,
    features: [
      "50+ Playlist Placements",
      "Full Social Media Campaign",
      "8-Week Campaign Duration",
      "24/7 Priority Support",
      "Premium Analytics Dashboard",
      "Full Email Marketing Campaign",
      "PR & Press Coverage",
      "Personal Account Manager",
    ],
    playlistPlacements: 50,
    socialPromotion: true,
    emailMarketing: true,
    priority: "premium",
    isActive: true,
    isPopular: false,
    subscribers: 342,
    revenue: 119358,
  },
];

export default function AdminPlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [editingPlan, setEditingPlan] = useState<typeof mockPlans[0] | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const duplicatePlan = (plan: typeof mockPlans[0]) => {
    const newPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      name: `${plan.name} (Copy)`,
      isPopular: false,
      subscribers: 0,
      revenue: 0,
    };
    setPlans([...plans, newPlan]);
  };

  return (
    <AdminLayout
      title="Plans"
      subtitle="Manage subscription plans and pricing"
      actions={
        <GoldButton size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlowCard
              variant={plan.isPopular ? "premium" : "default"}
              hover={false}
              className={cn(
                "relative overflow-hidden",
                !plan.isActive && "opacity-60"
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-0 right-4 px-3 py-1 bg-gold text-luxury-black text-xs font-semibold rounded-b-lg">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Most Popular
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {plan.name}
                      {!plan.isActive && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                          Inactive
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-luxury-gray mt-1">{plan.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-luxury-gray hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gold">${plan.price}</span>
                    <span className="text-luxury-gray text-sm">/campaign</span>
                  </div>
                  <div className="text-xs text-luxury-gray mt-1">{plan.duration} days duration</div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-luxury-gray uppercase tracking-wider mb-2">
                    Features
                  </h4>
                  <ul className="space-y-1.5">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-white">
                        <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-xs text-luxury-gray">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-luxury-black/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">{plan.subscribers}</div>
                    <div className="text-xs text-luxury-gray">Subscribers</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-gold">${plan.revenue.toLocaleString()}</div>
                    <div className="text-xs text-luxury-gray">Revenue</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <GoldButton
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingPlan(plan)}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </GoldButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-luxury-gray hover:text-white"
                    onClick={() => duplicatePlan(plan)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center">
                    <Switch
                      checked={plan.isActive}
                      onCheckedChange={() => togglePlanStatus(plan.id)}
                    />
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}

        {/* Add New Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: plans.length * 0.1 }}
        >
          <button
            onClick={() => setIsCreating(true)}
            className="w-full h-full min-h-[400px] border-2 border-dashed border-gold/20 rounded-xl flex flex-col items-center justify-center gap-4 text-luxury-gray hover:border-gold/50 hover:text-gold transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="font-medium">Create New Plan</div>
              <div className="text-xs">Add a new subscription tier</div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {(editingPlan || isCreating) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setEditingPlan(null);
              setIsCreating(false);
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
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gold/10 bg-luxury-dark z-10">
                <h3 className="text-lg font-semibold text-white">
                  {isCreating ? "Create New Plan" : "Edit Plan"}
                </h3>
                <button
                  onClick={() => {
                    setEditingPlan(null);
                    setIsCreating(false);
                  }}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Plan Name</Label>
                    <Input
                      defaultValue={editingPlan?.name}
                      placeholder="e.g., Premium"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Price ($)</Label>
                    <Input
                      type="number"
                      defaultValue={editingPlan?.price}
                      placeholder="149"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Input
                    defaultValue={editingPlan?.description}
                    placeholder="Brief description of the plan"
                    className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Duration (days)</Label>
                    <Input
                      type="number"
                      defaultValue={editingPlan?.duration}
                      placeholder="28"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Playlist Placements</Label>
                    <Input
                      type="number"
                      defaultValue={editingPlan?.playlistPlacements}
                      placeholder="15"
                      className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-white">
                    <Switch defaultChecked={editingPlan?.socialPromotion} />
                    Social Promotion
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <Switch defaultChecked={editingPlan?.emailMarketing} />
                    Email Marketing
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Priority Level</Label>
                  <div className="flex gap-3">
                    {["normal", "high", "premium"].map((priority) => (
                      <button
                        key={priority}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                          editingPlan?.priority === priority
                            ? "bg-gold text-luxury-black"
                            : "bg-luxury-lighter text-luxury-gray hover:text-white"
                        )}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Features (one per line)</Label>
                  <textarea
                    defaultValue={editingPlan?.features.join("\n")}
                    placeholder="15 Playlist Placements&#10;Full Social Promotion&#10;4-Week Campaign Duration"
                    className="w-full h-32 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 flex items-center justify-end gap-3 p-4 border-t border-gold/10 bg-luxury-dark">
                <GoldButton
                  variant="outline"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </GoldButton>
                <GoldButton>
                  {isCreating ? "Create Plan" : "Save Changes"}
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
