import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { PortfolioCard } from '@/components/public/portfolio-card'
import { HeroIllustration } from '@/components/public/illustrations/hero-illustration'
import { ProcessSteps } from '@/components/public/illustrations/process-steps'
import { ServiceCard } from '@/components/public/illustrations/service-icons'
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


const fallbackProjects = [
  {
    id: 'velora',
    slug: 'velora',
    name: 'Velora Commerce',
    description: 'Commerce experience yang menyatukan katalog, pesanan, dan pertumbuhan.',
    technologies: ['Product design', 'Next.js', 'Commerce'],
    screenshots: ['/images/portfolio/velora-commerce.png'],
  },
  {
    id: 'nadi',
    slug: 'nadi',
    name: 'Nadi Operations',
    description: 'Satu ruang kerja untuk melihat operasional tanpa kehilangan konteks.',
    technologies: ['Dashboard', 'Automation', 'Analytics'],
    screenshots: ['/images/portfolio/nadi-operations.png'],
  },
  {
    id: 'sora',
    slug: 'sora',
    name: 'Sora Living',
    description: 'Identitas digital yang mengubah pencarian properti menjadi pengalaman.',
    technologies: ['Brand system', 'Web design', 'CMS'],
    screenshots: ['/images/portfolio/sora-living.png'],
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
        {/* Hero Section */}
        <section className="relative overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24 lg:pt-36">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 gradient-mesh animate-gradient" aria-hidden="true" />
          <div className="hero-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div
            className="absolute -right-48 top-16 h-[34rem] w-[34rem] rounded-full bg-emerald-200/45 blur-3xl animate-pulse-glow"
            aria-hidden="true"
          />
          <div
            className="absolute -left-48 bottom-0 h-96 w-96 rounded-full bg-lime-100/60 blur-3xl animate-pulse-glow"
            aria-hidden="true"
            style={{ animationDelay: "1.5s" }}
          />

          <div className="container-wide relative">
            <div className="grid items-start gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-12">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-emerald-900 shadow-sm backdrop-blur animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Menerima project untuk Q3 2026
                </div>

                <h1 className="max-w-4xl text-balance text-[clamp(3.2rem,6vw,6rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-slate-950 animate-fade-in" style={{ animationDelay: "150ms" }}>
                  {heroContent.headline}
                </h1>
                <p className="mt-8 max-w-xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  {heroContent.subheadline}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-in" style={{ animationDelay: "450ms" }}>
                  <Link href="/contact">
                    <Button
                      size="xl"
                      className="w-full rounded-xl bg-emerald-950 shadow-[0_12px_30px_-12px_rgba(6,78,59,0.7)] hover:bg-emerald-900 hover:shadow-[0_16px_40px_-12px_rgba(6,78,59,0.8)] transition-all duration-300 sm:w-auto"
                    >
                      {heroContent.ctaPrimary}
                      <ArrowRight className="ml-2 h-4 w-4" weight="bold" />
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button variant="ghost" size="lg" className="w-full text-slate-700 hover:text-emerald-700 sm:w-auto">
                      {heroContent.ctaSecondary}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: "600ms" }}>
                  {['Strategi yang jelas', 'Desain yang khas', 'Build yang solid'].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" weight="fill" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[640px] animate-fade-in" style={{ animationDelay: "300ms" }}>
                {heroContent.heroImageUrl ? (
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
                ) : (
                  <HeroIllustration />
                )}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-emerald-950/10 bg-emerald-950/10 sm:grid-cols-4 lg:mt-20 animate-fade-in" style={{ animationDelay: "750ms" }}>
              {[
                [String(statsContent.stat1Value || dbStats.projects), statsContent.stat1Label || 'produk diluncurkan'],
                [String(statsContent.stat2Value || dbStats.clients), statsContent.stat2Label || 'partner bisnis'],
                [statsContent.stat3Value || '5 th', statsContent.stat3Label || 'pengalaman kolektif'],
                [statsContent.stat4Value || '4.9/5', statsContent.stat4Label || 'kepuasan partner'],
              ].map(([value, label]) => (
                <div key={label} className="bg-white/75 px-5 py-6 backdrop-blur transition-colors hover:bg-white/90 sm:px-7">
                  <p className="text-2xl font-semibold tabular-nums tracking-[-0.04em] text-emerald-950 sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="tentang" className="bg-white py-20 sm:py-28 lg:py-32">
          <div className="container-wide">
            <h2 className="mx-auto max-w-2xl text-center text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {aboutContent.title}
            </h2>

            <div className="mx-auto mt-8 max-w-2xl text-center text-pretty text-base leading-8 text-slate-600">
              {aboutParagraphs.slice(0, 2).map((paragraph) => (
                <p key={paragraph} className="mt-4 first:mt-0">{paragraph}</p>
              ))}
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-950/10 bg-emerald-50/30">
                {aboutContent.imageUrl ? (
                  <Image src={aboutContent.imageUrl} alt="Logo atau visual Jhiro Digital Lab" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain p-10 sm:p-14" />
                ) : projects[0]?.screenshots?.[0] ? (
                  <Image src={projects[0].screenshots[0]} alt={`Tampilan project ${projects[0].name}`} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
                ) : (
                  <div className="flex h-full min-h-[28rem] flex-col justify-between bg-emerald-950 p-8 text-white sm:p-12">
                    <svg className="h-9 w-9 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <p className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                      Strategi yang jernih. Desain yang beralasan. Produk yang siap dipakai.
                    </p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-3 text-sm shadow-sm sm:bottom-6 sm:left-6">
                  <p className="font-semibold text-emerald-950">{aboutContent.imageUrl ? 'Jhiro Digital Lab' : projects[0]?.name || 'Produk digital yang siap bertumbuh'}</p>
                  <p className="mt-1 text-xs text-slate-500">{aboutContent.imageUrl ? 'Identitas studio digital' : 'Dari strategi sampai peluncuran'}</p>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl bg-emerald-950 p-7 text-white sm:p-10">
                <div className="flex items-center justify-between border-b border-white/15 pb-6">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">Cara kami bekerja</h3>
                  <svg className="h-7 w-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <ProcessSteps />
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {['Satu tim lintas disiplin', 'Komunikasi langsung', 'Keputusan berbasis alasan'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-emerald-50/50 px-5 py-4 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-50">
                  <CheckCircle className="h-5 w-5 text-emerald-600" weight="fill" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="border-y border-emerald-950/10 bg-emerald-50/50 py-20 sm:py-28">
          <div className="container-wide">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {servicesContent.title}
              </h2>
              <div className="lg:justify-self-end">
                <p className="max-w-lg text-pretty text-base leading-7 text-slate-600">
                  Kami menyusun tim sesuai masalah yang perlu diselesaikan, lalu bekerja dalam ritme pendek yang transparan.
                </p>
                <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors">
                  Lihat seluruh kapabilitas
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </Link>
              </div>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-12">
              {/* Featured card: 7 cols */}
              {servicesContent.items?.slice(0, 1).map((service, index) => (
                <Link
                  key={`${service.title}-${index}`}
                  href="/services"
                  className="lg:col-span-7"
                >
                  <ServiceCard
                    type={service.icon as "globe" | "monitor" | "chart" | "smartphone"}
                    title={service.title}
                    description={service.description}
                    index={index}
                    isFeatured
                  />
                </Link>
              ))}
              {/* Second card: 5 cols */}
              {servicesContent.items?.slice(1, 2).map((service, index) => (
                <Link
                  key={`${service.title}-${index + 1}`}
                  href="/services"
                  className="lg:col-span-5"
                >
                  <ServiceCard
                    type={service.icon as "globe" | "monitor" | "chart" | "smartphone"}
                    title={service.title}
                    description={service.description}
                    index={index + 1}
                  />
                </Link>
              ))}
              {/* Remaining cards: 4 cols each */}
              {servicesContent.items?.slice(2, 4).map((service, index) => (
                <Link
                  key={`${service.title}-${index + 2}`}
                  href="/services"
                  className="lg:col-span-6"
                >
                  <ServiceCard
                    type={service.icon as "globe" | "monitor" | "chart" | "smartphone"}
                    title={service.title}
                    description={service.description}
                    index={index + 2}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
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
                className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-600 transition-colors"
              >
                Lihat semua karya
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" weight="bold" />
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

        {/* Testimonials Section */}
        <section className="border-y border-emerald-950/10 bg-emerald-50/30 py-20 sm:py-28">
          <div className="container-wide">
            <div className="text-center">
              <p className="section-label">Testimoni partner</p>
              <h2 className="mt-6 mx-auto max-w-2xl text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Dipercaya oleh bisnis yang ingin bertumbuh.
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: 'Jhiro membantu kami membangun dashboard yang benar-benar dipakai tim setiap hari. Prosesnya transparan dan hasilnya melebihi ekspektasi.',
                  name: 'Andi Pratama',
                  role: 'CTO, Velora Commerce',
                  avatar: 'A',
                },
                {
                  quote: 'Dari strategi sampai launch, tim Jhiro bekerja seperti extension dari tim kami sendiri. Komunikasi excellent, delivery on time.',
                  name: 'Sari Dewi',
                  role: 'Head of Product, Nadi Corp',
                  avatar: 'S',
                },
                {
                  quote: 'Website baru kami konversi 3x lipat dari sebelumnya. Desainnya clean, performanya cepat, dan SEO-nya jalan.',
                  name: 'Budi Santoso',
                  role: 'Founder, Sora Living',
                  avatar: 'B',
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl bg-white p-7 shadow-[0_8px_30px_-20px_rgba(6,78,59,0.12)] transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(6,78,59,0.2)] sm:p-8"
                >
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-600">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-emerald-950/5 pt-5">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-20 text-white sm:px-12 sm:py-24 lg:px-20">
            <div className="cta-grid absolute inset-0 opacity-25" aria-hidden="true" />
            <div
              className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-400/30 blur-3xl animate-pulse-glow"
              aria-hidden="true"
            />
            <div
              className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl animate-pulse-glow"
              aria-hidden="true"
              style={{ animationDelay: "1.5s" }}
            />
            {/* Floating shapes */}
            <div className="absolute right-20 top-20 h-4 w-4 rotate-45 border border-emerald-400/30 animate-float" aria-hidden="true" />
            <div className="absolute bottom-32 left-24 h-6 w-6 rounded-full border border-emerald-400/20 animate-float" aria-hidden="true" style={{ animationDelay: "2s" }} />
            <div className="absolute right-1/3 bottom-16 h-3 w-3 rotate-12 bg-emerald-400/20 animate-float" aria-hidden="true" style={{ animationDelay: "1s" }} />

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
                    className="w-full rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300 hover:shadow-[0_16px_40px_-12px_rgba(52,211,153,0.5)] transition-all duration-300 sm:w-auto"
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



