"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = ["gdrmathis15@gmail.com", "vanderieviere76@gmail.com"];

function ConnexionForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
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

    // If admin email, go to admin login with auto-submit
    if (ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      window.location.href = "/admin/login?auto=1";
      return;
    }

    // Normal user -> espace client
    window.location.href = redirect || "/espace-client";
  }

  return (
    <AuthForm
      title="Connexion"
      subtitle="Accedez a votre espace client"
      onSubmit={handleSubmit}
      error={error}
    >
      {/* Google Sign In */}
      <button
        type="button"
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: "https://glissegauloise.vercel.app/espace-client",
            },
          });
        }}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
          <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continuer avec Google
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gris-anthracite px-3 text-blanc-casse/40">ou</span>
        </div>
      </div>

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
  );
}

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4 py-12">
      <Suspense>
        <ConnexionForm />
      </Suspense>
    </div>
  );
}
