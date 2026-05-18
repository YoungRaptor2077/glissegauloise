"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/lib/hooks/useUser";

export default function ProfilPage() {
  const { profile } = useUser();
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess("Profil mis a jour avec succes");
    setSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Password change logic would go here
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">Mon profil</h1>
        <p className="mt-1 text-blanc-casse/60">
          Gerez vos informations personnelles.
        </p>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-6 bg-gris-anthracite border border-white/5 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-vert-neon/10">
            <User className="h-5 w-5 text-vert-neon" />
          </div>
          <h2 className="text-lg font-semibold text-blanc-casse">
            Informations personnelles
          </h2>
        </div>

        {success && (
          <div className="mb-4 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            id="fullName"
            name="fullName"
            label="Nom complet"
            placeholder="Jean Dupont"
            value={formData.fullName}
            onChange={handleChange}
          />
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
          <Input
            id="phone"
            name="phone"
            label="Telephone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            id="address"
            name="address"
            label="Adresse"
            placeholder="12 Rue de la Glisse, 75001 Paris"
            value={formData.address}
            onChange={handleChange}
          />
          <Button type="submit" isLoading={saving}>
            Enregistrer
          </Button>
        </form>
      </motion.div>

      {/* Password Change */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-6 bg-gris-anthracite border border-white/5 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-yellow-500/10">
            <Lock className="h-5 w-5 text-yellow-400" />
          </div>
          <h2 className="text-lg font-semibold text-blanc-casse">
            Changer le mot de passe
          </h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            id="currentPassword"
            name="currentPassword"
            label="Mot de passe actuel"
            type="password"
            placeholder="Votre mot de passe actuel"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <Input
            id="newPassword"
            name="newPassword"
            label="Nouveau mot de passe"
            type="password"
            placeholder="Nouveau mot de passe"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="Confirmez le mot de passe"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
          <Button type="submit" variant="secondary">
            Changer le mot de passe
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
