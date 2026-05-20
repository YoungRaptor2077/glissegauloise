"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Star, TrendingUp } from "lucide-react";

interface LoyaltyData {
  points: number;
  pointsPerEuro: number;
  rewardThreshold: number;
  rewardPercent: number;
  progress: number;
  pointsUntilReward: number;
  hasReward: boolean;
}

export function LoyaltyCard() {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoyalty() {
      try {
        const res = await fetch("/api/loyalty");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {}
      setLoading(false);
    }
    fetchLoyalty();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="h-8 w-20 bg-white/10 rounded mb-4" />
        <div className="h-3 w-full bg-white/10 rounded" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-gris-anthracite to-noir-mat p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-vert-neon/10">
            <Gift size={18} className="text-vert-neon" />
          </div>
          <h3 className="text-sm font-semibold text-blanc-casse">Programme Fidelite</h3>
        </div>
        {data.hasReward && (
          <span className="px-3 py-1 rounded-full bg-vert-neon/10 text-xs font-medium text-vert-neon animate-pulse">
            Recompense disponible !
          </span>
        )}
      </div>

      {/* Points Display */}
      <div className="flex items-end gap-2 mb-4">
        <span className="text-3xl font-bold text-blanc-casse">{data.points}</span>
        <span className="text-sm text-blanc-casse/50 mb-1">points</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-blanc-casse/50 mb-1.5">
          <span>Progression</span>
          <span>{data.points}/{data.rewardThreshold}</span>
        </div>
        <div className="h-2.5 rounded-full bg-noir-mat overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-vert-neon/70 to-vert-neon"
          />
        </div>
      </div>

      {/* Info */}
      {data.hasReward ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-vert-neon/5 border border-vert-neon/20">
          <Star size={14} className="text-vert-neon shrink-0" />
          <p className="text-xs text-vert-neon">
            Vous avez droit a <strong>{data.rewardPercent}% de remise</strong> sur votre prochain achat !
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-blanc-casse/40 shrink-0" />
          <p className="text-xs text-blanc-casse/50">
            Encore <strong className="text-blanc-casse/70">{data.pointsUntilReward} points</strong> pour debloquer {data.rewardPercent}% de remise
          </p>
        </div>
      )}

      <p className="text-[10px] text-blanc-casse/30 mt-3">
        {data.pointsPerEuro} point par euro depense
      </p>
    </motion.div>
  );
}
