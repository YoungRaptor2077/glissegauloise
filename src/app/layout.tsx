import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://glissegauloisse.fr"
  ),
  title: {
    default: "GlisseGauloisse - Trottinettes Electriques : Reparation, Pieces & Accessoires",
    template: "%s | GlisseGauloisse",
  },
  description:
    "Specialiste trottinette electrique a Eaubonne (95). Reparation, diagnostic, maintenance et vente de pieces detachees. Dualtron, Kaabo, Xiaomi, Ninebot. Livraison en France.",
  keywords: [
    "trottinette electrique",
    "reparation trottinette",
    "pieces detachees trottinette",
    "diagnostic trottinette electrique",
    "maintenance trottinette",
    "Dualtron",
    "Kaabo",
    "Xiaomi",
    "Ninebot",
    "Eaubonne",
    "Val d'Oise",
    "France",
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
  openGraph: {
    title: "GlisseGauloisse - Trottinettes Electriques : Reparation, Pieces & Accessoires",
    description:
      "Specialiste trottinette electrique. Reparation, diagnostic, maintenance et vente de pieces detachees premium.",
    type: "website",
    locale: "fr_FR",
    siteName: "GlisseGauloisse",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlisseGauloisse - Trottinettes Electriques : Reparation, Pieces & Accessoires",
    description:
      "Specialiste trottinette electrique. Reparation, diagnostic, maintenance et vente de pieces detachees premium.",
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
        <CartProvider>
          <Header />
          <main className="pt-16 lg:pt-20">{children}</main>
          <Footer />
          <CartDrawer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
