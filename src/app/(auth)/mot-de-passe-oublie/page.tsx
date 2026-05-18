"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(
      "Un email de reinitialisation a ete envoye. Verifiez votre boite de reception."
    );
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4 py-12">
      <AuthForm
        title="Mot de passe oublie"
        subtitle="Entrez votre email pour recevoir un lien de reinitialisation"
        onSubmit={handleSubmit}
        error={error}
        success={success}
      >
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Envoyer le lien
        </Button>
        <p className="mt-4 text-center text-sm text-blanc-casse/60">
          <Link
            href="/connexion"
            className="text-vert-neon hover:text-vert-neon/80 transition-colors"
          >
            Retour a la connexion
          </Link>
        </p>
      </AuthForm>
    </div>
  );
}
