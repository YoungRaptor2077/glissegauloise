"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const auto = searchParams.get("auto");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-login if coming from connexion page with admin email
  useEffect(() => {
    if (auto === "1") {
      doLogin("12512595");
    }
  }, [auto]);

  async function doLogin(pwd: string) {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Mot de passe incorrect");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doLogin(password);
  }

  // If auto-login is in progress, show loading
  if (auto === "1" && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir-mat">
        <div className="text-blanc-casse/60 animate-pulse">Connexion en cours...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-noir-mat px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-gris-anthracite p-8">
        <h1 className="text-center text-2xl font-bold text-blanc-casse">
          Administration GlisseGauloise
        </h1>
        <p className="mt-2 text-center text-sm text-blanc-casse/60">
          Entrez le mot de passe administrateur
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-lg border border-white/10 bg-noir-mat px-4 py-3 text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/50"
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-vert-neon px-4 py-3 font-semibold text-noir-mat transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Acceder au panel"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
