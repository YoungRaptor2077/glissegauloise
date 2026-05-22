"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/hooks/useCart";
import type { ProductDisplay } from "@/lib/data/product-adapter";

interface AddToCartButtonProps {
  product: ProductDisplay;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const isInStock = product.stockQuantity > 0;

  const handleAdd = () => {
    if (!isInStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] || "",
        brand: product.brand,
        stock: product.stockQuantity,
      },
      quantity
    );
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="text-sm text-blanc-casse/60">Quantité:</span>
        <div className="flex items-center gap-1 bg-gris-anthracite-light/50 rounded-lg border border-white/10">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gris-anthracite-light transition-colors rounded-l-lg"
          >
            <Minus className="h-4 w-4 text-blanc-casse/70" />
          </button>
          <span className="w-10 text-center text-sm text-blanc-casse font-medium">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stockQuantity, quantity + 1))
            }
            className="p-2 hover:bg-gris-anthracite-light transition-colors rounded-r-lg"
          >
            <Plus className="h-4 w-4 text-blanc-casse/70" />
          </button>
        </div>
        {isInStock && product.stockQuantity <= 5 && (
          <span className="text-xs text-yellow-400">
            Plus que {product.stockQuantity} en stock
          </span>
        )}
      </div>

      <motion.button
        whileHover={isInStock ? { scale: 1.02 } : undefined}
        whileTap={isInStock ? { scale: 0.98 } : undefined}
        onClick={handleAdd}
        disabled={!isInStock}
        className={cn(
          "w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300",
          isInStock
            ? "bg-vert-neon text-noir-mat hover:bg-vert-neon-dark shadow-lg shadow-vert-neon/20"
            : "bg-gris-anthracite-light text-blanc-casse/30 cursor-not-allowed"
        )}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              Ajouté au panier
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isInStock ? "Ajouter au panier" : "Produit indisponible"}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
