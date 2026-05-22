"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Wrench, MessageSquare, FileText } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { LoyaltyCard } from "@/components/client/LoyaltyCard";
import { ReferralCard } from "@/components/client/ReferralCard";

interface SummaryCard {
  label: string;
  value: string;
  icon: typeof ShoppingBag;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface Activity {
  id: string;
  message: string;
  date: string;
}

export default function EspaceClientPage() {
  const { user, profile } = useUser();
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([
    {
      label: "Commandes en cours",
      value: "0",
      icon: ShoppingBag,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Reparations en cours",
      value: "0",
      icon: Wrench,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      label: "Messages non lus",
      value: "0",
      icon: MessageSquare,
      color: "text-vert-neon",
      bgColor: "bg-vert-neon/10",
      borderColor: "border-vert-neon/20",
    },
    {
      label: "Devis en attente",
      value: "0",
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    async function applyPendingReferral() {
      const ref = localStorage.getItem("pending_referral");
      if (ref) {
        localStorage.removeItem("pending_referral");
        try {
          await fetch("/api/referral/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referralCode: ref }),
          });
        } catch {}
      }
    }
    applyPendingReferral();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const supabase = createClient();

      // Fetch active orders count (not delivered, not cancelled)
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .not("status", "in", '("delivered","cancelled")');

      // Fetch active repairs count (not completed, not cancelled)
      const { count: repairsCount } = await supabase
        .from("repairs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .not("status", "in", '("completed","cancelled")');

      // Fetch unread messages count
      // First get all conversation IDs for this user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: conversations } = await (supabase as any)
        .from("conversations")
        .select("id")
        .eq("user_id", user!.id);

      let unreadCount = 0;
      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map((c: { id: string }) => c.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count } = await (supabase as any)
          .from("messages")
          .select("*", { count: "exact", head: true })
          .in("conversation_id", conversationIds)
          .eq("is_read", false)
          .neq("sender_id", user!.id);
        unreadCount = count || 0;
      }

      // Fetch pending/sent quotes count
      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .in("status", ["draft", "sent"]);

      setSummaryCards([
        {
          label: "Commandes en cours",
          value: String(ordersCount || 0),
          icon: ShoppingBag,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
        },
        {
          label: "Reparations en cours",
          value: String(repairsCount || 0),
          icon: Wrench,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
        },
        {
          label: "Messages non lus",
          value: String(unreadCount),
          icon: MessageSquare,
          color: "text-vert-neon",
          bgColor: "bg-vert-neon/10",
          borderColor: "border-vert-neon/20",
        },
        {
          label: "Devis en attente",
          value: String(quotesCount || 0),
          icon: FileText,
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/20",
        },
      ]);

      // Fetch recent activity from unread messages (last 5)
      if (conversations && conversations.length > 0) {
        const convIds = conversations.map((c: { id: string }) => c.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: recentMessages } = await (supabase as any)
          .from("messages")
          .select("id, content, created_at")
          .in("conversation_id", convIds)
          .neq("sender_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentMessages && recentMessages.length > 0) {
          setRecentActivity(
            recentMessages.map((msg: { id: string; content: string; created_at: string }) => ({
              id: msg.id,
              message: msg.content.length > 80 ? msg.content.slice(0, 80) + "..." : msg.content,
              date: formatRelativeDate(msg.created_at),
            }))
          );
        } else {
          setRecentActivity([]);
        }
      } else {
        setRecentActivity([]);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">
          Bonjour{profile?.full_name ? `, ${profile.full_name}` : ""} !
        </h1>
        <p className="mt-1 text-blanc-casse/60">
          Bienvenue dans votre espace client GlisseGauloisse.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-5 rounded-2xl bg-gris-anthracite border ${card.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blanc-casse/60">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loyalty Card */}
      <LoyaltyCard />

      {/* Referral Card */}
      <ReferralCard />

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gris-anthracite border border-white/5 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-blanc-casse mb-4">
          Activite recente
        </h2>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-blanc-casse/50">Aucune activite recente</p>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <p className="text-sm text-blanc-casse/80">
                  {activity.message}
                </p>
                <span className="text-xs text-blanc-casse/50 whitespace-nowrap ml-4">
                  {activity.date}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "A l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR");
}
