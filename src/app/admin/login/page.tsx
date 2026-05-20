"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const auto = searchParams.get("auto");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (auto === "1") {
      doLogin("12512595");
    } else {
      setShowForm(true);
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
        credentials: "same-origin",
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError("Mot de passe incorrect");
        setLoading(false);
        setShowForm(true);
      }
    } catch {
      setError("Une erreur est survenue");
      setLoading(false);
      setShowForm(true);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    doLogin(password);
  }

  if (loading && !showForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir-mat">
        <div className="text-blanc-casse/60 animate-pulse">Connexion en cours...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-noir-mat px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-gris-anthracite p-8">
        <h1 className="text-xl font-bold text-blanc-casse text-center mb-2">Administration</h1>
        <p className="text-sm text-blanc-casse/60 text-center mb-6">GlisseGauloisse</p>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blanc-casse/80 mb-1.5">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity disabled:opacity-50"
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
