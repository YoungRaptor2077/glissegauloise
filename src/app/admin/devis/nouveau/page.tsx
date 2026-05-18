"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NouveauDevisPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientId: "",
    repairId: "",
    validUntil: "",
    notes: "",
    laborCost: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    router.push("/admin/devis");
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

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Client & Repair */}
          <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Informations</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientId: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                >
                  <option value="">Selectionner un client...</option>
                  <option value="1">Jean Dupont</option>
                  <option value="2">Marie Martin</option>
                  <option value="3">Pierre Durand</option>
                  <option value="4">Lucas Moreau</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Reparation liee</label>
                <select
                  value={formData.repairId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, repairId: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                >
                  <option value="">Aucune (optionnel)</option>
                  <option value="REP-001">REP-001 - Lucas Moreau</option>
                  <option value="REP-002">REP-002 - Emma Petit</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">Valide jusqu&apos;au</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
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
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6">
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
                  <div className="col-span-3">
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
              className="w-full rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark"
            >
              Enregistrer le devis
            </button>
            <button
              type="button"
              onClick={() => {
                // TODO: Save and send via API
                router.push("/admin/devis");
              }}
              className="w-full rounded-xl border border-vert-neon/30 px-4 py-2.5 text-sm font-medium text-vert-neon transition-colors hover:bg-vert-neon/10"
            >
              Enregistrer et envoyer
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
