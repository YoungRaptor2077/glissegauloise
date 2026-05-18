"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/admin/StatCard";
import {
  Euro,
  ShoppingCart,
  Wrench,
  Users,
  Plus,
  Package,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Order, Repair, Profile } from "@/types/database";

interface RecentOrder {
  id: string;
  client: string;
  total: number;
  status: string;
  date: string;
}

interface RecentRepair {
  id: string;
  client: string;
  board: string;
  status: string;
  date: string;
}

const orderStatusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmee",
  shipped: "Expediee",
  delivered: "Livree",
  cancelled: "Annulee",
};

const repairStatusLabels: Record<string, string> = {
  pending: "En attente",
  diagnosed: "Diagnostic",
  in_progress: "En cours",
  completed: "Termine",
  cancelled: "Annule",
};

const statusColors: Record<string, string> = {
  "En attente": "bg-yellow-500/10 text-yellow-400",
  "Confirmee": "bg-blue-500/10 text-blue-400",
  "Expediee": "bg-purple-500/10 text-purple-400",
  "Livree": "bg-green-500/10 text-green-400",
  "Annulee": "bg-red-500/10 text-red-400",
  "Diagnostic": "bg-orange-500/10 text-orange-400",
  "En cours": "bg-blue-500/10 text-blue-400",
  "Termine": "bg-green-500/10 text-green-400",
  "Annule": "bg-red-500/10 text-red-400",
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [repairCount, setRepairCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentRepairs, setRecentRepairs] = useState<RecentRepair[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient();
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      try {
        // Fetch orders this month (not cancelled) for count and revenue
        const { data: monthOrders } = await supabase
          .from("orders")
          .select("*")
          .gte("created_at", startOfMonth)
          .neq("status", "cancelled") as { data: Order[] | null };

        if (monthOrders) {
          setOrderCount(monthOrders.length);
          setRevenue(monthOrders.reduce((sum, o) => sum + (o.total || 0), 0));
        }

        // Active repairs count
        const { count: activeRepairs } = await supabase
          .from("repairs")
          .select("*", { count: "exact", head: true })
          .in("status", ["pending", "diagnosed", "in_progress"]);

        setRepairCount(activeRepairs || 0);

        // New clients this month
        const { count: newClients } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfMonth);

        setClientCount(newClients || 0);

        // 4 most recent orders with profile name
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4) as { data: Order[] | null };

        if (orders) {
          const orderUserIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))] as string[];
          const orderProfileMap: Record<string, Profile> = {};
          if (orderUserIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .in("id", orderUserIds) as { data: Profile[] | null };
            if (profiles) {
              profiles.forEach((p) => { orderProfileMap[p.id] = p; });
            }
          }

          setRecentOrders(
            orders.map((o) => ({
              id: o.id.substring(0, 8).toUpperCase(),
              client: (o.user_id && orderProfileMap[o.user_id]?.full_name) || "Client",
              total: o.total,
              status: orderStatusLabels[o.status] || o.status,
              date: new Date(o.created_at).toLocaleDateString("fr-FR"),
            }))
          );
        }

        // 3 most recent repairs with profile name
        const { data: repairs } = await supabase
          .from("repairs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3) as { data: Repair[] | null };

        if (repairs) {
          const repairUserIds = [...new Set(repairs.map((r) => r.user_id).filter(Boolean))] as string[];
          const repairProfileMap: Record<string, Profile> = {};
          if (repairUserIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .in("id", repairUserIds) as { data: Profile[] | null };
            if (profiles) {
              profiles.forEach((p) => { repairProfileMap[p.id] = p; });
            }
          }

          setRecentRepairs(
            repairs.map((r) => ({
              id: r.id.substring(0, 8).toUpperCase(),
              client: (r.user_id && repairProfileMap[r.user_id]?.full_name) || "Client",
              board: `${r.brand || ""} ${r.board_type}`.trim(),
              status: repairStatusLabels[r.status] || r.status,
              date: new Date(r.created_at).toLocaleDateString("fr-FR"),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Dashboard</h1>
          <p className="text-sm text-blanc-casse/60">Vue d&apos;ensemble de votre activite</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Euro size={24} />}
          label="Chiffre d'affaires du mois"
          value={loading ? "..." : `${revenue.toLocaleString("fr-FR")} EUR`}
        />
        <StatCard
          icon={<ShoppingCart size={24} />}
          label="Commandes ce mois"
          value={loading ? "..." : String(orderCount)}
        />
        <StatCard
          icon={<Wrench size={24} />}
          label="Reparations en cours"
          value={loading ? "..." : String(repairCount)}
        />
        <StatCard
          icon={<Users size={24} />}
          label="Nouveaux clients"
          value={loading ? "..." : String(clientCount)}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-noir-mat/50 p-4 transition-colors hover:border-vert-neon/20 hover:bg-gris-anthracite"
        >
          <div className="rounded-lg bg-vert-neon/10 p-2">
            <Plus size={16} className="text-vert-neon" />
          </div>
          <span className="text-sm font-medium text-blanc-casse">Ajouter un produit</span>
        </Link>
        <Link
          href="/admin/commandes"
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-noir-mat/50 p-4 transition-colors hover:border-vert-neon/20 hover:bg-gris-anthracite"
        >
          <div className="rounded-lg bg-vert-neon/10 p-2">
            <Package size={16} className="text-vert-neon" />
          </div>
          <span className="text-sm font-medium text-blanc-casse">Gerer les commandes</span>
        </Link>
        <Link
          href="/admin/devis/nouveau"
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-noir-mat/50 p-4 transition-colors hover:border-vert-neon/20 hover:bg-gris-anthracite"
        >
          <div className="rounded-lg bg-vert-neon/10 p-2">
            <FileText size={16} className="text-vert-neon" />
          </div>
          <span className="text-sm font-medium text-blanc-casse">Creer un devis</span>
        </Link>
      </div>

      {/* Recent Orders & Repairs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blanc-casse">Commandes recentes</h2>
            <Link
              href="/admin/commandes"
              className="text-xs text-vert-neon hover:text-vert-neon-dark"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-gris-anthracite" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-blanc-casse/40 py-4 text-center">Aucune commande</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">ID</th>
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">Client</th>
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">Total</th>
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-2.5 text-sm font-mono text-blanc-casse/80">{order.id}</td>
                      <td className="py-2.5 text-sm text-blanc-casse/80">{order.client}</td>
                      <td className="py-2.5 text-sm text-blanc-casse/80">{order.total.toFixed(2)} EUR</td>
                      <td className="py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Repairs */}
        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blanc-casse">Reparations recentes</h2>
            <Link
              href="/admin/reparations"
              className="text-xs text-vert-neon hover:text-vert-neon-dark"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-gris-anthracite" />
                ))}
              </div>
            ) : recentRepairs.length === 0 ? (
              <p className="text-sm text-blanc-casse/40 py-4 text-center">Aucune reparation</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">ID</th>
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">Client</th>
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">Board</th>
                    <th className="pb-2 text-left text-xs font-medium text-blanc-casse/50">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentRepairs.map((repair) => (
                    <tr key={repair.id}>
                      <td className="py-2.5 text-sm font-mono text-blanc-casse/80">{repair.id}</td>
                      <td className="py-2.5 text-sm text-blanc-casse/80">{repair.client}</td>
                      <td className="py-2.5 text-sm text-blanc-casse/80">{repair.board}</td>
                      <td className="py-2.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[repair.status] || ""}`}>
                          {repair.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
