import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating portfolio data...')

  // Portfolio 1 - Velora Commerce
  await prisma.portfolio.upsert({
    where: { slug: 'velora-commerce' },
    update: {
      name: 'Velora Commerce',
      description: 'Dashboard analytics e-commerce real-time untuk Velora Commerce, membantu tim memantau performa bisnis secara harian dengan visualisasi data yang intuitif.',
      technologies: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
      screenshots: ['/images/portfolio/velora-commerce.png'],
      projectUrl: 'https://velora-commerce.id',
      isFeatured: true,
    },
    create: {
      name: 'Velora Commerce',
      slug: 'velora-commerce',
      description: 'Dashboard analytics e-commerce real-time untuk Velora Commerce, membantu tim memantau performa bisnis secara harian dengan visualisasi data yang intuitif.',
      technologies: ['Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
      screenshots: ['/images/portfolio/velora-commerce.png'],
      projectUrl: 'https://velora-commerce.id',
      isFeatured: true,
    },
  })
  console.log('Upserted Velora Commerce')

  // Portfolio 2 - Nadi Corp
  await prisma.portfolio.upsert({
    where: { slug: 'nadi-corp' },
    update: {
      name: 'Nadi Corp',
      description: 'Sistem operasi internal untuk Nadi Corp dengan fitur workflow automation, task management, dan reporting dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      screenshots: ['/images/portfolio/nadi-operations.png'],
      isFeatured: true,
    },
    create: {
      name: 'Nadi Corp',
      slug: 'nadi-corp',
      description: 'Sistem operasi internal untuk Nadi Corp dengan fitur workflow automation, task management, dan reporting dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      screenshots: ['/images/portfolio/nadi-operations.png'],
      isFeatured: true,
    },
  })
  console.log('Upserted Nadi Corp')

  // Portfolio 3 - Sora Living
  await prisma.portfolio.upsert({
    where: { slug: 'sora-living' },
    update: {
      name: 'Sora Living',
      description: 'Website digital presence Sora Living dengan desain minimalis yang mencerminkan brand sustainability mereka, dilengkapi blog dan e-commerce section.',
      technologies: ['Next.js', 'Framer Motion', 'Sanity CMS', 'Vercel'],
      screenshots: ['/images/portfolio/sora-living.png'],
      projectUrl: 'https://sora-living.id',
      isFeatured: false,
    },
    create: {
      name: 'Sora Living',
      slug: 'sora-living',
      description: 'Website digital presence Sora Living dengan desain minimalis yang mencerminkan brand sustainability mereka, dilengkapi blog dan e-commerce section.',
      technologies: ['Next.js', 'Framer Motion', 'Sanity CMS', 'Vercel'],
      screenshots: ['/images/portfolio/sora-living.png'],
      projectUrl: 'https://sora-living.id',
      isFeatured: false,
    },
  })
  console.log('Upserted Sora Living')

  // Portfolio 4 - Arca Studio
  await prisma.portfolio.upsert({
    where: { slug: 'arca-studio' },
    update: {
      name: 'Arca Studio',
      description: 'Studio portofolio Arca Studio dengan grid layout interaktif, animasi scroll-triggered, dan showcase proyek arsitektur 3D.',
      technologies: ['Next.js', 'Three.js', 'GSAP', 'Supabase'],
      screenshots: ['/images/portfolio/arca-studio.png'],
      isFeatured: false,
    },
    create: {
      name: 'Arca Studio',
      slug: 'arca-studio',
      description: 'Studio portofolio Arca Studio dengan grid layout interaktif, animasi scroll-triggered, dan showcase proyek arsitektur 3D.',
      technologies: ['Next.js', 'Three.js', 'GSAP', 'Supabase'],
      screenshots: ['/images/portfolio/arca-studio.png'],
      isFeatured: false,
    },
  })
  console.log('Upserted Arca Studio')

  // Delete old portfolios that don't match
  const keepSlugs = ['velora-commerce', 'nadi-corp', 'sora-living', 'arca-studio']
  const deleted = await prisma.portfolio.deleteMany({
    where: { slug: { notIn: keepSlugs } },
  })
  console.log(`Deleted ${deleted.count} old portfolios`)

  // CMS Content - Hero
  await prisma.cMSContent.upsert({
    where: { section_locale: { section: 'hero', locale: 'ID' } },
    update: {
      content: {
        headline: 'Bangkitkan Bisnis Digital Anda',
        subheadline: 'Kami membantu bisnis membangun produk digital yang berdampak — dari strategi hingga eksekusi, dengan fokus pada hasil nyata.',
        ctaPrimary: 'Mulai Project',
        ctaSecondary: 'Lihat Portfolio',
      },
    },
    create: {
      section: 'hero',
      locale: 'ID',
      content: {
        headline: 'Bangkitkan Bisnis Digital Anda',
        subheadline: 'Kami membantu bisnis membangun produk digital yang berdampak — dari strategi hingga eksekusi, dengan fokus pada hasil nyata.',
        ctaPrimary: 'Mulai Project',
        ctaSecondary: 'Lihat Portfolio',
      },
    },
  })
  console.log('Upserted hero CMS')

  // CMS Content - Services
  await prisma.cMSContent.upsert({
    where: { section_locale: { section: 'services', locale: 'ID' } },
    update: {
      content: {
        title: 'Layanan Kami',
        items: [
          {
            title: 'Website & Digital Presence',
            description: 'Website modern yang dioptimalkan untuk konversi, dengan desain yang mencerminkan brand Anda dan performa yang cepat.',
            icon: 'globe',
          },
          {
            title: 'Web Application',
            description: 'Aplikasi web custom untuk otomasi workflow, dashboard analytics, atau sistem internal bisnis Anda.',
            icon: 'monitor',
          },
          {
            title: 'Mobile Experience',
            description: 'Aplikasi mobile lintas platform dengan performa native dan pengalaman pengguna yang mulus.',
            icon: 'smartphone',
          },
          {
            title: 'UI/UX Research & Strategy',
            description: 'Riset pengguna, wireframing, hingga prototyping — memastikan produk Anda dibangun dengan fondasi yang tepat.',
            icon: 'chart',
          },
        ],
      },
    },
    create: {
      section: 'services',
      locale: 'ID',
      content: {
        title: 'Layanan Kami',
        items: [
          {
            title: 'Website & Digital Presence',
            description: 'Website modern yang dioptimalkan untuk konversi, dengan desain yang mencerminkan brand Anda dan performa yang cepat.',
            icon: 'globe',
          },
          {
            title: 'Web Application',
            description: 'Aplikasi web custom untuk otomasi workflow, dashboard analytics, atau sistem internal bisnis Anda.',
            icon: 'monitor',
          },
          {
            title: 'Mobile Experience',
            description: 'Aplikasi mobile lintas platform dengan performa native dan pengalaman pengguna yang mulus.',
            icon: 'smartphone',
          },
          {
            title: 'UI/UX Research & Strategy',
            description: 'Riset pengguna, wireframing, hingga prototyping — memastikan produk Anda dibangun dengan fondasi yang tepat.',
            icon: 'chart',
          },
        ],
      },
    },
  })
  console.log('Upserted services CMS')

  // CMS Content - Stats
  await prisma.cMSContent.upsert({
    where: { section_locale: { section: 'stats', locale: 'ID' } },
    update: {
      content: {
        stat1Value: '50',
        stat1Label: 'produk diluncurkan',
        stat2Value: '30+',
        stat2Label: 'partner bisnis',
        stat3Value: '3+ th',
        stat3Label: 'pengalaman kolektif',
        stat4Value: '4.9/5',
        stat4Label: 'kepuasan partner',
      },
    },
    create: {
      section: 'stats',
      locale: 'ID',
      content: {
        stat1Value: '50',
        stat1Label: 'produk diluncurkan',
        stat2Value: '30+',
        stat2Label: 'partner bisnis',
        stat3Value: '3+ th',
        stat3Label: 'pengalaman kolektif',
        stat4Value: '4.9/5',
        stat4Label: 'kepuasan partner',
      },
    },
  })
  console.log('Upserted stats CMS')

  console.log('\nDone! Portfolio and CMS content updated.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
