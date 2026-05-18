import type { Metadata } from "next";
import { HomePage } from "./HomePage";

export const metadata: Metadata = {
  title:
    "Glisse Gauloise - Reparation Trottinette Electrique Eaubonne (95) | Val d'Oise",
  description:
    "Expert en reparation de trottinettes electriques a Eaubonne (95). Diagnostic, entretien, depannage et vente de pieces detachees. Atelier specialise Val d'Oise. Toutes marques : Dualtron, Kaabo, Xiaomi, Nami, Vsett.",
  keywords: [
    "reparation trottinette Eaubonne",
    "reparation trottinette 95",
    "reparation trottinette Val d'Oise",
    "atelier trottinette electrique",
    "diagnostic trottinette electrique",
    "pieces detachees trottinette",
    "entretien trottinette electrique",
    "depannage trottinette Eaubonne",
  ],
  openGraph: {
    title:
      "Glisse Gauloise - Expert Reparation Trottinette Electrique a Eaubonne",
    description:
      "Atelier specialise dans la reparation et l'entretien de trottinettes electriques. Diagnostic, depannage, pieces detachees. Eaubonne, Val d'Oise (95).",
    type: "website",
    locale: "fr_FR",
    siteName: "Glisse Gauloise",
  },
};

export default function Home() {
  return <HomePage />;
}
