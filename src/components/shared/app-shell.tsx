"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { List, X, SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/shared/brand-mark";
import { useSiteContent } from "@/hooks/use-site-content";
import { NotificationBell } from "@/components/shared/notification-bell";
import { FloatingChat } from "@/components/shared/floating-chat";
import type { ElementType, ReactNode } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: ElementType;
}

interface AppShellProps {
  children: ReactNode;
  navigation: NavItem[];
  brandHref: string;
  brandSubtitle: string;
  userSecondary: string;
  showUserImage?: boolean;
  activeMatchMode?: "prefix" | "exact";
  topBarCenter?: ReactNode;
  dropdownItems?: ReactNode;
  headerActions?: ReactNode;
}

export function AppShell({
  children,
  navigation,
  brandHref,
  brandSubtitle,
  userSecondary,
  showUserImage = false,
  activeMatchMode = "prefix",
  topBarCenter,
  dropdownItems,
  headerActions,
}: AppShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { branding } = useSiteContent();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    activeMatchMode === "prefix"
      ? pathname === href || pathname.startsWith(href + "/")
      : pathname === href;

  const currentSection = navigation.find((item) => isActive(item.href));

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "print:hidden fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-emerald-950 text-white transform transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
            <BrandMark href={brandHref} size="md" subtitle={brandSubtitle} textClassName="[&>span:first-child]:text-white [&>span:last-child]:text-emerald-300" />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" weight="bold" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-emerald-300 text-emerald-950"
                      : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-9 w-9">
                {showUserImage && <AvatarImage src={session?.user?.image || undefined} />}
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
                <p className="truncate text-xs text-emerald-200/70">
                  {userSecondary}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start text-emerald-100/70 hover:bg-white/10 hover:text-white"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <SignOut className="h-4 w-4 mr-2" weight="bold" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 print:pl-0">
        <header className="print:hidden sticky top-0 z-30 h-16 border-b border-emerald-950/10 bg-white/90 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between px-4 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <List className="h-5 w-5" weight="bold" />
            </Button>

            {topBarCenter !== undefined ? (
              <div className="min-w-0 flex-1 pl-3 lg:pl-0">
                {topBarCenter}
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <div className="flex items-center gap-2">
              {headerActions}
              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {showUserImage && <AvatarImage src={session?.user?.image || undefined} />}
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{session?.user?.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {session?.user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {dropdownItems}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-destructive focus:text-destructive"
                  >
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main id="main-content" className="workspace-main mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8 print:p-0">
          {children}
        </main>
        <FloatingChat />
      </div>
    </div>
  );
}


