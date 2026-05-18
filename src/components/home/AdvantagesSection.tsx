"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Award,
  Building2,
  ShieldCheck,
  Cpu,
  Headphones,
  Clock,
} from "lucide-react";

const advantages = [
  {
    icon: Award,
    title: "Expertise technique",
    description:
      "Techniciens formes et experimentes sur toutes les marques de trottinettes.",
  },
  {
    icon: Building2,
    title: "Atelier specialise",
    description:
      "Atelier equipe d'outils professionnels dedies a la micromobilite.",
  },
  {
    icon: ShieldCheck,
    title: "Pieces de qualite",
    description:
      "Uniquement des pieces detachees de qualite pour des reparations durables.",
  },
  {
    icon: Cpu,
    title: "Diagnostic precis",
    description:
      "Outils de diagnostic electronique pour identifier les pannes avec precision.",
  },
  {
    icon: Headphones,
    title: "SAV reactif",
    description:
      "Un service apres-vente reactif et a l'ecoute de vos besoins.",
  },
  {
    icon: Clock,
    title: "Reponse rapide",
    description:
      "Delai d'intervention court et reparations effectuees rapidement.",
  },
];

export function AdvantagesSection() {
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
            Pourquoi <span className="text-vert-neon">nous choisir</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            Des avantages concrets pour un service de qualite professionnelle.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 rounded-lg bg-vert-neon/10 p-2.5 text-vert-neon">
                <advantage.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-blanc-casse">
                  {advantage.title}
                </h3>
                <p className="text-sm leading-relaxed text-blanc-casse/60">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
