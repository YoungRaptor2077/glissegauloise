"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CircleDot,
  Disc3,
  Cpu,
  Battery,
  Settings,
  Paintbrush,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { PricingCard } from "@/components/tarifs/PricingCard";

interface TarifData {
  icon: React.ReactNode;
  title: string;
  priceRange: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="h-5 w-5" />,
  CircleDot: <CircleDot className="h-5 w-5" />,
  Disc3: <Disc3 className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  Battery: <Battery className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  Paintbrush: <Paintbrush className="h-5 w-5" />,
  Wrench: <Wrench className="h-5 w-5" />,
};

const defaultPricingData: TarifData[] = [
  {
    icon: <Search className="h-5 w-5" />,
    title: "Diagnostic",
    priceRange: "25 - 45\u20AC",
    description:
      "Analyse complete de votre trottinette pour identifier les problemes.",
    features: [
      "Inspection visuelle complete",
      "Test electronique",
      "Rapport detaille",
      "Devis gratuit si reparation",
    ],
    highlighted: false,
  },
  {
    icon: <CircleDot className="h-5 w-5" />,
    title: "Changement pneu",
    priceRange: "15 - 35\u20AC",
    description:
      "Remplacement de pneu, chambre a air ou passage en tubeless.",
    features: [
      "Demontage et remontage",
      "Verification pression",
      "Equilibrage",
      "Conseil sur le type de pneu",
    ],
    highlighted: false,
  },
  {
    icon: <Disc3 className="h-5 w-5" />,
    title: "Reparation freinage",
    priceRange: "20 - 50\u20AC",
    description: "Remplacement plaquettes, reglage ou purge du systeme de freinage.",
    features: [
      "Remplacement plaquettes",
      "Purge hydraulique",
      "Reglage frein mecanique",
      "Test de securite",
    ],
    highlighted: true,
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Electronique",
    priceRange: "30 - 80\u20AC",
    description:
      "Diagnostic et reparation des composants electroniques (controleur, ecran, connectique).",
    features: [
      "Diagnostic controleur",
      "Remplacement ecran",
      "Reprise connectique",
      "Mise a jour firmware",
    ],
    highlighted: false,
  },
  {
    icon: <Battery className="h-5 w-5" />,
    title: "Batterie",
    priceRange: "40 - 100\u20AC",
    description:
      "Diagnostic batterie, remplacement de cellules ou reconditionnement.",
    features: [
      "Test capacite cellules",
      "Remplacement BMS",
      "Reconditionnement",
      "Equilibrage cellules",
    ],
    highlighted: false,
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: "Entretien complet",
    priceRange: "50 - 90\u20AC",
    description:
      "Revision complete de votre trottinette pour garantir performance et securite.",
    features: [
      "Nettoyage integral",
      "Graissage roulements",
      "Serrage visserie",
      "Test complet",
    ],
    highlighted: true,
  },
  {
    icon: <Paintbrush className="h-5 w-5" />,
    title: "Personnalisation",
    priceRange: "Sur devis",
    description:
      "Customisation, amelioration de performances ou modifications specifiques.",
    features: [
      "Consultation personnalisee",
      "Upgrade performances",
      "LED / eclairage custom",
      "Protection et wrap",
    ],
    highlighted: false,
  },
];

export default function TarifsPage() {
  const [pricingData, setPricingData] = useState<TarifData[]>(defaultPricingData);

  useEffect(() => {
    async function fetchTarifs() {
      try {
        const res = await fetch("/api/admin/tarifs");
        const data = await res.json();

        if (data.tarifs && data.tarifs.length > 0) {
          const activeTarifs = data.tarifs
            .filter((t: { is_active: boolean }) => t.is_active)
            .map((t: { icon_name: string; title: string; price_range: string; description: string; features: string[]; highlighted: boolean }) => ({
              icon: iconMap[t.icon_name] || <Settings className="h-5 w-5" />,
              title: t.title,
              priceRange: t.price_range,
              description: t.description || "",
              features: t.features || [],
              highlighted: t.highlighted,
            }));

          if (activeTarifs.length > 0) {
            setPricingData(activeTarifs);
          }
        }
      } catch {
        // Fallback to defaults silently
      }
    }

    fetchTarifs();
  }, []);

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-bold text-blanc-casse mb-4">
            Nos <span className="text-vert-neon">tarifs</span>
          </h1>
          <p className="text-lg text-blanc-casse/60 max-w-2xl mx-auto">
            Des tarifs transparents pour tous nos services de reparation et
            d&apos;entretien de trottinettes electriques.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 lg:p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-500 mb-1">
                Information importante
              </p>
              <p className="text-sm text-blanc-casse/70">
                Les tarifs correspondent uniquement a la main-d&apos;oeuvre. Les
                pieces detachees, pneus, chambres a air et consommables ne sont
                pas inclus sauf mention contraire.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingData.map((card, index) => (
            <PricingCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
