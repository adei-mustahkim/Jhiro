"use client";

import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import {
  SquaresFour,
  Folder,
  Receipt,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dasbor", href: "/portal/dashboard", icon: SquaresFour },
  { name: "Proyek Saya", href: "/portal/projects", icon: Folder },
  { name: "Invoice", href: "/portal/invoices", icon: Receipt },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      navigation={navigation}
      brandHref="/portal/dashboard"
      brandSubtitle="Client portal"
      userSecondary="Klien"
      showUserImage={false}
      activeMatchMode="exact"
      headerActions={
        <Link href="/">
          <Button variant="ghost" size="sm">
            Lihat Website
          </Button>
        </Link>
      }
      dropdownItems={
        <DropdownMenuItem asChild>
          <Link href="/portal/profile">Profil</Link>
        </DropdownMenuItem>
      }
    >
      {children}
    </AppShell>
  );
}
