"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Wrench,
  FileText,
  CreditCard,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "Produits", href: "/admin/produits", icon: <Package size={20} /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderTree size={20} /> },
  { label: "Commandes", href: "/admin/commandes", icon: <ShoppingCart size={20} /> },
  { label: "Reparations", href: "/admin/reparations", icon: <Wrench size={20} /> },
  { label: "Devis", href: "/admin/devis", icon: <FileText size={20} /> },
  { label: "Tarifs", href: "/admin/tarifs", icon: <CreditCard size={20} /> },
  { label: "Clients", href: "/admin/clients", icon: <Users size={20} /> },
  { label: "Conversations", href: "/admin/conversations", icon: <MessageSquare size={20} /> },
  { label: "Parametres", href: "/admin/parametres", icon: <Settings size={20} /> },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-gris-anthracite p-2 text-blanc-casse lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 bg-noir-mat transition-all duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64 translate-x-0",
          "lg:relative lg:translate-x-0",
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-lg font-bold text-vert-neon">GG</span>
              <span className="text-sm font-medium text-blanc-casse">Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <span className="text-lg font-bold text-vert-neon">GG</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1.5 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse lg:block"
          >
            <ChevronLeft
              size={18}
              className={cn("transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setCollapsed(true);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-vert-neon/10 text-vert-neon"
                      : "text-blanc-casse/60 hover:bg-gris-anthracite hover:text-blanc-casse"
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0",
                      isActive(item.href) && "text-vert-neon"
                    )}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                  {isActive(item.href) && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-vert-neon" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
