"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/types/database";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  [key: string]: unknown;
}

const statusStyles: Record<string, string> = {
  Actif: "bg-green-500/10 text-green-400",
  Rupture: "bg-red-500/10 text-red-400",
  Brouillon: "bg-yellow-500/10 text-yellow-400",
};

export default function ProduitsPage() {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }) as { data: Product[] | null };

      if (data) {
        // Fetch categories
        const categoryIds = [...new Set(data.map((p) => p.category_id).filter(Boolean))] as string[];
        const categoryMap: Record<string, string> = {};

        if (categoryIds.length > 0) {
          const { data: cats } = await supabase
            .from("categories")
            .select("*")
            .in("id", categoryIds) as { data: Category[] | null };
          if (cats) {
            cats.forEach((c) => { categoryMap[c.id] = c.name; });
          }
        }

        setProducts(
          data.map((p) => {
            let status = "Actif";
            if (p.stock_quantity === 0) status = "Rupture";
            else if (!p.is_active) status = "Brouillon";
            return {
              id: p.id,
              name: p.name,
              category: (p.category_id && categoryMap[p.category_id]) || "-",
              price: p.price,
              stock: p.stock_quantity,
              status,
            };
          })
        );
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    setError(null);
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      setError("Erreur lors de la suppression du produit.");
    }
    setDeleteConfirm(null);
    setMenuOpen(null);
  };

  const columns: Column<ProductRow>[] = [
    { key: "name", label: "Produit", sortable: true },
    { key: "category", label: "Categorie", sortable: true },
    {
      key: "price",
      label: "Prix",
      sortable: true,
      render: (row) => <span>{row.price.toFixed(2)} EUR</span>,
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (row) => (
        <span className={row.stock === 0 ? "text-red-400" : ""}>
          {row.stock}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status] || ""}`}>
          {row.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blanc-casse">Produits</h1>
            <p className="text-sm text-blanc-casse/60">Gerez votre catalogue de produits</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Produits</h1>
          <p className="text-sm text-blanc-casse/60">Gerez votre catalogue de produits</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark"
        >
          <Plus size={16} />
          Ajouter un produit
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Rechercher un produit..."
        actions={(row) => (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(menuOpen === row.id ? null : row.id);
              }}
              className="rounded-lg p-1.5 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen === row.id && (
              <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-xl border border-white/10 bg-gris-anthracite py-1 shadow-xl">
                <Link
                  href={`/admin/produits/${row.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blanc-casse/80 hover:bg-noir-mat/50"
                >
                  <Edit size={14} />
                  Modifier
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(row.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-noir-mat/50"
                >
                  <Trash2 size={14} />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      />

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-2xl border border-white/10 bg-gris-anthracite p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-blanc-casse mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-blanc-casse/60 mb-6">
              Etes-vous sur de vouloir supprimer ce produit ? Cette action est irreversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirm(null);
                  setMenuOpen(null);
                }}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-blanc-casse/80 transition-colors hover:bg-noir-mat/50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
