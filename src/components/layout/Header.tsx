"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useWorkshopStatus } from "@/lib/hooks/useWorkshopStatus";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isOpen: workshopIsOpen } = useWorkshopStatus();

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
                className="relative rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse"
                aria-label="Panier"
              >
                <ShoppingCart size={20} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vert-neon text-[10px] font-bold text-noir-mat">
                  0
                </span>
              </button>

              {/* User button - desktop only */}
              <Link
                href="/espace-client"
                className="hidden rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse lg:block"
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
