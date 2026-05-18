"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const mockConversations = [
  {
    id: "1",
    subject: "Question sur ma reparation REP-2024-001",
    lastMessage: "Bonjour, votre reparation est en cours. Nous estimons...",
    date: "Il y a 2h",
    unread: 2,
    linkedType: "Reparation",
    status: "open",
  },
  {
    id: "2",
    subject: "Suivi commande CMD-2024-001",
    lastMessage: "Votre colis a ete expedie ce matin via Colissimo...",
    date: "Il y a 1 jour",
    unread: 0,
    linkedType: "Commande",
    status: "open",
  },
  {
    id: "3",
    subject: "Devis remplacement fixations",
    lastMessage:
      "Merci pour votre retour. Nous allons proceder a la commande...",
    date: "Il y a 3 jours",
    unread: 0,
    linkedType: "Devis",
    status: "closed",
  },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">Mes messages</h1>
        <p className="mt-1 text-blanc-casse/60">
          Consultez vos conversations avec le service client.
        </p>
      </motion.div>

      <div className="space-y-3">
        {mockConversations.map((conv, index) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-5 bg-gris-anthracite border border-white/5 rounded-2xl hover:border-white/10 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-xl bg-vert-neon/10">
                  <MessageSquare className="h-5 w-5 text-vert-neon" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-blanc-casse truncate">
                      {conv.subject}
                    </p>
                    {conv.unread > 0 && (
                      <Badge variant="neon">{conv.unread}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-blanc-casse/50 mt-1 truncate">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default">{conv.linkedType}</Badge>
                    {conv.status === "closed" && (
                      <Badge variant="default">Ferme</Badge>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-blanc-casse/50 whitespace-nowrap">
                {conv.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
