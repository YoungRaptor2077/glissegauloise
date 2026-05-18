"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type RepairStatus = "all" | "received" | "diagnostic" | "waiting_parts" | "repairing" | "testing" | "done" | "ready";

interface RepairRow {
  id: string;
  client: string;
  board: string;
  brand: string;
  status: string;
  date: string;
  estimatedCost: number | null;
  description: string;
  [key: string]: unknown;
}

const mockRepairs: RepairRow[] = [
  { id: "REP-001", client: "Lucas Moreau", board: "Snowboard", brand: "Burton", status: "diagnostic", date: "2024-01-15", estimatedCost: null, description: "Carre endommagee cote talon" },
  { id: "REP-002", client: "Emma Petit", board: "Ski", brand: "Rossignol", status: "repairing", date: "2024-01-14", estimatedCost: 85, description: "Semelle rayee en profondeur" },
  { id: "REP-003", client: "Hugo Leroy", board: "Snowboard", brand: "Lib Tech", status: "done", date: "2024-01-13", estimatedCost: 60, description: "Fartage et affutage complet" },
  { id: "REP-004", client: "Lea Roux", board: "Ski", brand: "Atomic", status: "received", date: "2024-01-12", estimatedCost: null, description: "Fixation desserree" },
  { id: "REP-005", client: "Thomas Garnier", board: "Snowboard", brand: "Capita", status: "waiting_parts", date: "2024-01-11", estimatedCost: 120, description: "Nose delaminate" },
  { id: "REP-006", client: "Camille Dubois", board: "Ski", brand: "Salomon", status: "ready", date: "2024-01-10", estimatedCost: 45, description: "Reparation semelle + fartage" },
];

const statusLabels: Record<string, string> = {
  received: "Demande recue",
  diagnostic: "Diagnostic",
  waiting_parts: "En attente piece",
  repairing: "Reparation en cours",
  testing: "Tests",
  done: "Termine",
  ready: "Pret a recuperer",
};

const statusStyles: Record<string, string> = {
  received: "bg-gray-500/10 text-gray-400",
  diagnostic: "bg-orange-500/10 text-orange-400",
  waiting_parts: "bg-yellow-500/10 text-yellow-400",
  repairing: "bg-blue-500/10 text-blue-400",
  testing: "bg-purple-500/10 text-purple-400",
  done: "bg-green-500/10 text-green-400",
  ready: "bg-emerald-500/10 text-emerald-400",
};

const statusOrder = ["received", "diagnostic", "waiting_parts", "repairing", "testing", "done", "ready"];

const tabs: { key: RepairStatus; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "received", label: "Recues" },
  { key: "diagnostic", label: "Diagnostic" },
  { key: "waiting_parts", label: "En attente" },
  { key: "repairing", label: "En cours" },
  { key: "testing", label: "Tests" },
  { key: "done", label: "Terminees" },
  { key: "ready", label: "Pretes" },
];

export default function ReparationsPage() {
  const [activeTab, setActiveTab] = useState<RepairStatus>("all");
  const [selectedRepair, setSelectedRepair] = useState<RepairRow | null>(null);

  const filteredRepairs = activeTab === "all"
    ? mockRepairs
    : mockRepairs.filter((r) => r.status === activeTab);

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
              // TODO: Update status via API
              console.log("Update repair status:", row.id, e.target.value);
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
              className="rounded-lg p-1.5 text-blanc-casse/60 hover:bg-gris-anthracite-light hover:text-blanc-casse"
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

            {/* Add Note */}
            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Ajouter une note</h3>
              <textarea
                placeholder="Ajouter une note..."
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30 resize-none"
              />
              <button className="mt-2 rounded-lg bg-vert-neon/10 px-3 py-1.5 text-xs font-medium text-vert-neon hover:bg-vert-neon/20">
                Enregistrer la note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
