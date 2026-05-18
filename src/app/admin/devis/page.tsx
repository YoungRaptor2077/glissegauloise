"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { cn } from "@/lib/utils";

type QuoteStatus = "all" | "draft" | "sent" | "accepted" | "rejected" | "expired";

interface QuoteRow {
  id: string;
  client: string;
  repairId: string | null;
  status: string;
  total: number;
  validUntil: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockQuotes: QuoteRow[] = [
  { id: "DEV-001", client: "Lucas Moreau", repairId: "REP-001", status: "sent", total: 120.00, validUntil: "2024-02-15", createdAt: "2024-01-15" },
  { id: "DEV-002", client: "Emma Petit", repairId: "REP-002", status: "accepted", total: 85.00, validUntil: "2024-02-14", createdAt: "2024-01-14" },
  { id: "DEV-003", client: "Thomas Garnier", repairId: "REP-005", status: "draft", total: 180.00, validUntil: "2024-02-11", createdAt: "2024-01-11" },
  { id: "DEV-004", client: "Lea Roux", repairId: null, status: "rejected", total: 250.00, validUntil: "2024-01-30", createdAt: "2024-01-05" },
  { id: "DEV-005", client: "Jean Dupont", repairId: null, status: "expired", total: 95.00, validUntil: "2024-01-10", createdAt: "2023-12-20" },
];

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  sent: "Envoye",
  accepted: "Accepte",
  rejected: "Refuse",
  expired: "Expire",
};

const statusStyles: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-400",
  sent: "bg-blue-500/10 text-blue-400",
  accepted: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  expired: "bg-yellow-500/10 text-yellow-400",
};

const tabs: { key: QuoteStatus; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "draft", label: "Brouillons" },
  { key: "sent", label: "Envoyes" },
  { key: "accepted", label: "Acceptes" },
  { key: "rejected", label: "Refuses" },
  { key: "expired", label: "Expires" },
];

export default function DevisPage() {
  const [activeTab, setActiveTab] = useState<QuoteStatus>("all");

  const filteredQuotes = activeTab === "all"
    ? mockQuotes
    : mockQuotes.filter((q) => q.status === activeTab);

  const columns: Column<QuoteRow>[] = [
    { key: "id", label: "Devis", sortable: true },
    { key: "client", label: "Client", sortable: true },
    {
      key: "repairId",
      label: "Reparation",
      render: (row) => <span className="font-mono text-xs">{row.repairId || "-"}</span>,
    },
    {
      key: "total",
      label: "Montant",
      sortable: true,
      render: (row) => <span className="font-medium">{row.total.toFixed(2)} EUR</span>,
    },
    {
      key: "status",
      label: "Statut",
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status] || ""}`}>
          {statusLabels[row.status] || row.status}
        </span>
      ),
    },
    { key: "validUntil", label: "Valide jusqu'au", sortable: true },
    { key: "createdAt", label: "Cree le", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Devis</h1>
          <p className="text-sm text-blanc-casse/60">Creez et gerez les devis clients</p>
        </div>
        <Link
          href="/admin/devis/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark"
        >
          <Plus size={16} />
          Nouveau devis
        </Link>
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
        data={filteredQuotes}
        searchPlaceholder="Rechercher un devis..."
        actions={(row) => (
          <div className="flex items-center gap-2">
            {row.status === "draft" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Send quote via API
                  console.log("Send quote:", row.id);
                }}
                className="rounded-lg bg-vert-neon/10 px-2 py-1 text-xs font-medium text-vert-neon hover:bg-vert-neon/20"
              >
                Envoyer
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}
