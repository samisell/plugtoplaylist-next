"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const goldButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
  {
    variants: {
      variant: {
        gold: "bg-gold text-luxury-black shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline: "border-2 border-gold text-gold hover:bg-gold hover:text-luxury-black shadow-none hover:shadow-gold-glow",
        ghost: "text-luxury-gray hover:text-gold hover:bg-gold/10",
        orange: "bg-brand-orange text-white hover:bg-brand-orange/90 shadow-orange-glow",
        premium: "bg-gradient-to-r from-gold via-yellow-400 to-gold text-luxury-black shadow-gold-glow-lg hover:shadow-gold-glow font-bold",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  }
);

export interface GoldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof goldButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
          onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, disabled, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const [isClicked, setIsClicked] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isClicked) return;
      setIsClicked(true);
      if (onClick) {
        onClick(e);
      }
      setTimeout(() => setIsClicked(false), 1000);
    };

    return (
      <Comp
        className={cn(goldButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading || isClicked}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
GoldButton.displayName = "GoldButton";

// Animated version
const GoldButtonAnimated = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, disabled, onClick, ...props }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading || isClicked) return;
      setIsClicked(true);
      if (onClick) {
        onClick(e);
      }
      setTimeout(() => setIsClicked(false), 1000); // Reset after 1 second to allow re-submission on error
    };

    return (
      <motion.button
        whileHover={{ scale: disabled || loading || isClicked ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading || isClicked ? 1 : 0.98 }}
        className={cn(goldButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading || isClicked}
        onClick={handleClick}
        {...(props as any)} // Use type assertion to bypass the type conflict
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);
GoldButtonAnimated.displayName = "GoldButtonAnimated";

export { GoldButton, GoldButtonAnimated, goldButtonVariants };