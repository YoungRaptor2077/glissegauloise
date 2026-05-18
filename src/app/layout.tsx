import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
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
    default: "GlisseGauloisse - Skateboard, Longboard & Surfskate Premium",
    template: "%s | GlisseGauloisse",
  },
  description:
    "Boutique en ligne de skateboard, longboard et surfskate premium a Eaubonne (95). Vente, reparation et conseils personnalises. Livraison en France.",
  keywords: [
    "skateboard",
    "longboard",
    "surfskate",
    "glisse urbaine",
    "reparation skate",
    "boutique skate",
    "Eaubonne",
    "Val d'Oise",
    "France",
    "premium",
    "accessoires skate",
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
    title: "GlisseGauloisse - Skateboard, Longboard & Surfskate Premium",
    description:
      "Boutique en ligne de skateboard, longboard et surfskate premium. Vente, reparation et conseils personnalises.",
    type: "website",
    locale: "fr_FR",
    siteName: "GlisseGauloisse",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlisseGauloisse - Skateboard, Longboard & Surfskate Premium",
    description:
      "Boutique en ligne de skateboard, longboard et surfskate premium. Vente, reparation et conseils personnalises.",
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
        </CartProvider>
      </body>
    </html>
  );
}
