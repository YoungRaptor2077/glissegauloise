"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  children?: Category[];
}

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
          <p className="text-xs text-blanc-casse/40">{category.description || "-"}</p>
        </div>
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

function buildTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", parentId: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const tree = buildTree(categories);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parent_id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      await fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory.id,
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            parent_id: formData.parentId || null,
            sort_order: editingCategory.sort_order,
          }),
        });
      } else {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            parent_id: formData.parentId || null,
            sort_order: 0,
          }),
        });
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: "", slug: "", description: "", parentId: "" });
      await fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Categories</h1>
          <p className="text-sm text-blanc-casse/60">Organisez votre catalogue par categories</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-vert-neon" />
        </div>
      </div>
    );
  }

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
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Categorie parent</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              >
                <option value="">Aucune (racine)</option>
                {categories
                  .filter((c) => c.id !== editingCategory?.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
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
                disabled={submitting}
                className="rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
              >
                {submitting ? "..." : editingCategory ? "Mettre a jour" : "Creer"}
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
        {tree.length === 0 ? (
          <div className="py-12 text-center">
            <FolderTree size={32} className="mx-auto mb-3 text-blanc-casse/20" />
            <p className="text-sm text-blanc-casse/40">Aucune categorie pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {tree.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
