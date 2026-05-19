"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Use server-side API to check role (bypasses RLS)
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.role === "admin" || data.role === "super_admin") {
        window.location.href = "/admin";
        return;
      }
    } catch {
      // If role check fails, default to espace-client
    }

    window.location.href = "/espace-client";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4 py-12">
      <AuthForm
        title="Connexion"
        subtitle="Accedez a votre espace client"
        onSubmit={handleSubmit}
        error={error}
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
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Se connecter
        </Button>
        <div className="mt-4 flex flex-col items-center gap-2 text-sm">
          <Link
            href="/mot-de-passe-oublie"
            className="text-vert-neon hover:text-vert-neon/80 transition-colors"
          >
            Mot de passe oublie ?
          </Link>
          <p className="text-blanc-casse/60">
            Pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="text-vert-neon hover:text-vert-neon/80 transition-colors"
            >
              Creer un compte
            </Link>
          </p>
        </div>
      </AuthForm>
    </div>
  );
}
