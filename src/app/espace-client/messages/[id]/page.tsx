"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { ChatInput } from "@/components/messages/ChatInput";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import {
  subscribeToMessages,
  unsubscribeChannel,
} from "@/lib/supabase/realtime";
import type { RealtimeMessage } from "@/lib/supabase/realtime";
import type { Conversation, Message } from "@/types/database";

interface MessageItem {
  id: string;
  content: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
}

interface ConversationInfo {
  id: string;
  subject: string;
  status: "open" | "closed";
  related_order_id: string | null;
  related_repair_id: string | null;
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { user, loading: userLoading } = useUser();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversation, setConversation] = useState<ConversationInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch conversation and messages
  useEffect(() => {
    async function fetchData() {
      if (!conversationId || !user) return;
      const supabase = createClient();

      // Fetch conversation and verify ownership
      const { data: conv } = (await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single()) as { data: Conversation | null };

      if (!conv) {
        setLoading(false);
        return;
      }

      // Security: verify user owns this conversation
      if (conv.user_id !== user.id) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      setConversation({
        id: conv.id,
        subject: conv.subject,
        status: conv.status,
        related_order_id: conv.related_order_id,
        related_repair_id: conv.related_repair_id,
      });

      // Fetch messages
      const { data: msgs } = (await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })) as {
        data: Message[] | null;
      };

      if (msgs) {
        setMessages(msgs);
      }

      // Mark unread messages from admin as read
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: markError } = await (supabase.from("messages") as any)
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .neq("sender_id", user.id);
      if (markError) {
        console.error("Failed to mark messages as read:", markError);
      }

      setLoading(false);
    }

    if (!userLoading && user) {
      fetchData();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [conversationId, user, userLoading]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = subscribeToMessages(
      conversationId,
      (newMsg: RealtimeMessage) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        // Mark as read if from admin (not sent by current user)
        if (newMsg.sender_id !== user.id) {
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
      }
    );

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
      const { data, error } = (await (supabase.from("messages") as any)
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          attachments: [],
          is_read: false,
        })
        .select()
        .single()) as { data: Message | null; error: unknown };

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

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="h-8 w-8 border-2 border-vert-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-sm text-blanc-casse/40">
          Vous n&apos;avez pas acces a cette conversation.
        </p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p className="text-sm text-blanc-casse/40">Conversation introuvable.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-12rem)]"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/5">
        <Link
          href="/espace-client/messages"
          className="p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-blanc-casse/60" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-blanc-casse truncate">
            {conversation.subject}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {conversation.related_repair_id ? (
              <Wrench className="h-3.5 w-3.5 text-vert-neon" />
            ) : conversation.related_order_id ? (
              <Package className="h-3.5 w-3.5 text-vert-neon" />
            ) : null}
            {(conversation.related_repair_id ||
              conversation.related_order_id) && (
              <span className="text-xs text-blanc-casse/50">
                {(
                  conversation.related_repair_id ||
                  conversation.related_order_id ||
                  ""
                )
                  .slice(0, 8)
                  .toUpperCase()}
              </span>
            )}
            <Badge
              variant={conversation.status === "open" ? "success" : "default"}
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
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            content={msg.content}
            timestamp={formatTimestamp(msg.created_at)}
            isSent={msg.sender_id === user?.id}
            senderName={
              msg.sender_id !== user?.id ? "GlisseGauloise" : undefined
            }
            isRead={msg.is_read}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={conversation.status === "closed"}
      />
    </motion.div>
  );
}
