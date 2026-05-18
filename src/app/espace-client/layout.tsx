"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Tableau de bord", href: "/espace-client", icon: LayoutDashboard },
  { label: "Commandes", href: "/espace-client/commandes", icon: ShoppingBag },
  { label: "Reparations", href: "/espace-client/reparations", icon: Wrench },
  { label: "Devis", href: "/espace-client/devis", icon: FileText },
  { label: "Messages", href: "/espace-client/messages", icon: MessageSquare },
  { label: "Profil", href: "/espace-client/profil", icon: User },
];

interface SidebarAnimationProps {
  children: React.ReactNode;
  className?: string;
}

function SidebarContainer({ children, className }: SidebarAnimationProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.aside>
  );
}

export default function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/connexion");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-noir-mat flex">
      {/* Desktop Sidebar */}
      <SidebarContainer className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30">
        <div className="flex flex-col h-full bg-gris-anthracite border-r border-white/5">
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="text-xl font-bold text-vert-neon">
              GlisseGauloisse
            </Link>
            <p className="text-xs text-blanc-casse/50 mt-1">Espace Client</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/espace-client" &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-vert-neon/10 text-vert-neon border border-vert-neon/20"
                      : "text-blanc-casse/70 hover:bg-white/5 hover:text-blanc-casse"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blanc-casse/70 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 w-full"
            >
              <LogOut className="h-4 w-4" />
              Deconnexion
            </button>
          </div>
        </div>
      </SidebarContainer>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-64 h-full bg-gris-anthracite border-r border-white/5 flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-vert-neon">
                GlisseGauloisse
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-blanc-casse/70 hover:text-blanc-casse"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/espace-client" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-vert-neon/10 text-vert-neon border border-vert-neon/20"
                        : "text-blanc-casse/70 hover:bg-white/5 hover:text-blanc-casse"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blanc-casse/70 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 w-full"
              >
                <LogOut className="h-4 w-4" />
                Deconnexion
              </button>
            </div>
          </motion.aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-gris-anthracite/80 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-blanc-casse/70 hover:text-blanc-casse"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-sm font-medium text-blanc-casse">
            Espace Client
          </span>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
