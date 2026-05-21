"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useWorkshopStatus } from "@/lib/hooks/useWorkshopStatus";
import { useCart } from "@/lib/hooks/useCart";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isOpen: workshopIsOpen } = useWorkshopStatus();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "glass-strong shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-bold text-blanc-casse lg:text-2xl">
                Glisse
              </span>
              <span className="text-xl font-bold text-vert-neon lg:text-2xl">
                Gauloisse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-blanc-casse/70 transition-colors hover:text-vert-neon"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Workshop status - desktop only */}
              <div className="hidden items-center gap-2 lg:flex">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    workshopIsOpen ? "bg-vert-neon animate-pulse" : "bg-red-500"
                  )}
                />
                <span className="text-xs text-blanc-casse/60">
                  {workshopIsOpen ? "Atelier ouvert" : "Atelier ferme"}
                </span>
              </div>

              {/* Social links - desktop only */}
              <a href="https://www.instagram.com/glissegauloisse/?hl=fr" target="_blank" rel="noopener noreferrer" className="hidden rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-vert-neon lg:block" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@glissegauloisse" target="_blank" rel="noopener noreferrer" className="hidden rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-vert-neon lg:block" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.5V7.1a4.83 4.83 0 0 1-1-.41z"/>
                </svg>
              </a>

              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>

              {/* Cart button */}
              <button
                onClick={openCart}
                className="relative rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse"
                aria-label="Panier"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vert-neon text-[10px] font-bold text-noir-mat">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User button */}
              <Link
                href="/espace-client"
                className="rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse"
                aria-label="Mon compte"
              >
                <User size={20} />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse lg:hidden"
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
