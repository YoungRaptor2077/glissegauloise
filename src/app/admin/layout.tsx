"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/login/verify");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [isLoginPage, router]);

  // Login page renders without the admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-noir-mat">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vert-neon border-t-transparent" />
      </div>
    );
  }

  // Not authenticated - will redirect, show nothing
  if (!isAuthenticated) {
    return null;
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
