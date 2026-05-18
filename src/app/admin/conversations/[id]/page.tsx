"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, User, Package, Wrench, Mail, Phone } from "lucide-react";
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

const ADMIN_ID = "admin-1";

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

const mockCustomer = {
  name: "Jean Dupont",
  email: "jean.dupont@email.com",
  phone: "06 12 34 56 78",
};

const mockConversation = {
  id: "1",
  subject: "Question sur ma reparation REP-2024-001",
  status: "open" as const,
  linkedType: "repair",
  linkedId: "REP-2024-001",
  linkedStatus: "in_progress",
};

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminConversationDetailPage() {
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
      sender_id: ADMIN_ID,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

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
              {mockConversation.subject}
            </h1>
            <div className="flex items-center gap-2 mt-1">
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
              isSent={msg.sender_id === ADMIN_ID}
              senderName={
                msg.sender_id !== ADMIN_ID ? mockCustomer.name : undefined
              }
              isRead={msg.is_read}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} placeholder="Repondre au client..." />
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
            <p className="text-sm text-blanc-casse">{mockCustomer.name}</p>
            <div className="flex items-center gap-2 text-xs text-blanc-casse/60">
              <Mail className="h-3.5 w-3.5" />
              <span>{mockCustomer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blanc-casse/60">
              <Phone className="h-3.5 w-3.5" />
              <span>{mockCustomer.phone}</span>
            </div>
          </div>
        </div>

        {/* Linked entity */}
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-4">
          <h3 className="text-sm font-medium text-blanc-casse mb-3 flex items-center gap-2">
            {mockConversation.linkedType === "repair" ? (
              <Wrench className="h-4 w-4 text-vert-neon" />
            ) : (
              <Package className="h-4 w-4 text-vert-neon" />
            )}
            {mockConversation.linkedType === "repair"
              ? "Reparation"
              : "Commande"}
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-blanc-casse">
              {mockConversation.linkedId}
            </p>
            <Badge variant="warning">
              {mockConversation.linkedStatus === "in_progress"
                ? "En cours"
                : mockConversation.linkedStatus}
            </Badge>
          </div>
        </div>

        {/* Status change */}
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-4">
          <h3 className="text-sm font-medium text-blanc-casse mb-3">
            Actions
          </h3>
          <button
            type="button"
            className="w-full px-4 py-2 text-sm rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            Fermer la conversation
          </button>
        </div>
      </div>
    </div>
  );
}
