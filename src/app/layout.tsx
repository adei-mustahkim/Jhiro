import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProviderWrapper } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { getSiteContent } from "@/lib/cms-content";
import { SiteContentProvider } from "@/components/providers/site-content-provider";

const baseMetadata: Metadata = {
  title: {
    default: "Jhiro Digital Lab - Digital Product Studio",
    template: "%s | Jhiro Digital Lab",
  },
  description:
    "Studio produk digital untuk bisnis modern. Website, aplikasi web, dashboard, dan solusi digital berbasis AI.",
  keywords: [
    "digital agency",
    "web development",
    "web application",
    "mobile app",
    "dashboard",
    "UI/UX",
    "Indonesia",
  ],
  authors: [{ name: "Jhiro Digital Lab" }],
  creator: "Jhiro Digital Lab",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://jhiro.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    siteName: "Jhiro Digital Lab",
    title: "Jhiro Digital Lab - Digital Product Studio",
    description:
      "Studio produk digital untuk bisnis modern. Website, aplikasi web, dashboard, dan solusi digital berbasis AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhiro Digital Lab - Digital Product Studio",
    description:
      "Studio produk digital untuk bisnis modern. Website, aplikasi web, dashboard, dan solusi digital berbasis AI.",
    creator: "@jhirodigital",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { branding } = await getSiteContent();
  const name = branding.name || "Jhiro Digital Lab";
  return { ...baseMetadata, title: { default: `${name} - Digital Product Studio`, template: `%s | ${name}` }, icons: branding.faviconUrl ? { icon: branding.faviconUrl, shortcut: branding.faviconUrl } : undefined };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-emerald-950 px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          Lewati ke konten
        </a>
        <SiteContentProvider initialContent={siteContent}>
          <SessionProviderWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </SessionProviderWrapper>
        </SiteContentProvider>
      </body>
    </html>
  );
}
