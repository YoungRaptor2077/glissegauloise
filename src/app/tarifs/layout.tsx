import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs Reparation Trottinette | Glisse Gauloise",
  description:
    "Consultez nos tarifs de reparation et entretien pour trottinettes electriques. Main-d'oeuvre transparente : diagnostic, freinage, electronique, batterie et plus.",
  openGraph: {
    title: "Tarifs Reparation Trottinette | Glisse Gauloise",
    description:
      "Consultez nos tarifs de reparation et entretien pour trottinettes electriques. Main-d'oeuvre transparente.",
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
