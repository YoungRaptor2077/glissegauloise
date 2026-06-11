"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";

export default function ProfilPage() {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address, city, postal_code")
        .eq("id", user.id)
        .single() as { data: { full_name: string | null; phone: string | null; address: string | null; city: string | null; postal_code: string | null } | null };

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postal_code: data.postal_code || "",
        });
      }
      setLoading(false);
    }

    if (!userLoading && user) {
      fetchProfile();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setFeedback(null);

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
      })
      .eq("id", user.id);

    if (error) {
      setFeedback({ type: "error", message: "Erreur lors de la sauvegarde" });
    } else {
      setFeedback({ type: "success", message: "Profil mis a jour avec succes" });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await fetch("/api/admin/auth/logout", { method: "POST" });
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-vert-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">Mon profil</h1>
        <p className="mt-1 text-blanc-casse/60">Gerez vos informations personnelles</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-vert-neon/10">
            <User size={18} className="text-vert-neon" />
          </div>
          <h2 className="text-lg font-semibold text-blanc-casse">Informations</h2>
        </div>

        <div>
          <p className="text-xs text-blanc-casse/40 mb-4">Email : {user?.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-blanc-casse/70 mb-1.5">
            Nom d&apos;affichage (pseudo ou prenom)
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Ex: Mathis, MathGDR, etc."
            className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blanc-casse/70 mb-1.5">
            Telephone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
            className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blanc-casse/70 mb-1.5">
            Adresse
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="12 Rue de la Paix"
            className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-1.5">
              Ville
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Eaubonne"
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-1.5">
              Code postal
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="95600"
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>
        </div>

        {feedback && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-vert-neon/20 bg-vert-neon/10 text-vert-neon"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}>
            {feedback.message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-vert-neon px-6 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </motion.form>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-red-500/30 px-6 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Se deconnecter
        </button>
      </motion.div>
    </div>
  );
}
