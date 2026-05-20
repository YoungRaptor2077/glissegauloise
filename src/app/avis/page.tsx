"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";

export default function AvisPage() {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSending(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
    } catch {
      // Still show success even if API fails
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
          <div className="text-6xl">🎉</div>
          <h1 className="text-2xl font-bold text-blanc-casse">Merci pour votre avis !</h1>
          <p className="text-blanc-casse/60">
            Votre retour nous aide a nous ameliorer.
          </p>

          <div className="pt-4 space-y-3">
            <a
              href="https://www.google.com/maps/search/GlisseGauloisse+49+Route+de+Margency+Eaubonne"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity"
            >
              Laisser un avis sur Google ⭐
            </a>
            <Link
              href="/espace-client"
              className="block w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-blanc-casse/80 hover:bg-gris-anthracite transition-colors text-center"
            >
              Retour a mon espace
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
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blanc-casse">Votre avis compte</h1>
            <p className="mt-2 text-sm text-blanc-casse/60">
              Comment s&apos;est passee votre experience chez GlisseGauloisse ?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      star <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/20"
                    }
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-sm text-blanc-casse/60">
                {rating === 5 && "Excellent !"}
                {rating === 4 && "Tres bien !"}
                {rating === 3 && "Correct"}
                {rating === 2 && "Peut mieux faire"}
                {rating === 1 && "Decevant"}
              </p>
            )}

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Dites-nous en plus sur votre experience (optionnel)"
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-3 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none resize-none"
            />

            <button
              type="submit"
              disabled={rating === 0 || sending}
              className="w-full rounded-xl bg-vert-neon px-4 py-3 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {sending ? "Envoi..." : "Envoyer mon avis"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
