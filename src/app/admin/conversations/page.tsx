"use client";

import { MessageSquare } from "lucide-react";

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Conversations</h1>
        <p className="text-sm text-blanc-casse/60">Messagerie avec vos clients</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-noir-mat/50 p-12">
        <div className="rounded-full bg-vert-neon/10 p-4 mb-4">
          <MessageSquare size={32} className="text-vert-neon" />
        </div>
        <h2 className="text-lg font-semibold text-blanc-casse mb-2">
          Messagerie
        </h2>
        <p className="text-sm text-blanc-casse/60 text-center max-w-sm">
          La messagerie temps reel sera disponible prochainement. Vous pourrez
          echanger directement avec vos clients ici.
        </p>
      </div>
    </div>
  );
}
