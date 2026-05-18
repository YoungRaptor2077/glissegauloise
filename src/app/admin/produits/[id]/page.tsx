"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/types/database";

interface CategoryOption {
  id: string;
  name: string;
}

export default function EditProduitPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAtPrice: "",
    stock: "",
    categoryId: "",
    brand: "",
    images: [] as string[],
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch product
      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single() as { data: Product | null };

      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          price: String(product.price),
          compareAtPrice: product.compare_at_price ? String(product.compare_at_price) : "",
          stock: String(product.stock_quantity),
          categoryId: product.category_id || "",
          brand: product.brand || "",
          images: product.images || [],
          isFeatured: product.is_featured,
          isActive: product.is_active,
        });
      }

      // Fetch categories
      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true }) as { data: Category[] | null };

      if (cats) {
        setCategories(cats);
      }

      setLoading(false);
    }

    fetchData();
  }, [productId]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/admin/produits");
      }
    } catch (error) {
      console.error("Product update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/produits"
            className="rounded-lg p-2 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blanc-casse">Modifier le produit</h1>
            <p className="text-sm text-blanc-casse/60">Chargement...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produits"
          className="rounded-lg p-2 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Modifier le produit</h1>
          <p className="text-sm text-blanc-casse/60">ID: {productId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic info */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Informations generales</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Burton Custom 158"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="burton-custom-158"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm font-mono text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Decrivez le produit..."
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30 resize-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Marque
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="Ex: Xiaomi, Segway, Ninebot"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Tarification</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Prix (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Prix compare (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: e.target.value }))}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Images</h2>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-gris-anthracite"
                >
                  <div className="flex h-full items-center justify-center text-xs text-blanc-casse/40">
                    Image {i + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute right-1 top-1 rounded-full bg-noir-mat/80 p-0.5 text-blanc-casse/80 hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-blanc-casse/40 transition-colors hover:border-vert-neon/40 hover:text-vert-neon"
              >
                <Upload size={20} />
                <span className="text-[10px]">Ajouter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Statut</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-gris-anthracite text-vert-neon focus:ring-vert-neon/30"
                />
                <span className="text-sm text-blanc-casse/80">Produit actif</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-gris-anthracite text-vert-neon focus:ring-vert-neon/30"
                />
                <span className="text-sm text-blanc-casse/80">Produit en vedette</span>
              </label>
            </div>
          </div>

          {/* Organization */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Organisation</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Categorie
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                >
                  <option value="">Selectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
              )}
            >
              {isSubmitting ? "Enregistrement..." : "Mettre a jour"}
            </button>
            <Link
              href="/admin/produits"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-blanc-casse/80 transition-colors hover:bg-gris-anthracite"
            >
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
