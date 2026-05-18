import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Glisse Gauloise - Premium Skate & Glisse",
  description:
    "La plateforme premium de glisse en France. Skateboard, longboard, surfskate et accessoires haut de gamme.",
  keywords: [
    "skateboard",
    "longboard",
    "surfskate",
    "glisse",
    "premium",
    "france",
  ],
  openGraph: {
    title: "Glisse Gauloise - Premium Skate & Glisse",
    description:
      "La plateforme premium de glisse en France. Skateboard, longboard, surfskate et accessoires haut de gamme.",
    type: "website",
    locale: "fr_FR",
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
        <Header />
        <main className="pt-16 lg:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
