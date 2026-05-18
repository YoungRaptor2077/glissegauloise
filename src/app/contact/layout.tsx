import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Glisse Gauloise",
  description:
    "Contactez Glisse Gauloise a Eaubonne. Telephone, email, formulaire de contact et plan d'acces. Nous sommes a votre ecoute pour toute question.",
  openGraph: {
    title: "Contact | Glisse Gauloise",
    description:
      "Contactez Glisse Gauloise a Eaubonne. Telephone, email, formulaire de contact et plan d'acces.",
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
