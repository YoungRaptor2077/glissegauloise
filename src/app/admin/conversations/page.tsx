"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ChevronRight, Plus, Search, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";

interface ConversationRow {
  id: string;
  customerName: string;
  subject: string;
  lastMessage: string;
  date: string;
  unread: number;
  status: "open" | "closed";
}

interface ClientOption {
  id: string;
  full_name: string;
  email: string;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "A l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR");
}

export default function AdminConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch('/api/admin/conversations');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setConversations(data.conversations.map((conv: any) => ({
          ...conv,
          date: formatRelativeTime(conv.date),
        })));
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
      setLoading(false);
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    if (showModal && clients.length === 0) {
      async function fetchClients() {
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .order("full_name", { ascending: true });

        if (data) {
          setClients(data as ClientOption[]);
        }
      }
      fetchClients();
    }
  }, [showModal, clients.length]);

  const filteredClients = clients.filter((c) => {
    const search = clientSearch.toLowerCase();
    return (
      (c.full_name || "").toLowerCase().includes(search) ||
      (c.email || "").toLowerCase().includes(search)
    );
  });

  const handleNewConversation = async () => {
    if (!selectedClient || !message.trim()) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/conversations/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedClient.id,
          subject: subject.trim() || "Nouvelle conversation",
          content: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la creation");
        return;
      }

      // Redirect to the new conversation
      router.push(`/admin/conversations/${data.conversation.id}`);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setSending(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
    setClientSearch("");
    setSubject("");
    setMessage("");
    setError(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Conversations</h1>
          <p className="text-sm text-blanc-casse/60">Messagerie avec vos clients</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Conversations</h1>
          <p className="text-sm text-blanc-casse/60">
            Messagerie avec vos clients
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark"
        >
          <Plus size={16} />
          Nouvelle conversation
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-12 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-blanc-casse/20 mb-3" />
          <p className="text-sm text-blanc-casse/40">Aucune conversation</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-medium text-blanc-casse/50 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-blanc-casse/50 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-blanc-casse/50 uppercase tracking-wider">
                    Dernier message
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-blanc-casse/50 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-blanc-casse/50 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {conversations.map((conv) => (
                  <tr
                    key={conv.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-vert-neon/10 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-vert-neon" />
                        </div>
                        <span className="text-sm font-medium text-blanc-casse">
                          {conv.customerName}
                        </span>
                        {conv.unread > 0 && (
                          <Badge variant="neon">{conv.unread}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-blanc-casse/80 max-w-[200px] truncate block">
                        {conv.subject}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-blanc-casse/50 max-w-[200px] truncate block">
                        {conv.lastMessage}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={conv.status === "open" ? "success" : "default"}
                      >
                        {conv.status === "open" ? "Ouvert" : "Ferme"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-blanc-casse/50">
                        {conv.date}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/conversations/${conv.id}`}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors inline-flex"
                      >
                        <ChevronRight className="h-4 w-4 text-blanc-casse/40" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Conversation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-noir-mat p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-blanc-casse">Nouvelle conversation</h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-blanc-casse/60 hover:bg-gris-anthracite hover:text-blanc-casse transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Client Selection */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                Client
              </label>
              {selectedClient ? (
                <div className="flex items-center justify-between rounded-xl border border-vert-neon/20 bg-vert-neon/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vert-neon/10">
                      <User size={14} className="text-vert-neon" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blanc-casse">{selectedClient.full_name || "Sans nom"}</p>
                      <p className="text-xs text-blanc-casse/50">{selectedClient.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blanc-casse/40" />
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Rechercher par nom ou email..."
                      className="w-full rounded-xl border border-white/10 bg-gris-anthracite pl-9 pr-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-gris-anthracite">
                    {filteredClients.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-blanc-casse/50">Aucun client trouve</p>
                    ) : (
                      filteredClients.slice(0, 15).map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClient(client);
                            setClientSearch("");
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-vert-neon/5 transition-colors"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
                            <User size={12} className="text-blanc-casse/60" />
                          </div>
                          <div>
                            <p className="text-sm text-blanc-casse">{client.full_name || "Sans nom"}</p>
                            <p className="text-xs text-blanc-casse/40">{client.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                Sujet (optionnel)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Suivi de votre reparation"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message au client..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse placeholder:text-blanc-casse/40 focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-blanc-casse/80 transition-colors hover:bg-gris-anthracite"
              >
                Annuler
              </button>
              <button
                onClick={handleNewConversation}
                disabled={!selectedClient || !message.trim() || sending}
                className="flex-1 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
