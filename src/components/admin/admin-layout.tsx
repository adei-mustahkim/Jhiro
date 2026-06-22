"use client";

import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import {
  SquaresFour,
  Users,
  Folder,
  Receipt,
  Files,
  Briefcase,
  BookOpen,
  Download,
  Pulse,
  Gear,
  ChartBar,
} from "@phosphor-icons/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dasbor", href: "/dashboard", icon: SquaresFour },
  { name: "Klien", href: "/clients", icon: Users },
  { name: "Proyek", href: "/projects", icon: Folder },
  { name: "Invoice", href: "/invoices", icon: Receipt },
  { name: "CMS", href: "/cms", icon: Files },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Portofolio", href: "/admin/portfolio", icon: Briefcase },
  { name: "Studi Kasus", href: "/admin/case-study", icon: ChartBar },
  { name: "Sumber Daya", href: "/admin/resources", icon: Download },
  { name: "Log Aktivitas", href: "/activity-logs", icon: Pulse },
  { name: "Pengaturan", href: "/settings", icon: Gear },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      navigation={navigation}
      brandHref="/dashboard"
      brandSubtitle="Admin console"
      userSecondary="Super Admin"
      showUserImage={true}
      activeMatchMode="prefix"
      topBarCenter={
        <>
          <p className="truncate text-sm font-semibold tracking-tight text-emerald-950">
            Admin
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Jhiro Digital Lab workspace
          </p>
        </>
      }
      dropdownItems={
        <>
          <DropdownMenuItem asChild>
            <Link href="/settings">Pengaturan</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">Lihat Website</Link>
          </DropdownMenuItem>
        </>
      }
    >
      {children}
    </AppShell>
  );
}
