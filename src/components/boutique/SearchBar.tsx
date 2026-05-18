"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data/products";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-xl glass transition-all duration-300",
          isFocused && "neon-border"
        )}
      >
        <Search className="absolute left-4 h-5 w-5 text-blanc-casse/40" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Rechercher un produit, une marque..."
          className="w-full bg-transparent py-3.5 pl-12 pr-10 text-blanc-casse placeholder:text-blanc-casse/40 focus:outline-none"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 rounded-md hover:bg-gris-anthracite-light transition-colors"
          >
            <X className="h-4 w-4 text-blanc-casse/60" />
          </button>
        )}
      </div>
      {isFocused && !localValue && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl glass-strong z-10">
          <p className="text-xs font-medium text-blanc-casse/50 uppercase tracking-wider mb-2">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleChange(cat.name)}
                className="px-3 py-1.5 rounded-lg bg-gris-anthracite-light/50 text-sm text-blanc-casse/70 hover:text-vert-neon hover:bg-vert-neon/5 transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
