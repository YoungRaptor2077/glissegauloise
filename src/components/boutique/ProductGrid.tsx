"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { ProductDisplay } from "@/lib/data/product-adapter";

interface ProductGridProps {
  products: ProductDisplay[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <PackageSearch className="h-16 w-16 text-blanc-casse/20 mb-4" />
        <h3 className="text-lg font-medium text-blanc-casse/70">
          Aucun produit trouvé
        </h3>
        <p className="text-sm text-blanc-casse/40 mt-2">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
