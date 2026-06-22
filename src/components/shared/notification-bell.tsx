"use client";

import { useState, useCallback } from "react";
import { Bell, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setHasLoaded(true);
      }
    } catch (error) {
      console.warn("Failed to fetch notifications:", error instanceof Error ? error.message : error);
    }
  }, []);

  async function handleOpenChange(open: boolean) {
    if (open && !hasLoaded) {
      await fetchNotifications();
    }
  }

  async function handleMarkAsRead(id: string, link: string | null) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }

    if (link) {
      router.push(link);
    }
  }

  async function handleMarkAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-transform active:scale-95">
          <Bell className="h-5 w-5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-fade-in animate-duration-200">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-1 shadow-lg ring-1 ring-emerald-950/5">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <CheckSquare className="h-3 w-3" />
              Tandai semua dibaca
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {!hasLoaded ? (
            <div className="py-8 text-center text-xs text-muted-foreground font-medium">
              Klik untuk memuat notifikasi
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground font-medium">
              Belum ada notifikasi baru
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleMarkAsRead(item.id, item.link)}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer text-xs transition-colors focus:bg-slate-50 ${
                  !item.isRead ? "bg-emerald-50/20 font-medium" : ""
                }`}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className={`text-[12px] font-semibold ${!item.isRead ? "text-emerald-950" : "text-slate-800"}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                  {item.message}
                </p>
                {!item.isRead && (
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
