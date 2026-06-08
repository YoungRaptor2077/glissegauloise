import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://glissegauloisse.com"
  ),
  title: {
    default: "GlisseGauloisse | Reparation Trottinette Electrique Eaubonne 95",
    template: "%s | GlisseGauloisse",
  },
  description:
    "GlisseGauloisse - Expert en reparation de trottinettes electriques a Eaubonne (95600). Diagnostic, reparation batterie, pneus, freins, controleurs. Dualtron, Kaabo, Xiaomi, Nami, Vsett. Devis gratuit.",
  keywords: [
    "reparation trottinette electrique",
    "reparation trottinette Eaubonne",
    "reparation trottinette 95",
    "reparation trottinette Val d'Oise",
    "GlisseGauloisse",
    "diagnostic trottinette",
    "reparation Dualtron",
    "reparation Kaabo",
    "reparation Xiaomi",
    "pieces trottinette electrique",
    "batterie trottinette",
    "pneu trottinette",
    "entretien trottinette electrique",
    "meilleur reparateur trottinette",
    "trottinette electrique 95600",
  ],
  authors: [{ name: "GlisseGauloisse" }],
  creator: "GlisseGauloisse",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://glissegauloisse.com",
  },
  openGraph: {
    title: "GlisseGauloisse | Reparation Trottinette Electrique Eaubonne 95",
    description:
      "GlisseGauloisse - Expert en reparation de trottinettes electriques a Eaubonne (95600). Diagnostic, reparation batterie, pneus, freins, controleurs. Dualtron, Kaabo, Xiaomi, Nami, Vsett. Devis gratuit.",
    type: "website",
    locale: "fr_FR",
    siteName: "GlisseGauloisse",
    url: "https://glissegauloisse.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlisseGauloisse | Reparation Trottinette Electrique Eaubonne 95",
    description:
      "GlisseGauloisse - Expert en reparation de trottinettes electriques a Eaubonne (95600). Diagnostic, reparation batterie, pneus, freins, controleurs. Dualtron, Kaabo, Xiaomi, Nami, Vsett. Devis gratuit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-noir-mat text-blanc-casse antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "GlisseGauloisse",
              "alternateName": ["Glisse Gauloisse", "GlisseGauloise", "Glisse Gauloise"],
              "description": "Expert en reparation de trottinettes electriques a Eaubonne (95600). Diagnostic, reparation batterie, pneus, freins, controleurs. Toutes marques: Dualtron, Kaabo, Xiaomi, Nami, Vsett.",
              "url": "https://glissegauloisse.com",
              "telephone": "+33786757963",
              "email": "GlisseGauloisse.Service@outlook.fr",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "49 Route de Margency",
                "addressLocality": "Eaubonne",
                "postalCode": "95600",
                "addressRegion": "Val-d'Oise",
                "addressCountry": "FR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "48.9922",
                "longitude": "2.2847"
              },
              "areaServed": [
                { "@type": "City", "name": "Eaubonne" },
                { "@type": "City", "name": "Enghien-les-Bains" },
                { "@type": "City", "name": "Montmorency" },
                { "@type": "City", "name": "Ermont" },
                { "@type": "City", "name": "Saint-Gratien" },
                { "@type": "AdministrativeArea", "name": "Val-d'Oise" }
              ],
              "openingHoursSpecification": [
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "17:00" },
                { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "17:00" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Services de reparation trottinette electrique",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Diagnostic trottinette electrique", "description": "Diagnostic complet de votre trottinette electrique" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Reparation batterie trottinette", "description": "Remplacement et reparation de batteries pour trottinettes electriques" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Changement pneu trottinette", "description": "Remplacement de pneus et chambres a air pour trottinettes" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Reparation freinage trottinette", "description": "Reparation et remplacement de systemes de freinage" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Reparation controleur trottinette", "description": "Diagnostic et reparation de controleurs electroniques" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Entretien trottinette electrique", "description": "Service d'entretien complet pour trottinettes electriques" } }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "10"
              },
              "priceRange": "$$",
              "image": "https://glissegauloisse.com/og-image.png",
              "sameAs": [
                "https://www.instagram.com/glissegauloisse/",
                "https://www.tiktok.com/@glissegauloisse"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GlisseGauloisse",
              "url": "https://glissegauloisse.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://glissegauloisse.com/boutique?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <CartProvider>
          <Header />
          <main className="pt-16 lg:pt-20">{children}</main>
          <Footer />
          <CartDrawer />
          <CookieBanner />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
