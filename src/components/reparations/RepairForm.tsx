"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileUpload } from "./FileUpload";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/providers/ToastProvider";
import Link from "next/link";

const BRANDS = [
  "Dualtron",
  "Kaabo",
  "Xiaomi",
  "Ninebot",
  "Vsett",
  "Inokim",
  "Minimotors",
  "Segway",
  "E-Twow",
  "Kugoo",
  "Autre",
];

const URGENCY_LEVELS = [
  { value: "normal", label: "Normal", description: "Delai standard" },
  { value: "urgent", label: "Urgent", description: "Traitement prioritaire" },
  {
    value: "tres-urgent",
    label: "Tres urgent",
    description: "Prise en charge immediate",
  },
];

interface FormState {
  marque: string;
  modele: string;
  description: string;
  urgence: string;
  preferenceContact: string;
  telephone: string;
  email: string;
  localisation: string;
}

export function RepairForm() {
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>({
    marque: "",
    modele: "",
    description: "",
    urgence: "normal",
    preferenceContact: "email",
    telephone: "",
    email: "",
    localisation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  // Pre-fill from query params (diagnostic auto-fill)
  useEffect(() => {
    const marque = searchParams.get("marque");
    const modele = searchParams.get("modele");
    const probleme = searchParams.get("probleme");
    const piece = searchParams.get("piece");

    if (marque || modele || probleme || piece) {
      setForm((prev) => ({
        ...prev,
        marque: marque || prev.marque,
        modele: modele || prev.modele,
        description: [probleme, piece].filter(Boolean).join(" - ") || prev.description,
      }));
    }
  }, [searchParams]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Upload files to Supabase Storage
      const supabase = createClient();
      const uploadedImages: string[] = [];
      const uploadedVideos: string[] = [];

      for (const file of imageFiles) {
        const fileName = `repairs/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: uploadErr } = await supabase.storage.from('uploads').upload(fileName, file);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
          uploadedImages.push(urlData.publicUrl);
        }
      }

      for (const file of videoFiles) {
        const fileName = `repairs/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: uploadErr } = await supabase.storage.from('uploads').upload(fileName, file);
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
          uploadedVideos.push(urlData.publicUrl);
        }
      }

      const response = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: uploadedImages,
          videos: uploadedVideos,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || `Erreur ${response.status}`);
        return;
      }
      setSubmitted(true);
      toast("Demande de reparation envoyee !");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de connexion";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="rounded-2xl bg-gris-anthracite border border-white/5 p-6 lg:p-8 text-center">
        <p className="text-blanc-casse/60">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl bg-gris-anthracite border border-white/5 p-6 lg:p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-blanc-casse">
          Demande de reparation
        </h3>
        <p className="text-blanc-casse/60">
          Vous devez creer un compte pour continuer
        </p>
        <Link
          href="/connexion"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-vert-neon text-noir-mat font-semibold hover:opacity-90 transition-opacity"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 rounded-2xl bg-gris-anthracite border border-vert-neon/20"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-vert-neon/10 flex items-center justify-center">
          <Send className="h-7 w-7 text-vert-neon" />
        </div>
        <h3 className="text-xl font-bold text-blanc-casse mb-2">
          Demande envoyee !
        </h3>
        <p className="text-blanc-casse/60">
          Nous reviendrons vers vous dans les plus brefs delais.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="rounded-2xl bg-gris-anthracite border border-white/5 p-6 lg:p-8 space-y-6"
    >
      <h3 className="text-xl font-bold text-blanc-casse mb-2">
        Demande de reparation
      </h3>

      {/* Brand & Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full">
          <label
            htmlFor="marque"
            className="mb-1.5 block text-sm font-medium text-blanc-casse/80"
          >
            Marque
          </label>
          <select
            id="marque"
            name="marque"
            value={form.marque}
            onChange={handleChange}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse transition-colors duration-200",
              "focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30",
              "hover:border-white/20"
            )}
          >
            <option value="">Selectionnez une marque</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
        <Input
          id="modele"
          name="modele"
          label="Modele"
          placeholder="Ex: Thunder 2"
          value={form.modele}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-blanc-casse/80"
        >
          Description de la panne
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Decrivez le probleme rencontre..."
          value={form.description}
          onChange={handleChange}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 transition-colors duration-200 resize-none",
            "focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30",
            "hover:border-white/20"
          )}
        />
      </div>

      {/* Urgency */}
      <div className="w-full">
        <label className="mb-2 block text-sm font-medium text-blanc-casse/80">
          Niveau d&apos;urgence
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {URGENCY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, urgence: level.value }))
              }
              className={cn(
                "rounded-xl border p-3 text-left transition-all duration-200",
                form.urgence === level.value
                  ? "border-vert-neon/50 bg-vert-neon/5"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <span className="text-sm font-medium text-blanc-casse">
                {level.label}
              </span>
              <p className="text-xs text-blanc-casse/50 mt-0.5">
                {level.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileUpload
          label="Photos"
          accept="image/jpeg,image/png,image/webp"
          type="image"
          maxFiles={5}
          onFilesChange={(files) => setImageFiles(files)}
        />
        <FileUpload
          label="Videos"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          type="video"
          maxFiles={2}
          onFilesChange={(files) => setVideoFiles(files)}
        />
      </div>

      {/* Contact Preference */}
      <div className="w-full">
        <label className="mb-2 block text-sm font-medium text-blanc-casse/80">
          Preference de contact
        </label>
        <div className="flex gap-4">
          {[
            { value: "telephone", label: "Telephone" },
            { value: "email", label: "Email" },
            { value: "site", label: "Site internet" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="preferenceContact"
                value={opt.value}
                checked={form.preferenceContact === opt.value}
                onChange={handleChange}
                className="w-4 h-4 accent-[#00ff88]"
              />
              <span className="text-sm text-blanc-casse/80">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="telephone"
          name="telephone"
          label="Telephone"
          type="tel"
          placeholder="06 12 34 56 78"
          value={form.telephone}
          onChange={handleChange}
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      {/* Location */}
      <Input
        id="localisation"
        name="localisation"
        label="Localisation"
        placeholder="Ville ou code postal"
        value={form.localisation}
        onChange={handleChange}
      />

      {/* Submit */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        <Send className="h-4 w-4 mr-2" />
        Envoyer la demande
      </Button>
    </motion.form>
  );
}
