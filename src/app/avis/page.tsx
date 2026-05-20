"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";
import Link from "next/link";

const CRITERIA = [
  { id: "quality", label: "Qualite du travail" },
  { id: "speed", label: "Rapidite d'intervention" },
  { id: "communication", label: "Communication" },
  { id: "price", label: "Rapport qualite/prix" },
];

export default function AvisPage() {
  const searchParams = useSearchParams();
  const repairId = searchParams.get("repair_id");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const globalRating = CRITERIA.length > 0
    ? Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Math.max(Object.values(ratings).length, 1))
    : 0;

  const allRated = CRITERIA.every(c => ratings[c.id] > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allRated) return;
    setSending(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: globalRating,
          comment,
          criteria: ratings,
          recommend,
          repair_id: repairId,
        }),
      });
    } catch {
      // Still show success
    }

    setSubmitted(true);
    setSending(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl"
          >
            🎉
          </motion.div>
          <h1 className="text-2xl font-bold text-blanc-casse">Merci pour votre avis !</h1>
          <p className="text-blanc-casse/60">
            Votre retour nous aide a nous ameliorer au quotidien.
          </p>
          
          <div className="flex justify-center gap-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={24} className={s <= globalRating ? "fill-yellow-400 text-yellow-400" : "text-white/20"} />
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <a
              href="https://www.google.com/maps/search/GlisseGauloisse+49+Route+de+Margency+Eaubonne"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity"
            >
              Laisser un avis sur Google ⭐
            </a>
            <p className="text-xs text-blanc-casse/40">
              Un avis Google nous aide enormement a etre visible localement
            </p>
            <Link
              href="/espace-client/reparations"
              className="block w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-blanc-casse/80 hover:bg-gris-anthracite transition-colors text-center"
            >
              Retour a mes reparations
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir-mat px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 sm:p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blanc-casse">Evaluez votre experience</h1>
            <p className="mt-2 text-sm text-blanc-casse/60">
              Chez GlisseGauloisse, votre satisfaction est notre priorite
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Criteria ratings */}
            <div className="space-y-5">
              {CRITERIA.map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <label className="text-sm font-medium text-blanc-casse/80">
                    {criterion.label}
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatings(prev => ({ ...prev, [criterion.id]: star }))}
                        onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [criterion.id]: star }))}
                        onMouseLeave={() => setHoveredStars(prev => ({ ...prev, [criterion.id]: 0 }))}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={
                            star <= (hoveredStars[criterion.id] || ratings[criterion.id] || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/15"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommend */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blanc-casse/80">
                Recommanderiez-vous GlisseGauloisse ?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRecommend(true)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                    recommend === true
                      ? "border-vert-neon/50 bg-vert-neon/10 text-vert-neon"
                      : "border-white/10 text-blanc-casse/60 hover:border-white/20"
                  }`}
                >
                  <ThumbsUp size={16} /> Oui
                </button>
                <button
                  type="button"
                  onClick={() => setRecommend(false)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                    recommend === false
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-white/10 text-blanc-casse/60 hover:border-white/20"
                  }`}
                >
                  <ThumbsUp size={16} className="rotate-180" /> Non
                </button>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-blanc-casse/80">
                Un commentaire ? (optionnel)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre experience en quelques mots..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none resize-none"
              />
            </div>

            {/* Global score preview */}
            {allRated && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 rounded-xl bg-noir-mat/50 border border-white/5"
              >
                <p className="text-xs text-blanc-casse/50 mb-1">Note globale</p>
                <div className="flex justify-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={20} className={s <= globalRating ? "fill-yellow-400 text-yellow-400" : "text-white/20"} />
                  ))}
                </div>
                <p className="text-lg font-bold text-blanc-casse mt-1">{globalRating}/5</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={!allRated || sending}
              className="w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {sending ? "Envoi en cours..." : "Envoyer mon evaluation"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
