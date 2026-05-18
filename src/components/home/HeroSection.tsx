"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ShoppingBag } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-noir-mat via-gris-anthracite to-noir-mat" />

      {/* Animated neon circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-vert-neon/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-vert-neon/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Circuit pattern decorative lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div
          className="absolute top-20 left-10 h-px w-40 bg-gradient-to-r from-transparent via-vert-neon to-transparent"
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 h-px w-60 bg-gradient-to-r from-transparent via-vert-neon to-transparent"
          animate={{ x: [0, -80, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 h-px w-48 bg-gradient-to-r from-transparent via-vert-neon to-transparent"
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-vert-neon/30 bg-vert-neon/10 px-4 py-2 text-sm text-vert-neon"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Zap className="h-4 w-4" />
            Atelier specialise a Eaubonne (95)
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Expert en{" "}
            <span className="text-vert-neon neon-text">
              Trottinettes Electriques
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-blanc-casse/70 sm:text-xl">
            Reparation, diagnostic et entretien de trottinettes electriques.
            Un service professionnel et rapide pour toutes les marques.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/reparations"
                className="inline-flex items-center gap-2 rounded-xl bg-vert-neon px-7 py-3.5 text-base font-semibold text-noir-mat shadow-lg shadow-vert-neon/20 transition-colors hover:bg-vert-neon-dark"
              >
                <Zap className="h-5 w-5" />
                Demander un devis
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 rounded-xl border border-vert-neon/30 px-7 py-3.5 text-base font-semibold text-vert-neon transition-colors hover:border-vert-neon/60 hover:bg-vert-neon/10"
              >
                <ShoppingBag className="h-5 w-5" />
                Decouvrir la boutique
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir-mat to-transparent" />
    </section>
  );
}
