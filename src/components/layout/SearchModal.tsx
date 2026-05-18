"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-50 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-gris-anthracite/95 p-4 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <Search size={20} className="shrink-0 text-blanc-casse/40" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher un produit, une marque..."
                className="flex-1 bg-transparent text-lg text-blanc-casse placeholder:text-blanc-casse/30 focus:outline-none"
              />
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg p-1.5 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite-light hover:text-blanc-casse"
                aria-label="Fermer la recherche"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hint text */}
            <div className="mt-4 border-t border-white/5 pt-4">
              <p className="text-xs text-blanc-casse/40">
                Appuyez sur Echap pour fermer
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
