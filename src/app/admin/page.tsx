"use client";

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

const recentOrders = [
  { id: "CMD-001", client: "Jean Dupont", total: "149.90", status: "En cours", date: "2024-01-15" },
  { id: "CMD-002", client: "Marie Martin", total: "89.00", status: "Expediee", date: "2024-01-14" },
  { id: "CMD-003", client: "Pierre Durand", total: "299.99", status: "Livree", date: "2024-01-13" },
  { id: "CMD-004", client: "Sophie Bernard", total: "59.90", status: "En attente", date: "2024-01-12" },
];

const recentRepairs = [
  { id: "REP-001", client: "Lucas Moreau", board: "Snowboard Burton", status: "Diagnostic", date: "2024-01-15" },
  { id: "REP-002", client: "Emma Petit", board: "Ski Rossignol", status: "En cours", date: "2024-01-14" },
  { id: "REP-003", client: "Hugo Leroy", board: "Snowboard Lib Tech", status: "Termine", date: "2024-01-13" },
];

const statusColors: Record<string, string> = {
  "En cours": "bg-blue-500/10 text-blue-400",
  "Expediee": "bg-purple-500/10 text-purple-400",
  "Livree": "bg-green-500/10 text-green-400",
  "En attente": "bg-yellow-500/10 text-yellow-400",
  "Diagnostic": "bg-orange-500/10 text-orange-400",
  "Termine": "bg-green-500/10 text-green-400",
};

export default function AdminDashboard() {
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
          value="12 450 EUR"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={<ShoppingCart size={24} />}
          label="Commandes en cours"
          value="23"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon={<Wrench size={24} />}
          label="Reparations en cours"
          value="7"
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          icon={<Users size={24} />}
          label="Nouveaux clients"
          value="34"
          trend={{ value: 15, isPositive: true }}
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
                    <td className="py-2.5 text-sm text-blanc-casse/80">{order.total} EUR</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </div>
        </div>
      </div>
    </div>
  );
}
