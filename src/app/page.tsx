import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { getCMSSections } from '@/lib/cms-content'
import { getPublicPortfolios } from '@/lib/public-content'

export const revalidate = 300

interface HeroContent {
  headline: string
  subheadline: string
  ctaPrimary: string
  heroImageUrl?: string
}

interface AboutContent {
  title: string
  description: string
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
    getCMSSections(['hero', 'about', 'services']),
    getPublicPortfolios(),
  ])
  return {
    hero: sections.hero ? { content: sections.hero } : null,
    about: sections.about ? { content: sections.about } : null,
    services: sections.services ? { content: sections.services } : null,
    portfolios: portfolios.slice(0, 4),
  }
}

const fallbackProjects = [
  {
    id: 'nexa',
    slug: 'nexa',
    name: 'Project Nexa',
    category: 'Fintech Platform',
    description: 'Platform fintech modern untuk layanan keuangan digital.',
    technologies: ['UGUS', 'Web App'],
    screenshots: ['/images/portfolio/velora-commerce.png'],
  },
  {
    id: 'quantum',
    slug: 'quantum',
    name: 'Quantum CRM',
    category: 'Enterprise Solution',
    description: 'Sistem CRM enterprise untuk manajemen hubungan pelanggan.',
    technologies: ['UGUS', 'Web App', 'Development'],
    screenshots: ['/images/portfolio/nadi-operations.png'],
  },
  {
    id: 'stellar',
    slug: 'stellar',
    name: 'Stellar E-commerce',
    category: 'Stellar E-commerce',
    description: 'Platform e-commerce dengan pengalaman belanja yang mulus.',
    technologies: ['UGUS', 'Web App', 'Development'],
    screenshots: ['/images/portfolio/sora-living.png'],
  },
  {
    id: 'aris',
    slug: 'aris',
    name: 'Aris Health App',
    category: 'Aris Health App',
    description: 'Aplikasi kesehatan untuk monitoring dan konsultasi medis.',
    technologies: ['UGUS', 'Web App', 'Development'],
    screenshots: ['/images/portfolio/arca-studio.png'],
  },
]

const processSteps = [
  {
    number: 1,
    title: 'Strategi & Penemuan',
    description: 'Desain responsif dan modern untuk brand Anda.',
  },
  {
    number: 2,
    title: 'Desain UI/UX',
    description: 'Aplikasi web kustom untuk fungsionalitas kompleks.',
  },
  {
    number: 3,
    title: 'Pengembangan Full-stack',
    description: 'Pengembangan full-stack animasi dan pengembangkan.',
  },
  {
    number: 4,
    title: 'Pengujian & Peluncuran',
    description: 'Pengujian untuk pencurnan dan integrasi dan pengujian & peluncuran.',
  },
]

export default async function HomePage() {
  const [{ hero, about, services, portfolios }] = await Promise.all([
    getCMSContent(),
  ])

  const heroContent = (hero?.content as unknown as HeroContent) || {
    headline: 'Produk digital yang membuat bisnis bergerak lebih jauh',
    subheadline:
      'Kembangkan produk digital kustom yang memukau dan fungsional bersama Jhiro Digital Lab.',
    ctaPrimary: 'Mulai Proyek Anda',
  }

  const aboutContent = (about?.content as unknown as AboutContent) || {
    title: 'Partner digital, bukan sekadar vendor.',
    description:
      'Kembangkan produk digital kustom yang memukau dan fungsional bersama Jhiro Digital Lab.',
  }

  const servicesContent = (services?.content as unknown as ServicesContent) || {
    title: 'Services',
    items: [
      {
        title: 'Website',
        description: 'Desain responsif dan modern untuk brand Anda.',
        icon: 'globe',
      },
      {
        title: 'Web App',
        description: 'Aplikasi web kustom untuk fungsionalitas kompleks.',
        icon: 'monitor',
      },
      {
        title: 'Dashboard',
        description: 'Visualisasi data dan panel admin yang intuitif.',
        icon: 'chart',
      },
      {
        title: 'Mobile App',
        description: 'Aplikasi iOS & Android asli atau cross-platform.',
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
        <section className="relative bg-emerald-950 pb-16 pt-28 sm:pt-36 lg:pb-24 lg:pt-36">
          <div className="container-wide relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <h1 className="max-w-4xl text-balance text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-white animate-fade-in">
                  {heroContent.headline}
                </h1>
                <p className="mt-8 max-w-xl text-pretty text-base leading-7 text-emerald-100/70 sm:text-lg sm:leading-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
                  {heroContent.subheadline}
                </p>

                <div className="mt-9 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <Link href="/contact">
                    <Button
                      size="xl"
                      className="rounded-xl bg-emerald-500 text-white shadow-[0_12px_30px_-12px_rgba(16,185,129,0.7)] hover:bg-emerald-400 hover:shadow-[0_16px_40px_-12px_rgba(16,185,129,0.8)] transition-all duration-300"
                    >
                      {heroContent.ctaPrimary}
                      <ArrowRight className="ml-2 h-4 w-4" weight="bold" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[640px] animate-fade-in" style={{ animationDelay: "200ms" }}>
                {heroContent.heroImageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Image
                      src={heroContent.heroImageUrl}
                      alt="Dashboard Jhiro Digital Lab"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full p-6">
                        <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-400/60" />
                            <div className="h-3 w-3 rounded-full bg-emerald-400/40" />
                            <div className="h-3 w-3 rounded-full bg-emerald-400/20" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-3/4 rounded bg-white/10" />
                            <div className="h-2 w-1/2 rounded bg-white/10" />
                            <div className="h-2 w-2/3 rounded bg-white/10" />
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="h-16 rounded-lg bg-emerald-400/20" />
                            <div className="h-16 rounded-lg bg-emerald-400/15" />
                            <div className="h-16 rounded-lg bg-emerald-400/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="tentang" className="bg-white py-20 sm:py-28 lg:py-32">
          <div className="container-wide">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Tentang
            </p>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {aboutContent.title}
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-600">
              {aboutContent.description}
            </p>

            {/* Process Worksteps */}
            <div className="mt-14">
              <p className="text-sm font-semibold text-slate-900">Process workjs step</p>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Kembangkan produk digital kustom yang memukau dan fungsional bersama Jhiro Digital Lab.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((step) => (
                  <div key={step.number} className="flex flex-col">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-200 text-emerald-700">
                      <span className="text-sm font-bold">{step.number}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {step.number}) {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="border-y border-emerald-950/10 bg-emerald-50/50 py-20 sm:py-28">
          <div className="container-wide">
            <div className="flex items-end justify-between">
              <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {servicesContent.title}
              </h2>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-slate-600 transition-colors hover:bg-emerald-50">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-slate-600 transition-colors hover:bg-emerald-50">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-12 flex gap-4 overflow-x-auto hide-scrollbar scroll-snap-x pb-4">
              {servicesContent.items?.map((service, index) => (
                <div
                  key={`${service.title}-${index}`}
                  className="min-w-[240px] flex-1 rounded-2xl border border-emerald-950/10 bg-white p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                    <ServiceIcon type={service.icon as "globe" | "monitor" | "chart" | "smartphone"} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-24 sm:py-32 lg:py-40">
          <div className="container-wide">
            <div className="flex items-end justify-between">
              <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl">
                Portfolio Showcase
              </h2>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-slate-600 transition-colors hover:bg-emerald-50">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-slate-600 transition-colors hover:bg-emerald-50">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-12 flex gap-6 overflow-x-auto hide-scrollbar scroll-snap-x pb-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group min-w-[280px] flex-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                    {project.screenshots?.[0] ? (
                      <Image
                        src={project.screenshots[0]}
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                        <span className="text-4xl font-bold text-emerald-200">{project.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.category || project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-20 text-center text-white sm:px-12 sm:py-24">
            <h2 className="mx-auto max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl">
              Mari buat sesuatu yang layak dibicarakan.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-emerald-100/70 sm:text-base sm:leading-7">
              Diskusikan ide Anda dan biarkan tim ahli kami mewujudkannya.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button
                  size="xl"
                  className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-[0_16px_40px_-12px_rgba(16,185,129,0.5)] transition-all duration-300"
                >
                  Hubungi Kami Sekarang
                  <ArrowUpRight className="ml-2 h-4 w-4" weight="bold" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function ServiceIcon({ type }: { type: "globe" | "monitor" | "chart" | "smartphone" }) {
  const iconClass = "h-6 w-6 text-emerald-600"
  
  switch (type) {
    case "globe":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    case "monitor":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.41A2.25 2.25 0 012.25 5.495V5.25" />
        </svg>
      )
    case "chart":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    case "smartphone":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      )
  }
}
