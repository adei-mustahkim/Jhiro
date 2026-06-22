import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const readPortfolios = unstable_cache(
  async () => prisma.portfolio.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ["public-portfolios-v1"],
  { revalidate: 300, tags: ["public-portfolios"] },
);

const readArticles = unstable_cache(
  async () => prisma.article.findMany({ where: { status: "PUBLISHED", deletedAt: null }, include: { author: { select: { name: true } } }, orderBy: { publishedAt: "desc" } }),
  ["public-articles-v1"],
  { revalidate: 300, tags: ["public-articles"] },
);

const readResources = unstable_cache(
  async () => prisma.resource.findMany({ orderBy: { createdAt: "desc" } }),
  ["public-resources-v1"],
  { revalidate: 300, tags: ["public-resources"] },
);

export async function getPublicPortfolios() { try { return await readPortfolios(); } catch { return []; } }
export async function getPublicArticles() { try { return await readArticles(); } catch { return []; } }
export async function getPublicResources() { try { return await readResources(); } catch { return []; } }
