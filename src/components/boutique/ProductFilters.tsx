"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  brands: string[];
  category: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  brands?: string[];
  categories?: { name: string; slug: string }[];
  className?: string;
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-medium text-blanc-casse mb-2"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-blanc-casse/50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductFilters({
  filters,
  onChange,
  brands = [],
  categories = [],
  className,
}: ProductFiltersProps) {
  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: newBrands });
  };

  return (
    <div className={cn("rounded-xl glass p-5", className)}>
      <div className="flex items-center gap-2 mb-5">
        <Filter className="h-4 w-4 text-vert-neon" />
        <h3 className="text-sm font-semibold text-blanc-casse uppercase tracking-wider">
          Filtres
        </h3>
      </div>

      <FilterSection title="Marque">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-blanc-casse/20 bg-gris-anthracite-light text-vert-neon focus:ring-vert-neon/50 focus:ring-offset-0"
              />
              <span className="text-sm text-blanc-casse/70 group-hover:text-blanc-casse transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Categorie">
        <div className="space-y-1">
          <button
            onClick={() => onChange({ ...filters, category: "" })}
            className={cn(
              "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
              !filters.category
                ? "bg-vert-neon/10 text-vert-neon"
                : "text-blanc-casse/70 hover:bg-gris-anthracite-light/50"
            )}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onChange({ ...filters, category: cat.slug })}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                filters.category === cat.slug
                  ? "bg-vert-neon/10 text-vert-neon"
                  : "text-blanc-casse/70 hover:bg-gris-anthracite-light/50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Prix" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]],
                })
              }
              placeholder="Min"
              className="w-full px-3 py-2 rounded-lg bg-gris-anthracite-light/50 border border-white/10 text-sm text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50"
            />
            <span className="text-blanc-casse/40">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              placeholder="Max"
              className="w-full px-3 py-2 rounded-lg bg-gris-anthracite-light/50 border border-white/10 text-sm text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Disponibilite">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 rounded border-blanc-casse/20 bg-gris-anthracite-light text-vert-neon focus:ring-vert-neon/50 focus:ring-offset-0"
          />
          <span className="text-sm text-blanc-casse/70">En stock uniquement</span>
        </label>
      </FilterSection>

      <FilterSection title="Trier par">
        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-gris-anthracite-light/50 border border-white/10 text-sm text-blanc-casse focus:outline-none focus:border-vert-neon/50"
        >
          <option value="popularite">Popularite</option>
          <option value="nouveautes">Nouveautes</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix decroissant</option>
        </select>
      </FilterSection>
    </div>
  );
}
