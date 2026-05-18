"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { BadgeVariant } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import type { Quote } from "@/types/database";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Brouillon", variant: "default" },
  sent: { label: "En attente", variant: "warning" },
  accepted: { label: "Accepte", variant: "success" },
  rejected: { label: "Refuse", variant: "error" },
  expired: { label: "Expire", variant: "default" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DevisPage() {
  const { user, loading: userLoading } = useUser();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      if (!user) return;
      const supabase = createClient();
      const { data } = (await supabase
        .from("quotes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })) as { data: Quote[] | null };

      if (data) {
        setQuotes(data);
      }
      setLoading(false);
    }

    if (!userLoading && user) {
      fetchQuotes();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const handleUpdateStatus = async (
    quoteId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    setUpdating(quoteId);
    setError(null);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("quotes") as any)
      .update({ status: newStatus })
      .eq("id", quoteId);

    if (!error) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
    } else {
      setError("Erreur lors de la mise a jour du devis.");
    }
    setUpdating(null);
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
      >
        <h1 className="text-2xl font-bold text-blanc-casse">Mes devis</h1>
        <p className="mt-1 text-blanc-casse/60">
          Consultez et gerez vos devis.
        </p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {quotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <FileText className="h-12 w-12 text-blanc-casse/20 mx-auto mb-4" />
          <p className="text-blanc-casse/50">Aucun devis pour le moment</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote, index) => {
            const status = statusConfig[quote.status] || statusConfig.sent;
            return (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-5 bg-gris-anthracite border border-white/5 rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-blanc-casse">
                          {quote.id.slice(0, 8).toUpperCase()}
                        </p>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-blanc-casse/70 mt-1">
                        {quote.notes || "Devis"}
                      </p>
                      <p className="text-xs text-blanc-casse/50 mt-0.5">
                        Valide jusqu&apos;au {formatDate(quote.valid_until)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-blanc-casse">
                      {quote.total.toFixed(2)} EUR
                    </p>
                    {quote.status === "sent" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            handleUpdateStatus(quote.id, "accepted")
                          }
                          disabled={updating === quote.id}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleUpdateStatus(quote.id, "rejected")
                          }
                          disabled={updating === quote.id}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
