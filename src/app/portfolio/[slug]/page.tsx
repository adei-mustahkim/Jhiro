import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PortfolioCaseStudy } from "@/components/public/portfolio-case-study";

interface PortfolioDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolio.findFirst({
    where: { slug, deletedAt: null },
    select: { name: true, description: true },
  });
  if (!project) return {};
  return {
    title: project.name,
    description: project.description || undefined,
  };
}

export default async function PortfolioDetail({ params }: PortfolioDetailProps) {
  const { slug } = await params;

  const project = await prisma.portfolio.findFirst({
    where: {
      slug,
      deletedAt: null,
    },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="portfolio" />
      <main id="main-content">
        <PortfolioCaseStudy
          name={project.name}
          description={project.description}
          technologies={project.technologies}
          screenshots={project.screenshots}
          projectUrl={project.projectUrl}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
