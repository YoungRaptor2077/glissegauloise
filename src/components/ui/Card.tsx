"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "glass" | "neon";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-gris-anthracite border border-white/5 rounded-2xl",
  glass: "glass rounded-2xl",
  neon: "bg-gris-anthracite neon-border rounded-2xl",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("p-6", variantStyles[variant], className)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn("mt-4 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardVariant };
