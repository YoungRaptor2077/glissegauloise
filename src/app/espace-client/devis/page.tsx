"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, CreditCard, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";

interface ClientQuote {
  id: string;
  status: string;
  total: number;
  payment_url: string | null;
  valid_until: string;
  created_at: string;
  notes: string | null;
}

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Brouillon", variant: "default" },
  sent: { label: "A payer", variant: "warning" },
  accepted: { label: "Paye", variant: "success" },
  rejected: { label: "Annule", variant: "error" },
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
  const [quotes, setQuotes] = useState<ClientQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("quotes")
        .select("id, status, total, payment_url, valid_until, created_at, notes")
        .eq("user_id", user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order("created_at", { ascending: false }) as any as { data: ClientQuote[] | null };

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
          Consultez vos devis et payez en ligne.
        </p>
      </motion.div>

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
                    <div className={`p-3 rounded-xl ${quote.status === "accepted" ? "bg-vert-neon/10" : "bg-purple-500/10"}`}>
                      {quote.status === "accepted" ? (
                        <CheckCircle2 className="h-5 w-5 text-vert-neon" />
                      ) : (
                        <FileText className="h-5 w-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-blanc-casse">
                          Devis #{quote.id.slice(0, 8).toUpperCase()}
                        </p>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      {quote.notes && (
                        <p className="text-sm text-blanc-casse/70 mt-1">
                          {quote.notes.substring(0, 80)}
                        </p>
                      )}
                      <p className="text-xs text-blanc-casse/50 mt-0.5">
                        Valide jusqu&apos;au {formatDate(quote.valid_until)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-blanc-casse">
                      {quote.total.toFixed(2)} EUR
                    </p>
                    {quote.status === "sent" && quote.payment_url && (
                      <a
                        href={quote.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2.5 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity"
                      >
                        <CreditCard className="h-4 w-4" />
                        Payer
                      </a>
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
