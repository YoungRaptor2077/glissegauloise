"use client";

import { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { cn } from "@/lib/utils";
import { Eye, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Order, Profile } from "@/types/database";

type OrderStatus = "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface OrderRow {
  id: string;
  rawId: string;
  client: string;
  email: string;
  total: number;
  items: number;
  status: string;
  date: string;
  itemsData: unknown[];
  shippingAddress: unknown;
  trackingNumber: string | null;
  notes: string | null;
  [key: string]: unknown;
}

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
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }) as { data: Order[] | null };

      if (data) {
        // Fetch profiles for all user_ids
        const userIds = [...new Set(data.map((o) => o.user_id).filter(Boolean))] as string[];
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

        setOrders(
          data.map((o) => {
            const profile = o.user_id ? profileMap[o.user_id] : null;
            const itemsArray = Array.isArray(o.items) ? o.items : [];
            return {
              id: `GG-${o.id.substring(0, 4).toUpperCase()}`,
              rawId: o.id,
              client: profile?.full_name || "Client",
              email: profile?.email || "",
              total: o.total,
              items: itemsArray.length,
              status: o.status,
              date: new Date(o.created_at).toLocaleDateString("fr-FR"),
              itemsData: itemsArray,
              shippingAddress: o.shipping_address,
              trackingNumber: o.tracking_number,
              notes: o.notes,
            };
          })
        );
      }
      setLoading(false);
    }

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setError(null);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("orders") as any)
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.rawId === orderId ? { ...o, status: newStatus } : o))
      );

      // Send email notification for important status changes
      const emailStatuses = ["confirmed", "shipped", "delivered"];
      if (emailStatuses.includes(newStatus)) {
        const order = orders.find((o) => o.rawId === orderId);
        if (order?.email) {
          fetch("/api/notify/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: order.email,
              clientName: order.client,
              orderId: order.id,
              status: newStatus,
            }),
          });
        }
      }
    } else {
      setError("Erreur lors de la mise a jour du statut de la commande.");
    }
  };

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Commandes</h1>
          <p className="text-sm text-blanc-casse/60">Gerez les commandes de vos clients</p>
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
          <h1 className="text-2xl font-bold text-blanc-casse">Commandes</h1>
          <p className="text-sm text-blanc-casse/60">Gerez les commandes de vos clients</p>
        </div>
        <a
          href="/api/admin/export?type=orders"
          download
          className="px-4 py-2 rounded-lg bg-vert-neon/10 border border-vert-neon/20 text-sm font-medium text-vert-neon hover:bg-vert-neon/20 transition-colors"
        >
          Exporter CSV
        </a>
      </div>
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
        data={filteredOrders}
        searchPlaceholder="Rechercher une commande..."
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(row);
              }}
              className="rounded-lg p-1.5 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
              title="Voir les details"
            >
              <Eye size={16} />
            </button>
            <select
              value={row.status}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusChange(row.rawId, e.target.value);
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
          </div>
        )}
      />

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/5 bg-gris-anthracite p-6 shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blanc-casse">
              Commande {selectedOrder.id}
            </h2>
            <button
              onClick={() => setSelectedOrder(null)}
              className="rounded-lg p-1.5 text-blanc-casse/60 hover:bg-gris-anthracite hover:text-blanc-casse"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Client</h3>
              <p className="text-sm text-blanc-casse">{selectedOrder.client}</p>
              {selectedOrder.email && (
                <p className="text-xs text-blanc-casse/50">{selectedOrder.email}</p>
              )}
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Statut</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[selectedOrder.status] || ""}`}>
                {statusLabels[selectedOrder.status] || selectedOrder.status}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Articles</h3>
              {selectedOrder.itemsData.length === 0 ? (
                <p className="text-sm text-blanc-casse/40">Aucun article</p>
              ) : (
                <ul className="space-y-2">
                  {selectedOrder.itemsData.map((item, i) => {
                    const it = item as Record<string, unknown>;
                    return (
                      <li key={i} className="flex justify-between text-sm text-blanc-casse">
                        <span>{(it.name as string) || (it.product_name as string) || `Article ${i + 1}`} x{(it.quantity as number) || 1}</span>
                        <span className="text-blanc-casse/60">{it.price ? `${Number(it.price).toFixed(2)} EUR` : ""}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Adresse de livraison</h3>
              {selectedOrder.shippingAddress ? (
                <p className="text-sm text-blanc-casse whitespace-pre-line">
                  {typeof selectedOrder.shippingAddress === "string"
                    ? selectedOrder.shippingAddress
                    : Object.values(selectedOrder.shippingAddress as Record<string, unknown>)
                        .filter(Boolean)
                        .join("\n")}
                </p>
              ) : (
                <p className="text-sm text-blanc-casse/40">Non renseignee</p>
              )}
            </div>

            {selectedOrder.trackingNumber && (
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
                <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Numero de suivi</h3>
                <p className="text-sm font-mono text-blanc-casse">{selectedOrder.trackingNumber}</p>
              </div>
            )}

            {selectedOrder.notes && (
              <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
                <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Notes</h3>
                <p className="text-sm text-blanc-casse">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="rounded-xl border border-white/5 bg-noir-mat/50 p-4">
              <h3 className="text-sm font-medium text-blanc-casse/60 mb-2">Total</h3>
              <p className="text-lg font-bold text-blanc-casse">{selectedOrder.total.toFixed(2)} EUR</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
