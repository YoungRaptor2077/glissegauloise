"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  icon: React.ReactNode;
  title: string;
  priceRange: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({
  icon,
  title,
  priceRange,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-2xl border p-6 transition-colors duration-300 flex flex-col",
        highlighted
          ? "border-vert-neon/40 bg-gris-anthracite shadow-lg shadow-vert-neon/5"
          : "border-white/5 bg-gris-anthracite hover:border-vert-neon/20"
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-vert-neon/10 flex items-center justify-center text-vert-neon">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-blanc-casse">{title}</h3>
      </div>

      <p className="text-blanc-casse/60 text-sm mb-4">{description}</p>

      <div className="mb-4">
        <span className="text-2xl font-bold text-vert-neon">{priceRange}</span>
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-blanc-casse/70">
            <span className="text-vert-neon mt-0.5 flex-shrink-0">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href="/reparations"
        className={cn(
          "inline-flex items-center justify-center w-full rounded-xl py-2.5 text-sm font-medium transition-colors duration-200",
          highlighted
            ? "bg-vert-neon text-noir-mat hover:bg-vert-neon-dark"
            : "border border-vert-neon/30 text-vert-neon hover:bg-vert-neon/10"
        )}
      >
        Demander un devis
      </a>
    </motion.div>
  );
}
