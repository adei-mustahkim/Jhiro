import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import prisma from "@/lib/prisma";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { formatDate } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    select: { title: true, excerpt: true },
  });
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
    },
    include: {
      author: { select: { name: true } },
    },
  });

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="blog" />
      <main id="main-content">
        <article className="container-narrow pb-24 pt-36 sm:pb-32 sm:pt-44">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke insight
          </Link>

          <div className="mt-12">
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span>{article.category || "Insight"}</span>
              <span>·</span>
              <span>{article.author.name}</span>
              {article.publishedAt && (
                <>
                  <span>·</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </>
              )}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-6xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-7 text-pretty text-lg leading-8 text-slate-500">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="mt-14 border-t border-emerald-950/10 pt-10 whitespace-pre-wrap text-base leading-8 text-slate-700">
            {article.content}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
