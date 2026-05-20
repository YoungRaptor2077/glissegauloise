import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Devis Reparation Trottinette Eaubonne | GlisseGauloisse",
  description:
    "Contactez GlisseGauloisse a Eaubonne (95600). 07 86 75 79 63. Devis gratuit reparation trottinette electrique. 49 Route de Margency. Reponse rapide garantie.",
  openGraph: {
    title: "Contact & Devis Reparation Trottinette Eaubonne | GlisseGauloisse",
    description:
      "Contactez GlisseGauloisse a Eaubonne (95600). 07 86 75 79 63. Devis gratuit reparation trottinette electrique. 49 Route de Margency. Reponse rapide garantie.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
