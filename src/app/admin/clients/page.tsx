"use client";

import { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { X, ShoppingCart, Wrench, Loader2 } from "lucide-react";

interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orders: number;
  repairs: number;
  totalSpent: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/clients");
        const data = await res.json();
        if (data.clients) {
          setClients(data.clients);
        }
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const columns: Column<ClientRow>[] = [
    { key: "name", label: "Nom", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Telephone" },
    {
      key: "orders",
      label: "Commandes",
      sortable: true,
      render: (row) => <span>{row.orders}</span>,
    },
    {
      key: "repairs",
      label: "Reparations",
      sortable: true,
      render: (row) => <span>{row.repairs}</span>,
    },
    {
      key: "totalSpent",
      label: "Total depense",
      sortable: true,
      render: (row) => <span className="font-medium">{row.totalSpent.toFixed(2)} EUR</span>,
    },
    { key: "createdAt", label: "Inscrit le", sortable: true },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Clients</h1>
          <p className="text-sm text-blanc-casse/60">Gerez vos clients et consultez leur historique</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-vert-neon" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Clients</h1>
          <p className="text-sm text-blanc-casse/60">Gerez vos clients et consultez leur historique</p>
        </div>
        <a
          href="/api/admin/export?type=clients"
          download
          className="px-4 py-2 rounded-lg bg-vert-neon/10 border border-vert-neon/20 text-sm font-medium text-vert-neon hover:bg-vert-neon/20 transition-colors"
        >
          Exporter CSV
        </a>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 py-12 text-center">
          <p className="text-sm text-blanc-casse/40">Aucun client pour le moment.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          searchPlaceholder="Rechercher par nom ou email..."
          onRowClick={(row) => setSelectedClient(row)}
        />
      )}

      {/* Client Detail Panel */}
      {selectedClient && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/5 bg-gris-anthracite p-6 shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blanc-casse">
              Detail client
            </h2>
            <button
              onClick={() => setSelectedClient(null)}
              className="rounded-lg p-1.5 text-blanc-casse/60 hover:bg-gris-anthracite-light hover:text-blanc-casse"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vert-neon/10 text-lg font-bold text-vert-neon">
                {selectedClient.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-blanc-casse">{selectedClient.name}</p>
                <p className="text-sm text-blanc-casse/60">{selectedClient.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-3">
                <div className="flex items-center gap-2 text-blanc-casse/60">
                  <ShoppingCart size={14} />
                  <span className="text-xs">Commandes</span>
                </div>
                <p className="mt-1 text-lg font-bold text-blanc-casse">{selectedClient.orders}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-3">
                <div className="flex items-center gap-2 text-blanc-casse/60">
                  <Wrench size={14} />
                  <span className="text-xs">Reparations</span>
                </div>
                <p className="mt-1 text-lg font-bold text-blanc-casse">{selectedClient.repairs}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blanc-casse/60">Telephone</span>
                  <span className="text-blanc-casse">{selectedClient.phone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blanc-casse/60">Total depense</span>
                  <span className="text-blanc-casse font-medium">{selectedClient.totalSpent.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blanc-casse/60">Inscrit le</span>
                  <span className="text-blanc-casse">{selectedClient.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Historique commandes</h3>
              <p className="text-xs text-blanc-casse/40">Les dernieres commandes apparaitront ici.</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Historique reparations</h3>
              <p className="text-xs text-blanc-casse/40">Les dernieres reparations apparaitront ici.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
