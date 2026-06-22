"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Browsers, ChartLineUp, Check, DeviceMobile, GlobeHemisphereWest, Lightning, ShoppingBagOpen } from "@phosphor-icons/react";

const services = [
  { icon: GlobeHemisphereWest, title: "Website & kehadiran digital", description: "Website yang khas, cepat, dan dirancang untuk mengubah perhatian menjadi percakapan bisnis.", includes: ["Strategi produk", "Desain UI/UX", "CMS", "SEO & performa"] },
  { icon: Browsers, title: "Aplikasi web", description: "Aplikasi khusus yang menyederhanakan proses rumit dan tumbuh bersama operasional Anda.", includes: ["Desain alur kerja", "Dashboard", "Integrasi API", "Akses berbasis peran"] },
  { icon: DeviceMobile, title: "Pengalaman mobile", description: "Pengalaman mobile yang ringan dan intuitif untuk pengguna yang selalu bergerak.", includes: ["iOS & Android", "Design system", "Mode offline", "Push notification"] },
  { icon: ChartLineUp, title: "Dashboard & analitik", description: "Satu pandangan yang jernih untuk membaca performa dan mengambil keputusan lebih cepat.", includes: ["Visualisasi data", "Laporan kustom", "Metrik real-time", "Ekspor data"] },
  { icon: ShoppingBagOpen, title: "Perdagangan digital", description: "Commerce experience yang menghubungkan katalog, transaksi, dan hubungan pelanggan.", includes: ["Katalog produk", "Pembayaran", "Alur pesanan", "Portal pelanggan"] },
  { icon: Lightning, title: "Otomasi & AI", description: "Otomasi yang memangkas pekerjaan berulang tanpa menambah kerumitan baru.", includes: ["Audit proses", "Alur kerja AI", "Integrasi", "Pemantauan"] },
];

export function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-emerald-950/10 bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <div className="divide-y divide-emerald-950/10">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isActive = index === activeIndex;
          return (
            <button key={service.title} type="button" onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} className={`flex min-h-20 w-full items-center gap-4 px-5 py-4 text-left transition-colors sm:px-7 ${isActive ? "bg-emerald-50 text-emerald-950" : "text-slate-600 hover:bg-slate-50"}`} aria-pressed={isActive}>
              <Icon className={`h-6 w-6 shrink-0 ${isActive ? "text-emerald-700" : "text-slate-400"}`} weight="duotone" />
              <span className="flex-1 text-base font-semibold sm:text-lg">{service.title}</span>
              <ArrowUpRight className={`h-4 w-4 transition-transform ${isActive ? "-translate-y-0.5 translate-x-0.5" : "text-slate-300"}`} weight="bold" />
            </button>
          );
        })}
      </div>
      <div className="relative flex min-h-[32rem] flex-col justify-between overflow-hidden bg-emerald-950 p-7 text-white sm:p-10 lg:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-300 text-emerald-950"><ActiveIcon className="h-7 w-7" weight="duotone" /></span>
          <h2 className="mt-9 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{active.title}</h2>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-emerald-100/80">{active.description}</p>
          <ul className="mt-9 grid gap-3 sm:grid-cols-2">
            {active.includes.map((item) => <li key={item} className="flex items-center gap-3 rounded-lg bg-white/[0.07] px-4 py-3 text-sm text-emerald-50"><Check className="h-4 w-4 shrink-0 text-emerald-300" weight="bold" />{item}</li>)}
          </ul>
        </div>
        <Link href="/contact" className="relative mt-10 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-200">Diskusikan kebutuhan<ArrowUpRight className="h-4 w-4" weight="bold" /></Link>
      </div>
    </div>
  );
}
