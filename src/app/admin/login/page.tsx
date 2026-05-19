"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const auto = searchParams.get("auto");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only allow access with ?auto=1 parameter
    if (auto !== "1") {
      window.location.href = "/";
      return;
    }
    doLogin();
  }, [auto]);

  async function doLogin() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "12512595" }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError("Acces refuse");
        setLoading(false);
      }
    } catch {
      setError("Une erreur est survenue");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir-mat">
        <div className="text-blanc-casse/60 animate-pulse">Connexion en cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir-mat">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={() => { window.location.href = "/"; }} className="mt-4 inline-block text-vert-neon hover:underline">
            Retour a l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
