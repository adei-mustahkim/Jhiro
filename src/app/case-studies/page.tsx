import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import prisma from "@/lib/prisma";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PageHero } from "@/components/public/page-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studi Kasus",
  description: "Cerita tentang tantangan yang kami hadapi dan solusi yang kami bangun bersama partner dari berbagai industri.",
};

async function getCaseStudies() {
  return prisma.caseStudy.findMany({
    where: {
      screenshots: { isEmpty: false },
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="case-studies" />
      <main id="main-content">
        <PageHero
          eyebrow="Studi Kasus"
          title="Hasil yang nyata dari kerja sama dengan bisnis Anda."
          description="Cerita tentang tantangan yang kami hadapi dan solusi yang kami bangun bersama partner dari berbagai industri."
        />

        <section className="py-24 sm:py-32">
          <div className="container-wide">
            {caseStudies.length === 0 ? (
              <div className="rounded-[2rem] border border-emerald-950/10 bg-emerald-50/50 px-6 py-20 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Studi kasus sedang disiapkan
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Kami sedang merapikan cerita proyek terbaik untuk segera
                  dibagikan.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                {caseStudies.map((cs, index) => (
                  <Link
                    key={cs.id}
                    href={`/case-study/${cs.slug}`}
                    className={`group relative overflow-hidden rounded-[1.75rem] border border-emerald-950/10 ${
                      index === 0 ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="relative min-h-[400px]">
                      {cs.screenshots[0] ? (
                        <Image
                          src={cs.screenshots[0]}
                          alt={cs.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-emerald-950" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="text-xs font-medium uppercase tracking-widest text-emerald-200">
                            Studi Kasus
                          </span>
                          <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                            {cs.title}
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-emerald-100/75">
                            {cs.problem}
                          </p>
                        </div>
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                          <ArrowUpRight className="h-5 w-5 text-white" weight="bold" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
