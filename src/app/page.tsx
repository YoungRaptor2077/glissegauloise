import type { Metadata } from "next";
import { HomePage } from "./HomePage";

export const metadata: Metadata = {
  title:
    "GlisseGauloisse | N°1 Reparation Trottinette Electrique Eaubonne 95600",
  description:
    "GlisseGauloisse - Votre expert en reparation de trottinettes electriques a Eaubonne (95600, Val d'Oise). Diagnostic gratuit, reparation rapide. Dualtron, Kaabo, Xiaomi, Nami, Vsett, Minimotors. Pieces detachees, entretien, depannage. Note 5/5.",
  openGraph: {
    title:
      "GlisseGauloisse | N°1 Reparation Trottinette Electrique Eaubonne 95600",
    description:
      "GlisseGauloisse - Votre expert en reparation de trottinettes electriques a Eaubonne (95600, Val d'Oise). Diagnostic gratuit, reparation rapide. Dualtron, Kaabo, Xiaomi, Nami, Vsett, Minimotors. Pieces detachees, entretien, depannage. Note 5/5.",
    type: "website",
    locale: "fr_FR",
    siteName: "GlisseGauloisse",
  },
};

export default function Home() {
  return <HomePage />;
}
