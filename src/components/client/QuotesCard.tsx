"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";

interface ClientQuote {
  id: string;
  status: string;
  total: number;
  payment_url: string | null;
  valid_until: string;
  created_at: string;
}

export function QuotesCard() {
  const [quotes, setQuotes] = useState<ClientQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch("/api/client/quotes");
        if (res.ok) {
          const data = await res.json();
          setQuotes(data.quotes?.filter((q: ClientQuote) => q.status === "sent") || []);
        }
      } catch {}
      setLoading(false);
    }
    fetchQuotes();
  }, []);

  if (loading || quotes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-noir-mat p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-yellow-500/10">
          <FileText size={18} className="text-yellow-400" />
        </div>
        <h3 className="text-sm font-semibold text-blanc-casse">Devis en attente</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-yellow-500/10 text-xs font-medium text-yellow-400">
          {quotes.length}
        </span>
      </div>

      <div className="space-y-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-noir-mat p-3">
            <div>
              <p className="text-sm font-medium text-blanc-casse">{quote.total.toFixed(2)} EUR</p>
              <p className="text-xs text-blanc-casse/40">
                Valide jusqu&apos;au {new Date(quote.valid_until).toLocaleDateString("fr-FR")}
              </p>
            </div>
            {quote.payment_url && (
              <a
                href={quote.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-vert-neon px-3 py-2 text-xs font-semibold text-noir-mat hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={12} />
                Payer
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-blanc-casse/30 mt-3">
        Paiement securise par carte ou en 3 fois sans frais
      </p>
    </motion.div>
  );
}
