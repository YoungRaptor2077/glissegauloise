"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Circle,
  Cpu,
  Gauge,
  Monitor,
  Battery,
  Cable,
  Disc3,
  Grip,
  Hand,
  Zap,
  Wrench,
  Lightbulb,
  Cog,
  SlidersHorizontal,
  Package,
  ShieldCheck,
  Layers,
} from "lucide-react";

const categories = [
  { name: "Pneus & chambres a air", icon: Circle, slug: "pneus-chambres" },
  { name: "Pneus tubeless", icon: Disc3, slug: "pneus-tubeless" },
  { name: "Pneus pleins", icon: ShieldCheck, slug: "pneus-pleins" },
  { name: "Electronique", icon: Cpu, slug: "electronique" },
  { name: "Controleurs", icon: SlidersHorizontal, slug: "controleurs" },
  { name: "Afficheurs", icon: Monitor, slug: "afficheurs" },
  { name: "BMS", icon: Battery, slug: "bms" },
  { name: "Cablage", icon: Cable, slug: "cablage" },
  { name: "Freinage", icon: Gauge, slug: "freinage" },
  { name: "Plaquettes", icon: Layers, slug: "plaquettes" },
  { name: "Disques", icon: Disc3, slug: "disques" },
  { name: "Leviers", icon: Hand, slug: "leviers" },
  { name: "Batteries", icon: Zap, slug: "batteries" },
  { name: "Suspensions", icon: Cog, slug: "suspensions" },
  { name: "Accessoires", icon: Package, slug: "accessoires" },
  { name: "Eclairage", icon: Lightbulb, slug: "eclairage" },
  { name: "Outillage", icon: Wrench, slug: "outillage" },
  { name: "Grip", icon: Grip, slug: "grip" },
];

export function CategoriesSection() {
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
            Nos <span className="text-vert-neon">Categories</span>
          </h2>
          <p className="mx-auto max-w-2xl text-blanc-casse/60">
            Trouvez les pieces detachees dont vous avez besoin pour votre
            trottinette electrique.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/boutique?categorie=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-gris-anthracite p-4 text-center transition-all duration-300 hover:border-vert-neon/30 hover:bg-gris-anthracite-light hover:shadow-lg hover:shadow-vert-neon/5"
              >
                <div className="rounded-lg bg-vert-neon/10 p-2.5 text-vert-neon transition-colors group-hover:bg-vert-neon/20">
                  <category.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-blanc-casse/80 group-hover:text-blanc-casse">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
