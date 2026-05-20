"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gris-anthracite/95 backdrop-blur-lg p-4 sm:p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie size={20} className="text-vert-neon shrink-0 mt-0.5" />
                <p className="text-sm text-blanc-casse/70">
                  Ce site utilise uniquement des <span className="text-blanc-casse font-medium">cookies techniques</span> necessaires a son bon fonctionnement. Aucun cookie publicitaire ou de tracking n&apos;est utilise.
                </p>
              </div>
              <button
                onClick={handleAccept}
                className="shrink-0 rounded-xl bg-vert-neon px-5 py-2.5 text-sm font-semibold text-noir-mat hover:opacity-90 transition-opacity"
              >
                Compris
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
