"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const SUBJECTS = [
  "Question generale",
  "Demande de devis",
  "Service apres-vente",
  "Partenariat",
  "Autre",
];

interface FormState {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
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
          <CheckCircle2 className="h-7 w-7 text-vert-neon" />
        </div>
        <h3 className="text-xl font-bold text-blanc-casse mb-2">
          Message envoye !
        </h3>
        <p className="text-blanc-casse/60">
          Nous vous repondrons dans les plus brefs delais.
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
      className="rounded-2xl bg-gris-anthracite border border-white/5 p-6 lg:p-8 space-y-5"
    >
      <h3 className="text-xl font-bold text-blanc-casse mb-2">
        Envoyez-nous un message
      </h3>

      <Input
        id="nom"
        name="nom"
        label="Nom"
        placeholder="Votre nom"
        value={form.nom}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="contact-email"
          name="email"
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          id="contact-telephone"
          name="telephone"
          label="Telephone"
          type="tel"
          placeholder="06 12 34 56 78"
          value={form.telephone}
          onChange={handleChange}
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="sujet"
          className="mb-1.5 block text-sm font-medium text-blanc-casse/80"
        >
          Sujet
        </label>
        <select
          id="sujet"
          name="sujet"
          value={form.sujet}
          onChange={handleChange}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse transition-colors duration-200",
            "focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30",
            "hover:border-white/20"
          )}
        >
          <option value="">Selectionnez un sujet</option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-blanc-casse/80"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Votre message..."
          value={form.message}
          onChange={handleChange}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 transition-colors duration-200 resize-none",
            "focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30",
            "hover:border-white/20"
          )}
        />
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        <Send className="h-4 w-4 mr-2" />
        Envoyer le message
      </Button>
    </motion.form>
  );
}
