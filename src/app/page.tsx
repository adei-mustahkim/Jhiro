import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  ArrowUpRight,
  Browsers,
  ChartLineUp,
  CheckCircle,
  CirclesFour,
  Code,
  DeviceMobile,
  GlobeHemisphereWest,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { PortfolioCard } from '@/components/public/portfolio-card'
import { getCMSSections } from '@/lib/cms-content'
import { getPublicPortfolios } from '@/lib/public-content'
import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const revalidate = 300

interface HeroContent {
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
  heroImageUrl?: string
}

interface AboutContent {
  title: string
  description: string
  imageUrl?: string
}

interface StatsContent {
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  stat3Value?: string
  stat3Label?: string
  stat4Value?: string
  stat4Label?: string
}

interface ServiceItem {
  title: string
  description: string
  icon: string
}

interface ServicesContent {
  title: string
  items: ServiceItem[]
}

async function getCMSContent() {
  const [sections, portfolios] = await Promise.all([
    getCMSSections(['hero', 'about', 'services', 'stats']),
    getPublicPortfolios(),
  ])
  return {
    hero: sections.hero ? { content: sections.hero } : null,
    about: sections.about ? { content: sections.about } : null,
    services: sections.services ? { content: sections.services } : null,
    stats: sections.stats ? { content: sections.stats } : null,
    portfolios: portfolios.slice(0, 4),
  }
}

const getStats = unstable_cache(
  async () => {
    try {
      const [completedProjects, totalClients] = await Promise.all([
        prisma.project.count({ where: { status: 'COMPLETED', deletedAt: null } }),
        prisma.client.count({ where: { deletedAt: null } }),
      ])
      return {
        projects: completedProjects || 48,
        clients: totalClients || 31,
      }
    } catch {
      return { projects: 48, clients: 31 }
    }
  },
  ['home-stats'],
  { revalidate: 300, tags: ['stats'] }
)

const serviceIcons = {
  globe: GlobeHemisphereWest,
  monitor: Browsers,
  smartphone: DeviceMobile,
  chart: ChartLineUp,
}

const fallbackProjects = [
  {
    id: 'velora',
    slug: 'velora',
    name: 'Velora Commerce',
    description: 'Commerce experience yang menyatukan katalog, pesanan, dan pertumbuhan.',
    technologies: ['Product design', 'Next.js', 'Commerce'],
    screenshots: [],
  },
  {
    id: 'nadi',
    slug: 'nadi',
    name: 'Nadi Operations',
    description: 'Satu ruang kerja untuk melihat operasional tanpa kehilangan konteks.',
    technologies: ['Dashboard', 'Automation', 'Analytics'],
    screenshots: [],
  },
  {
    id: 'sora',
    slug: 'sora',
    name: 'Sora Living',
    description: 'Identitas digital yang mengubah pencarian properti menjadi pengalaman.',
    technologies: ['Brand system', 'Web design', 'CMS'],
    screenshots: [],
  },
]

export default async function HomePage() {
  const [{ hero, about, services, stats: cmsStats, portfolios }, dbStats] = await Promise.all([
    getCMSContent(),
    getStats(),
  ])

  const statsContent = (cmsStats?.content as unknown as StatsContent) || {}

  const heroContent = (hero?.content as unknown as HeroContent) || {
    headline: 'Produk digital yang membuat bisnis bergerak lebih jauh.',
    subheadline:
      'Kami merancang dan membangun website, aplikasi, serta sistem operasional yang terasa jernih bagi pengguna dan bernilai bagi bisnis.',
    ctaPrimary: 'Mulai project',
    ctaSecondary: 'Lihat karya',
  }

  const aboutContent = (about?.content as unknown as AboutContent) || {
    title: 'Partner digital, bukan sekadar vendor.',
    description:
      'Jhiro Digital Lab menyatukan strategi, desain, dan engineering dalam satu tim kecil yang fokus. Kami bekerja dekat dengan bisnis Anda untuk mengubah persoalan rumit menjadi produk yang sederhana digunakan.',
  }
  const aboutSentences = aboutContent.description.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [
    aboutContent.description,
  ]
  const aboutParagraphs = aboutSentences.reduce<string[]>((paragraphs, sentence, index) => {
    const paragraphIndex = Math.floor(index / 3)
    paragraphs[paragraphIndex] = `${paragraphs[paragraphIndex] ?? ''} ${sentence.trim()}`.trim()
    return paragraphs
  }, [])

  const servicesContent = (services?.content as unknown as ServicesContent) || {
    title: 'Dari ide mentah sampai produk yang dipakai.',
    items: [
      {
        title: 'Website & digital presence',
        description:
          'Website yang cepat, khas, dan dibangun untuk mengubah perhatian menjadi percakapan bisnis.',
        icon: 'globe',
      },
      {
        title: 'Web application',
        description:
          'Aplikasi khusus yang merapikan proses, menyatukan data, dan tumbuh bersama operasional.',
        icon: 'monitor',
      },
      {
        title: 'Dashboard & automation',
        description:
          'Pandangan yang jernih atas bisnis Anda, dengan pekerjaan berulang yang berjalan otomatis.',
        icon: 'chart',
      },
      {
        title: 'Mobile experience',
        description:
          'Pengalaman mobile yang cepat dan intuitif untuk pengguna yang selalu bergerak.',
        icon: 'smartphone',
      },
    ],
  }

  const projects = portfolios.length > 0 ? portfolios : fallbackProjects

  return (
    <div className="overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main-content">
        <section className="relative border-b border-emerald-950/10 pb-16 pt-28 sm:pt-36 lg:pb-24 lg:pt-36">
          <div className="hero-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="absolute -right-48 top-16 h-[34rem] w-[34rem] rounded-full bg-emerald-200/45 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -left-48 bottom-0 h-96 w-96 rounded-full bg-lime-100/60 blur-3xl"
            aria-hidden="true"
          />

          <div className="container-wide relative">
            <div className="grid items-start gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-12">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-emerald-900 shadow-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Menerima project untuk Q3 2026
                </div>

                <h1 className="max-w-4xl text-balance text-[clamp(3.2rem,6vw,6rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-slate-950">
                  {heroContent.headline}
                </h1>
                <p className="mt-8 max-w-xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {heroContent.subheadline}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/contact">
                    <Button
                      size="xl"
                      className="w-full rounded-xl bg-emerald-950 shadow-[0_12px_30px_-12px_rgba(6,78,59,0.7)] hover:bg-emerald-900 sm:w-auto"
                    >
                      {heroContent.ctaPrimary}
                      <ArrowRight className="ml-2 h-4 w-4" weight="bold" />
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button variant="ghost" size="lg" className="w-full text-slate-700 sm:w-auto">
                      {heroContent.ctaSecondary}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">
                  {['Strategi yang jelas', 'Desain yang khas', 'Build yang solid'].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" weight="fill" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[640px]">
                {heroContent.heroImageUrl && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-[0_28px_60px_-30px_rgba(2,44,34,0.55)] ring-1 ring-emerald-950/10">
                    <Image
                      src={heroContent.heroImageUrl}
                      alt="Visual utama Jhiro Digital Lab"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      className="object-cover object-center"
                    />
                  </div>
                )}
                <div
                  className={
                    heroContent.heroImageUrl
                      ? 'hidden'
                      : 'relative rounded-2xl bg-emerald-950 p-3 shadow-[0_28px_60px_-30px_rgba(2,44,34,0.55)] sm:p-4'
                  }
                >
                   <div className="overflow-hidden rounded-[1.35rem] bg-emerald-50/60">
                    <div className="flex h-12 items-center justify-between border-b border-emerald-950/10 px-4">
                      <div className="flex items-center gap-1.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-950/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-950/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-950/15" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-950/40">
                        Project cockpit
                      </span>
                    </div>

                    <div className="grid min-h-[500px] grid-cols-[4rem_1fr] sm:grid-cols-[5rem_1fr]">
                      <div className="border-r border-emerald-950/10 p-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-950 text-xs font-semibold text-white">
                          J
                        </div>
                        <div className="mt-8 space-y-3">
                          {[true, false, false, false].map((active, index) => (
                            <div
                              key={index}
                              className={`h-9 rounded-xl ${active ? 'bg-emerald-100' : 'bg-emerald-950/[0.035]'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs text-slate-500">Selamat datang</p>
                            <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                              Ikhtisar proyek
                            </p>
                          </div>
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm">
                            <CirclesFour className="h-4 w-4 text-emerald-800" weight="bold" />
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(6,78,59,0.45)]">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                              Progress
                            </p>
                            <p className="mt-3 text-3xl font-semibold tabular-nums tracking-[-0.04em] text-slate-900">
                              76%
                            </p>
                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                              <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                            </div>
                          </div>
                          <div className="rounded-2xl bg-emerald-500 p-4 text-emerald-950 shadow-[0_14px_30px_-20px_rgba(16,185,129,0.8)]">
                            <p className="text-[10px] uppercase tracking-[0.14em] opacity-65">
                              Sprint
                            </p>
                            <p className="mt-3 text-3xl font-semibold tabular-nums tracking-[-0.04em]">
                              04
                            </p>
                            <p className="mt-4 text-xs font-medium">Tersisa 8 hari</p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-2xl bg-white p-4 shadow-[0_12px_30px_-24px_rgba(6,78,59,0.45)] sm:p-5">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">
                              Aktivitas project
                            </p>
                            <span className="text-[10px] font-medium text-emerald-700">7 hari</span>
                          </div>
                          <div className="mt-5 flex h-28 items-end gap-2">
                            {[35, 52, 42, 76, 58, 88, 68, 94, 78, 100].map((height, index) => (
                              <div
                                key={index}
                                className="flex-1 rounded-t-md bg-emerald-100"
                                style={{ height: `${height}%` }}
                              >
                                <div
                                  className="h-full w-full origin-bottom rounded-t-md bg-emerald-500/80"
                                  style={{ transform: `scaleY(${0.45 + index * 0.05})` }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-950/10 p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100">
                              <Sparkle className="h-4 w-4 text-amber-700" weight="fill" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Design review</p>
                              <p className="text-[10px] text-slate-400">Hari ini, 14.30</p>
                            </div>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    heroContent.heroImageUrl
                      ? 'hidden'
                      : 'absolute -bottom-7 -left-5 w-48 rounded-2xl border border-white bg-white/90 p-4 shadow-[0_18px_45px_-18px_rgba(6,78,59,0.35)] backdrop-blur sm:block'
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100">
                      <Code className="h-5 w-5 text-emerald-700" weight="bold" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Build shipped</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">Production ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-emerald-950/10 bg-emerald-950/10 sm:grid-cols-4 lg:mt-20">
              {[
                [String(statsContent.stat1Value || dbStats.projects), statsContent.stat1Label || 'produk diluncurkan'],
                [String(statsContent.stat2Value || dbStats.clients), statsContent.stat2Label || 'partner bisnis'],
                [statsContent.stat3Value || '5 th', statsContent.stat3Label || 'pengalaman kolektif'],
                [statsContent.stat4Value || '4.9/5', statsContent.stat4Label || 'kepuasan partner'],
              ].map(([value, label]) => (
                <div key={label} className="bg-white/75 px-5 py-6 backdrop-blur sm:px-7">
                  <p className="text-2xl font-semibold tabular-nums tracking-[-0.04em] text-emerald-950 sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tentang" className="bg-white py-20 sm:py-28 lg:py-32">
          <div className="container-wide">
            {/* Title centered */}
            <h2 className="mx-auto max-w-2xl text-center text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">{aboutContent.title}</h2>

            {/* Description centered */}
            <div className="mx-auto mt-8 max-w-2xl text-center text-pretty text-base leading-8 text-slate-600">
              {aboutParagraphs.slice(0, 2).map((paragraph) => <p key={paragraph} className="mt-4 first:mt-0">{paragraph}</p>)}
            </div>

            {/* Image + Cara kami bekerja */}
            <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-950/10 bg-emerald-50/30">
                {aboutContent.imageUrl ? (
                  <Image src={aboutContent.imageUrl} alt="Logo atau visual Jhiro Digital Lab" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain p-10 sm:p-14" />
                ) : projects[0]?.screenshots?.[0] ? (
                  <Image src={projects[0].screenshots[0]} alt={`Tampilan project ${projects[0].name}`} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain p-4 sm:p-8" />
                ) : (
                  <div className="flex h-full min-h-[28rem] flex-col justify-between bg-emerald-950 p-8 text-white sm:p-12">
                    <Sparkle className="h-9 w-9 text-emerald-300" weight="duotone" />
                    <p className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Strategi yang jernih. Desain yang beralasan. Produk yang siap dipakai.</p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-3 text-sm shadow-sm sm:bottom-6 sm:left-6"><p className="font-semibold text-emerald-950">{aboutContent.imageUrl ? 'Jhiro Digital Lab' : projects[0]?.name || 'Produk digital yang siap bertumbuh'}</p><p className="mt-1 text-xs text-slate-500">{aboutContent.imageUrl ? 'Identitas studio digital' : 'Dari strategi sampai peluncuran'}</p></div>
              </div>

              <div className="flex flex-col rounded-2xl bg-emerald-950 p-7 text-white sm:p-10">
                <div className="flex items-center justify-between border-b border-white/15 pb-6"><h3 className="text-2xl font-semibold tracking-[-0.03em]">Cara kami bekerja</h3><CirclesFour className="h-7 w-7 text-emerald-300" weight="duotone" /></div>
                <ol className="mt-2 flex-1 divide-y divide-white/12">
                  {[
                    ['Eksplorasi & strategi', 'Menyamakan tujuan bisnis dan kebutuhan pengguna.'],
                    ['Desain pengalaman', 'Menguji alur sebelum development dimulai.'],
                    ['Build & validasi', 'Mengirim progres dalam sprint yang transparan.'],
                    ['Peluncuran & dukungan', 'Memantau hasil dan menyiapkan iterasi.'],
                  ].map(([title, desc], index) => (
                    <li key={title} className="grid grid-cols-[2rem_1fr] gap-4 py-4"><span className="text-sm font-semibold text-emerald-300">0{index + 1}</span><div><h4 className="font-semibold">{title}</h4><p className="mt-1 text-sm leading-6 text-emerald-100/70">{desc}</p></div></li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
               {['Satu tim lintas disiplin', 'Komunikasi langsung', 'Keputusan berbasis alasan'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-emerald-50/50 px-5 py-4 text-sm font-semibold text-emerald-950"><CheckCircle className="h-5 w-5 text-emerald-600" weight="fill" />{item}</div>)}
            </div>
          </div>
        </section>

         <section className="border-y border-emerald-950/10 bg-emerald-50/50 py-20 sm:py-28">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl">{servicesContent.title}</h2>
              <div className="lg:justify-self-end"><p className="max-w-lg text-pretty text-base leading-7 text-slate-600">Kami menyusun tim sesuai masalah yang perlu diselesaikan, lalu bekerja dalam ritme pendek yang transparan.</p><Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">Lihat seluruh kapabilitas<ArrowRight className="h-4 w-4" weight="bold" /></Link></div>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-12">
              {servicesContent.items?.slice(0, 5).map((service, index) => {
                const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] || GlobeHemisphereWest
                const span = index === 0 ? 'lg:col-span-7 bg-emerald-950 text-white' : index === 1 ? 'lg:col-span-5 bg-white' : 'lg:col-span-4 bg-white'
                return <Link key={`${service.title}-${index}`} href="/services" className={`group flex min-h-64 flex-col justify-between rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${span}`}>
                  <div className="flex items-start justify-between"><Icon className={`h-7 w-7 ${index === 0 ? 'text-emerald-300' : 'text-emerald-700'}`} weight="duotone" /><ArrowUpRight className={`h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${index === 0 ? 'text-emerald-200' : 'text-slate-400'}`} weight="bold" /></div>
                  <div><h3 className={`text-2xl font-semibold tracking-[-0.03em] ${index === 0 ? 'text-white sm:text-3xl' : 'text-slate-950'}`}>{service.title}</h3><p className={`mt-3 max-w-md text-sm leading-6 ${index === 0 ? 'text-emerald-100/75' : 'text-slate-600'}`}>{service.description}</p></div>
                </Link>
              })}
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 lg:py-40">
          <div className="container-wide">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Selected work</p>
                <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                  Karya yang memberi bisnis momentum baru.
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
              >
                Lihat semua karya
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  weight="bold"
                />
              </Link>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {projects.slice(0, 3).map((project, index) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  href={`/portfolio/${project.slug}`}
                  featured={index === 0}
                  className={index === 0 ? 'md:col-span-2' : ''}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-20 text-white sm:px-12 sm:py-24 lg:px-20">
            <div className="cta-grid absolute inset-0 opacity-25" aria-hidden="true" />
            <div
              className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Punya ide untuk dibangun?
                </p>
                <h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  Mari buat sesuatu yang layak dibicarakan.
                </h2>
              </div>
              <div className="lg:justify-self-end">
                <p className="mb-6 max-w-sm text-sm leading-6 text-emerald-100/65">
                  Ceritakan tujuan, tantangan, dan garis besar ide Anda. Kami akan membantu
                  menemukan langkah paling masuk akal.
                </p>
                <Link href="/contact">
                  <Button
                    size="xl"
                    className="w-full rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300 sm:w-auto"
                  >
                    Mulai percakapan
                    <ArrowUpRight className="ml-2 h-4 w-4" weight="bold" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}



