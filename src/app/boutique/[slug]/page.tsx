"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Star, Truck, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProductGallery } from "@/components/boutique/ProductGallery";
import { AddToCartButton } from "@/components/boutique/AddToCartButton";
import { ProductCard } from "@/components/boutique/ProductCard";
import { createClient } from "@/lib/supabase/client";
import { toProductDisplay, type ProductDisplay } from "@/lib/data/product-adapter";
import type { Product } from "@/types/database";
import { useState, useEffect } from "react";

type Tab = "description" | "specifications" | "avis";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<ProductDisplay | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("description");

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();

      const { data: productData } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .single() as { data: (Product & { categories: { name: string; slug: string } | null }) | null };

      if (productData) {
        const displayProduct = toProductDisplay(productData);
        setProduct(displayProduct);

        // Fetch related products (same category, excluding current)
        if (productData.category_id) {
          const { data: relatedData } = await supabase
            .from("products")
            .select("*, categories(name, slug)")
            .eq("category_id", productData.category_id)
            .eq("is_active", true)
            .neq("id", productData.id)
            .limit(4) as { data: (Product & { categories: { name: string; slug: string } | null })[] | null };

          if (relatedData) {
            setRelatedProducts(relatedData.map((p) => toProductDisplay(p)));
          }
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <section className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-vert-neon animate-spin" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-blanc-casse/20 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-blanc-casse mb-2">
            Produit introuvable
          </h1>
          <p className="text-blanc-casse/50 mb-4">
            Ce produit n&apos;existe pas ou a ete retire.
          </p>
          <Link
            href="/boutique"
            className="text-vert-neon hover:underline text-sm"
          >
            Retour a la boutique
          </Link>
        </div>
      </div>
    );
  }

  const isInStock = product.stockQuantity > 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "avis", label: "Avis" },
  ];

  return (
    <section className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-sm text-blanc-casse/60 hover:text-vert-neon transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a la boutique
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery images={product.images} productName={product.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              {product.brand && (
                <Badge variant="neon" className="mb-3">
                  {product.brand}
                </Badge>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-blanc-casse mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        "text-blanc-casse/20"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-blanc-casse/50">(0 avis)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blanc-casse">
                {product.price.toFixed(2)} EUR
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-blanc-casse/40 line-through">
                  {product.compareAtPrice.toFixed(2)} EUR
                </span>
              )}
              {product.compareAtPrice && (
                <Badge variant="error">
                  -
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100
                  )}
                  %
                </Badge>
              )}
            </div>

            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                isInStock
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isInStock ? "bg-green-400" : "bg-red-400"
                )}
              />
              {isInStock
                ? `En stock (${product.stockQuantity} disponibles)`
                : "Rupture de stock"}
            </div>

            <AddToCartButton product={product} />

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="h-5 w-5 text-vert-neon" />
                <span className="text-xs text-blanc-casse/60">
                  Livraison 48h
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="h-5 w-5 text-vert-neon" />
                <span className="text-xs text-blanc-casse/60">
                  Garantie 2 ans
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Package className="h-5 w-5 text-vert-neon" />
                <span className="text-xs text-blanc-casse/60">
                  Retour gratuit
                </span>
              </div>
            </div>

            {product.compatibility.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-sm font-medium text-blanc-casse mb-3">
                  Compatibilite
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((compat) => (
                    <span
                      key={compat}
                      className="px-3 py-1.5 rounded-lg bg-gris-anthracite-light/50 border border-white/5 text-xs text-blanc-casse/70"
                    >
                      {compat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex gap-1 border-b border-white/10 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-3 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-vert-neon"
                    : "text-blanc-casse/50 hover:text-blanc-casse/80"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-vert-neon"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="rounded-xl glass p-6">
            {activeTab === "description" && (
              <div className="prose prose-invert max-w-none">
                <p className="text-blanc-casse/70 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            {activeTab === "specifications" && (
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                  >
                    <span className="text-sm text-blanc-casse/60">{key}</span>
                    <span className="text-sm font-medium text-blanc-casse">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "avis" && (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-blanc-casse/20 mx-auto mb-3" />
                <p className="text-blanc-casse/50">
                  Les avis seront bientot disponibles.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-blanc-casse mb-6">
              Produits similaires
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related, index) => (
                <ProductCard key={related.id} product={related} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
