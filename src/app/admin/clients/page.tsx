"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { X, ShoppingCart, Wrench } from "lucide-react";

interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  repairs: number;
  totalSpent: number;
  createdAt: string;
  [key: string]: unknown;
}

const mockClients: ClientRow[] = [
  { id: "1", name: "Jean Dupont", email: "jean@example.com", phone: "06 12 34 56 78", orders: 5, repairs: 2, totalSpent: 1249.95, createdAt: "2023-06-15" },
  { id: "2", name: "Marie Martin", email: "marie@example.com", phone: "06 23 45 67 89", orders: 3, repairs: 0, totalSpent: 567.00, createdAt: "2023-08-22" },
  { id: "3", name: "Pierre Durand", email: "pierre@example.com", phone: "06 34 56 78 90", orders: 8, repairs: 3, totalSpent: 2890.50, createdAt: "2023-03-10" },
  { id: "4", name: "Sophie Bernard", email: "sophie@example.com", phone: "06 45 67 89 01", orders: 2, repairs: 1, totalSpent: 459.99, createdAt: "2023-11-05" },
  { id: "5", name: "Lucas Moreau", email: "lucas@example.com", phone: "06 56 78 90 12", orders: 1, repairs: 4, totalSpent: 320.00, createdAt: "2023-09-18" },
  { id: "6", name: "Emma Petit", email: "emma@example.com", phone: "06 67 89 01 23", orders: 6, repairs: 1, totalSpent: 1890.00, createdAt: "2023-04-27" },
];

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Clients</h1>
        <p className="text-sm text-blanc-casse/60">Gerez vos clients et consultez leur historique</p>
      </div>

      <DataTable
        columns={columns}
        data={mockClients}
        searchPlaceholder="Rechercher par nom ou email..."
        onRowClick={(row) => setSelectedClient(row)}
      />

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
                  <span className="text-blanc-casse">{selectedClient.phone}</span>
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
