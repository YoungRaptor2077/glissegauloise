"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, isOpen, closeCart } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-gris-anthracite border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-vert-neon" />
                <h2 className="text-lg font-semibold text-blanc-casse">
                  Panier ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-gris-anthracite-light transition-colors"
              >
                <X className="h-5 w-5 text-blanc-casse/70" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-blanc-casse/20 mb-4" />
                  <p className="text-blanc-casse/60 text-lg">
                    Votre panier est vide
                  </p>
                  <p className="text-blanc-casse/40 text-sm mt-2">
                    Ajoutez des produits depuis la boutique
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 p-4 rounded-xl bg-gris-anthracite-light/50 border border-white/5"
                    >
                      <div className="w-16 h-16 rounded-lg bg-noir-mat flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-6 w-6 text-blanc-casse/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-blanc-casse truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-blanc-casse/50 mt-0.5">
                          {item.brand}
                        </p>
                        <p className="text-sm font-semibold text-vert-neon mt-1">
                          {item.price.toFixed(2)} EUR
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded-md hover:bg-noir-mat transition-colors"
                          >
                            <Minus className="h-3 w-3 text-blanc-casse/70" />
                          </button>
                          <span className="text-sm text-blanc-casse w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded-md hover:bg-noir-mat transition-colors"
                          >
                            <Plus className="h-3 w-3 text-blanc-casse/70" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 rounded-md hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blanc-casse/70">Sous-total</span>
                  <span className="text-lg font-bold text-blanc-casse">
                    {total.toFixed(2)} EUR
                  </span>
                </div>
                <Button className="w-full" size="lg">
                  Commander
                </Button>
                <p className="text-xs text-center text-blanc-casse/40">
                  Livraison calculée à l&apos;étape suivante
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
