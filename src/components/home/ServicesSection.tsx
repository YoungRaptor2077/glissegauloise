"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Wrench,
  Search,
  Settings,
  AlertTriangle,
  Palette,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Wrench,
    title: "Reparation",
    description:
      "Reparation complete de votre trottinette electrique, toutes marques et tous modeles.",
  },
  {
    icon: Search,
    title: "Diagnostic",
    description:
      "Diagnostic electronique approfondi pour identifier rapidement les pannes.",
  },
  {
    icon: Settings,
    title: "Entretien",
    description:
      "Entretien preventif pour prolonger la duree de vie de votre trottinette.",
  },
  {
    icon: AlertTriangle,
    title: "Depannage",
    description:
      "Service de depannage rapide pour vous remettre en route au plus vite.",
  },
  {
    icon: Palette,
    title: "Personnalisation",
    description:
      "Customisation et amelioration des performances de votre engin.",
  },
  {
    icon: Package,
    title: "Vente pieces",
    description:
      "Large stock de pieces detachees compatibles, livraison rapide.",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Nos <span className="text-vert-neon">Services</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            Un accompagnement complet pour votre trottinette electrique,
            de la reparation a la personnalisation.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative rounded-2xl border border-white/5 bg-gris-anthracite p-6 transition-all duration-300",
                "hover:border-vert-neon/30 hover:shadow-lg hover:shadow-vert-neon/5"
              )}
            >
              <div className="mb-4 inline-flex rounded-xl bg-vert-neon/10 p-3 text-vert-neon transition-colors group-hover:bg-vert-neon/20">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-blanc-casse">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-blanc-casse/60">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
