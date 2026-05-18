"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileUpload } from "./FileUpload";

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

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
        />
        <FileUpload
          label="Videos"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          type="video"
          maxFiles={2}
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
      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        <Send className="h-4 w-4 mr-2" />
        Envoyer la demande
      </Button>
    </motion.form>
  );
}
