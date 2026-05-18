"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { ChatInput } from "@/components/messages/ChatInput";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { subscribeToMessages, unsubscribeChannel } from "@/lib/supabase/realtime";
import type { RealtimeMessage } from "@/lib/supabase/realtime";
import type { Conversation, Profile, Message } from "@/types/database";

interface MessageItem {
  id: string;
  content: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string | null;
}

interface ConversationInfo {
  id: string;
  subject: string;
  status: "open" | "closed";
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { user } = useUser();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch conversation data
  useEffect(() => {
    async function fetchData() {
      if (!conversationId) return;
      const supabase = createClient();

      // Fetch conversation
      const { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single() as { data: Conversation | null };

      if (conv) {
        setConversation({
          id: conv.id,
          subject: conv.subject,
          status: conv.status,
        });

        // Fetch customer profile
        if (conv.user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", conv.user_id)
            .single() as { data: Profile | null };
          if (profile) {
            setCustomer({
              name: profile.full_name || "Client",
              email: profile.email,
              phone: profile.phone,
            });
          }
        }
      }

      // Fetch messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }) as { data: Message[] | null };

      if (msgs) {
        setMessages(msgs);
      }

      // Mark unread messages as read (those not sent by current admin)
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: markError } = await (supabase.from("messages") as any)
          .update({ is_read: true })
          .eq("conversation_id", conversationId)
          .eq("is_read", false)
          .neq("sender_id", user.id);
        if (markError) {
          console.error("Failed to mark messages as read:", markError);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [conversationId, user]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = subscribeToMessages(conversationId, (newMsg: RealtimeMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      // Mark as read if from customer
      if (user && newMsg.sender_id !== user.id) {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("messages") as any)
          .update({ is_read: true })
          .eq("id", newMsg.id)
          .then(() => {})
          .catch((err: unknown) => {
            console.error("Failed to mark message as read:", err);
          });
      }
    });

    return () => {
      unsubscribeChannel(channel);
    };
  }, [conversationId, user]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!user || !conversationId) return;
      setError(null);
      const supabase = createClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from("messages") as any)
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          attachments: [],
          is_read: false,
        })
        .select()
        .single() as { data: Message | null; error: unknown };

      if (!error && data) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      } else if (error) {
        setError("Erreur lors de l'envoi du message.");
      }
    },
    [user, conversationId]
  );

  const handleCloseConversation = async () => {
    if (!conversationId) return;
    setError(null);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("conversations") as any)
      .update({ status: "closed" })
      .eq("id", conversationId);

    if (!error) {
      setConversation((prev) => prev ? { ...prev, status: "closed" } : null);
    } else {
      setError("Erreur lors de la fermeture de la conversation.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-sm text-blanc-casse/40">Chargement...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-sm text-blanc-casse/40">Conversation introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-white/5">
          <Link
            href="/admin/conversations"
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-blanc-casse/60" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-blanc-casse truncate">
              {conversation.subject}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  conversation.status === "open" ? "success" : "default"
                }
              >
                {conversation.status === "open" ? "Ouvert" : "Ferme"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-2">
              {error}
            </div>
          )}
          {messages.length === 0 ? (
            <p className="text-sm text-blanc-casse/40 text-center py-8">Aucun message</p>
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                content={msg.content}
                timestamp={formatTimestamp(msg.created_at)}
                isSent={user ? msg.sender_id === user.id : false}
                senderName={
                  user && msg.sender_id !== user.id ? customer?.name : undefined
                }
                isRead={msg.is_read}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          placeholder="Repondre au client..."
          disabled={conversation.status === "closed"}
        />
      </div>

      {/* Sidebar */}
      <div className="w-72 shrink-0 space-y-4 overflow-y-auto hidden lg:block">
        {/* Customer info */}
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-4">
          <h3 className="text-sm font-medium text-blanc-casse mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-vert-neon" />
            Client
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-blanc-casse">{customer?.name}</p>
            {customer?.email && (
              <div className="flex items-center gap-2 text-xs text-blanc-casse/60">
                <Mail className="h-3.5 w-3.5" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer?.phone && (
              <div className="flex items-center gap-2 text-xs text-blanc-casse/60">
                <Phone className="h-3.5 w-3.5" />
                <span>{customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status change */}
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-4">
          <h3 className="text-sm font-medium text-blanc-casse mb-3">
            Actions
          </h3>
          {conversation.status === "open" ? (
            <button
              type="button"
              onClick={handleCloseConversation}
              className="w-full px-4 py-2 text-sm rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Fermer la conversation
            </button>
          ) : (
            <p className="text-xs text-blanc-casse/40">Conversation fermee</p>
          )}
        </div>
      </div>
    </div>
  );
}
