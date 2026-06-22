"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/shared/brand-mark";

interface SiteHeaderProps {
  active?: "services" | "portfolio" | "blog" | "resources" | "contact" | "case-studies";
}

const navigation = [
  { key: "services", label: "Layanan", href: "/services" },
  { key: "portfolio", label: "Karya", href: "/portfolio" },
  { key: "case-studies", label: "Studi Kasus", href: "/case-studies" },
  { key: "blog", label: "Insight", href: "/blog" },
  { key: "resources", label: "Sumber Daya", href: "/resources" },
] as const;

export function SiteHeader({ active }: SiteHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeSidebar();
    }
    if (sidebarOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [sidebarOpen, closeSidebar]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav className="container-wide grid h-[4.5rem] grid-cols-[auto_1fr_auto] items-center rounded-2xl border border-emerald-950/10 bg-white/90 px-3 shadow-[0_8px_28px_-18px_rgba(6,78,59,0.28)] backdrop-blur-xl sm:px-4 lg:grid-cols-[1fr_auto_1fr]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 lg:hidden"
            aria-label="Buka menu"
            aria-expanded={sidebarOpen}
          >
            <List className="h-5 w-5" weight="bold" />
          </button>

          <BrandMark size="md" showTagline textClassName="hidden lg:block" />

          <div className="hidden items-center gap-7 lg:flex lg:justify-self-center">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-900",
                  active === item.key ? "text-emerald-900" : "text-slate-500"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-self-end gap-1 sm:gap-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" className="rounded-xl bg-emerald-950 px-4 hover:bg-emerald-900">
                Mulai project
                <ArrowUpRight className="ml-1.5 h-4 w-4" weight="bold" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 border-r border-emerald-950/10 bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-emerald-950/10 px-6">
          <BrandMark size="md" />
          <button
            onClick={closeSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" weight="bold" />
          </button>
        </div>

        <div className="flex flex-col gap-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeSidebar}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                active === item.key
                  ? "bg-emerald-700 text-white shadow-[0_10px_24px_-14px_rgba(5,150,105,0.6)]"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-emerald-950/10 p-4 space-y-2">
          <Link href="/login" onClick={closeSidebar} className="block">
            <Button variant="ghost" className="w-full justify-center text-slate-600">
              Masuk
            </Button>
          </Link>
          <Link href="/contact" onClick={closeSidebar} className="block">
            <Button className="w-full justify-center rounded-xl bg-emerald-950 hover:bg-emerald-900">
              Mulai project
              <ArrowUpRight className="ml-1.5 h-4 w-4" weight="bold" />
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
