"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        pending: "bg-brand-orange/20 text-brand-orange border border-brand-orange/30",
        active: "bg-gold/20 text-gold border border-gold/30",
        completed: "bg-green-500/20 text-green-400 border border-green-500/30",
        cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
        paid: "bg-green-500/20 text-green-400 border border-green-500/30",
        failed: "bg-red-500/20 text-red-400 border border-red-500/30",
        refunded: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ status }), className)}
        {...props}
      >
        {icon}
        {children}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// Animated dot for active status
function StatusDot({ status }: { status: "pending" | "active" | "completed" | "cancelled" }) {
  const dotColors = {
    pending: "bg-brand-orange",
    active: "bg-gold animate-pulse",
    completed: "bg-green-400",
    cancelled: "bg-red-400",
  };

  return (
    <span className={cn("w-2 h-2 rounded-full", dotColors[status])} />
  );
}

export { StatusBadge, StatusBadge as Badge, StatusDot };
