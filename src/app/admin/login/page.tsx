"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur inconnue");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Erreur de connexion au serveur");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blanc-casse">
            Administration
          </h1>
          <p className="mt-2 text-sm text-blanc-casse/60">
            Entrez le mot de passe administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-blanc-casse/80"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe administrateur"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-blanc-casse placeholder:text-blanc-casse/30 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat transition-all hover:bg-vert-neon/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
