"use client";

import React from "react";
import { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { X, Trash2, Inbox, Search, Package, Wrench, FlaskConical, CheckCircle, Hand, Lock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Repair, Profile } from "@/types/database";

type RepairStatus = "all" | "received" | "diagnostic" | "waiting_parts" | "in_progress" | "testing" | "completed" | "ready_pickup" | "closed";

interface RepairRow {
  id: string;
  rawId: string;
  userId: string | null;
  client: string;
  equipment: string;
  brand: string;
  status: string;
  date: string;
  estimatedCost: number | null;
  description: string;
  adminNotes: string | null;
  images: string[];
  videos: string[];
  contactPreference: string;
  phone: string | null;
  email: string | null;
  [key: string]: unknown;
}

const statusLabels: Record<string, string> = {
  received: "Recu",
  diagnostic: "Diagnostic",
  waiting_parts: "En attente pieces",
  in_progress: "En cours",
  testing: "En test",
  completed: "Termine",
  ready_pickup: "Pret a recuperer",
  closed: "Termine (note)",
};

const statusStyles: Record<string, string> = {
  received: "bg-yellow-500/10 text-yellow-400",
  diagnostic: "bg-orange-500/10 text-orange-400",
  waiting_parts: "bg-purple-500/10 text-purple-400",
  in_progress: "bg-blue-500/10 text-blue-400",
  testing: "bg-cyan-500/10 text-cyan-400",
  completed: "bg-green-500/10 text-green-400",
  ready_pickup: "bg-emerald-500/10 text-emerald-400",
  closed: "bg-gray-500/10 text-gray-400",
};

const statusIcons: Record<string, React.ReactNode> = {
  received: <Inbox size={14} className="text-blue-400" />,
  diagnostic: <Search size={14} className="text-yellow-400" />,
  waiting_parts: <Package size={14} className="text-orange-400" />,
  in_progress: <Wrench size={14} className="text-vert-neon" />,
  testing: <FlaskConical size={14} className="text-purple-400" />,
  completed: <CheckCircle size={14} className="text-green-400" />,
  ready_pickup: <Hand size={14} className="text-cyan-400" />,
  closed: <Lock size={14} className="text-gray-400" />,
};

const statusOrder = ["received", "diagnostic", "waiting_parts", "in_progress", "testing", "completed", "ready_pickup", "closed"];

const tabs: { key: RepairStatus; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "received", label: "Recu" },
  { key: "diagnostic", label: "Diagnostic" },
  { key: "waiting_parts", label: "Attente pieces" },
  { key: "in_progress", label: "En cours" },
  { key: "testing", label: "En test" },
  { key: "completed", label: "Terminees" },
  { key: "ready_pickup", label: "Pret a recuperer" },
  { key: "closed", label: "Terminees (notees)" },
];

function ClientReviewSection({ repairId }: { repairId: string }) {
  const [review, setReview] = useState<{ rating: number; comment: string | null; created_at: string } | null>(null);
  const [loadingReview, setLoadingReview] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch(`/api/reviews?repair_id=${repairId}`);
        const data = await res.json();
        setReview(data.review);
      } catch {}
      setLoadingReview(false);
    }
    fetchReview();
  }, [repairId]);

  if (loadingReview) {
    return (
      <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
        <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Note du client</h3>
        <p className="text-xs text-blanc-casse/30">Chargement...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
        <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Note du client</h3>
        <p className="text-xs text-blanc-casse/30">Pas encore note</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
      <h3 className="text-sm font-medium text-yellow-400 mb-2">Note du client</h3>
      <div className="flex gap-0.5 mb-2">
        {[1,2,3,4,5].map(s => (
          <span key={s} className={s <= review.rating ? "text-yellow-400" : "text-white/20"}>★</span>
        ))}
        <span className="ml-2 text-sm font-bold text-blanc-casse">{review.rating}/5</span>
      </div>
      {review.comment && (
        <p className="text-sm text-blanc-casse/70 italic">&quot;{review.comment}&quot;</p>
      )}
      <p className="text-xs text-blanc-casse/40 mt-2">
        {new Date(review.created_at).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}

export default function ReparationsPage() {
  const [activeTab, setActiveTab] = useState<RepairStatus>("all");
  const [repairs, setRepairs] = useState<RepairRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<RepairRow | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              userId: r.user_id || null,
              client: profile?.full_name || "Client",
              equipment: [r.brand, r.model].filter(Boolean).join(" "),
              brand: r.brand || "",
              status: r.status,
              date: new Date(r.created_at).toLocaleDateString("fr-FR"),
              estimatedCost: r.estimated_cost,
              description: r.issue_description,
              adminNotes: r.admin_notes,
              images: r.images || [],
              videos: r.videos || [],
              contactPreference: r.contact_preference || "email",
              phone: r.phone || null,
              email: r.email || null,
            };
          })
        );
      }
      setLoading(false);
    }

    fetchRepairs();
  }, []);

  const handleStatusChange = async (repairId: string, newStatus: string) => {
    setError(null);
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

      // Send notification to client
      const repair = repairs.find((r) => r.rawId === repairId);
      if (repair?.userId) {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: repair.userId,
            title: "Reparation mise a jour",
            message: `Votre reparation est maintenant : ${statusLabels[newStatus] || newStatus}`,
            type: "repair_update",
            status_key: newStatus,
            link: "/espace-client/reparations",
          }),
        });
      }
    } else {
      setError("Erreur lors de la mise a jour du statut de la reparation.");
    }
  };

  const handleDelete = async (repairId: string) => {
    if (!confirm("Supprimer cette reparation et ses conversations associees ?")) return;
    setError(null);

    try {
      const res = await fetch(`/api/admin/repairs/${repairId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRepairs((prev) => prev.filter((r) => r.rawId !== repairId));
        if (selectedRepair?.rawId === repairId) {
          setSelectedRepair(null);
        }
      } else {
        setError("Erreur lors de la suppression de la reparation.");
      }
    } catch {
      setError("Erreur lors de la suppression de la reparation.");
    }
  };

  const filteredRepairs = activeTab === "all"
    ? repairs
    : repairs.filter((r) => r.status === activeTab);

  const columns: Column<RepairRow>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "client", label: "Client", sortable: true },
    { key: "equipment", label: "Equipement", sortable: true },
    { key: "brand", label: "Marque", sortable: true },
    {
      key: "status",
      label: "Statut",
      render: (row) => (
        <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status] || ""}`}>
          {statusIcons[row.status]} {statusLabels[row.status] || row.status}
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

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredRepairs}
        searchPlaceholder="Rechercher une reparation..."
        onRowClick={(row) => setSelectedRepair(row)}
        actions={(row) => (
          <div className="flex items-center gap-2">
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
            {row.userId && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const res = await fetch("/api/admin/conversations/new", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId: row.userId,
                        subject: `Reparation - ${row.brand} ${row.equipment}`,
                        content: `Bonjour, je vous contacte au sujet de votre reparation (${row.brand} ${row.equipment}).`,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok && data.conversation?.id) {
                      window.location.href = `/admin/conversations/${data.conversation.id}`;
                    } else {
                      alert(data.error || "Erreur lors de la creation de la conversation");
                    }
                  } catch {
                    alert("Erreur de connexion");
                  }
                }}
                className="rounded-lg p-1.5 text-blanc-casse/40 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                title="Contacter le client"
              >
                <MessageSquare size={15} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.rawId);
              }}
              className="rounded-lg p-1.5 text-blanc-casse/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={15} />
            </button>
          </div>
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
              <p className="text-sm text-blanc-casse">{selectedRepair.brand} - {selectedRepair.equipment}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Description</h3>
              <p className="text-sm text-blanc-casse">{selectedRepair.description}</p>
            </div>

            {/* Contact preference */}
            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Preference de contact</h3>
              <p className="text-sm text-blanc-casse">
                {selectedRepair.contactPreference === "phone" ? "Telephone" : selectedRepair.contactPreference === "both" ? "Telephone + Email" : selectedRepair.contactPreference === "site" ? "Via le site" : "Email"}
                {selectedRepair.phone && ` - ${selectedRepair.phone}`}
                {selectedRepair.email && ` - ${selectedRepair.email}`}
              </p>
            </div>

            {/* Images */}
            {selectedRepair.images.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
                <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Photos ({selectedRepair.images.length})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRepair.images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-white/10 hover:border-vert-neon/40 transition-colors">
                      <img src={url} alt={`Photo ${i + 1}`} className="h-24 w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {selectedRepair.videos.length > 0 && (
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
                <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Videos ({selectedRepair.videos.length})</h3>
                <div className="space-y-2">
                  {selectedRepair.videos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-white/10 bg-gris-anthracite p-3 text-xs text-vert-neon hover:border-vert-neon/40 transition-colors">
                      🎥 Video {i + 1} - Voir
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Notes admin</h3>
              <div className="space-y-2">
                <textarea
                  defaultValue={selectedRepair.adminNotes || ""}
                  id="admin-notes-input"
                  placeholder="Notes internes..."
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none resize-none"
                />
                <button
                  onClick={async () => {
                    const input = document.getElementById("admin-notes-input") as HTMLTextAreaElement;
                    const supabase = createClient();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase.from("repairs") as any).update({ admin_notes: input.value }).eq("id", selectedRepair.rawId);
                    setRepairs(prev => prev.map(r => r.rawId === selectedRepair.rawId ? { ...r, adminNotes: input.value } : r));
                    setSelectedRepair(prev => prev ? { ...prev, adminNotes: input.value } : null);
                  }}
                  className="rounded-lg bg-vert-neon/10 px-3 py-1.5 text-xs font-medium text-vert-neon hover:bg-vert-neon/20 transition-colors"
                >
                  Sauvegarder notes
                </button>
              </div>
            </div>

            {/* Note client (envoie un message) */}
            {selectedRepair.userId && (
              <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                <h3 className="text-sm font-medium text-blue-400 mb-2">Note au client</h3>
                <p className="text-[10px] text-blanc-casse/40 mb-2">Envoie un message au client (il recevra un email + notification)</p>
                <div className="space-y-2">
                  <textarea
                    id="client-note-input"
                    placeholder="Ex: Votre trottinette est prete, passez la recuperer samedi..."
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-blue-500/50 focus:outline-none resize-none"
                  />
                  <button
                    onClick={async () => {
                      const input = document.getElementById("client-note-input") as HTMLTextAreaElement;
                      const noteContent = input.value.trim();
                      if (!noteContent) { alert("Ecrivez un message"); return; }
                      try {
                        const res = await fetch("/api/admin/conversations/new", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: selectedRepair.userId,
                            subject: `Reparation - ${selectedRepair.brand} ${selectedRepair.equipment}`,
                            content: noteContent,
                          }),
                        });
                        if (res.ok) {
                          input.value = "";
                          alert("Message envoye au client !");
                        } else {
                          const data = await res.json();
                          alert(data.error || "Erreur");
                        }
                      } catch {
                        alert("Erreur de connexion");
                      }
                    }}
                    className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Envoyer au client
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Statut actuel</h3>
              <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[selectedRepair.status] || ""}`}>
                {statusIcons[selectedRepair.status]} {statusLabels[selectedRepair.status]}
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

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Cout estime (EUR)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  defaultValue={selectedRepair.estimatedCost || ""}
                  id="estimated-cost-input"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                />
                <button
                  onClick={async () => {
                    const input = document.getElementById("estimated-cost-input") as HTMLInputElement;
                    const value = parseFloat(input.value);
                    if (isNaN(value)) return;
                    const supabase = createClient();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase.from("repairs") as any).update({ estimated_cost: value }).eq("id", selectedRepair.rawId);
                    setRepairs(prev => prev.map(r => r.rawId === selectedRepair.rawId ? { ...r, estimatedCost: value } : r));
                    setSelectedRepair(prev => prev ? { ...prev, estimatedCost: value } : null);
                  }}
                  className="shrink-0 rounded-lg bg-vert-neon px-3 py-2 text-xs font-semibold text-noir-mat hover:opacity-90 transition-opacity"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Deposit / Acompte */}
            {selectedRepair.status !== "closed" && (
              <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                <h3 className="text-sm font-medium text-yellow-400 mb-2">Demander un acompte</h3>
                <p className="text-xs text-blanc-casse/50 mb-3">Envoyer un lien de paiement au client pour un acompte (50% ou montant libre)</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    id="deposit-amount-input"
                    placeholder="Montant EUR"
                    defaultValue={selectedRepair.estimatedCost ? (selectedRepair.estimatedCost / 2).toFixed(0) : ""}
                    className="flex-1 rounded-lg border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-yellow-500/50 focus:outline-none"
                  />
                  <button
                    onClick={async () => {
                      const input = document.getElementById("deposit-amount-input") as HTMLInputElement;
                      const amount = parseFloat(input.value);
                      if (!amount || amount <= 0) { alert("Entrez un montant"); return; }
                      
                      const res = await fetch("/api/admin/payment-link", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          amount,
                          repairId: selectedRepair.rawId,
                          clientEmail: selectedRepair.email,
                          clientName: selectedRepair.client,
                          description: `Acompte - ${selectedRepair.brand} ${selectedRepair.equipment}`,
                        }),
                      });
                      const data = await res.json();
                      if (data.url) {
                        // Copy link to clipboard
                        navigator.clipboard.writeText(data.url);
                        alert(`Lien de paiement copie ! (${amount} EUR)\n\nEnvoyez-le au client par message ou email.\n\nLien: ${data.url}`);
                      } else {
                        alert("Erreur: " + (data.error || "Impossible de creer le lien"));
                      }
                    }}
                    className="shrink-0 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-noir-mat hover:bg-yellow-400 transition-colors"
                  >
                    Generer le lien
                  </button>
                </div>
              </div>
            )}

            {/* Client Review */}
            <ClientReviewSection repairId={selectedRepair.rawId} />

            <div className="pt-4 border-t border-white/5 space-y-3">
              {selectedRepair.status === "closed" && (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-400 font-medium">Reparation terminee definitivement</p>
                </div>
              )}
              {selectedRepair.status !== "ready_pickup" && selectedRepair.status !== "completed" && selectedRepair.status !== "closed" && (
                <button
                  onClick={() => handleStatusChange(selectedRepair.rawId, "completed")}
                  className="w-full rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
                >
                  Marquer comme termine
                </button>
              )}
              {selectedRepair.status === "completed" && (
                <button
                  onClick={() => handleStatusChange(selectedRepair.rawId, "ready_pickup")}
                  className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors"
                >
                  Pret a recuperer
                </button>
              )}
              {selectedRepair.status === "ready_pickup" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blanc-casse/70">
                    Montant paye par le client (EUR)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      id="final-amount-input"
                      placeholder="Ex: 45.00"
                      className="flex-1 rounded-xl border border-white/10 bg-noir-mat px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById("final-amount-input") as HTMLInputElement;
                        const amount = parseFloat(input.value);
                        if (!amount || amount <= 0) {
                          alert("Entrez le montant paye");
                          return;
                        }
                        // Update final cost
                        const supabase = createClient();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase.from("repairs") as any).update({ final_cost: amount }).eq("id", selectedRepair.rawId);
                        // Add loyalty points
                        if (selectedRepair.userId) {
                          const points = Math.floor(amount);
                          await fetch("/api/admin/loyalty/points", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ user_id: selectedRepair.userId, points, reason: "Reparation terminee" }),
                          });
                        }
                        // Close the repair
                        handleStatusChange(selectedRepair.rawId, "closed");
                      }}
                      className="rounded-xl bg-gray-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                      Terminer + Points
                    </button>
                  </div>
                  <p className="text-[10px] text-blanc-casse/40">
                    Les points de fidelite seront ajoutes automatiquement (1pt/EUR)
                  </p>
                </div>
              )}
              {selectedRepair.status !== "closed" && (
                <button
                  onClick={() => handleDelete(selectedRepair.rawId)}
                  className="w-full rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Supprimer la reparation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
