"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Eye, X, Truck, MapPin, Star } from "lucide-react";
import { generateInvoicePDF } from "@/lib/invoice";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import type { Order } from "@/types/database";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "En attente", variant: "warning" },
  confirmed: { label: "Confirmee", variant: "neon" },
  shipped: { label: "Expediee", variant: "success" },
  delivered: { label: "Livree", variant: "success" },
  cancelled: { label: "Annulee", variant: "error" },
};

const timelineSteps = ["pending", "confirmed", "shipped", "delivered"];

interface OrderItem {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  qty?: number;
}

interface ShippingAddress {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = timelineSteps.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 mt-4">
      {timelineSteps.map((step, index) => {
        const stepLabel =
          statusConfig[step]?.label || step;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  index <= currentIndex ? "bg-vert-neon" : "bg-white/20"
                }`}
              />
              <span className="text-[10px] text-blanc-casse/50 mt-1">
                {stepLabel}
              </span>
            </div>
            {index < timelineSteps.length - 1 && (
              <div
                className={`h-0.5 w-8 mb-4 ${
                  index < currentIndex ? "bg-vert-neon" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CommandesPage() {
  const { user, loading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const supabase = createClient();
      const { data } = (await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })) as { data: Order[] | null };

      if (data) {
        setOrders(data);
      }
      setLoading(false);
    }

    if (!userLoading && user) {
      fetchOrders();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-vert-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Package className="h-12 w-12 text-blanc-casse/20 mx-auto mb-4" />
          <p className="text-blanc-casse/50">Aucune commande pour le moment</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const items = Array.isArray(order.items) ? order.items : [];
            const itemCount = items.length;
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
                      GG-{order.id.slice(0, 4).toUpperCase()}
                    </p>
                    <p className="text-xs text-blanc-casse/50 mt-0.5">
                      {formatDate(order.created_at)} - {itemCount} article
                      {itemCount > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <p className="text-sm font-semibold text-blanc-casse">
                    {order.total.toFixed(2)} EUR
                  </p>
                  {order.status === "delivered" && (
                    <Link
                      href="/avis"
                      className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition-colors flex items-center gap-1"
                    >
                      <Star size={12} /> Noter
                    </Link>
                  )}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 rounded-lg hover:bg-white/5 text-blanc-casse/60 hover:text-blanc-casse transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gris-anthracite border border-white/10 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-blanc-casse">
                  Commande GG-{selectedOrder.id.slice(0, 4).toUpperCase()}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-blanc-casse/60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status */}
              <div className="mb-6">
                <Badge
                  variant={
                    (statusConfig[selectedOrder.status] || statusConfig.pending)
                      .variant
                  }
                >
                  {
                    (statusConfig[selectedOrder.status] || statusConfig.pending)
                      .label
                  }
                </Badge>
                {selectedOrder.status !== "cancelled" && (
                  <OrderTimeline currentStatus={selectedOrder.status} />
                )}
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-blanc-casse mb-3">
                  Articles commandes
                </h3>
                <div className="space-y-2">
                  {(
                    (Array.isArray(selectedOrder.items)
                      ? selectedOrder.items
                      : []) as OrderItem[]
                  ).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-noir-mat rounded-xl"
                    >
                      <div>
                        <p className="text-sm text-blanc-casse">
                          {item.name || `Article ${i + 1}`}
                        </p>
                        <p className="text-xs text-blanc-casse/50">
                          Quantite : {item.quantity || item.qty || 1}
                        </p>
                      </div>
                      {item.price && (
                        <p className="text-sm font-medium text-blanc-casse">
                          {(item.price * (item.quantity || item.qty || 1)).toFixed(2)} EUR
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="mb-6 p-4 bg-noir-mat rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blanc-casse/60">Sous-total</span>
                  <span className="text-blanc-casse">
                    {selectedOrder.subtotal.toFixed(2)} EUR
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blanc-casse/60">Livraison</span>
                  <span className="text-blanc-casse">
                    {selectedOrder.shipping_cost.toFixed(2)} EUR
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2">
                  <span className="text-blanc-casse">Total</span>
                  <span className="text-vert-neon">
                    {selectedOrder.total.toFixed(2)} EUR
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-blanc-casse mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse de livraison
                  </h3>
                  <div className="p-3 bg-noir-mat rounded-xl text-sm text-blanc-casse/70">
                    {(() => {
                      const addr = selectedOrder.shipping_address as ShippingAddress;
                      return (
                        <>
                          {addr.name && <p>{addr.name}</p>}
                          {addr.address && <p>{addr.address}</p>}
                          {(addr.postalCode || addr.city) && (
                            <p>
                              {addr.postalCode} {addr.city}
                            </p>
                          )}
                          {addr.country && <p>{addr.country}</p>}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Tracking */}
              {selectedOrder.tracking_number && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-blanc-casse mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Suivi
                  </h3>
                  <p className="text-sm text-blanc-casse/70 p-3 bg-noir-mat rounded-xl font-mono">
                    {selectedOrder.tracking_number}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  const items = Array.isArray(selectedOrder.items) ? selectedOrder.items : [];
                  generateInvoicePDF({
                    orderNumber: `GG-${selectedOrder.id.slice(0, 4).toUpperCase()}`,
                    date: formatDate(selectedOrder.created_at),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    customerName: (selectedOrder as any).customer_name || "",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    customerEmail: (selectedOrder as any).customer_email || "",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    items: items.map((item: any) => ({
                      name: item.name || "Article",
                      quantity: item.qty || item.quantity || 1,
                      price: item.price || 0,
                    })),
                    total: selectedOrder.total,
                  });
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-vert-neon/10 border border-vert-neon/20 px-4 py-3 text-sm font-medium text-vert-neon hover:bg-vert-neon/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Telecharger la facture (PDF)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
