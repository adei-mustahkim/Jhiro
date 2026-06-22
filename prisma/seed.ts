import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.changeRequest.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.requirementTracker.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.article.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.sEOMeta.deleteMany();
  await prisma.cMSContent.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash("admin123", 12);
  const superAdmin = await prisma.user.create({
    data: {
      name: "Tuan Muda Hakim",
      email: "admin@jhiro.id",
      passwordHash: superAdminPassword,
      role: "SUPER_ADMIN",
      image: null,
    },
  });
  console.log("Created Super Admin:", superAdmin.email);

  // Create Project Managers
  const pmPassword = await bcrypt.hash("pm123456", 12);
  const pm1 = await prisma.user.create({
    data: {
      name: "Ahmad Pratama",
      email: "ahmad@jhiro.id",
      passwordHash: pmPassword,
      role: "PROJECT_MANAGER",
      image: null,
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      name: "Sarah Wijaya",
      email: "sarah@jhiro.id",
      passwordHash: pmPassword,
      role: "PROJECT_MANAGER",
      image: null,
    },
  });
  console.log("Created Project Managers");

  // Create Clients
  const clientPassword = await bcrypt.hash("client123", 12);

  const clientUser1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@techvision.co.id",
      passwordHash: clientPassword,
      role: "CLIENT",
    },
  });
  const client1 = await prisma.client.create({
    data: {
      userId: clientUser1.id,
      companyName: "PT Tech Vision Indonesia",
      phone: "+62 812 3456 7890",
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      industry: "Technology",
    },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      name: "Diana Chen",
      email: "diana@greencircle.id",
      passwordHash: clientPassword,
      role: "CLIENT",
    },
  });
  const client2 = await prisma.client.create({
    data: {
      userId: clientUser2.id,
      companyName: "Green Circle Indonesia",
      phone: "+62 821 9876 5432",
      address: "Jl. Gatot Subroto No. 45, Bandung",
      industry: "Sustainability",
    },
  });

  const clientUser3 = await prisma.user.create({
    data: {
      name: "Rizky Ramadhan",
      email: "rizky@fashionhub.co.id",
      passwordHash: clientPassword,
      role: "CLIENT",
    },
  });
  const client3 = await prisma.client.create({
    data: {
      userId: clientUser3.id,
      companyName: "Fashion Hub Indonesia",
      phone: "+62 856 1234 5678",
      address: "Jl. Kemang No. 78, Jakarta Selatan",
      industry: "Fashion & Retail",
    },
  });
  console.log("Created Clients");

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Tech Vision Company Profile",
      description: "Website company profile dengan fitur modern dan SEO-optimized",
      clientId: client1.id,
      managerId: pm1.id,
      deadline: new Date("2026-08-15"),
      priority: "HIGH",
      status: "DEVELOPMENT",
      progress: 65,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Green Circle E-commerce Platform",
      description: "Platform e-commerce untuk produk ramah lingkungan",
      clientId: client2.id,
      managerId: pm2.id,
      deadline: new Date("2026-10-30"),
      priority: "URGENT",
      status: "REQUIREMENT_GATHERING",
      progress: 15,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Fashion Hub Mobile App",
      description: "Mobile application untuk shopping experience",
      clientId: client3.id,
      managerId: pm1.id,
      deadline: new Date("2026-06-30"),
      priority: "MEDIUM",
      status: "TESTING",
      progress: 90,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: "Tech Vision Dashboard",
      description: "Internal dashboard untuk monitoring bisnis",
      clientId: client1.id,
      managerId: pm1.id,
      deadline: new Date("2026-05-15"),
      priority: "LOW",
      status: "COMPLETED",
      progress: 100,
    },
  });

  const project5 = await prisma.project.create({
    data: {
      name: "Green Circle Landing Page",
      description: "Landing page untuk campaign sustainability",
      clientId: client2.id,
      managerId: pm2.id,
      deadline: new Date("2026-07-01"),
      priority: "MEDIUM",
      status: "REVISION",
      progress: 85,
    },
  });
  console.log("Created Projects");

  // Create Requirement Trackers
  await prisma.requirementTracker.create({
    data: {
      projectId: project1.id,
      businessGoals: "Meningkatkan brand awareness dan mendapatkan leads berkualitas",
      requestedFeatures: "- Company profile interaktif\n- Portfolio gallery\n- Contact form dengan CRM integration\n- Blog section\n- Multi-language support (ID/EN)",
      references: "https://referensi.com",
      status: "APPROVED",
    },
  });

  await prisma.requirementTracker.create({
    data: {
      projectId: project2.id,
      businessGoals: "Digitalisasi penjualan produk ramah lingkungan",
      requestedFeatures: "- Product catalog\n- Shopping cart\n- Payment gateway integration\n- Order management\n- Customer dashboard",
      status: "DRAFT",
    },
  });
  console.log("Created Requirement Trackers");

  // Create Change Requests
  await prisma.changeRequest.create({
    data: {
      projectId: project1.id,
      title: "Tambah Integrasi WhatsApp Button",
      description: "Butuh fitur WhatsApp floating button untuk customer service langsung",
      type: "new_feature",
      estimatedCost: 2500000,
      status: "APPROVED",
    },
  });
  console.log("Created Change Requests");

  // Create Chat Threads
  await prisma.chatThread.create({
    data: {
      projectId: project1.id,
      messages: {
        create: [
          {
            senderId: clientUser1.id,
            message: "Halo, saya ingin konsultasi tentang progress project",
            createdAt: new Date("2026-06-10T09:00:00Z"),
          },
          {
            senderId: pm1.id,
            message: "Halo Budi, progress saat ini sudah 65%. Design sudah approved dan sedang dalam development fase 2.",
            mentions: [clientUser1.id],
            createdAt: new Date("2026-06-10T09:15:00Z"),
          },
          {
            senderId: clientUser1.id,
            message: "Bagus, apakah bisa dijadwalkan meeting untuk review?",
            createdAt: new Date("2026-06-10T09:30:00Z"),
          },
        ],
      },
    },
  });
  console.log("Created Chat Threads");

  // Create Invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-001",
      clientId: client1.id,
      projectId: project1.id,
      amount: 25000000,
      dueDate: new Date("2026-07-15"),
      status: "UNPAID",
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-002",
      clientId: client1.id,
      projectId: project4.id,
      amount: 15000000,
      dueDate: new Date("2026-05-30"),
      status: "PAID",
      paidAt: new Date("2026-05-25"),
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-003",
      clientId: client2.id,
      projectId: project2.id,
      amount: 35000000,
      dueDate: new Date("2026-08-30"),
      status: "DRAFT",
    },
  });
  console.log("Created Invoices");

  // Create CMS Content
  await prisma.cMSContent.upsert({
    where: { section_locale: { section: "hero", locale: "ID" } },
    update: {
      content: {
        headline: "Bangkitkan Bisnis Digital Anda",
        subheadline: "Kami membantu bisnis membangun produk digital yang berdampak — dari strategi hingga eksekusi, dengan fokus pada hasil nyata.",
        ctaPrimary: "Mulai Project",
        ctaSecondary: "Lihat Portfolio",
        heroImageUrl: "/images/hero-dashboard.png",
      },
    },
    create: {
      section: "hero",
      locale: "ID",
      content: {
        headline: "Bangkitkan Bisnis Digital Anda",
        subheadline: "Kami membantu bisnis membangun produk digital yang berdampak — dari strategi hingga eksekusi, dengan fokus pada hasil nyata.",
        ctaPrimary: "Mulai Project",
        ctaSecondary: "Lihat Portfolio",
        heroImageUrl: "/images/hero-dashboard.png",
      },
    },
  });

  await prisma.cMSContent.create({
    data: {
      section: "hero",
      locale: "EN",
      content: {
        headline: "Elevate Your Digital Business",
        subheadline: "We create digital solutions that transform ideas into reality. Websites, applications, and systems that help your business grow.",
        ctaPrimary: "Start Project",
        ctaSecondary: "View Portfolio",
      },
    },
  });

  await prisma.cMSContent.create({
    data: {
      section: "about",
      locale: "ID",
      content: {
        title: "Tentang Jhiro Digital Lab",
        description: "Jhiro Digital Lab adalah studio produk digital yang membantu bisnis membangun kehadiran online yang kuat. Dengan pengalaman lebih dari 5 tahun, kami telah membantu puluhan bisnis meningkatkan digital presence mereka.",
        stats: [
          { label: "Project Selesai", value: "50+" },
          { label: "Client Puas", value: "35+" },
          { label: "Tahun Pengalaman", value: "5+" },
        ],
      },
    },
  });

  await prisma.cMSContent.upsert({
    where: { section_locale: { section: "services", locale: "ID" } },
    update: {
      content: {
        title: "Layanan Kami",
        items: [
          {
            title: "Website & Digital Presence",
            description: "Website modern yang dioptimalkan untuk konversi, dengan desain yang mencerminkan brand Anda dan performa yang cepat.",
            icon: "globe",
          },
          {
            title: "Web Application",
            description: "Aplikasi web custom untuk otomasi workflow, dashboard analytics, atau sistem internal bisnis Anda.",
            icon: "monitor",
          },
          {
            title: "Mobile Experience",
            description: "Aplikasi mobile lintas platform dengan performa native dan pengalaman pengguna yang mulus.",
            icon: "smartphone",
          },
          {
            title: "UI/UX Research & Strategy",
            description: "Riset pengguna, wireframing, hingga prototyping — memastikan produk Anda dibangun dengan fondasi yang tepat.",
            icon: "chart",
          },
        ],
      },
    },
    create: {
      section: "services",
      locale: "ID",
      content: {
        title: "Layanan Kami",
        items: [
          {
            title: "Website & Digital Presence",
            description: "Website modern yang dioptimalkan untuk konversi, dengan desain yang mencerminkan brand Anda dan performa yang cepat.",
            icon: "globe",
          },
          {
            title: "Web Application",
            description: "Aplikasi web custom untuk otomasi workflow, dashboard analytics, atau sistem internal bisnis Anda.",
            icon: "monitor",
          },
          {
            title: "Mobile Experience",
            description: "Aplikasi mobile lintas platform dengan performa native dan pengalaman pengguna yang mulus.",
            icon: "smartphone",
          },
          {
            title: "UI/UX Research & Strategy",
            description: "Riset pengguna, wireframing, hingga prototyping — memastikan produk Anda dibangun dengan fondasi yang tepat.",
            icon: "chart",
          },
        ],
      },
    },
  });

  await prisma.cMSContent.create({
    data: {
      section: "footer",
      locale: "ID",
      content: {
        company: "Jhiro Digital Lab",
        description: "Studio produk digital untuk bisnis modern.",
        email: "hello@jhiro.id",
        phone: "+62 812 3456 7890",
        address: "Jakarta, Indonesia",
        socialLinks: {
          instagram: "https://instagram.com/jhirodigital",
          linkedin: "https://linkedin.com/company/jhirodigital",
          github: "https://github.com/jhirodigital",
        },
      },
    },
  });

  await prisma.cMSContent.create({
    data: {
      section: "contact",
      locale: "ID",
      content: {
        title: "Hubungi Kami",
        description: "Siap memulai project? Hubungi kami untuk konsultasi gratis.",
        email: "hello@jhiro.id",
        phone: "+62 812 3456 7890",
        whatsapp: "6281234567890",
      },
    },
  });

  await prisma.cMSContent.create({
    data: {
      section: "faq",
      locale: "ID",
      content: {
        title: "Pertanyaan Umum",
        items: [
          {
            question: "Berapa lama waktu pengerjaan project?",
            answer: "Waktu pengerjaan bervariasi tergantung kompleksitas project. Website sederhana 4-8 minggu, aplikasi web 8-16 minggu.",
          },
          {
            question: "Apakah termasuk maintenance setelah launching?",
            answer: "Ya, kami berikan free maintenance 1 bulan setelah launching. Untuk maintenance jangka panjang tersedia paket support.",
          },
          {
            question: "Bagaimana sistem pembayaran?",
            answer: "Pembayaran dilakukan dengan sistem DP 50% dan pelunasan setelah project selesai. Untuk project besar bisa di cicil.",
          },
        ],
      },
    },
  });

  await prisma.cMSContent.upsert({
    where: { section_locale: { section: "stats", locale: "ID" } },
    update: {
      content: {
        stat1Value: "50",
        stat1Label: "produk diluncurkan",
        stat2Value: "30+",
        stat2Label: "partner bisnis",
        stat3Value: "3+ th",
        stat3Label: "pengalaman kolektif",
        stat4Value: "4.9/5",
        stat4Label: "kepuasan partner",
      },
    },
    create: {
      section: "stats",
      locale: "ID",
      content: {
        stat1Value: "50",
        stat1Label: "produk diluncurkan",
        stat2Value: "30+",
        stat2Label: "partner bisnis",
        stat3Value: "3+ th",
        stat3Label: "pengalaman kolektif",
        stat4Value: "4.9/5",
        stat4Label: "kepuasan partner",
      },
    },
  });

  console.log("Created CMS Content");

  // Create Articles
  await prisma.article.create({
    data: {
      title: "Mengapa Website Penting untuk Bisnis di 2026",
      slug: "mengapa-website-penting-untuk-bisnis-2026",
      content: "<p>Di era digital seperti sekarang, memiliki website bukan lagi pilihan melainkan kebutuhan...</p>",
      excerpt: "Pelajari mengapa website menjadi kebutuhan utama bagi bisnis modern di tahun 2026.",
      category: "Tips & Trick",
      tags: ["website", "bisnis", "digital marketing"],
      authorId: superAdmin.id,
      status: "PUBLISHED",
      locale: "ID",
      publishedAt: new Date("2026-06-01"),
    },
  });

  await prisma.article.create({
    data: {
      title: "Best Practices dalam Web Development",
      slug: "best-practices-web-development",
      content: "<p>Web development terus berkembang dengan teknologi baru...</p>",
      excerpt: "Temukan best practices terbaru dalam development untuk menghasilkan website yang berkualitas.",
      category: "Tutorial",
      tags: ["web development", "best practices", "coding"],
      authorId: pm1.id,
      status: "PUBLISHED",
      locale: "ID",
      publishedAt: new Date("2026-05-15"),
    },
  });
  console.log("Created Articles");

  // Create Portfolios (mockup-matching data with local images)
  await prisma.portfolio.create({
    data: {
      name: "Velora Commerce",
      slug: "velora-commerce",
      description: "Dashboard analytics e-commerce real-time untuk Velora Commerce, membantu tim memantau performa bisnis secara harian dengan visualisasi data yang intuitif.",
      technologies: ["Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
      screenshots: ["/images/portfolio/velora-commerce.png"],
      projectUrl: "https://velora-commerce.id",
      isFeatured: true,
    },
  });

  await prisma.portfolio.create({
    data: {
      name: "Nadi Corp",
      slug: "nadi-corp",
      description: "Sistem operasi internal untuk Nadi Corp dengan fitur workflow automation, task management, dan reporting dashboard.",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
      screenshots: ["/images/portfolio/nadi-operations.png"],
      isFeatured: true,
    },
  });

  await prisma.portfolio.create({
    data: {
      name: "Sora Living",
      slug: "sora-living",
      description: "Website digital presence Sora Living dengan desain minimalis yang mencerminkan brand sustainability mereka, dilengkapi blog dan e-commerce section.",
      technologies: ["Next.js", "Framer Motion", "Sanity CMS", "Vercel"],
      screenshots: ["/images/portfolio/sora-living.png"],
      projectUrl: "https://sora-living.id",
      isFeatured: false,
    },
  });

  await prisma.portfolio.create({
    data: {
      name: "Arca Studio",
      slug: "arca-studio",
      description: "Studio portofolio Arca Studio dengan grid layout interaktif, animasi scroll-triggered, dan showcase proyek arsitektur 3D.",
      technologies: ["Next.js", "Three.js", "GSAP", "Supabase"],
      screenshots: ["/images/portfolio/arca-studio.png"],
      isFeatured: false,
    },
  });
  console.log("Created Portfolios");

  // Create Case Studies
  await prisma.caseStudy.create({
    data: {
      title: "Bagaimana Tech Vision Meningkatkan Leads 200%",
      slug: "tech-vision-leads-improvement",
      problem: "Tech Vision memiliki website lama yang outdated dan tidak responsive, menghasilkan leads sangat sedikit.",
      solution: "Kami redesign entire website dengan modern UX dan integrate dengan CRM system untuk tracking leads.",
      result: "Website baru meningkatkan conversion rate dan menghasilkan 200% lebih banyak leads dalam 3 bulan pertama.",
      screenshots: ["https://picsum.photos/seed/techvision-case/800/600"],
      metrics: {
        leadsIncrease: "+200%",
        conversionRate: "+45%",
        pageSpeed: "-60% load time",
      },
    },
  });
  console.log("Created Case Studies");

  // Create Resources
  await prisma.resource.create({
    data: {
      title: "Free Website Checklist 2026",
      description: "Checklist lengkap untuk memastikan website Anda siap launching.",
      type: "CHECKLIST",
      fileUrl: "/resources/website-checklist-2026.pdf",
      category: "Download",
    },
  });

  await prisma.resource.create({
    data: {
      title: "E-book: Digital Marketing Guide",
      description: "Panduan lengkap digital marketing untuk pemula hingga advanced.",
      type: "EBOOK",
      fileUrl: "/resources/digital-marketing-guide.pdf",
      category: "E-book",
    },
  });
  console.log("Created Resources");

  // Create SEO Meta
  await prisma.sEOMeta.create({
    data: {
      pageKey: "home",
      metaTitle: "Jhiro Digital Lab - Digital Product Studio",
      metaDescription: "Studio produk digital untuk bisnis modern. Website, aplikasi, dashboard, dan solusi digital lainnya.",
      ogImage: "/images/og-home.jpg",
      canonicalUrl: "https://jhiro.id",
    },
  });

  await prisma.sEOMeta.create({
    data: {
      pageKey: "services",
      metaTitle: "Layanan - Jhiro Digital Lab",
      metaDescription: "Layanan pengembangan website, web application, mobile app, dan solusi digital lainnya.",
      ogImage: "/images/og-services.jpg",
    },
  });
  console.log("Created SEO Meta");

  // Create Activity Logs
  await prisma.activityLog.create({
    data: {
      userId: superAdmin.id,
      activity: "system_init",
      metadata: { message: "System initialized with seed data" },
    },
  });
  console.log("Created Activity Logs");

  console.log("Seed completed successfully!");
  console.log("\n--- Test Credentials ---");
  console.log("Super Admin: admin@jhiro.id / admin123");
  console.log("PM 1: ahmad@jhiro.id / pm123456");
  console.log("PM 2: sarah@jhiro.id / pm123456");
  console.log("Client 1: budi@techvision.co.id / client123");
  console.log("Client 2: diana@greencircle.id / client123");
  console.log("Client 3: rizky@fashionhub.co.id / client123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
