"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const orderNumber = `CMD-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-lg w-full text-center"
      >
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-vert-neon/10 border border-vert-neon/30 mb-6"
        >
          <CheckCircle className="h-10 w-10 text-vert-neon" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-blanc-casse mb-3"
        >
          Commande confirmee !
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-blanc-casse/60 mb-8"
        >
          Merci pour votre achat. Vous recevrez un email de confirmation avec le
          detail de votre commande.
        </motion.p>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/5 bg-gris-anthracite p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-5 w-5 text-vert-neon" />
            <span className="text-sm font-medium text-blanc-casse">
              Numero de commande
            </span>
          </div>
          <p className="text-lg font-mono font-bold text-vert-neon">
            {orderNumber}
          </p>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-sm text-blanc-casse/60">
              Delai de livraison estime : 3-5 jours ouvrables
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/espace-client"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-blanc-casse hover:bg-white/5 transition-colors"
          >
            Suivre ma commande
          </Link>
          <Link
            href="/boutique"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-vert-neon text-noir-mat font-semibold hover:bg-vert-neon-dark transition-colors"
          >
            Continuer mes achats
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
