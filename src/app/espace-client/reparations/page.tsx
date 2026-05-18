"use client";

import { motion } from "framer-motion";
import { Wrench, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "En attente", variant: "warning" },
  diagnosed: { label: "Diagnostiquee", variant: "neon" },
  in_progress: { label: "En cours", variant: "neon" },
  completed: { label: "Terminee", variant: "success" },
  cancelled: { label: "Annulee", variant: "error" },
};

const timelineSteps = ["pending", "diagnosed", "in_progress", "completed"];

const mockRepairs = [
  {
    id: "REP-2024-001",
    boardType: "Snowboard",
    brand: "Burton",
    description: "Semelle abimee, carres rouillees",
    status: "in_progress",
    date: "10/01/2024",
    estimatedCost: 75.0,
  },
  {
    id: "REP-2023-012",
    boardType: "Ski",
    brand: "Rossignol",
    description: "Fartage et affutage complet",
    status: "completed",
    date: "15/12/2023",
    estimatedCost: 45.0,
  },
];

function RepairTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = timelineSteps.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 mt-3">
      {timelineSteps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full ${
              index <= currentIndex ? "bg-vert-neon" : "bg-white/20"
            }`}
          />
          {index < timelineSteps.length - 1 && (
            <div
              className={`h-0.5 w-6 ${
                index < currentIndex ? "bg-vert-neon" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReparationsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">
          Mes reparations
        </h1>
        <p className="mt-1 text-blanc-casse/60">
          Suivez l&apos;avancement de vos reparations.
        </p>
      </motion.div>

      <div className="space-y-4">
        {mockRepairs.map((repair, index) => {
          const status = statusConfig[repair.status] || statusConfig.pending;
          return (
            <motion.div
              key={repair.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-5 bg-gris-anthracite border border-white/5 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-yellow-500/10">
                    <Wrench className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-blanc-casse">
                        {repair.id}
                      </p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-xs text-blanc-casse/50 mt-1">
                      {repair.boardType} {repair.brand} - {repair.date}
                    </p>
                    <p className="text-sm text-blanc-casse/70 mt-2">
                      {repair.description}
                    </p>
                    <RepairTimeline currentStatus={repair.status} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {repair.estimatedCost && (
                    <span className="text-sm font-semibold text-blanc-casse">
                      ~{repair.estimatedCost.toFixed(2)} EUR
                    </span>
                  )}
                  <button className="p-2 rounded-lg hover:bg-white/5 text-blanc-casse/60 hover:text-blanc-casse transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
