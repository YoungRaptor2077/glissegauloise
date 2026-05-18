"use client";

import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Clock } from "lucide-react";
import { RepairTimeline } from "@/components/reparations/RepairTimeline";
import { RepairForm } from "@/components/reparations/RepairForm";

export default function ReparationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-vert-neon/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vert-neon/10 border border-vert-neon/20 mb-6">
              <Wrench className="h-4 w-4 text-vert-neon" />
              <span className="text-sm text-vert-neon font-medium">
                Service Apres-Vente
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-blanc-casse mb-6">
              Reparation de votre{" "}
              <span className="text-vert-neon">trottinette electrique</span>
            </h1>
            <p className="text-lg text-blanc-casse/60 mb-8">
              Notre equipe de techniciens specialises prend en charge la
              reparation de toutes les marques. Diagnostic rapide, pieces
              d&apos;origine et garantie sur nos interventions.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-blanc-casse/70">
                <ShieldCheck className="h-5 w-5 text-vert-neon" />
                <span className="text-sm">Garantie interventions</span>
              </div>
              <div className="flex items-center gap-2 text-blanc-casse/70">
                <Clock className="h-5 w-5 text-vert-neon" />
                <span className="text-sm">Delai rapide</span>
              </div>
              <div className="flex items-center gap-2 text-blanc-casse/70">
                <Wrench className="h-5 w-5 text-vert-neon" />
                <span className="text-sm">Toutes marques</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <RepairTimeline />

      {/* Repair Form */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RepairForm />
        </div>
      </section>
    </div>
  );
}
