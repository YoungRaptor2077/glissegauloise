"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Quote, Profile } from "@/types/database";

type QuoteStatus = "all" | "draft" | "sent" | "accepted" | "rejected" | "expired";

interface QuoteRow {
  id: string;
  rawId: string;
  client: string;
  repairId: string | null;
  status: string;
  total: number;
  validUntil: string;
  createdAt: string;
  paymentUrl: string | null;
  [key: string]: unknown;
}

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
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      const supabase = createClient();
      const { data } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false }) as { data: Quote[] | null };

      if (data) {
        const userIds = [...new Set(data.map((q) => q.user_id).filter(Boolean))] as string[];
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

        setQuotes(
          data.map((q) => {
            const profile = q.user_id ? profileMap[q.user_id] : null;
            return {
              id: q.id.substring(0, 8).toUpperCase(),
              rawId: q.id,
              client: profile?.full_name || "Client",
              repairId: q.repair_id ? q.repair_id.substring(0, 8).toUpperCase() : null,
              status: q.status,
              total: q.total,
              validUntil: new Date(q.valid_until).toLocaleDateString("fr-FR"),
              createdAt: new Date(q.created_at).toLocaleDateString("fr-FR"),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              paymentUrl: (q as any).payment_url || null,
            };
          })
        );
      }
      setLoading(false);
    }

    fetchQuotes();
  }, []);

  const handleStatusUpdate = async (quoteId: string, newStatus: string) => {
    setError(null);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("quotes") as any)
      .update({ status: newStatus })
      .eq("id", quoteId);

    if (!error) {
      setQuotes((prev) =>
        prev.map((q) => (q.rawId === quoteId ? { ...q, status: newStatus } : q))
      );
    } else {
      setError("Erreur lors de la mise a jour du statut du devis.");
    }
  };

  const filteredQuotes = activeTab === "all"
    ? quotes
    : quotes.filter((q) => q.status === activeTab);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blanc-casse">Devis</h1>
            <p className="text-sm text-blanc-casse/60">Creez et gerez les devis clients</p>
          </div>
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

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

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
                  handleStatusUpdate(row.rawId, "sent");
                }}
                className="rounded-lg bg-vert-neon/10 px-2 py-1 text-xs font-medium text-vert-neon hover:bg-vert-neon/20"
              >
                Envoyer
              </button>
            )}
            {row.status === "sent" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (row.paymentUrl) {
                      navigator.clipboard.writeText(row.paymentUrl);
                      alert("Lien de paiement copie !");
                    } else {
                      alert("Pas de lien de paiement pour ce devis");
                    }
                  }}
                  className="rounded-lg bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
                >
                  Copier lien
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const res = await fetch("/api/admin/quotes/resend", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ quoteId: row.rawId }),
                    });
                    if (res.ok) {
                      alert("Relance envoyee au client !");
                    } else {
                      alert("Erreur lors de la relance");
                    }
                  }}
                  className="rounded-lg bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20"
                >
                  Relancer
                </button>
              </>
            )}
          </div>
        )}
      />
    </div>
  );
}
