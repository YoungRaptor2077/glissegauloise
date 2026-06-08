"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ToastData {
  id: string;
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 200);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto px-4 py-3 rounded-xl bg-gris-anthracite border border-vert-neon/30 shadow-lg shadow-vert-neon/5",
        "text-sm text-blanc-casse transition-all duration-200 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      )}
    >
      {toast.message}
    </div>
  );
}
