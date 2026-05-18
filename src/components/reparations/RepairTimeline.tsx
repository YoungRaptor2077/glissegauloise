"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Search,
  Package,
  Wrench,
  FlaskConical,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  label: string;
  icon: React.ReactNode;
}

const steps: TimelineStep[] = [
  { label: "Demande recue", icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: "Diagnostic", icon: <Search className="h-5 w-5" /> },
  { label: "En attente piece", icon: <Package className="h-5 w-5" /> },
  { label: "Reparation en cours", icon: <Wrench className="h-5 w-5" /> },
  { label: "Tests", icon: <FlaskConical className="h-5 w-5" /> },
  { label: "Termine", icon: <CheckCircle2 className="h-5 w-5" /> },
  { label: "Pret a recuperer", icon: <MapPin className="h-5 w-5" /> },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function RepairTimeline() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-blanc-casse mb-4">
            Notre processus de reparation
          </h2>
          <p className="text-blanc-casse/60 max-w-2xl mx-auto">
            Suivez l&apos;avancement de votre reparation etape par etape
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden lg:flex items-start justify-between relative"
        >
          {/* Connecting line */}
          <div className="absolute top-8 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-vert-neon/20 via-vert-neon/40 to-vert-neon/20" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center relative z-10 w-32"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-3 border transition-colors",
                  "bg-gris-anthracite border-vert-neon/30 text-vert-neon"
                )}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium text-blanc-casse/80 leading-tight">
                {step.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:hidden flex flex-col gap-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-4 relative"
            >
              {/* Vertical connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-vert-neon/20" />
              )}
              <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-gris-anthracite border-vert-neon/30 text-vert-neon flex-shrink-0">
                {step.icon}
              </div>
              <span className="text-sm font-medium text-blanc-casse/80">
                {step.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
