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
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        setRevenue(data.revenue);
        setOrderCount(data.orderCount);
        setRepairCount(data.repairCount);
        setClientCount(data.clientCount);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setRecentOrders(data.recentOrders.map((o: any) => ({
          ...o,
          status: orderStatusLabels[o.status] || o.status,
        })));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setRecentRepairs(data.recentRepairs.map((r: any) => ({
          ...r,
          status: repairStatusLabels[r.status] || r.status,
        })));
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
