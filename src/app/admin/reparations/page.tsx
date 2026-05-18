"use client";

import { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Repair, Profile } from "@/types/database";

type RepairStatus = "all" | "pending" | "diagnosed" | "in_progress" | "completed" | "cancelled";

interface RepairRow {
  id: string;
  rawId: string;
  client: string;
  board: string;
  brand: string;
  status: string;
  date: string;
  estimatedCost: number | null;
  description: string;
  diagnosis: string | null;
  [key: string]: unknown;
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  diagnosed: "Diagnostic",
  in_progress: "En cours",
  completed: "Termine",
  cancelled: "Annule",
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  diagnosed: "bg-orange-500/10 text-orange-400",
  in_progress: "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const statusOrder = ["pending", "diagnosed", "in_progress", "completed", "cancelled"];

const tabs: { key: RepairStatus; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "diagnosed", label: "Diagnostic" },
  { key: "in_progress", label: "En cours" },
  { key: "completed", label: "Terminees" },
  { key: "cancelled", label: "Annulees" },
];

export default function ReparationsPage() {
  const [activeTab, setActiveTab] = useState<RepairStatus>("all");
  const [repairs, setRepairs] = useState<RepairRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairRow | null>(null);

  useEffect(() => {
    async function fetchRepairs() {
      const supabase = createClient();
      const { data } = await supabase
        .from("repairs")
        .select("*")
        .order("created_at", { ascending: false }) as { data: Repair[] | null };

      if (data) {
        const userIds = [...new Set(data.map((r) => r.user_id).filter(Boolean))] as string[];
        const profileMap: Record<string, Profile> = {};

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds) as { data: Profile[] | null };
          if (profiles) {
            profiles.forEach((p) => { profileMap[p.id] = p; });
          }
        }

        setRepairs(
          data.map((r) => {
            const profile = r.user_id ? profileMap[r.user_id] : null;
            return {
              id: r.id.substring(0, 8).toUpperCase(),
              rawId: r.id,
              client: profile?.full_name || "Client",
              board: r.board_type,
              brand: r.brand || "",
              status: r.status,
              date: new Date(r.created_at).toLocaleDateString("fr-FR"),
              estimatedCost: r.estimated_cost,
              description: r.description,
              diagnosis: r.diagnosis,
            };
          })
        );
      }
      setLoading(false);
    }

    fetchRepairs();
  }, []);

  const handleStatusChange = async (repairId: string, newStatus: string) => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("repairs") as any)
      .update({ status: newStatus })
      .eq("id", repairId);

    if (!error) {
      setRepairs((prev) =>
        prev.map((r) => (r.rawId === repairId ? { ...r, status: newStatus } : r))
      );
      if (selectedRepair?.rawId === repairId) {
        setSelectedRepair((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const filteredRepairs = activeTab === "all"
    ? repairs
    : repairs.filter((r) => r.status === activeTab);

  const columns: Column<RepairRow>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "client", label: "Client", sortable: true },
    { key: "board", label: "Type", sortable: true },
    { key: "brand", label: "Marque", sortable: true },
    {
      key: "status",
      label: "Statut",
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status] || ""}`}>
          {statusLabels[row.status] || row.status}
        </span>
      ),
    },
    {
      key: "estimatedCost",
      label: "Cout estime",
      render: (row) => (
        <span>{row.estimatedCost ? `${row.estimatedCost} EUR` : "-"}</span>
      ),
    },
    { key: "date", label: "Date", sortable: true },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Reparations</h1>
          <p className="text-sm text-blanc-casse/60">Suivez les reparations en cours</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Reparations</h1>
        <p className="text-sm text-blanc-casse/60">Suivez les reparations en cours</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/5 bg-noir-mat/50 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-vert-neon/10 text-vert-neon"
                : "text-blanc-casse/60 hover:text-blanc-casse"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredRepairs}
        searchPlaceholder="Rechercher une reparation..."
        onRowClick={(row) => setSelectedRepair(row)}
        actions={(row) => (
          <select
            value={row.status}
            onChange={(e) => {
              handleStatusChange(row.rawId, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg border border-white/10 bg-gris-anthracite px-2 py-1 text-xs text-blanc-casse focus:border-vert-neon/50 focus:outline-none"
          >
            {statusOrder.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        )}
      />

      {/* Detail Panel */}
      {selectedRepair && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/5 bg-gris-anthracite p-6 shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blanc-casse">
              {selectedRepair.id}
            </h2>
            <button
              onClick={() => setSelectedRepair(null)}
              className="rounded-lg p-1.5 text-blanc-casse/60 hover:bg-gris-anthracite hover:text-blanc-casse"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Client</h3>
              <p className="text-sm text-blanc-casse">{selectedRepair.client}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Equipement</h3>
              <p className="text-sm text-blanc-casse">{selectedRepair.brand} - {selectedRepair.board}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Description</h3>
              <p className="text-sm text-blanc-casse">{selectedRepair.description}</p>
            </div>

            {selectedRepair.diagnosis && (
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
                <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Diagnostic</h3>
                <p className="text-sm text-blanc-casse">{selectedRepair.diagnosis}</p>
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Statut actuel</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[selectedRepair.status] || ""}`}>
                {statusLabels[selectedRepair.status]}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-3">Progression</h3>
              <div className="space-y-2">
                {statusOrder.map((s, i) => {
                  const currentIdx = statusOrder.indexOf(selectedRepair.status);
                  const isPast = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full border-2",
                          isCurrent
                            ? "border-vert-neon bg-vert-neon"
                            : isPast
                            ? "border-vert-neon/60 bg-vert-neon/30"
                            : "border-white/20 bg-transparent"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs",
                          isCurrent
                            ? "font-medium text-vert-neon"
                            : isPast
                            ? "text-blanc-casse/60"
                            : "text-blanc-casse/30"
                        )}
                      >
                        {statusLabels[s]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedRepair.estimatedCost && (
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
                <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Cout estime</h3>
                <p className="text-lg font-bold text-blanc-casse">{selectedRepair.estimatedCost} EUR</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
