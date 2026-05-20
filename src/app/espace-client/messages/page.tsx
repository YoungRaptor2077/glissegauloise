"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface ConversationWithPreview {
  id: string;
  subject: string;
  status: "open" | "closed" | "archived";
  type: "general" | "quote" | "repair" | "order" | "support";
  related_id: string | null;
  created_at: string;
  lastMessage: string | null;
  lastMessageDate: string | null;
  unreadCount: number;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Hier";
  } else {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

function getLinkedType(conv: ConversationWithPreview): string | null {
  if (conv.type === "repair") return "Reparation";
  if (conv.type === "order") return "Commande";
  if (conv.type === "quote") return "Devis";
  return null;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationWithPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  if (loading) {
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
        <h1 className="text-2xl font-bold text-blanc-casse">Mes messages</h1>
        <p className="mt-1 text-blanc-casse/60">
          Consultez vos conversations avec le service client.
        </p>
      </motion.div>

      {conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <MessageSquare className="h-12 w-12 text-blanc-casse/20 mx-auto mb-4" />
          <p className="text-blanc-casse/50">Aucun message pour le moment</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv, index) => {
            const linkedType = getLinkedType(conv);
            return (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/espace-client/messages/${conv.id}`}>
                  <div className="p-5 bg-gris-anthracite border border-white/5 rounded-2xl hover:border-white/10 transition-colors cursor-pointer">
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
                            {conv.unreadCount > 0 && (
                              <Badge variant="neon">{conv.unreadCount}</Badge>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-sm text-blanc-casse/50 mt-1 truncate">
                              {conv.lastMessage}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {linkedType && (
                              <Badge variant="default">{linkedType}</Badge>
                            )}
                            {conv.status === "closed" && (
                              <Badge variant="default">Ferme</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {conv.lastMessageDate && (
                        <span className="text-xs text-blanc-casse/50 whitespace-nowrap">
                          {formatRelativeDate(conv.lastMessageDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
