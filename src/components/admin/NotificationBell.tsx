"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        const notifs: Notification[] = [];

        if (data.recentOrders) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.recentOrders.slice(0, 2).forEach((order: any) => {
            notifs.push({
              id: order.id,
              title: "Nouvelle commande",
              message: `Commande ${order.id} - ${order.total}\u20AC`,
              time: order.date,
              read: false,
            });
          });
        }

        if (data.recentRepairs) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.recentRepairs.slice(0, 2).forEach((repair: any) => {
            notifs.push({
              id: repair.id,
              title: "Nouvelle reparation",
              message: `${repair.board} - ${repair.client}`,
              time: repair.date,
              read: false,
            });
          });
        }

        setNotifications(notifs);
      } catch {
        // Silently fail
      }
    }
    loadNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-blanc-casse/60 transition-colors hover:bg-gris-anthracite hover:text-blanc-casse"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vert-neon text-[10px] font-bold text-noir-mat">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-gris-anthracite shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-blanc-casse">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-vert-neon hover:text-vert-neon-dark"
              >
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-blanc-casse/40">
                Aucune notification
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "w-full border-b border-white/5 p-4 text-left transition-colors hover:bg-gris-anthracite-light last:border-b-0",
                    !notification.read && "bg-vert-neon/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-vert-neon" />
                    )}
                    <div className={cn(!notification.read ? "" : "pl-5")}>
                      <p className="text-sm font-medium text-blanc-casse">
                        {notification.title}
                      </p>
                      <p className="text-xs text-blanc-casse/60">{notification.message}</p>
                      <p className="mt-1 text-xs text-blanc-casse/40">{notification.time}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
