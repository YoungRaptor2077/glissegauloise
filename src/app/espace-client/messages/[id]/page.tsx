"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { ChatInput } from "@/components/messages/ChatInput";
import { Badge } from "@/components/ui/Badge";

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
  status: "open" | "closed" | "archived";
  type: "general" | "quote" | "repair" | "order" | "support";
  related_id: string | null;
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

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [conversation, setConversation] = useState<ConversationInfo | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);
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
      if (!conversationId) return;

      try {
        const res = await fetch(`/api/messages/${conversationId}`);

        if (res.status === 401) {
          setLoading(false);
          return;
        }

        if (res.status === 403) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }

        if (res.status === 404) {
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setConversation(data.conversation);
        setMessages(data.messages || []);

        // Extract user ID from messages (sender that is not admin)
        if (data.messages && data.messages.length > 0) {
          const clientMsg = data.messages.find(
            (m: MessageItem & { is_admin?: boolean }) => !m.is_admin
          );
          if (clientMsg) {
            setUserId(clientMsg.sender_id);
          }
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [conversationId]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!conversationId || !conversation) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          if (data.conversation) {
            setConversation(data.conversation);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId, conversation]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!conversationId) return;
      setError(null);

      try {
        const res = await fetch(`/api/messages/${conversationId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.message.id)) return prev;
              return [...prev, data.message];
            });
            if (!userId) {
              setUserId(data.message.sender_id);
            }
          }
        } else {
          setError("Erreur lors de l'envoi du message.");
        }
      } catch {
        setError("Erreur lors de l'envoi du message.");
      }
    },
    [conversationId, userId]
  );

  if (loading) {
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
            {conversation.type === "repair" ? (
              <Wrench className="h-3.5 w-3.5 text-vert-neon" />
            ) : conversation.type === "order" ? (
              <Package className="h-3.5 w-3.5 text-vert-neon" />
            ) : null}
            {conversation.related_id && (
              <span className="text-xs text-blanc-casse/50">
                {conversation.related_id.slice(0, 8).toUpperCase()}
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
            isSent={msg.sender_id === userId}
            senderName={
              msg.sender_id !== userId ? "GlisseGauloise" : undefined
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
