import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reparation Trottinette Electrique Eaubonne 95 | Devis Gratuit",
  description:
    "Service de reparation de trottinettes electriques a Eaubonne (95600). Diagnostic, changement batterie, pneus, freins, controleurs. Dualtron, Kaabo, Xiaomi, Nami. Devis gratuit sous 24h.",
  openGraph: {
    title: "Reparation Trottinette Electrique Eaubonne 95 | Devis Gratuit",
    description:
      "Service de reparation de trottinettes electriques a Eaubonne (95600). Diagnostic, changement batterie, pneus, freins, controleurs. Dualtron, Kaabo, Xiaomi, Nami. Devis gratuit sous 24h.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function ReparationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
