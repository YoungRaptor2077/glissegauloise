"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Wrench } from "lucide-react";
import Link from "next/link";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { ChatInput } from "@/components/messages/ChatInput";
import { Badge } from "@/components/ui/Badge";

interface MockMessage {
  id: string;
  content: string;
  sender_id: string;
  is_read: boolean;
  created_at: string;
}

const CURRENT_USER_ID = "user-1";

const mockMessages: MockMessage[] = [
  {
    id: "1",
    content: "Bonjour, je voudrais savoir ou en est ma reparation ?",
    sender_id: "user-1",
    is_read: true,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    content:
      "Bonjour ! Votre reparation est en cours. Nous avons recu les pieces de rechange et le technicien travaille dessus actuellement.",
    sender_id: "admin-1",
    is_read: true,
    created_at: "2024-01-15T11:15:00Z",
  },
  {
    id: "3",
    content: "Super, vous pensez que ce sera pret pour quand ?",
    sender_id: "user-1",
    is_read: true,
    created_at: "2024-01-15T11:20:00Z",
  },
  {
    id: "4",
    content:
      "Nous estimons que la reparation sera terminee d'ici vendredi. Nous vous enverrons une notification des que ce sera pret.",
    sender_id: "admin-1",
    is_read: true,
    created_at: "2024-01-15T14:00:00Z",
  },
];

const mockConversation = {
  id: "1",
  subject: "Question sur ma reparation REP-2024-001",
  status: "open" as const,
  linkedType: "repair",
  linkedId: "REP-2024-001",
};

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationDetailPage() {
  const [messages, setMessages] = useState<MockMessage[]>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback((content: string) => {
    const newMessage: MockMessage = {
      id: Date.now().toString(),
      content,
      sender_id: CURRENT_USER_ID,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

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
            {mockConversation.subject}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {mockConversation.linkedType === "repair" ? (
              <Wrench className="h-3.5 w-3.5 text-vert-neon" />
            ) : (
              <Package className="h-3.5 w-3.5 text-vert-neon" />
            )}
            <span className="text-xs text-blanc-casse/50">
              {mockConversation.linkedId}
            </span>
            <Badge
              variant={
                mockConversation.status === "open" ? "success" : "default"
              }
            >
              {mockConversation.status === "open" ? "Ouvert" : "Ferme"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            content={msg.content}
            timestamp={formatTimestamp(msg.created_at)}
            isSent={msg.sender_id === CURRENT_USER_ID}
            senderName={
              msg.sender_id !== CURRENT_USER_ID ? "GlisseGauloisse" : undefined
            }
            isRead={msg.is_read}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </motion.div>
  );
}
