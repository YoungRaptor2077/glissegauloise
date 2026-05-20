"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useWorkshopStatus } from "@/lib/hooks/useWorkshopStatus";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isOpen: workshopIsOpen } = useWorkshopStatus();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col bg-noir-mat"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-blanc-casse">
                Glisse
              </span>
              <span className="text-xl font-bold text-vert-neon">
                Gauloisse
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-blanc-casse/70 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse"
              aria-label="Fermer le menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-2xl font-semibold text-blanc-casse transition-colors hover:text-vert-neon"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-white/5 px-6 py-6">
            {/* Workshop status */}
            <div className="mb-4 flex items-center justify-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  workshopIsOpen ? "bg-vert-neon animate-pulse" : "bg-red-500"
                )}
              />
              <span className="text-sm text-blanc-casse/70">
                {workshopIsOpen ? "Atelier ouvert" : "Atelier ferme"}
              </span>
            </div>

            {/* Login button */}
            <Link
              href="/espace-client"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-gris-anthracite px-4 py-3 text-sm font-medium text-blanc-casse transition-colors hover:border-vert-neon/30"
            >
              <User size={18} />
              Mon compte
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
