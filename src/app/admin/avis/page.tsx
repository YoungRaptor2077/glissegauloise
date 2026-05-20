"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, Users } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
  repair_brand: string | null;
  repair_model: string | null;
  repair_id: string | null;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  withComments: number;
}

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/admin/reviews");
        if (!res.ok) return;
        const data = await res.json();
        setReviews(data.reviews || []);
        setStats(data.stats || null);
      } catch {}
      setLoading(false);
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-vert-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Avis clients</h1>
        <p className="mt-1 text-sm text-blanc-casse/60">
          Toutes les notes et retours de vos clients
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Star size={18} className="text-yellow-400" />
              </div>
              <span className="text-xs text-blanc-casse/50">Note moyenne</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-blanc-casse">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-blanc-casse/40 mb-1">/5</span>
            </div>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={
                    s <= Math.round(stats.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/20"
                  }
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-vert-neon/10">
                <Users size={18} className="text-vert-neon" />
              </div>
              <span className="text-xs text-blanc-casse/50">Total avis</span>
            </div>
            <span className="text-3xl font-bold text-blanc-casse">{stats.totalReviews}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageSquare size={18} className="text-blue-400" />
              </div>
              <span className="text-xs text-blanc-casse/50">Avec commentaire</span>
            </div>
            <span className="text-3xl font-bold text-blanc-casse">{stats.withComments}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ThumbsUp size={18} className="text-green-400" />
              </div>
              <span className="text-xs text-blanc-casse/50">Satisfaction</span>
            </div>
            <span className="text-3xl font-bold text-blanc-casse">
              {stats.totalReviews > 0
                ? Math.round(((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalReviews * 100)
                : 0}%
            </span>
            <p className="text-xs text-blanc-casse/40 mt-1">4+ etoiles</p>
          </motion.div>
        </div>
      )}

      {/* Rating Distribution Bar */}
      {stats && stats.totalReviews > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-gris-anthracite p-6"
        >
          <h2 className="text-sm font-medium text-blanc-casse/80 mb-4">Repartition des notes</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star] || 0;
              const percent = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-blanc-casse/70">{star}</span>
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-noir-mat overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-blanc-casse/50 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-blanc-casse/80">Tous les avis ({reviews.length})</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/5 bg-gris-anthracite">
            <Star className="h-12 w-12 text-blanc-casse/20 mx-auto mb-4" />
            <p className="text-blanc-casse/50">Aucun avis pour le moment</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="rounded-2xl border border-white/5 bg-gris-anthracite p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/15"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-blanc-casse">{review.rating}/5</span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-sm text-blanc-casse/70 italic mb-3">
                      &quot;{review.comment}&quot;
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blanc-casse/40">
                    <span>{review.user_name || review.user_email || "Client anonyme"}</span>
                    {review.repair_brand && (
                      <span className="px-2 py-0.5 rounded-full bg-white/5">
                        {review.repair_brand} {review.repair_model || ""}
                      </span>
                    )}
                    <span>{new Date(review.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
