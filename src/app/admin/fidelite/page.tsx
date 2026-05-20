"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Save } from "lucide-react";

export default function AdminFidelitePage() {
  const [pointsPerEuro, setPointsPerEuro] = useState(1);
  const [rewardThreshold, setRewardThreshold] = useState(100);
  const [rewardPercent, setRewardPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/loyalty");
        if (res.ok) {
          const data = await res.json();
          setPointsPerEuro(data.points_per_euro);
          setRewardThreshold(data.reward_threshold);
          setRewardPercent(data.reward_percent);
        }
      } catch {
        // Use defaults
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/loyalty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points_per_euro: pointsPerEuro,
          reward_threshold: rewardThreshold,
          reward_percent: rewardPercent,
        }),
      });
      if (res.ok) {
        setFeedback({ type: "success", message: "Parametres sauvegardes avec succes" });
      } else {
        setFeedback({ type: "error", message: "Erreur lors de la sauvegarde" });
      }
    } catch {
      setFeedback({ type: "error", message: "Erreur de connexion" });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Programme de Fidelite</h1>
          <p className="text-sm text-blanc-casse/60">Gerez les parametres du programme de fidelite</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Programme de Fidelite</h1>
        <p className="text-sm text-blanc-casse/60">Gerez les parametres du programme de fidelite</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 space-y-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vert-neon/10">
            <Gift className="h-5 w-5 text-vert-neon" />
          </div>
          <h2 className="text-lg font-semibold text-blanc-casse">Parametres</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-2">
              Points par euro depense
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={pointsPerEuro}
              onChange={(e) => setPointsPerEuro(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-2">
              Seuil de recompense en points
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={rewardThreshold}
              onChange={(e) => setRewardThreshold(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blanc-casse/70 mb-2">
              Pourcentage de remise (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={rewardPercent}
              onChange={(e) => setRewardPercent(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
            />
          </div>
        </div>

        {feedback && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-vert-neon/20 bg-vert-neon/10 text-vert-neon"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-vert-neon px-6 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </motion.div>
    </div>
  );
}
