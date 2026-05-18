"use client";

import { motion } from "framer-motion";
import { Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "En attente", variant: "warning" },
  confirmed: { label: "Confirmee", variant: "neon" },
  shipped: { label: "Expediee", variant: "success" },
  delivered: { label: "Livree", variant: "success" },
  cancelled: { label: "Annulee", variant: "error" },
};

const mockOrders = [
  {
    id: "CMD-2024-001",
    date: "15/01/2024",
    status: "shipped",
    total: 189.99,
    items: 3,
  },
  {
    id: "CMD-2024-002",
    date: "20/01/2024",
    status: "pending",
    total: 65.5,
    items: 1,
  },
  {
    id: "CMD-2024-003",
    date: "05/12/2023",
    status: "delivered",
    total: 320.0,
    items: 5,
  },
  {
    id: "CMD-2023-045",
    date: "10/11/2023",
    status: "cancelled",
    total: 45.0,
    items: 2,
  },
];

export default function CommandesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">Mes commandes</h1>
        <p className="mt-1 text-blanc-casse/60">
          Suivez vos commandes et consultez leur statut.
        </p>
      </motion.div>

      <div className="space-y-3">
        {mockOrders.map((order, index) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-5 bg-gris-anthracite border border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5">
                  <Package className="h-5 w-5 text-blanc-casse/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blanc-casse">
                    {order.id}
                  </p>
                  <p className="text-xs text-blanc-casse/50 mt-0.5">
                    {order.date} - {order.items} article
                    {order.items > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <Badge variant={status.variant}>{status.label}</Badge>
                <p className="text-sm font-semibold text-blanc-casse">
                  {order.total.toFixed(2)} EUR
                </p>
                <button className="p-2 rounded-lg hover:bg-white/5 text-blanc-casse/60 hover:text-blanc-casse transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
