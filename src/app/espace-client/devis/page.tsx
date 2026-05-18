"use client";

import { motion } from "framer-motion";
import { FileText, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { BadgeVariant } from "@/components/ui/Badge";

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  sent: { label: "En attente", variant: "warning" },
  accepted: { label: "Accepte", variant: "success" },
  rejected: { label: "Refuse", variant: "error" },
  expired: { label: "Expire", variant: "default" },
};

const mockQuotes = [
  {
    id: "DEV-2024-001",
    subject: "Reparation snowboard Burton",
    status: "sent",
    total: 120.0,
    validUntil: "30/01/2024",
    date: "15/01/2024",
  },
  {
    id: "DEV-2024-002",
    subject: "Fartage + affutage skis",
    status: "accepted",
    total: 55.0,
    validUntil: "20/01/2024",
    date: "05/01/2024",
  },
  {
    id: "DEV-2023-015",
    subject: "Remplacement fixations",
    status: "expired",
    total: 180.0,
    validUntil: "01/12/2023",
    date: "15/11/2023",
  },
];

export default function DevisPage() {
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

      <div className="space-y-4">
        {mockQuotes.map((quote, index) => {
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
                        {quote.id}
                      </p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-blanc-casse/70 mt-1">
                      {quote.subject}
                    </p>
                    <p className="text-xs text-blanc-casse/50 mt-0.5">
                      Valide jusqu&apos;au {quote.validUntil}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-blanc-casse">
                    {quote.total.toFixed(2)} EUR
                  </p>
                  {quote.status === "sent" && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="primary">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Accepter
                      </Button>
                      <Button size="sm" variant="ghost">
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
    </div>
  );
}
