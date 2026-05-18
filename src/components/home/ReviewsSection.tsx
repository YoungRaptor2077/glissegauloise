"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Thomas D.",
    rating: 5,
    text: "Reparation impeccable de ma Dualtron Thunder. Le diagnostic etait precis et la reparation rapide. Je recommande vivement !",
    date: "Il y a 2 semaines",
  },
  {
    name: "Sophie M.",
    rating: 5,
    text: "Excellent service ! Ma Xiaomi Pro 2 avait un probleme de batterie, repare en 24h. Tres professionnel.",
    date: "Il y a 1 mois",
  },
  {
    name: "Lucas R.",
    rating: 5,
    text: "Atelier tres bien equipe. Changement de pneus et plaquettes de frein en moins d'une heure. Prix tres corrects.",
    date: "Il y a 3 semaines",
  },
  {
    name: "Marie L.",
    rating: 4,
    text: "Bon accueil et conseils pertinents. Ma Kaabo Mantis est comme neuve apres l'entretien complet.",
    date: "Il y a 2 mois",
  },
  {
    name: "Antoine B.",
    rating: 5,
    text: "Depannage rapide pour mon Vsett 10+. Probleme de controleur identifie et remplace le jour meme. Top !",
    date: "Il y a 1 semaine",
  },
  {
    name: "Camille P.",
    rating: 5,
    text: "Service au top, pieces de qualite et travail soigne. Mon Nami Burn-E roule mieux qu'au premier jour.",
    date: "Il y a 1 mois",
  },
];

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
          {reviews.map((review, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
