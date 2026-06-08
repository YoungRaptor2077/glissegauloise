"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Search, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  note: string;
}

interface ClientOption {
  id: string;
  full_name: string;
  email: string;
}

export default function NouveauDevisPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    manualClient: "",
    repairId: "",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
    laborCost: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0, note: "" },
  ]);

  useEffect(() => {
    async function fetchClients() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name", { ascending: true });

      if (data) {
        setClients(data as ClientOption[]);
      }
    }
    fetchClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    const search = clientSearch.toLowerCase();
    return (
      (c.full_name || "").toLowerCase().includes(search) ||
      (c.email || "").toLowerCase().includes(search)
    );
  });

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0, note: "" }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const partsCost = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const laborCost = parseFloat(formData.laborCost) || 0;
  const total = partsCost + laborCost;

  const handleSubmit = async (e: React.FormEvent, sendAfterSave = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedClient?.id || null,
          repairId: formData.repairId || null,
          validUntil: formData.validUntil,
          notes: manualMode ? `Client: ${formData.manualClient}\n${formData.notes}` : formData.notes,
          lineItems,
          laborCost,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la creation");
        return;
      }

      if (sendAfterSave && data.quote?.id) {
        const sendRes = await fetch("/api/admin/quotes/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quoteId: data.quote.id }),
        });
        const sendData = await sendRes.json();
        if (sendData?.paymentUrl) {
          navigator.clipboard.writeText(sendData.paymentUrl);
          setSuccess("Devis cree et envoye ! Lien de paiement copie dans le presse-papier.");
        } else {
          setSuccess("Devis cree et envoye !");
        }
      } else {
        setSuccess("Devis enregistre !");
      }

      setTimeout(() => router.push("/admin/devis"), 1500);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/devis"
          className="rounded-lg p-2 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Nouveau devis</h1>
          <p className="text-sm text-blanc-casse/60">Creer un devis pour un client</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-vert-neon/20 bg-vert-neon/10 px-4 py-3 text-sm text-vert-neon">
          {success}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Client Selection */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blanc-casse">Client</h2>
              <button
                type="button"
                onClick={() => {
                  setManualMode(!manualMode);
                  setSelectedClient(null);
                  setClientSearch("");
                }}
                className="text-xs font-medium text-vert-neon hover:underline"
              >
                {manualMode ? "Selectionner un client existant" : "Saisie manuelle"}
              </button>
            </div>

            {manualMode ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Nom / Email du client
                </label>
                <input
                  type="text"
                  value={formData.manualClient}
                  onChange={(e) => setFormData((prev) => ({ ...prev, manualClient: e.target.value }))}
                  placeholder="Ex: Jean Dupont - jean@email.com"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {selectedClient ? (
                  <div className="flex items-center justify-between rounded-xl border border-vert-neon/20 bg-vert-neon/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vert-neon/10">
                        <User size={14} className="text-vert-neon" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blanc-casse">{selectedClient.full_name || "Sans nom"}</p>
                        <p className="text-xs text-blanc-casse/50">{selectedClient.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedClient(null)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Changer
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blanc-casse/40" />
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Rechercher par nom ou email..."
                        className="w-full rounded-xl border border-white/10 bg-gris-anthracite pl-9 pr-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-gris-anthracite">
                      {filteredClients.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-blanc-casse/50">Aucun client trouve</p>
                      ) : (
                        filteredClients.slice(0, 15).map((client) => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => {
                                setSelectedClient(client);
                                setClientSearch("");
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-vert-neon/5 transition-colors"
                            >
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
                                <User size={12} className="text-blanc-casse/60" />
                              </div>
                              <div>
                                <p className="text-sm text-blanc-casse">{client.full_name || "Sans nom"}</p>
                                <p className="text-xs text-blanc-casse/40">{client.email}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Repair & Date */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Reparation liee (optionnel)</label>
                <input
                  type="text"
                  value={formData.repairId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, repairId: e.target.value }))}
                  placeholder="ID de la reparation"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Valide jusqu&apos;au</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blanc-casse">Pieces et fournitures</h2>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-flex items-center gap-1 rounded-lg bg-vert-neon/10 px-3 py-1.5 text-xs font-medium text-vert-neon hover:bg-vert-neon/20"
              >
                <Plus size={12} />
                Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="space-y-2 pb-3 border-b border-white/5 last:border-0">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      {index === 0 && (
                        <label className="mb-1.5 block text-xs font-medium text-blanc-casse/60">Description</label>
                      )}
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, "description", e.target.value)}
                        placeholder="Piece ou service..."
                        className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && (
                        <label className="mb-1.5 block text-xs font-medium text-blanc-casse/60">Qte</label>
                      )}
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 1)}
                        className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && (
                        <label className="mb-1.5 block text-xs font-medium text-blanc-casse/60">Prix unit.</label>
                      )}
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice || ""}
                        onChange={(e) => updateLineItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && (
                        <label className="mb-1.5 block text-xs font-medium text-blanc-casse/60">Note</label>
                      )}
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) => updateLineItem(index, "note", e.target.value)}
                        placeholder="Ex: a la charge du client"
                        className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-3 py-2 text-xs text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                        className="rounded-lg p-2 text-blanc-casse/40 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Notes</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes internes ou pour le client..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30 resize-none"
            />
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Recapitulatif</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blanc-casse/60">Pieces</span>
                <span className="text-blanc-casse">{partsCost.toFixed(2)} EUR</span>
              </div>
              <div>
                <label className="mb-1.5 block text-blanc-casse/60">Main d&apos;oeuvre</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.laborCost}
                  onChange={(e) => setFormData((prev) => ({ ...prev, laborCost: e.target.value }))}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-3 py-2 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none"
                />
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between">
                <span className="font-medium text-blanc-casse">Total</span>
                <span className="font-bold text-vert-neon">{total.toFixed(2)} EUR</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer le devis"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
              className="w-full rounded-xl border border-vert-neon/30 px-4 py-2.5 text-sm font-medium text-vert-neon transition-colors hover:bg-vert-neon/10 disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Enregistrer et envoyer"}
            </button>
            <Link
              href="/admin/devis"
              className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-blanc-casse/80 transition-colors hover:bg-gris-anthracite"
            >
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
