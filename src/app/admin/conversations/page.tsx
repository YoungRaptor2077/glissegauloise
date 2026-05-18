"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import type { Conversation, Profile, Message } from "@/types/database";

interface ConversationRow {
  id: string;
  customerName: string;
  subject: string;
  lastMessage: string;
  date: string;
  unread: number;
  status: "open" | "closed";
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
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchConversations() {
      const supabase = createClient();

      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false }) as { data: Conversation[] | null };

      if (data) {
        // Fetch profiles
        const userIds = [...new Set(data.map((c) => c.user_id).filter(Boolean))] as string[];
        const profileMap: Record<string, Profile> = {};

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds) as { data: Profile[] | null };
          if (profiles) {
            profiles.forEach((p) => { profileMap[p.id] = p; });
          }
        }

        const convRows: ConversationRow[] = [];

        for (const conv of data) {
          const profile = conv.user_id ? profileMap[conv.user_id] : null;

          // Fetch the last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single() as { data: Message | null };

          // Count unread messages (not from admin)
          let unreadCount = 0;
          if (user) {
            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("conversation_id", conv.id)
              .eq("is_read", false)
              .neq("sender_id", user.id);
            unreadCount = count || 0;
          }

          convRows.push({
            id: conv.id,
            customerName: profile?.full_name || "Client",
            subject: conv.subject,
            lastMessage: lastMsg?.content || "",
            date: formatRelativeTime(lastMsg?.created_at || conv.updated_at),
            unread: unreadCount,
            status: conv.status,
          });
        }

        setConversations(convRows);
      }
      setLoading(false);
    }

    if (user !== undefined) {
      fetchConversations();
    }
  }, [user]);

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
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Conversations</h1>
        <p className="text-sm text-blanc-casse/60">
          Messagerie avec vos clients
        </p>
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
    </div>
  );
}
