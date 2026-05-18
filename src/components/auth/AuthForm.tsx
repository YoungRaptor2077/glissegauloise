"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  success?: string | null;
  isLoading?: boolean;
  className?: string;
}

export function AuthForm({
  title,
  subtitle,
  children,
  onSubmit,
  error,
  success,
  className,
}: AuthFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "w-full max-w-md mx-auto p-8 bg-gris-anthracite border border-white/5 rounded-2xl shadow-2xl",
        className
      )}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-blanc-casse">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-blanc-casse/60">{subtitle}</p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </motion.div>
  );
}
