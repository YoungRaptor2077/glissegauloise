"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, Share2 } from "lucide-react";

export function ReferralCard() {
  const [data, setData] = useState<{ code: string; referralCount: number; link: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferral() {
      try {
        const res = await fetch("/api/referral");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {}
      setLoading(false);
    }
    fetchReferral();
  }, []);

  function copyLink() {
    if (data?.link) {
      navigator.clipboard.writeText(data.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function share() {
    if (data?.link && navigator.share) {
      navigator.share({
        title: "GlisseGauloisse - Parrainage",
        text: "Inscris-toi avec mon lien et recois 10 points de fidelite !",
        url: data.link,
      });
    } else {
      copyLink();
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="h-8 w-full bg-white/10 rounded" />
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
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Users size={18} className="text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-blanc-casse">Parrainage</h3>
        {data.referralCount > 0 && (
          <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/10 text-xs font-medium text-blue-400">
            {data.referralCount} filleul{data.referralCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <p className="text-xs text-blanc-casse/50 mb-3">
        Partagez votre lien. Votre ami recoit <strong className="text-blanc-casse/70">10 points</strong>, vous recevez <strong className="text-blanc-casse/70">30 points</strong>.
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-white/10 bg-noir-mat px-3 py-2 text-xs text-blanc-casse/70 truncate font-mono">
          {data.code}
        </div>
        <button
          onClick={copyLink}
          className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          title="Copier le lien"
        >
          {copied ? <Check size={16} className="text-vert-neon" /> : <Copy size={16} className="text-blanc-casse/60" />}
        </button>
        <button
          onClick={share}
          className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          title="Partager"
        >
          <Share2 size={16} className="text-blue-400" />
        </button>
      </div>

      {copied && (
        <p className="text-xs text-vert-neon mt-2">Lien copie !</p>
      )}
    </motion.div>
  );
}
