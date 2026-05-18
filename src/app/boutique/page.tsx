"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { ProductFilters, type FilterState } from "@/components/boutique/ProductFilters";
import { ProductGrid } from "@/components/boutique/ProductGrid";
import { SearchBar } from "@/components/boutique/SearchBar";
import { createClient } from "@/lib/supabase/client";
import { toProductDisplay, type ProductDisplay } from "@/lib/data/product-adapter";
import type { Product } from "@/types/database";

const defaultFilters: FilterState = {
  brands: [],
  category: "",
  priceRange: [0, 1000],
  inStockOnly: false,
  sortBy: "popularite",
};

export default function BoutiquePage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [search, setSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();

      const { data: productsData } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_active", true) as { data: (Product & { categories: { name: string; slug: string } | null })[] | null };

      if (productsData) {
        const displayProducts = productsData.map((p) => toProductDisplay(p));
        setProducts(displayProducts);

        // Extract unique brands
        const uniqueBrands = Array.from(
          new Set(displayProducts.map((p) => p.brand).filter(Boolean))
        ).sort();
        setBrands(uniqueBrands);
      }

      const { data: categoriesData } = await supabase
        .from("categories")
        .select("name, slug")
        .order("sort_order") as { data: { name: string; slug: string }[] | null };

      if (categoriesData) {
        setCategories(categoriesData);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    if (filters.category) {
      result = result.filter((p) => p.categorySlug === filters.category);
    }

    if (filters.priceRange[0] > 0) {
      result = result.filter((p) => p.price >= filters.priceRange[0]);
    }
    if (filters.priceRange[1] < 1000) {
      result = result.filter((p) => p.price <= filters.priceRange[1]);
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    switch (filters.sortBy) {
      case "prix-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "prix-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nouveautes":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [search, filters, products]);

  if (loading) {
    return (
      <section className="min-h-screen py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-vert-neon animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-blanc-casse mb-2">
            Boutique
          </h1>
          <p className="text-blanc-casse/60">
            Pieces et accessoires premium pour trottinettes electriques
          </p>
        </motion.div>

        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} categories={categories} />
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-blanc-casse/70 hover:text-blanc-casse transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {(filters.brands.length > 0 || filters.category || filters.inStockOnly) && (
              <span className="ml-1 w-5 h-5 rounded-full bg-vert-neon/20 text-vert-neon text-xs flex items-center justify-center">
                {filters.brands.length + (filters.category ? 1 : 0) + (filters.inStockOnly ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-noir-mat overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-blanc-casse">Filtres</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-gris-anthracite-light transition-colors"
                >
                  <X className="h-5 w-5 text-blanc-casse/70" />
                </button>
              </div>
              <div className="p-4">
                <ProductFilters
                  filters={filters}
                  onChange={setFilters}
                  brands={brands}
                  categories={categories}
                  className="border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              brands={brands}
              categories={categories}
            />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-blanc-casse/50">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </section>
  );
}
