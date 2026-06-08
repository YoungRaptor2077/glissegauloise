"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { COMPANY_INFO } from "@/lib/constants";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  note?: string;
  link?: string;
}

interface ClientQuote {
  id: string;
  status: string;
  total: number;
  payment_url: string | null;
  valid_until: string;
  created_at: string;
  notes: string | null;
  line_items: LineItem[] | null;
  labor_cost: number | null;
}

const statusConfig: Record<string, { label: string; variant: BadgeVariant; icon: typeof CheckCircle2 }> = {
  draft: { label: "Brouillon", variant: "default", icon: FileText },
  sent: { label: "En attente de paiement", variant: "warning", icon: Clock },
  accepted: { label: "Paye", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Refuse", variant: "error", icon: AlertCircle },
  expired: { label: "Expire", variant: "default", icon: AlertCircle },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function QuoteDocument({ quote }: { quote: ClientQuote }) {
  const status = statusConfig[quote.status] || statusConfig.sent;
  const lineItems = quote.line_items || [];
  const laborCost = quote.labor_cost || 0;
  const quoteNumber = `DEV-${quote.id.slice(0, 8).toUpperCase()}`;

  // Calculate parts subtotal
  const partsSubtotal = lineItems.reduce(
    (sum, item) => sum + (item.quantity || 1) * (item.unitPrice || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden"
    >
      {/* Document Header - Company + Quote Info */}
      <div className="relative border-b border-white/[0.06]">
        {/* Subtle green accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-vert-neon/60 via-vert-neon to-vert-neon/60" />

        <div className="p-6 sm:p-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            {/* Company Info */}
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-vert-neon tracking-tight">
                {COMPANY_INFO.name}
              </h2>
              <p className="text-xs text-blanc-casse/50">{COMPANY_INFO.address}</p>
              <p className="text-xs text-blanc-casse/50">{COMPANY_INFO.city}</p>
              <p className="text-xs text-blanc-casse/50">{COMPANY_INFO.phone}</p>
              <p className="text-xs text-blanc-casse/50">SIRET : {COMPANY_INFO.siret}</p>
            </div>

            {/* Quote Number + Status */}
            <div className="text-left sm:text-right space-y-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-blanc-casse/40 font-medium">
                  Devis N&deg;
                </p>
                <p className="text-base font-bold text-blanc-casse tracking-wide">
                  {quoteNumber}
                </p>
              </div>
              <Badge variant={status.variant} className="text-[11px]">
                {status.label}
              </Badge>
            </div>
          </div>

          {/* Dates row */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-xs text-blanc-casse/50">
            <div>
              <span className="text-blanc-casse/30 uppercase tracking-wider">Date d&apos;emission :</span>{" "}
              <span className="text-blanc-casse/70">{formatDate(quote.created_at)}</span>
            </div>
            <div>
              <span className="text-blanc-casse/30 uppercase tracking-wider">Valide jusqu&apos;au :</span>{" "}
              <span className="text-blanc-casse/70">{formatDate(quote.valid_until)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="p-6 sm:p-8">
        {lineItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left pb-3 text-[11px] uppercase tracking-wider text-blanc-casse/40 font-medium">
                    Designation
                  </th>
                  <th className="text-left pb-3 text-[11px] uppercase tracking-wider text-blanc-casse/40 font-medium hidden sm:table-cell">
                    Notes
                  </th>
                  <th className="text-center pb-3 text-[11px] uppercase tracking-wider text-blanc-casse/40 font-medium">
                    Qte
                  </th>
                  <th className="text-right pb-3 text-[11px] uppercase tracking-wider text-blanc-casse/40 font-medium">
                    P.U. HT
                  </th>
                  <th className="text-right pb-3 text-[11px] uppercase tracking-wider text-blanc-casse/40 font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {lineItems.map((item, i) => (
                  <tr key={i} className="group">
                    <td className="py-3 pr-4">
                      <span className="text-blanc-casse/90 font-medium">
                        {item.description || "Article"}
                      </span>
                      {/* Mobile: show note inline */}
                      {item.note && (
                        <p className="sm:hidden text-[11px] text-blanc-casse/40 italic mt-1">
                          {item.note}
                        </p>
                      )}
                      {item.link && (
                        <div className="mt-2 space-y-2">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-vert-neon/10 px-2.5 py-1 text-xs font-medium text-vert-neon hover:bg-vert-neon/20 transition-colors"
                          >
                            Voir la piece
                          </a>
                          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] border-l-2 border-l-vert-neon/40 px-3 py-2.5 text-sm text-blanc-casse/70 leading-relaxed">
                            <p className="font-semibold text-blanc-casse/80 mb-1.5 text-sm">Lors de votre commande, vous avez 2 options :</p>
                            <p>1. <span className="text-blanc-casse/80">Livraison chez vous</span> - Vous recevez la piece et vous nous la ramenez a l&apos;atelier</p>
                            <p>2. <span className="text-blanc-casse/80">Livraison directe a l&apos;atelier</span> - Faites livrer au nom de GlisseGauloisse, 49 Route de Margency, 95600 Eaubonne</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      {item.note ? (
                        <span className="text-[11px] text-blanc-casse/40 italic">
                          {item.note}
                        </span>
                      ) : (
                        <span className="text-blanc-casse/20">-</span>
                      )}
                    </td>
                    <td className="py-3 text-center text-blanc-casse/70">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-blanc-casse/70">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="py-3 text-right text-blanc-casse/90 font-medium">
                      {formatCurrency((item.quantity || 1) * (item.unitPrice || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-blanc-casse/40 text-center py-6">
            Aucun article sur ce devis
          </p>
        )}

        {/* Totals Section */}
        {(lineItems.length > 0 || laborCost > 0) && (
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-72 space-y-0">
              {/* Sous-total pieces */}
              {lineItems.length > 0 && (
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-blanc-casse/50">Sous-total pieces</span>
                  <span className="text-blanc-casse/80">{formatCurrency(partsSubtotal)}</span>
                </div>
              )}

              {/* Main d'oeuvre */}
              {laborCost > 0 && (
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-blanc-casse/50">Main d&apos;oeuvre</span>
                  <span className="text-blanc-casse/80">{formatCurrency(laborCost)}</span>
                </div>
              )}

              {/* Separator */}
              <div className="border-t border-vert-neon/20 my-1" />

              {/* Total TTC */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-semibold text-blanc-casse">Total TTC</span>
                <span className="text-xl font-bold text-vert-neon">
                  {formatCurrency(quote.total)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {quote.notes && (
          <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <p className="text-[11px] uppercase tracking-wider text-blanc-casse/40 font-medium mb-1">
              Notes
            </p>
            <p className="text-sm text-blanc-casse/70 whitespace-pre-line leading-relaxed">
              {quote.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Payment CTA */}
      {quote.status === "sent" && quote.payment_url && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="border-t border-white/[0.06] pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-blanc-casse/40 text-center sm:text-left">
                Ce devis est valable jusqu&apos;au {formatDate(quote.valid_until)}.
                <br />
                Le paiement vaut acceptation du devis.
              </p>
              <a
                href={quote.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-vert-neon px-6 py-3 text-sm font-bold text-noir-mat hover:bg-vert-neon/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-vert-neon/20"
              >
                <CreditCard className="h-4 w-4" />
                Accepter et payer {formatCurrency(quote.total)}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Paid confirmation */}
      {quote.status === "accepted" && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="border-t border-white/[0.06] pt-6">
            <div className="flex items-center gap-3 justify-center text-sm text-green-400/80">
              <CheckCircle2 className="h-4 w-4" />
              <span>Devis accepte et paye</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
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
        .select("id, status, total, payment_url, valid_until, created_at, notes, line_items, labor_cost")
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-blanc-casse">Mes devis</h1>
        <p className="mt-1 text-sm text-blanc-casse/50">
          Consultez vos devis et procedez au paiement en ligne.
        </p>
      </motion.div>

      {quotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
            <FileText className="h-7 w-7 text-blanc-casse/20" />
          </div>
          <p className="text-blanc-casse/40 text-sm">Aucun devis pour le moment</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <QuoteDocument quote={quote} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
