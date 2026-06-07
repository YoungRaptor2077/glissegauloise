"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, MessageSquare, Inbox, Search, Package, FlaskConical, CheckCircle2, Hand, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import type { Repair } from "@/types/database";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  received: { label: "Recu", variant: "warning" },
  diagnostic: { label: "Diagnostic", variant: "neon" },
  awaiting_decision: { label: "En attente de decision", variant: "warning" },
  waiting_parts: { label: "En attente pieces", variant: "warning" },
  in_progress: { label: "En cours", variant: "neon" },
  testing: { label: "En test", variant: "neon" },
  completed: { label: "Terminee", variant: "success" },
  ready_pickup: { label: "Pret a recuperer", variant: "success" },
  closed: { label: "Terminee", variant: "default" },
};

const timelineSteps = ["received", "diagnostic", "awaiting_decision", "waiting_parts", "in_progress", "testing", "completed", "ready_pickup"];

const timelineIcons: Record<string, React.ReactNode> = {
  received: <Inbox size={10} />,
  diagnostic: <Search size={10} />,
  awaiting_decision: <Clock size={10} />,
  waiting_parts: <Package size={10} />,
  in_progress: <Wrench size={10} />,
  testing: <FlaskConical size={10} />,
  completed: <CheckCircle2 size={10} />,
  ready_pickup: <Hand size={10} />,
};

function RepairTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = timelineSteps.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 mt-3">
      {timelineSteps.map((step, index) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            className={`flex items-center justify-center h-6 w-6 rounded-full transition-all duration-500 ${
              index <= currentIndex
                ? "bg-vert-neon/20 text-vert-neon ring-2 ring-vert-neon/30"
                : "bg-white/10 text-white/30"
            } ${index === currentIndex ? "ring-2 ring-vert-neon animate-pulse" : ""}`}
            title={statusConfig[step]?.label || step}
          >
            {timelineIcons[step]}
          </motion.div>
          {index < timelineSteps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
              className={`h-0.5 w-5 origin-left ${
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
                className={`p-5 border rounded-2xl transition-all ${
                  repair.status === "closed"
                    ? "bg-gris-anthracite/30 border-white/5 opacity-50"
                    : repair.status === "ready_pickup"
                    ? "bg-gris-anthracite/50 border-white/5 opacity-70"
                    : "bg-gris-anthracite border-white/5"
                }`}
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
                      {repair.status === "closed" ? (
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-400">Reparation terminee et notee</span>
                        </div>
                      ) : repair.status === "ready_pickup" ? (
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 size={14} className="text-green-400" />
                          <span className="text-xs font-medium text-green-400">Reparation terminee - Pret a recuperer</span>
                        </div>
                      ) : (
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
                    {(repair.status === "completed" || repair.status === "ready_pickup" || repair.status === "closed") && (
                      <Link
                        href={`/avis?repair_id=${repair.id}`}
                        className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                      >
                        ⭐ Donner votre avis
                      </Link>
                    )}
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
