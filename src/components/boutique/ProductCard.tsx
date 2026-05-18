"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/lib/hooks/useCart";
import type { ProductDisplay } from "@/lib/data/product-adapter";

interface ProductCardProps {
  product: ProductDisplay;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
      brand: product.brand,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/boutique/${product.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group relative rounded-xl bg-gris-anthracite border border-white/5 overflow-hidden hover:border-vert-neon/30 hover:shadow-lg hover:shadow-vert-neon/5 transition-all duration-300"
        >
          <div className="relative aspect-square bg-gris-anthracite-light/50 flex items-center justify-center overflow-hidden">
            <Package className="h-16 w-16 text-blanc-casse/10 group-hover:text-vert-neon/20 transition-colors duration-300" />
            {product.compareAtPrice && (
              <div className="absolute top-3 left-3">
                <Badge variant="error">
                  -
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100
                  )}
                  %
                </Badge>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full",
                  isInStock
                    ? isLowStock
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isInStock
                      ? isLowStock
                        ? "bg-yellow-400"
                        : "bg-green-400"
                      : "bg-red-400"
                  )}
                />
                {isInStock
                  ? isLowStock
                    ? "Stock limité"
                    : "En stock"
                  : "Rupture"}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2">
              <Badge variant="neon">{product.brand}</Badge>
            </div>
            <h3 className="text-sm font-medium text-blanc-casse line-clamp-2 min-h-[2.5rem] group-hover:text-vert-neon transition-colors duration-200">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-blanc-casse">
                {product.price.toFixed(2)} EUR
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-blanc-casse/40 line-through">
                  {product.compareAtPrice.toFixed(2)} EUR
                </span>
              )}
            </div>

            {product.compatibility.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.compatibility.slice(0, 2).map((compat) => (
                  <span
                    key={compat}
                    className="text-[10px] text-blanc-casse/40 bg-gris-anthracite-light/50 px-1.5 py-0.5 rounded"
                  >
                    {compat}
                  </span>
                ))}
                {product.compatibility.length > 2 && (
                  <span className="text-[10px] text-blanc-casse/30">
                    +{product.compatibility.length - 2}
                  </span>
                )}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={cn(
                "mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
                isInStock
                  ? "bg-vert-neon/10 text-vert-neon hover:bg-vert-neon/20 border border-vert-neon/20"
                  : "bg-gris-anthracite-light/50 text-blanc-casse/30 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInStock ? "Ajouter au panier" : "Indisponible"}
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
