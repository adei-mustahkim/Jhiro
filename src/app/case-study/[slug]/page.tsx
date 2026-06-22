import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import prisma from "@/lib/prisma";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

interface CaseStudyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await prisma.caseStudy.findFirst({
    where: { slug, screenshots: { isEmpty: false }, deletedAt: null },
    select: { title: true, problem: true },
  });
  if (!caseStudy) return {};
  return {
    title: caseStudy.title,
    description: caseStudy.problem || undefined,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const caseStudy = await prisma.caseStudy.findFirst({
    where: {
      slug,
      screenshots: { isEmpty: false },
      deletedAt: null,
    },
  });

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="case-studies" />
      <main id="main-content">
        {/* Hero */}
        <section className="relative min-h-[60vh] overflow-hidden">
          {caseStudy.screenshots[0] && (
            <Image
              src={caseStudy.screenshots[0]}
              alt={caseStudy.title}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-emerald-950/30" />
          <div className="container-wide relative flex min-h-[60vh] flex-col justify-end pb-16 pt-32">
            <Link
              href="/case-studies"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Semua Studi Kasus
            </Link>
            <span className="mb-4 text-sm font-semibold text-emerald-300">
              Case Study
            </span>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              {caseStudy.title}
            </h1>
          </div>
        </section>

        {/* Screenshots */}
        {caseStudy.screenshots.length > 1 && (
          <section className="py-16">
            <div className="container-wide">
              <div className="grid gap-6 lg:grid-cols-2">
                {caseStudy.screenshots.slice(1).map((screenshot, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={screenshot}
                      alt={`${caseStudy.title} screenshot ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Content */}        <section className="border-y border-emerald-950/10 bg-[#f5f8f6] py-16 sm:py-24">
          <div className="container-wide divide-y divide-emerald-950/10 border-y border-emerald-950/10">
            {[["Tantangan", caseStudy.problem], ["Solusi", caseStudy.solution], ["Hasil", caseStudy.result]].map(([title, body], index) => (
              <section key={title} className="grid gap-6 py-10 lg:grid-cols-[0.38fr_1fr] lg:gap-16 lg:py-14">
                <div className="flex items-start gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-950 text-sm font-semibold text-white">{index + 1}</span><h2 className="text-2xl font-semibold tracking-[-0.03em] text-emerald-950 sm:text-3xl">{title}</h2></div>
                <div className="max-w-[70ch] whitespace-pre-wrap text-pretty text-base leading-8 text-slate-700 sm:text-lg">{body}</div>
              </section>
            ))}
          </div>
        </section>
{/* CTA */}
        <section className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="rounded-2xl bg-emerald-950 px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Tertarik bekerja sama dengan kami?
                </h2>
                <p className="mt-4 max-w-lg text-emerald-100/75">
                  Ceritakan tantangan bisnis Anda dan mari diskusikan bagaimana
                  kami bisa membantu.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-8 py-4 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300">
                  Mulai percakapan
                  <ArrowUpRight className="h-4 w-4" weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

