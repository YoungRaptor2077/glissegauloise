"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import type { Repair } from "@/types/database";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  received: { label: "Recu", variant: "warning" },
  diagnostic: { label: "Diagnostic", variant: "neon" },
  waiting_parts: { label: "En attente pieces", variant: "warning" },
  in_progress: { label: "En cours", variant: "neon" },
  testing: { label: "En test", variant: "neon" },
  completed: { label: "Terminee", variant: "success" },
  ready_pickup: { label: "Pret a recuperer", variant: "success" },
};

const timelineSteps = ["received", "diagnostic", "waiting_parts", "in_progress", "testing", "completed", "ready_pickup"];

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ReparationsPage() {
  const { user, loading: userLoading } = useUser();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepairs() {
      if (!user) return;
      const supabase = createClient();
      const { data } = (await supabase
        .from("repairs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })) as { data: Repair[] | null };

      if (data) {
        setRepairs(data);
      }
      setLoading(false);
    }

    if (!userLoading && user) {
      fetchRepairs();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-vert-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {repairs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Wrench className="h-12 w-12 text-blanc-casse/20 mx-auto mb-4" />
          <p className="text-blanc-casse/50">Aucune reparation pour le moment</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {repairs.map((repair, index) => {
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
                          {repair.id.slice(0, 8).toUpperCase()}
                        </p>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-xs text-blanc-casse/50 mt-1">
                        {repair.brand}
                        {repair.model ? ` ${repair.model}` : ""} -{" "}
                        {formatDate(repair.created_at)}
                      </p>
                      <p className="text-sm text-blanc-casse/70 mt-2">
                        {repair.issue_description}
                      </p>
                      {repair.status !== "completed" && repair.status !== "ready_pickup" && (
                        <RepairTimeline currentStatus={repair.status} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {repair.estimated_cost && (
                      <span className="text-sm font-semibold text-blanc-casse">
                        ~{repair.estimated_cost.toFixed(2)} EUR
                      </span>
                    )}
                    <Link
                      href="/espace-client/messages"
                      className="p-2 rounded-lg hover:bg-white/5 text-blanc-casse/60 hover:text-blanc-casse transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
