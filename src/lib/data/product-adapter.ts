import type { Product } from "@/types/database";
import type { Json } from "@/types/database";

export interface ProductDisplay {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  brand: string;
  category: string;
  categorySlug: string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  compatibility: string[];
  specifications: Record<string, string>;
}

export function toProductDisplay(
  dbProduct: Product & { categories?: { name: string; slug: string } | null },
  categoryName?: string,
  categorySlug?: string
): ProductDisplay {
  const specs: Record<string, string> = {};
  if (dbProduct.specifications && typeof dbProduct.specifications === "object" && !Array.isArray(dbProduct.specifications)) {
    const specObj = dbProduct.specifications as Record<string, Json | undefined>;
    for (const [key, value] of Object.entries(specObj)) {
      if (typeof value === "string") {
        specs[key] = value;
      } else if (value !== null && value !== undefined) {
        specs[key] = String(value);
      }
    }
  }

  const catName = categoryName || dbProduct.categories?.name || "";
  const catSlug = categorySlug || dbProduct.categories?.slug || "";

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description || "",
    price: dbProduct.price,
    compareAtPrice: dbProduct.compare_at_price,
    brand: dbProduct.brand || "",
    category: catName,
    categorySlug: catSlug,
    images: dbProduct.images || [],
    stockQuantity: dbProduct.stock_quantity,
    isActive: dbProduct.is_active,
    isFeatured: dbProduct.is_featured,
    compatibility: dbProduct.compatibility || [],
    specifications: specs,
  };
}
