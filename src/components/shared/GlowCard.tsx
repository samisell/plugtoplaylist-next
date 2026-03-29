"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "orange" | "highlight";
  hover?: boolean;
  animate?: boolean;
}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, variant = "default", hover = true, animate = false, children, ...props }, ref) => {
    const baseStyles = "rounded-xl border bg-luxury-dark transition-all duration-300";
    
    const variants = {
      default: "border-gold/20 shadow-card",
      premium: "border-gold/40 shadow-gold-glow bg-gradient-to-br from-luxury-dark to-luxury-lighter",
      orange: "border-brand-orange/30 shadow-orange-glow",
      highlight: "border-gold/50 shadow-gold-glow-lg bg-gradient-to-br from-luxury-dark via-luxury-lighter to-luxury-dark",
    };

    const hoverStyles = hover
      ? "hover:border-gold/50 hover:shadow-gold-glow-lg hover:-translate-y-1"
      : "";

    const CardComponent = animate ? motion.div : "div";
    const animationProps = animate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
        }
      : {};

    return (
      <CardComponent
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...animationProps}
        {...props}
      >
        {children}
      </CardComponent>
    );
  }
);
GlowCard.displayName = "GlowCard";

// Card Header
type GlowCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const GlowCardHeader = React.forwardRef<HTMLDivElement, GlowCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
GlowCardHeader.displayName = "GlowCardHeader";

// Card Title
type GlowCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const GlowCardTitle = React.forwardRef<HTMLHeadingElement, GlowCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight text-white", className)}
      {...props}
    />
  )
);
GlowCardTitle.displayName = "GlowCardTitle";

// Card Description
type GlowCardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const GlowCardDescription = React.forwardRef<HTMLParagraphElement, GlowCardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-luxury-gray", className)}
      {...props}
    />
  )
);
GlowCardDescription.displayName = "GlowCardDescription";

// Card Content
type GlowCardContentProps = React.HTMLAttributes<HTMLDivElement>;

const GlowCardContent = React.forwardRef<HTMLDivElement, GlowCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
GlowCardContent.displayName = "GlowCardContent";

// Card Footer
type GlowCardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const GlowCardFooter = React.forwardRef<HTMLDivElement, GlowCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
GlowCardFooter.displayName = "GlowCardFooter";

export {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
  GlowCardContent,
  GlowCardFooter,
};
