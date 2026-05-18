"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/espace-client");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4 py-12">
      <AuthForm
        title="Creer un compte"
        subtitle="Rejoignez GlisseGauloisse"
        onSubmit={handleSubmit}
        error={error}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="firstName"
            name="firstName"
            label="Prenom"
            placeholder="Prenom"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            id="lastName"
            name="lastName"
            label="Nom"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={handleChange}
          required
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
          id="password"
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="Minimum 6 caracteres"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Confirmez votre mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Creer mon compte
        </Button>
        <p className="mt-4 text-center text-sm text-blanc-casse/60">
          Deja un compte ?{" "}
          <Link
            href="/connexion"
            className="text-vert-neon hover:text-vert-neon/80 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </AuthForm>
    </div>
  );
}
