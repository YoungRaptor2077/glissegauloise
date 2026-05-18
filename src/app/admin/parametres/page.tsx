"use client";

import { Settings } from "lucide-react";

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blanc-casse">Parametres</h1>
        <p className="text-sm text-blanc-casse/60">Configurez votre boutique</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Boutique</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                Nom de la boutique
              </label>
              <input
                type="text"
                defaultValue="Glisse Gauloise"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                Email de contact
              </label>
              <input
                type="email"
                defaultValue="contact@glissegauloise.fr"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-blanc-casse/80">
                Telephone
              </label>
              <input
                type="tel"
                defaultValue="+33 4 50 00 00 00"
                className="w-full rounded-xl border border-white/10 bg-gris-anthracite px-4 py-2.5 text-sm text-blanc-casse focus:border-vert-neon/50 focus:outline-none focus:ring-1 focus:ring-vert-neon/30"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-blanc-casse">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-blanc-casse/80">Nouvelle commande</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-gris-anthracite text-vert-neon focus:ring-vert-neon/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-blanc-casse/80">Nouvelle reparation</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-gris-anthracite text-vert-neon focus:ring-vert-neon/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-blanc-casse/80">Nouveau message</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-gris-anthracite text-vert-neon focus:ring-vert-neon/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-blanc-casse/80">Stock faible</span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-gris-anthracite text-vert-neon focus:ring-vert-neon/30"
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-noir-mat/50 p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={20} className="text-vert-neon" />
            <h2 className="text-lg font-semibold text-blanc-casse">Integrations</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-gris-anthracite p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blanc-casse">Stripe</h3>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">Connecte</span>
              </div>
              <p className="text-xs text-blanc-casse/40">Paiements en ligne securises</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-gris-anthracite p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blanc-casse">Supabase</h3>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">Connecte</span>
              </div>
              <p className="text-xs text-blanc-casse/40">Base de donnees et authentification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-xl bg-vert-neon px-6 py-2.5 text-sm font-semibold text-noir-mat transition-colors hover:bg-vert-neon-dark">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
