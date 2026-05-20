"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import type { Conversation, Message } from "@/types/database";

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
  const { user, loading: userLoading } = useUser();
  const [conversations, setConversations] = useState<ConversationWithPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchConversations() {
      if (!user) return;
      const supabase = createClient();

      // Fetch conversations
      const { data: convs } = (await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })) as { data: Conversation[] | null };

      if (!convs || convs.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // For each conversation, fetch last message and unread count
      const convIds = convs.map((c) => c.id);

      const { data: allMessages } = (await supabase
        .from("messages")
        .select("*")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: false })) as { data: Message[] | null };

      const messagesMap: Record<string, Message[]> = {};
      if (allMessages) {
        allMessages.forEach((msg) => {
          if (!messagesMap[msg.conversation_id]) {
            messagesMap[msg.conversation_id] = [];
          }
          messagesMap[msg.conversation_id].push(msg);
        });
      }

      const result: ConversationWithPreview[] = convs.map((conv) => {
        const msgs = messagesMap[conv.id] || [];
        const lastMsg = msgs[0] || null;
        const unreadCount = msgs.filter(
          (m) => !m.is_read && m.sender_id !== user.id
        ).length;

        return {
          id: conv.id,
          subject: conv.subject,
          status: conv.status,
          type: conv.type,
          related_id: conv.related_id,
          created_at: conv.created_at,
          lastMessage: lastMsg?.content || null,
          lastMessageDate: lastMsg?.created_at || conv.updated_at,
          unreadCount,
        };
      });

      setConversations(result);
      setLoading(false);
    }

    if (!userLoading && user) {
      fetchConversations();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const handleNewConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSubject.trim() || !newMessage.trim()) return;
    setSending(true);

    try {
      const supabase = createClient();

      // Create conversation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: conv, error: convError } = await (supabase.from("conversations") as any)
        .insert({
          user_id: user.id,
          subject: newSubject.trim(),
          status: "open",
          type: "general",
        })
        .select()
        .single();

      if (convError || !conv) {
        console.error("Error creating conversation:", convError);
        setSending(false);
        return;
      }

      // Create first message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("messages") as any).insert({
        conversation_id: conv.id,
        sender_id: user.id,
        content: newMessage.trim(),
        is_admin: false,
        is_read: false,
        attachments: [],
      });

      router.push(`/espace-client/messages/${conv.id}`);
    } catch (err) {
      console.error("Error creating conversation:", err);
      setSending(false);
    }
  };

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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Mes messages</h1>
          <p className="mt-1 text-blanc-casse/60">
            Consultez vos conversations avec le service client.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 rounded-xl bg-vert-neon/10 px-4 py-2 text-sm font-medium text-vert-neon border border-vert-neon/20 hover:bg-vert-neon/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau message
        </button>
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

      {/* New Message Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir-mat/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-gris-anthracite p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blanc-casse">Nouveau message</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-lg text-blanc-casse/60 hover:bg-white/5 hover:text-blanc-casse"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleNewConversation} className="space-y-4">
              <div>
                <label htmlFor="new-subject" className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Sujet
                </label>
                <input
                  id="new-subject"
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Objet de votre message..."
                  required
                  className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                />
              </div>
              <div>
                <label htmlFor="new-message" className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                  Message
                </label>
                <textarea
                  id="new-message"
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ecrivez votre message..."
                  required
                  className="w-full rounded-xl border border-white/10 bg-noir-mat px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-medium text-noir-mat hover:bg-vert-neon-dark transition-colors disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
