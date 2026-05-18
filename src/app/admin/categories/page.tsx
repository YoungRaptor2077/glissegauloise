"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  children?: Category[];
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Snowboards",
    slug: "snowboards",
    description: "Planches de snowboard pour tous niveaux",
    productCount: 24,
    children: [
      { id: "1-1", name: "All-Mountain", slug: "all-mountain", description: "Polyvalence", productCount: 10 },
      { id: "1-2", name: "Freestyle", slug: "freestyle", description: "Park et tricks", productCount: 8 },
      { id: "1-3", name: "Freeride", slug: "freeride", description: "Poudreuse et hors-piste", productCount: 6 },
    ],
  },
  {
    id: "2",
    name: "Skis",
    slug: "skis",
    description: "Skis alpins et de randonnee",
    productCount: 18,
    children: [
      { id: "2-1", name: "Piste", slug: "piste", description: "Ski de piste", productCount: 10 },
      { id: "2-2", name: "Randonnee", slug: "randonnee", description: "Ski de rando", productCount: 8 },
    ],
  },
  { id: "3", name: "Fixations", slug: "fixations", description: "Fixations snowboard et ski", productCount: 15 },
  { id: "4", name: "Boots", slug: "boots", description: "Chaussures et boots", productCount: 12 },
  { id: "5", name: "Accessoires", slug: "accessoires", description: "Masques, casques, etc.", productCount: 30 },
];

interface CategoryItemProps {
  category: Category;
  level?: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function CategoryItem({ category, level = 0, onEdit, onDelete }: CategoryItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-gris-anthracite/50",
          level > 0 && "ml-8"
        )}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="text-blanc-casse/40">
            <ChevronRight
              size={16}
              className={cn("transition-transform", expanded && "rotate-90")}
            />
          </button>
        ) : (
          <span className="w-4" />
        )}
        <FolderTree size={16} className="text-vert-neon/60" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blanc-casse">{category.name}</p>
          <p className="text-xs text-blanc-casse/40">{category.description}</p>
        </div>
        <span className="rounded-full bg-gris-anthracite-light px-2 py-0.5 text-xs text-blanc-casse/60">
          {category.productCount} produits
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(category)}
            className="rounded-lg p-1.5 text-blanc-casse/40 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="rounded-lg p-1.5 text-blanc-casse/40 transition-colors hover:bg-gris-anthracite hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", parentId: "" });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Delete category via API
    console.log("Delete category:", id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save category via API
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", parentId: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Categories</h1>
          <p className="text-sm text-blanc-casse/60">Organisez votre catalogue par categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "", parentId: "" });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark"
        >
          <Plus size={16} />
          Ajouter une categorie
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-blanc-casse">
            {editingCategory ? "Modifier la categorie" : "Nouvelle categorie"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                  }));
                }}
                placeholder="Nom de la categorie"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="nom-de-la-categorie"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm font-mono text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la categorie"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark"
              >
                {editingCategory ? "Mettre a jour" : "Creer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-blanc-casse/80 transition-colors hover:bg-gris-anthracite"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-2">
        <div className="divide-y divide-white/5">
          {mockCategories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
