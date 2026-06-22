"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useSiteContent } from "@/hooks/use-site-content";
import { BrandMark } from "@/components/shared/brand-mark";

export function SiteFooter() {
  const { branding, contact, footer } = useSiteContent();
  const brandName = branding.name || "Jhiro Digital Lab";
  return (
    <footer className="bg-background py-14 sm:py-20">
      <div className="container-wide">
        <div className="grid gap-12 border-b border-emerald-950/10 pb-14 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <BrandMark size="sm" />
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">{footer.description || branding.tagline || "Studio produk digital independen di Indonesia. Strategi, desain, dan engineering dalam satu tim."}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Jelajahi</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600"><Link href="/services">Layanan</Link><Link href="/portfolio">Karya</Link><Link href="/blog">Insight</Link><Link href="/resources">Sumber Daya</Link></div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Hubungi</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600"><a href={`mailto:${contact.email || "hello@jhiro.id"}`}>{contact.email || "hello@jhiro.id"}</a>{contact.phone&&<a href={`tel:${contact.phone}`}>{contact.phone}</a>}<span>{contact.location || "Jakarta, Indonesia"}</span><Link href="/contact" className="inline-flex items-center gap-1.5 font-medium text-emerald-800">Diskusikan proyek <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>&copy; {new Date().getFullYear()} {footer.copyright || brandName}</p><div className="flex gap-6"><Link href="/privacy">Privasi</Link><Link href="/terms">Ketentuan</Link></div></div>
      </div>
    </footer>
  );
}
