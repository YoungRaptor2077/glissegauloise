"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Trash2, Plus, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

export default function AdminGaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `gallery/${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (uploadError || !uploadData) {
        setFeedback({ type: "error", message: "Erreur lors de l'upload de l'image" });
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          title: title || null,
          description: description || null,
        }),
      });

      if (res.ok) {
        setFeedback({ type: "success", message: "Image ajoutee avec succes" });
        setTitle("");
        setDescription("");
        fetchImages();
      } else {
        setFeedback({ type: "error", message: "Erreur lors de l'ajout" });
      }
    } catch {
      setFeedback({ type: "error", message: "Erreur de connexion" });
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setFeedback({ type: "success", message: "Image supprimee" });
      } else {
        setFeedback({ type: "error", message: "Erreur lors de la suppression" });
      }
    } catch {
      setFeedback({ type: "error", message: "Erreur de connexion" });
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Galerie</h1>
          <p className="text-sm text-blanc-casse/60">Gerez les images de la galerie</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Galerie</h1>
        <p className="text-sm text-blanc-casse/60">Gerez les images de la galerie</p>
      </div>

      {/* Upload section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vert-neon/10">
            <Plus className="h-5 w-5 text-vert-neon" />
          </div>
          <h2 className="text-lg font-semibold text-blanc-casse">Ajouter une image</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-2">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'image"
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optionnel)"
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-vert-neon px-6 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity w-fit">
          <Upload size={16} />
          {uploading ? "Upload en cours..." : "Choisir et uploader une image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </motion.div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-vert-neon/20 bg-vert-neon/10 text-vert-neon"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-blanc-casse/20" />
          <p className="mt-4 text-sm text-blanc-casse/40">Aucune image dans la galerie</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative rounded-2xl border border-white/5 bg-gris-anthracite overflow-hidden"
            >
              <img
                src={img.image_url}
                alt={img.title || "Gallery image"}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                {img.title && (
                  <h3 className="text-sm font-semibold text-blanc-casse">{img.title}</h3>
                )}
                {img.description && (
                  <p className="text-xs text-blanc-casse/60 mt-1">{img.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 rounded-lg bg-red-500/80 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
