"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Wrench, MessageSquare, FileText } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";

const summaryCards = [
  {
    label: "Commandes en cours",
    value: "2",
    icon: ShoppingBag,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    label: "Reparations en cours",
    value: "1",
    icon: Wrench,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    label: "Messages non lus",
    value: "3",
    icon: MessageSquare,
    color: "text-vert-neon",
    bgColor: "bg-vert-neon/10",
    borderColor: "border-vert-neon/20",
  },
  {
    label: "Devis en attente",
    value: "1",
    icon: FileText,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
];

const recentActivity = [
  {
    id: "1",
    type: "commande",
    message: "Commande #1234 expediee",
    date: "Il y a 2 heures",
  },
  {
    id: "2",
    type: "reparation",
    message: "Reparation de votre board en cours",
    date: "Il y a 1 jour",
  },
  {
    id: "3",
    type: "devis",
    message: "Nouveau devis disponible",
    date: "Il y a 3 jours",
  },
  {
    id: "4",
    type: "message",
    message: "Nouveau message du service client",
    date: "Il y a 5 jours",
  },
];

export default function EspaceClientPage() {
  const { profile } = useUser();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">
          Bonjour{profile?.full_name ? `, ${profile.full_name}` : ""} !
        </h1>
        <p className="mt-1 text-blanc-casse/60">
          Bienvenue dans votre espace client GlisseGauloisse.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-5 rounded-2xl bg-gris-anthracite border ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blanc-casse/60">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gris-anthracite border border-white/5 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-blanc-casse mb-4">
          Activite recente
        </h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
            >
              <p className="text-sm text-blanc-casse/80">
                {activity.message}
              </p>
              <span className="text-xs text-blanc-casse/50 whitespace-nowrap ml-4">
                {activity.date}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
