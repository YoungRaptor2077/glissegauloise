"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder"];
  const thumbnailCount = Math.max(displayImages.length, 3);

  return (
    <div className="space-y-4">
      <motion.div
        className="relative aspect-square rounded-xl bg-gris-anthracite-light/50 border border-white/5 overflow-hidden flex items-center justify-center group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Package className="h-24 w-24 text-blanc-casse/10 group-hover:text-vert-neon/20 transition-colors duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-blanc-casse/20 text-sm">{productName}</span>
        </div>
      </motion.div>

      <div className="flex gap-2">
        {Array.from({ length: thumbnailCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "w-16 h-16 rounded-lg bg-gris-anthracite-light/50 border flex items-center justify-center transition-all duration-200",
              selectedIndex === index
                ? "border-vert-neon/50 shadow-sm shadow-vert-neon/10"
                : "border-white/5 hover:border-white/20"
            )}
          >
            <Package className="h-5 w-5 text-blanc-casse/20" />
          </button>
        ))}
      </div>
    </div>
  );
}
