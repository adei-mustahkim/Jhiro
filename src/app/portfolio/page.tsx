import { getPublicPortfolios } from '@/lib/public-content'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { PageHero } from '@/components/public/page-hero'
import { PortfolioCard } from '@/components/public/portfolio-card'

export const revalidate = 300
const fallback = [
  {
    id: 'velora',
    slug: 'velora',
    name: 'Velora Commerce',
    description: 'Commerce experience untuk brand lifestyle yang sedang bertumbuh.',
    technologies: ['Product design', 'Next.js', 'Commerce'],
    screenshots: [],
  },
  {
    id: 'nadi',
    slug: 'nadi',
    name: 'Nadi Operations',
    description: 'Satu ruang kerja untuk membaca operasional tanpa kehilangan konteks.',
    technologies: ['Dashboard', 'Automation', 'Analytics'],
    screenshots: [],
  },
  {
    id: 'sora',
    slug: 'sora',
    name: 'Sora Living',
    description: 'Pengalaman pencarian properti yang terasa sederhana dan personal.',
    technologies: ['Brand system', 'Web design', 'CMS'],
    screenshots: [],
  },
]

export default async function PortfolioPage() {
  const data = await getPublicPortfolios()
  const projects = data.length ? data : fallback
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="portfolio" />
      <main id="main-content">
        <PageHero
          eyebrow="Selected work"
          title="Karya yang memberi bisnis momentum baru."
          description="Pilihan produk dan pengalaman digital yang kami rancang bersama partner dari beragam industri."
        />
        <section className="py-20 sm:py-28">
          <div className="container-wide grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <PortfolioCard
                key={project.id}
                project={project}
                href={data.length ? `/portfolio/${project.slug}` : '/contact'}
                featured={index === 0}
                className={index === 0 ? 'md:col-span-2' : ''}
              />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
