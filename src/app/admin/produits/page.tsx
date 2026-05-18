"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  [key: string]: unknown;
}

const mockProducts: ProductRow[] = [
  { id: "1", name: "Burton Custom 158", category: "Snowboards", price: 549.99, stock: 12, status: "Actif" },
  { id: "2", name: "Rossignol Experience 88", category: "Skis", price: 699.00, stock: 5, status: "Actif" },
  { id: "3", name: "Union Force Bindings", category: "Fixations", price: 249.99, stock: 23, status: "Actif" },
  { id: "4", name: "Oakley Flight Deck", category: "Masques", price: 189.00, stock: 0, status: "Rupture" },
  { id: "5", name: "Burton Step On", category: "Boots", price: 399.99, stock: 8, status: "Actif" },
  { id: "6", name: "Lib Tech Skate Banana", category: "Snowboards", price: 499.00, stock: 3, status: "Actif" },
];

const statusStyles: Record<string, string> = {
  Actif: "bg-green-500/10 text-green-400",
  Rupture: "bg-red-500/10 text-red-400",
  Brouillon: "bg-yellow-500/10 text-yellow-400",
};

export default function ProduitsPage() {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

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

      <DataTable
        columns={columns}
        data={mockProducts}
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
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blanc-casse/80 hover:bg-gris-anthracite-light"
                >
                  <Edit size={14} />
                  Modifier
                </Link>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gris-anthracite-light">
                  <Trash2 size={14} />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
