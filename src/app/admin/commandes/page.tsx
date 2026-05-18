"use client";

import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { cn } from "@/lib/utils";

type OrderStatus = "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface OrderRow {
  id: string;
  client: string;
  email: string;
  total: number;
  items: number;
  status: string;
  date: string;
  [key: string]: unknown;
}

const mockOrders: OrderRow[] = [
  { id: "CMD-001", client: "Jean Dupont", email: "jean@example.com", total: 549.99, items: 2, status: "pending", date: "2024-01-15" },
  { id: "CMD-002", client: "Marie Martin", email: "marie@example.com", total: 189.00, items: 1, status: "confirmed", date: "2024-01-14" },
  { id: "CMD-003", client: "Pierre Durand", email: "pierre@example.com", total: 899.98, items: 3, status: "shipped", date: "2024-01-13" },
  { id: "CMD-004", client: "Sophie Bernard", email: "sophie@example.com", total: 299.99, items: 1, status: "delivered", date: "2024-01-12" },
  { id: "CMD-005", client: "Lucas Moreau", email: "lucas@example.com", total: 149.00, items: 2, status: "cancelled", date: "2024-01-11" },
  { id: "CMD-006", client: "Emma Petit", email: "emma@example.com", total: 449.99, items: 1, status: "pending", date: "2024-01-10" },
  { id: "CMD-007", client: "Hugo Leroy", email: "hugo@example.com", total: 679.00, items: 2, status: "shipped", date: "2024-01-09" },
];

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  shipped: "Expediee",
  delivered: "Livree",
  cancelled: "Annulee",
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  shipped: "bg-purple-500/10 text-purple-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const tabs: { key: OrderStatus; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmees" },
  { key: "shipped", label: "Expediees" },
  { key: "delivered", label: "Livrees" },
  { key: "cancelled", label: "Annulees" },
];

export default function CommandesPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");

  const filteredOrders = activeTab === "all"
    ? mockOrders
    : mockOrders.filter((o) => o.status === activeTab);

  const columns: Column<OrderRow>[] = [
    { key: "id", label: "Commande", sortable: true },
    { key: "client", label: "Client", sortable: true },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (row) => <span className="font-medium">{row.total.toFixed(2)} EUR</span>,
    },
    {
      key: "items",
      label: "Articles",
      render: (row) => <span>{row.items}</span>,
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
    { key: "date", label: "Date", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Commandes</h1>
        <p className="text-sm text-blanc-casse/60">Gerez les commandes de vos clients</p>
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
        data={filteredOrders}
        searchPlaceholder="Rechercher une commande..."
        actions={(row) => (
          <select
            value={row.status}
            onChange={(e) => {
              // TODO: Update status via API
              console.log("Update status:", row.id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg border border-white/10 bg-gris-anthracite px-2 py-1 text-xs text-blanc-casse focus:border-vert-neon/50 focus:outline-none"
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmee</option>
            <option value="shipped">Expediee</option>
            <option value="delivered">Livree</option>
            <option value="cancelled">Annulee</option>
          </select>
        )}
      />
    </div>
  );
}
