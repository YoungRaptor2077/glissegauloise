"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Trash2, X, GripVertical } from "lucide-react";

interface Tarif {
  id: string;
  title: string;
  price_range: string;
  description: string;
  features: string[];
  icon_name: string;
  highlighted: boolean;
  sort_order: number;
  is_active: boolean;
}

const defaultTarifs: Omit<Tarif, "id">[] = [
  {
    title: "Diagnostic",
    price_range: "25 - 45\u20AC",
    description: "Analyse complete de votre trottinette pour identifier les problemes.",
    features: ["Inspection visuelle complete", "Test electronique", "Rapport detaille", "Devis gratuit si reparation"],
    icon_name: "Search",
    highlighted: false,
    sort_order: 0,
    is_active: true,
  },
  {
    title: "Changement pneu",
    price_range: "15 - 35\u20AC",
    description: "Remplacement de pneu, chambre a air ou passage en tubeless.",
    features: ["Demontage et remontage", "Verification pression", "Equilibrage", "Conseil sur le type de pneu"],
    icon_name: "CircleDot",
    highlighted: false,
    sort_order: 1,
    is_active: true,
  },
  {
    title: "Reparation freinage",
    price_range: "20 - 50\u20AC",
    description: "Remplacement plaquettes, reglage ou purge du systeme de freinage.",
    features: ["Remplacement plaquettes", "Purge hydraulique", "Reglage frein mecanique", "Test de securite"],
    icon_name: "Disc3",
    highlighted: true,
    sort_order: 2,
    is_active: true,
  },
  {
    title: "Electronique",
    price_range: "30 - 80\u20AC",
    description: "Diagnostic et reparation des composants electroniques (controleur, ecran, connectique).",
    features: ["Diagnostic controleur", "Remplacement ecran", "Reprise connectique", "Mise a jour firmware"],
    icon_name: "Cpu",
    highlighted: false,
    sort_order: 3,
    is_active: true,
  },
  {
    title: "Batterie",
    price_range: "40 - 100\u20AC",
    description: "Diagnostic batterie, remplacement de cellules ou reconditionnement.",
    features: ["Test capacite cellules", "Remplacement BMS", "Reconditionnement", "Equilibrage cellules"],
    icon_name: "Battery",
    highlighted: false,
    sort_order: 4,
    is_active: true,
  },
  {
    title: "Entretien complet",
    price_range: "50 - 90\u20AC",
    description: "Revision complete de votre trottinette pour garantir performance et securite.",
    features: ["Nettoyage integral", "Graissage roulements", "Serrage visserie", "Test complet"],
    icon_name: "Settings",
    highlighted: true,
    sort_order: 5,
    is_active: true,
  },
  {
    title: "Personnalisation",
    price_range: "Sur devis",
    description: "Customisation, amelioration de performances ou modifications specifiques.",
    features: ["Consultation personnalisee", "Upgrade performances", "LED / eclairage custom", "Protection et wrap"],
    icon_name: "Paintbrush",
    highlighted: false,
    sort_order: 6,
    is_active: true,
  },
];

export default function AdminTarifsPage() {
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchTarifs();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function fetchTarifs() {
    try {
      const res = await fetch("/api/admin/tarifs");
      const data = await res.json();

      if (data.tarifs && data.tarifs.length > 0) {
        setTarifs(data.tarifs);
      } else {
        // No tarifs in DB yet - show empty state
        setTarifs([]);
      }
    } catch {
      setError("Impossible de charger les tarifs");
    } finally {
      setLoading(false);
    }
  }

  async function seedDefaults() {
    setSaving(true);
    setError(null);
    try {
      for (const tarif of defaultTarifs) {
        const res = await fetch("/api/admin/tarifs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tarif),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Erreur lors de la creation");
        }
      }
      setSuccess("Tarifs par defaut ajoutes avec succes");
      await fetchTarifs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout des tarifs");
    } finally {
      setSaving(false);
    }
  }

  async function saveTarif(tarif: Tarif) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tarifs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarif),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors de la sauvegarde");
      }

      setSuccess("Tarif mis a jour avec succes");
      setEditingId(null);
      await fetchTarifs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTarif(id: string) {
    if (!confirm("Supprimer ce tarif ?")) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tarifs?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors de la suppression");
      }

      setSuccess("Tarif supprime avec succes");
      setTarifs((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  }

  async function addNewTarif() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tarifs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nouveau tarif",
          price_range: "0\u20AC",
          description: "",
          features: [],
          icon_name: "Settings",
          highlighted: false,
          sort_order: tarifs.length,
          is_active: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors de la creation");
      }

      const data = await res.json();
      setTarifs((prev) => [...prev, data.tarif]);
      setEditingId(data.tarif.id);
      setSuccess("Nouveau tarif cree");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la creation");
    } finally {
      setSaving(false);
    }
  }

  function updateField(id: string, field: keyof Tarif, value: unknown) {
    setTarifs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  function addFeature(id: string) {
    if (!newFeature.trim()) return;
    setTarifs((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, features: [...t.features, newFeature.trim()] } : t
      )
    );
    setNewFeature("");
  }

  function removeFeature(id: string, featureIndex: number) {
    setTarifs((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, features: t.features.filter((_, i) => i !== featureIndex) }
          : t
      )
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vert-neon border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blanc-casse">Gestion des tarifs</h1>
          <p className="text-sm text-blanc-casse/60 mt-1">
            Gerez vos tarifs de reparation affiches sur le site
          </p>
        </div>
        <button
          onClick={addNewTarif}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2 text-sm font-medium text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-vert-neon/30 bg-vert-neon/10 p-4 text-sm text-vert-neon">
          {success}
        </div>
      )}

      {/* Empty state */}
      {tarifs.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-12 text-center">
          <p className="text-blanc-casse/60 mb-4">
            Aucun tarif en base de donnees.
          </p>
          <button
            onClick={seedDefaults}
            disabled={saving}
            className="rounded-xl bg-vert-neon px-6 py-2 text-sm font-medium text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
          >
            {saving ? "Chargement..." : "Ajouter les tarifs par defaut"}
          </button>
          <p className="text-xs text-blanc-casse/40 mt-3">
            Cela va creer les 7 tarifs standards dans la base de donnees.
          </p>
        </div>
      )}

      {/* Tarifs list */}
      <div className="space-y-4">
        {tarifs.map((tarif) => (
          <motion.div
            key={tarif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-gris-anthracite p-6"
          >
            {editingId === tarif.id ? (
              /* Editing mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-blanc-casse/60 mb-1 block">Titre</label>
                    <input
                      type="text"
                      value={tarif.title}
                      onChange={(e) => updateField(tarif.id, "title", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-noir-mat px-3 py-2 text-sm text-blanc-casse focus:border-vert-neon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-blanc-casse/60 mb-1 block">Fourchette de prix</label>
                    <input
                      type="text"
                      value={tarif.price_range}
                      onChange={(e) => updateField(tarif.id, "price_range", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-noir-mat px-3 py-2 text-sm text-blanc-casse focus:border-vert-neon focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-blanc-casse/60 mb-1 block">Description</label>
                  <textarea
                    value={tarif.description}
                    onChange={(e) => updateField(tarif.id, "description", e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-noir-mat px-3 py-2 text-sm text-blanc-casse focus:border-vert-neon focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-blanc-casse/60 mb-1 block">Icone</label>
                    <select
                      value={tarif.icon_name}
                      onChange={(e) => updateField(tarif.id, "icon_name", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-noir-mat px-3 py-2 text-sm text-blanc-casse focus:border-vert-neon focus:outline-none"
                    >
                      <option value="Search">Search</option>
                      <option value="CircleDot">CircleDot</option>
                      <option value="Disc3">Disc3</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Battery">Battery</option>
                      <option value="Settings">Settings</option>
                      <option value="Paintbrush">Paintbrush</option>
                      <option value="Wrench">Wrench</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-blanc-casse/60 mb-1 block">Ordre</label>
                    <input
                      type="number"
                      value={tarif.sort_order}
                      onChange={(e) => updateField(tarif.id, "sort_order", parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-white/10 bg-noir-mat px-3 py-2 text-sm text-blanc-casse focus:border-vert-neon focus:outline-none"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 text-sm text-blanc-casse/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tarif.highlighted}
                        onChange={(e) => updateField(tarif.id, "highlighted", e.target.checked)}
                        className="rounded border-white/20"
                      />
                      Mis en avant
                    </label>
                    <label className="flex items-center gap-2 text-sm text-blanc-casse/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tarif.is_active}
                        onChange={(e) => updateField(tarif.id, "is_active", e.target.checked)}
                        className="rounded border-white/20"
                      />
                      Actif
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-xs text-blanc-casse/60 mb-2 block">Caracteristiques</label>
                  <div className="space-y-2 mb-2">
                    {tarif.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <GripVertical size={14} className="text-blanc-casse/30" />
                        <span className="flex-1 text-sm text-blanc-casse/80">{feature}</span>
                        <button
                          onClick={() => removeFeature(tarif.id, idx)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature(tarif.id);
                        }
                      }}
                      placeholder="Ajouter une caracteristique..."
                      className="flex-1 rounded-lg border border-white/10 bg-noir-mat px-3 py-1.5 text-sm text-blanc-casse placeholder:text-blanc-casse/30 focus:border-vert-neon focus:outline-none"
                    />
                    <button
                      onClick={() => addFeature(tarif.id)}
                      className="rounded-lg bg-vert-neon/20 px-3 py-1.5 text-xs text-vert-neon hover:bg-vert-neon/30"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => saveTarif(tarif)}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-vert-neon px-4 py-2 text-sm font-medium text-noir-mat transition-colors hover:bg-vert-neon-dark disabled:opacity-50"
                  >
                    <Save size={14} />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      fetchTarifs();
                    }}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-blanc-casse/70 hover:bg-gris-anthracite-light"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-blanc-casse">{tarif.title}</h3>
                    <span className="text-sm font-bold text-vert-neon">{tarif.price_range}</span>
                    {tarif.highlighted && (
                      <span className="rounded-full bg-vert-neon/20 px-2 py-0.5 text-xs text-vert-neon">
                        Mis en avant
                      </span>
                    )}
                    {!tarif.is_active && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blanc-casse/60 mt-1">{tarif.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tarif.features.map((f, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-noir-mat px-2 py-1 text-xs text-blanc-casse/70"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setEditingId(tarif.id)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-blanc-casse/70 hover:bg-gris-anthracite-light"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteTarif(tarif.id)}
                    disabled={saving}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* SQL migration note */}
      {tarifs.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-gris-anthracite p-6">
          <h3 className="text-sm font-semibold text-blanc-casse mb-2">SQL Migration requise</h3>
          <p className="text-xs text-blanc-casse/60 mb-3">
            Pour utiliser cette fonctionnalite, creez la table tarifs dans votre base Supabase :
          </p>
          <pre className="rounded-lg bg-noir-mat p-4 text-xs text-blanc-casse/70 overflow-x-auto">
{`CREATE TABLE public.tarifs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  price_range TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  icon_name TEXT DEFAULT 'Settings',
  highlighted BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tarifs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tarifs"
  ON public.tarifs FOR SELECT USING (true);

CREATE POLICY "Admins can manage tarifs"
  ON public.tarifs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );`}
          </pre>
        </div>
      )}
    </div>
  );
}
