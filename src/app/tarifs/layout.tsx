import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs Reparation Trottinette Electrique | GlisseGauloisse",
  description:
    "Tarifs transparents pour la reparation de trottinettes electriques. Diagnostic des 25EUR, changement pneu des 15EUR, reparation freinage des 20EUR. Main d'oeuvre uniquement.",
  openGraph: {
    title: "Tarifs Reparation Trottinette Electrique | GlisseGauloisse",
    description:
      "Tarifs transparents pour la reparation de trottinettes electriques. Diagnostic des 25EUR, changement pneu des 15EUR, reparation freinage des 20EUR. Main d'oeuvre uniquement.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function TarifsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
