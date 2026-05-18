"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-200 hover:border-vert-neon/20",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-vert-neon/10 p-3 text-vert-neon">
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
              trend.isPositive
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-blanc-casse">{value}</p>
        <p className="mt-1 text-sm text-blanc-casse/60">{label}</p>
      </div>
    </motion.div>
  );
}
