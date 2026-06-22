import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function NotFound(){return <main id="main-content" className="hero-grid grid min-h-dvh place-items-center bg-background px-5"><div className="max-w-xl text-center"><span className="text-sm font-semibold text-emerald-700 tabular-nums">404</span><h1 className="mt-5 text-balance text-5xl font-semibold leading-none tracking-[-0.055em] text-emerald-950 sm:text-6xl">Halaman ini tidak ditemukan.</h1><p className="mt-6 text-base leading-7 text-slate-500">Tautannya mungkin sudah berubah, atau halaman tersebut belum tersedia.</p><Link href="/" className="mt-9 inline-block"><Button size="lg" className="bg-emerald-950 hover:bg-emerald-900"><ArrowLeft className="mr-2 h-4 w-4"/>Kembali ke beranda</Button></Link></div></main>}
