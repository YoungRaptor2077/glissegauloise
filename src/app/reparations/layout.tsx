import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reparation Trottinette Electrique | Glisse Gauloise",
  description:
    "Service de reparation et SAV pour trottinettes electriques toutes marques. Diagnostic rapide, pieces d'origine et garantie sur nos interventions a Eaubonne.",
  openGraph: {
    title: "Reparation Trottinette Electrique | Glisse Gauloise",
    description:
      "Service de reparation et SAV pour trottinettes electriques toutes marques. Diagnostic rapide, pieces d'origine et garantie sur nos interventions.",
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
