import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Globe, Image, Settings, ChevronRight } from "lucide-react";

export default async function CMSPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  const cmsSections = [
    {
      title: "Homepage",
      description: "Kelola konten halaman utama",
      href: "/cms/homepage",
      icon: Globe,
    },
    {
      title: "Services",
      description: "Kelola halaman layanan",
      href: "/cms/services",
      icon: FileText,
    },
    {
      title: "About",
      description: "Kelola halaman tentang kami",
      href: "/cms/about",
      icon: FileText,
    },
    {
      title: "Contact",
      description: "Kelola informasi kontak",
      href: "/cms/contact",
      icon: Settings,
    },
    {
      title: "Footer",
      description: "Kelola konten footer",
      href: "/cms/footer",
      icon: Settings,
    },
    {
      title: "Logo & Brand",
      description: "Kelola logo dan brand assets",
      href: "/cms/branding",
      icon: Image,
    },
    {
      title: "Statistik",
      description: "Kelola angka statistik homepage",
      href: "/cms/stats",
      icon: Settings,
    },
  ];

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">CMS</h1>
          <p className="text-muted-foreground mt-1">
            Kelola konten website secara terpusat
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cmsSections.map((section) => (
            <Link key={section.href} href={section.href} className="group block">
              <Card className="h-full bg-white/70 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-emerald-500/20 group-hover:shadow-[0_20px_45px_-28px_rgba(6,78,59,0.35)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-700" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
  );
}
