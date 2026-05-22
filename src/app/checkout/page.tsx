"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [loyaltyData, setLoyaltyData] = useState<{ hasReward: boolean; rewardPercent: number; points: number } | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const shippingCost = total >= 100 ? 0 : 5.9;
  const discountPercent = discountApplied && loyaltyData?.hasReward ? loyaltyData.rewardPercent : 0;
  const discountAmount = (total * discountPercent) / 100;
  const orderTotal = total - discountAmount + shippingCost;

  useEffect(() => {
    async function checkLoyalty() {
      try {
        const res = await fetch("/api/loyalty");
        if (res.ok) {
          const data = await res.json();
          setLoyaltyData(data);
        }
      } catch {}
    }
    checkLoyalty();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerEmail: formData.email,
          shippingAddress: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          discount: discountApplied ? discountPercent : 0,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert("Erreur: " + data.error);
      } else {
        alert("Erreur lors de la creation du paiement. Veuillez reessayer.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erreur de connexion. Veuillez reessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="rounded-full bg-gris-anthracite p-6 mb-6">
          <ShoppingBag className="h-10 w-10 text-blanc-casse/40" />
        </div>
        <h1 className="text-2xl font-bold text-blanc-casse mb-2">
          Votre panier est vide
        </h1>
        <p className="text-blanc-casse/60 mb-6">
          Ajoutez des articles depuis notre boutique pour passer commande.
        </p>
        <Link
          href="/boutique"
          className="px-6 py-3 rounded-xl bg-vert-neon text-noir-mat font-semibold hover:bg-vert-neon-dark transition-colors"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-blanc-casse mb-8"
      >
        Finaliser la commande
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/5 bg-gris-anthracite p-6"
            >
              <h2 className="text-lg font-semibold text-blanc-casse flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-vert-neon" />
                Adresse de livraison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-blanc-casse/70 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-noir-mat border border-white/10 text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50 transition-colors"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-blanc-casse/70 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-noir-mat border border-white/10 text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50 transition-colors"
                    placeholder="jean@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-blanc-casse/70 mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-noir-mat border border-white/10 text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50 transition-colors"
                    placeholder="12 Rue de la Glisse"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blanc-casse/70 mb-1.5">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-noir-mat border border-white/10 text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50 transition-colors"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm text-blanc-casse/70 mb-1.5">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-noir-mat border border-white/10 text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none focus:border-vert-neon/50 transition-colors"
                    placeholder="75001"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/5 bg-gris-anthracite p-6"
            >
              <h2 className="text-lg font-semibold text-blanc-casse flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-vert-neon" />
                Paiement
              </h2>
              <p className="text-sm text-blanc-casse/60">
                Vous serez redirige vers la page de paiement securisee Stripe
                pour finaliser votre commande.
              </p>
            </motion.div>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-blanc-casse mb-4">
                Recapitulatif
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-noir-mat shrink-0">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blanc-casse truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-blanc-casse/50">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="text-sm text-blanc-casse font-medium">
                      {(item.price * item.quantity).toFixed(2)} EUR
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blanc-casse/60">Sous-total</span>
                  <span className="text-blanc-casse">{total.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blanc-casse/60">Livraison</span>
                  <span className="text-blanc-casse">
                    {shippingCost === 0
                      ? "Gratuite"
                      : `${shippingCost.toFixed(2)} EUR`}
                  </span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-vert-neon">Remise fidelite (-{discountPercent}%)</span>
                    <span className="text-vert-neon">-{discountAmount.toFixed(2)} EUR</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/5">
                  <span className="text-blanc-casse">Total</span>
                  <span className="text-vert-neon">
                    {orderTotal.toFixed(2)} EUR
                  </span>
                </div>
              </div>

              {loyaltyData?.hasReward && !discountApplied && (
                <div className="p-4 rounded-xl border border-vert-neon/20 bg-vert-neon/5 mb-4 mt-4">
                  <p className="text-sm text-vert-neon font-medium mb-2">
                    Vous avez droit a {loyaltyData.rewardPercent}% de remise !
                  </p>
                  <button
                    type="button"
                    onClick={() => setDiscountApplied(true)}
                    className="text-xs font-semibold text-noir-mat bg-vert-neon px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Appliquer ma remise fidelite
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 px-6 py-3.5 rounded-xl bg-vert-neon text-noir-mat font-semibold hover:bg-vert-neon-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  "Proceder au paiement"
                )}
              </button>

              <p className="text-[10px] text-blanc-casse/40 text-center mt-3">
                Paiement securise par Stripe. Vos donnees bancaires ne sont
                jamais stockees sur nos serveurs.
              </p>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
