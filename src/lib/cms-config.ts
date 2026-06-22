export interface CMSFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  upload?: "image" | "favicon";
}

export interface CMSSectionConfig {
  title: string;
  description: string;
  databaseSection: string;
  fields: CMSFieldConfig[];
}

export const cmsSections: Record<string, CMSSectionConfig> = {
  homepage: {
    title: "Homepage hero",
    description: "Atur pesan utama dan tombol pada bagian pertama homepage.",
    databaseSection: "hero",
    fields: [
      { key: "headline", label: "Headline", placeholder: "Pesan utama homepage", multiline: true },
      { key: "subheadline", label: "Subheadline", placeholder: "Jelaskan nilai bisnis secara singkat", multiline: true },
      { key: "ctaPrimary", label: "CTA utama", placeholder: "Mulai project" },
      { key: "ctaSecondary", label: "CTA sekunder", placeholder: "Lihat karya" },
      { key: "heroImageUrl", label: "Media hero", placeholder: "Upload gambar rasio 4:3 (mis. 1600 Ã— 1200)", upload: "image" },
    ],
  },
  services: {
    title: "Services",
    description: "Atur pengantar untuk kapabilitas dan layanan Jhiro.",
    databaseSection: "services",
    fields: [
      { key: "title", label: "Judul section", placeholder: "Dari ide mentah sampai produk yang dipakai", multiline: true },
      { key: "description", label: "Deskripsi", placeholder: "Ringkasan pendek layanan", multiline: true },
    ],
  },
  about: {
    title: "About",
    description: "Atur narasi singkat tentang pendekatan dan posisi Jhiro.",
    databaseSection: "about",
    fields: [
      { key: "title", label: "Judul", placeholder: "Partner digital, bukan sekadar vendor" },
      { key: "description", label: "Deskripsi", placeholder: "Ceritakan cara Jhiro bekerja", multiline: true },
      { key: "imageUrl", label: "Logo / gambar About", placeholder: "Upload logo atau gambar untuk section Tentang Kami", upload: "image" },
    ],
  },
  contact: {
    title: "Informasi kontak",
    description: "Kelola detail kontak yang digunakan pada website.",
    databaseSection: "contact",
    fields: [
      { key: "email", label: "Email", placeholder: "hello@jhiro.id" },
      { key: "phone", label: "Telepon", placeholder: "+62 812 3456 7890" },
      { key: "location", label: "Lokasi", placeholder: "Jakarta, Indonesia" },
      { key: "bankName", label: "Nama Bank (untuk Invoice)", placeholder: "Bank Mandiri" },
      { key: "bankAccount", label: "Nomor Rekening (untuk Invoice)", placeholder: "123-00-0987654-3" },
      { key: "bankAccountName", label: "Nama Pemilik Rekening (untuk Invoice)", placeholder: "PT Jhiro Digital Indonesia" },
      { key: "invoiceTaxRate", label: "Pajak Invoice (%)", placeholder: "0" },
      { key: "invoicePaymentNote", label: "Catatan Pembayaran Invoice", placeholder: "Mohon sertakan nomor invoice pada berita transfer.", multiline: true },
      { key: "invoiceFooter", label: "Footer Invoice", placeholder: "Terima kasih atas kerja sama Anda.", multiline: true },
    ],
  },
  footer: {
    title: "Footer",
    description: "Atur deskripsi singkat dan copyright website.",
    databaseSection: "footer",
    fields: [
      { key: "description", label: "Deskripsi", placeholder: "Studio produk digital independen...", multiline: true },
      { key: "copyright", label: "Copyright", placeholder: "Jhiro Digital Lab" },
    ],
  },
  branding: {
    title: "Logo & brand",
    description: "Kelola nama brand dan tagline utama.",
    databaseSection: "branding",
    fields: [
      { key: "name", label: "Nama brand", placeholder: "Jhiro Digital Lab" },
      { key: "tagline", label: "Tagline", placeholder: "Digital product studio" },
      { key: "logoUrl", label: "Logo", placeholder: "Upload simbol logo berbentuk persegi", upload: "image" },
      { key: "faviconUrl", label: "Favicon", placeholder: "Upload favicon", upload: "favicon" },
    ],
  },
  stats: {
    title: "Statistik",
    description: "Atur angka dan label yang ditampilkan di section statistik homepage.",
    databaseSection: "stats",
    fields: [
      { key: "stat1Value", label: "Stat 1 — Nilai", placeholder: "Contoh: 12 atau 50+" },
      { key: "stat1Label", label: "Stat 1 — Label", placeholder: "produk diluncurkan" },
      { key: "stat2Value", label: "Stat 2 — Nilai", placeholder: "Contoh: 3 atau 10" },
      { key: "stat2Label", label: "Stat 2 — Label", placeholder: "partner bisnis" },
      { key: "stat3Value", label: "Stat 3 — Nilai", placeholder: "Contoh: 5 th" },
      { key: "stat3Label", label: "Stat 3 — Label", placeholder: "pengalaman kolektif" },
      { key: "stat4Value", label: "Stat 4 — Nilai", placeholder: "Contoh: 4.9/5" },
      { key: "stat4Label", label: "Stat 4 — Label", placeholder: "kepuasan partner" },
    ],
  },
};

