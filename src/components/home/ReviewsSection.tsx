"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? "s" : ""}`;
}

function getInitial(name: string | null): string {
  if (!name) return "A.";
  const first = name.trim().charAt(0).toUpperCase();
  return first + ".";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-vert-neon text-vert-neon"
              : "fill-none text-blanc-casse/20"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/admin/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(
              data.reviews
                .filter((r: { comment: string | null }) => r.comment && r.comment.trim().length > 0)
                .slice(0, 6)
                .map((r: { user_name: string | null; rating: number; comment: string; created_at: string }) => ({
                  name: getInitial(r.user_name),
                  rating: r.rating,
                  text: r.comment,
                  date: formatRelativeDate(r.created_at),
                }))
            );
          }
        }
      } catch {
        // No reviews available
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  return (
    <section className="bg-gris-anthracite/50 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Avis <span className="text-vert-neon">Clients</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            La satisfaction de nos clients est notre priorite.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-gris-anthracite" />
            ))
          ) : reviews.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-blanc-casse/50">Les avis de nos clients apparaitront ici bientot.</p>
            </div>
          ) : (
            reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-white/5 bg-gris-anthracite p-6"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-vert-neon/10" />
              <StarRating rating={review.rating} />
              <p className="mt-4 text-sm leading-relaxed text-blanc-casse/70">
                {review.text}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-blanc-casse">
                  {review.name}
                </span>
                <span className="text-xs text-blanc-casse/40">
                  {review.date}
                </span>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
