"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

export function PushNotificationBanner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if push is supported and not yet subscribed
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    // Register service worker
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // SW registration failed
    });

    // Check if already subscribed and resync with server
    navigator.serviceWorker.ready.then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        // No local subscription, show banner to subscribe
        setShow(true);
        return;
      }

      // Subscription exists locally, resync it with the server
      try {
        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Push resync failed:", res.status, errorData);
          // Server sync failed, show banner so client can retry
          setShow(true);
        }
        // If sync succeeded, don't show banner (everything is OK)
      } catch (err) {
        console.error("Push resync network error:", err);
        // Network or other error, show banner to allow retry
        setShow(true);
      }
    });
  }, []);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShow(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidKey) {
        console.error("VAPID public key not configured");
        setError("Cle VAPID non configuree");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      // Save subscription to server
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (res.ok) {
        setShow(false);
        setError(null);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Reponse invalide" }));
        console.error("Push subscribe failed:", res.status, errorData);
        setError(errorData.error || "Erreur inconnue");
      }
    } catch (err) {
      console.error("Push subscription error:", err);
      setError("Erreur: " + (err instanceof Error ? err.message : "inconnue"));
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between rounded-lg border border-vert-neon/20 bg-vert-neon/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Bell size={18} className="text-vert-neon" />
          <span className="text-sm text-blanc-casse/80">
            Activez les notifications pour etre alerte de vos reparations, devis et messages.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="rounded-lg bg-vert-neon px-4 py-1.5 text-sm font-medium text-noir-mat transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "Activer"}
          </button>
          <button
            onClick={() => setShow(false)}
            className="rounded-lg p-1.5 text-blanc-casse/40 transition-colors hover:text-blanc-casse/80"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-400">
          Erreur: {error}
        </p>
      )}
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
