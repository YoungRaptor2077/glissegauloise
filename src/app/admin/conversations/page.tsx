"use client";

import { MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const mockConversations = [
  {
    id: "1",
    customerName: "Jean Dupont",
    subject: "Question sur ma reparation REP-2024-001",
    lastMessage: "Super, vous pensez que ce sera pret pour quand ?",
    date: "Il y a 2h",
    unread: 1,
    linkedType: "Reparation",
    status: "open",
  },
  {
    id: "2",
    customerName: "Marie Martin",
    subject: "Suivi commande CMD-2024-003",
    lastMessage: "Merci pour la mise a jour !",
    date: "Il y a 5h",
    unread: 0,
    linkedType: "Commande",
    status: "open",
  },
  {
    id: "3",
    customerName: "Pierre Lefevre",
    subject: "Devis remplacement trucks",
    lastMessage: "Le devis me convient, on peut proceder.",
    date: "Hier",
    unread: 2,
    linkedType: "Devis",
    status: "open",
  },
  {
    id: "4",
    customerName: "Sophie Bernard",
    subject: "Retour commande CMD-2024-001",
    lastMessage: "Merci, le remboursement a bien ete recu.",
    date: "Il y a 3 jours",
    unread: 0,
    linkedType: "Commande",
    status: "closed",
  },
];

export default function AdminConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Conversations</h1>
        <p className="text-sm text-blanc-casse/60">
          Messagerie avec vos clients
        </p>
      </div>

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
                  Type
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
              {mockConversations.map((conv) => (
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
                    <Badge variant="default">{conv.linkedType}</Badge>
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
    </div>
  );
}
