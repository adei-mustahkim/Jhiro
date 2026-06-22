import Link from "next/link";
import { ArrowUpRight, CheckCircle, Code } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageHero } from "@/components/public/page-hero";
import { ServicesShowcase } from "@/components/public/services-showcase";

export const revalidate = 300;

const process = [
  ["Eksplorasi", "Memahami tujuan, pengguna, dan batasan bisnis."],
  ["Definisi", "Menyusun ruang lingkup, prioritas, dan ukuran keberhasilan."],
  ["Desain", "Menguji alur dan bahasa visual sebelum development."],
  ["Pengembangan", "Membangun dalam sprint pendek dengan progres transparan."],
  ["Validasi", "Menguji fungsi, performa, aksesibilitas, dan edge case."],
  ["Peluncuran", "Merilis, memantau, dan menyiapkan iterasi berikutnya."],
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="services" />
      <main id="main-content">
        <PageHero eyebrow="Kapabilitas" title="Solusi digital yang dirancang untuk benar-benar dipakai." description="Strategi, desain, dan engineering dalam satu tim untuk membantu bisnis bekerja lebih baik dan tumbuh dengan percaya diri." />

        <section className="py-20 sm:py-28">
          <div className="container-wide">
            <div className="mb-10 grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <h2 className="max-w-lg text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">Pilih kapabilitas, lihat apa yang kami kerjakan.</h2>
              <p className="max-w-xl text-pretty text-base leading-7 text-slate-600 lg:justify-self-end">Setiap engagement disusun sesuai masalah bisnis, bukan paket yang dipaksakan. Arahkan kursor atau fokuskan layanan untuk melihat cakupannya.</p>
            </div>
            <ServicesShowcase />
          </div>
        </section>

        <section className="border-y border-emerald-950/10 bg-emerald-50/50 py-20 sm:py-28">
          <div className="container-wide grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            <div>
              <h2 className="max-w-md text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">Jelas dari awal, dekat sepanjang proses.</h2>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-600">Portal client membuat progres, file, percakapan, dan revisi tetap terlihat tanpa menambah rapat yang tidak perlu.</p>
              <Code className="mt-9 h-12 w-12 text-emerald-700" weight="duotone" />
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {process.map(([title, desc], index) => (
                <li key={title} className={`flex gap-4 rounded-xl p-5 sm:p-6 ${index === 0 ? "bg-emerald-950 text-white sm:col-span-2" : "bg-white"}`}>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold ${index === 0 ? "bg-emerald-300 text-emerald-950" : "bg-emerald-100 text-emerald-800"}`}><CheckCircle className="h-5 w-5" weight="fill" /></span>
                  <div><h3 className={`font-semibold ${index === 0 ? "text-white" : "text-slate-950"}`}>{title}</h3><p className={`mt-2 text-sm leading-6 ${index === 0 ? "text-emerald-100/80" : "text-slate-600"}`}>{desc}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-3 py-3 sm:px-6 sm:py-6">
          <div className="rounded-2xl bg-emerald-950 px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-20">
            <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
              <div><p className="text-sm font-medium text-emerald-300">Punya kebutuhan yang belum terpetakan?</p><h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">Mulai dari masalahnya. Kami bantu menyusun jalannya.</h2></div>
              <Link href="/contact"><Button size="xl" className="rounded-lg bg-emerald-300 text-emerald-950 hover:bg-emerald-200">Mulai percakapan<ArrowUpRight className="ml-2 h-4 w-4" weight="bold" /></Button></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
