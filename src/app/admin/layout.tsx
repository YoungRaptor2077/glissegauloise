"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { PushNotificationBanner } from "@/components/admin/PushNotificationBanner";
import { User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // If we're on the login page, just render children (login has its own layout)
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();

        if (!data.authenticated) {
          window.location.href = "/";
          return;
        }

        setIsAuthenticated(true);
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gris-anthracite">
        <div className="animate-pulse text-blanc-casse/60">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gris-anthracite">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-noir-mat/50 px-6">
          <div className="pl-12 lg:pl-0">
            <h1 className="text-sm font-medium text-blanc-casse/60">
              Panneau d&apos;administration
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-2 rounded-lg border border-white/5 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-vert-neon/10">
                <User size={14} className="text-vert-neon" />
              </div>
              <span className="text-sm font-medium text-blanc-casse/80">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <PushNotificationBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
