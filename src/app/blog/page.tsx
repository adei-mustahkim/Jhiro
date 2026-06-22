import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "@phosphor-icons/react/dist/ssr";
import { getPublicArticles } from "@/lib/public-content";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageHero } from "@/components/public/page-hero";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

async function getArticles(){return getPublicArticles()}

export default async function BlogPage(){const articles=await getArticles();return <div className="min-h-screen bg-background"><SiteHeader active="blog"/><main id="main-content"><PageHero eyebrow="Insight" title="Catatan dari proses membangun produk digital." description="Pemikiran praktis tentang strategi, desain, teknologi, dan keputusan kecil yang menentukan kualitas sebuah produk."/><section className="py-24 sm:py-32"><div className="container-wide">{articles.length===0?<div className="rounded-2xl border border-emerald-950/10 bg-emerald-50/50 px-6 py-20 text-center"><BookOpenText className="mx-auto h-12 w-12 text-emerald-700" weight="duotone"/><h2 className="mt-6 text-2xl font-semibold tracking-tight">Insight sedang kami siapkan</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Kami sedang merapikan catatan pertama agar benar-benar berguna saat diterbitkan.</p></div>:<div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12">{articles.map((article,index)=><Link key={article.id} href={`/blog/${article.slug}`} className={`${index===0?"lg:col-span-8":"lg:col-span-4"} group`}><article><div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-emerald-950">{article.thumbnail?<Image src={article.thumbnail} alt={article.title} fill className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"/>:<div className="absolute inset-0"><div className="absolute -right-16 top-8 h-64 w-64 rounded-full bg-emerald-400/40 blur-3xl"/><div className="absolute bottom-[-30%] left-[18%] h-64 w-64 rotate-12 rounded-2xl border border-white/10 bg-white/10"/></div>}<span className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white"><ArrowUpRight className="h-4 w-4" weight="bold"/></span></div><div className="mt-6"><div className="flex gap-3 text-xs text-slate-400"><span>{article.category}</span><span>Â·</span><span>{article.publishedAt?formatDate(article.publishedAt):"Draft"}</span></div><h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 group-hover:text-emerald-800">{article.title}</h2>{article.excerpt&&<p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{article.excerpt}</p>}</div></article></Link>)}</div>}</div></section></main><SiteFooter/></div>}

