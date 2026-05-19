"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/connexion");
          return;
        }

        if (!data.role || !["admin", "super_admin"].includes(data.role)) {
          router.push("/espace-client");
          return;
        }

        setIsAdmin(true);
      } catch {
        router.push("/espace-client");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (loading || !isAdmin) {
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
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
