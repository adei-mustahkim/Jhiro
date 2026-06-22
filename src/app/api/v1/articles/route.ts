import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity-logger";
import { assetUrlSchema } from "@/lib/validators/asset";
import { revalidateTag } from "next/cache";
import { ArticleStatus } from "@prisma/client";

const schema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(10).max(100000),
  category: z.string().trim().max(100).optional(),
  tags: z.string().optional().default(""),
  thumbnail: z.union([assetUrlSchema, z.literal("")]).optional(),
  status: z.nativeEnum(ArticleStatus).default("DRAFT"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = schema.parse(await request.json());
    const base = createSlug(data.title) || "article";
    const exists = await prisma.article.findUnique({ where: { slug: base }, select: { id: true } });
    const slug = exists ? `${base}-${Date.now().toString().slice(-6)}` : base;

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        category: data.category || null,
        tags: data.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
        thumbnail: data.thumbnail || null,
        status: data.status,
        authorId: session.user.id,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    await logActivity({
      userId: session.user.id,
      activity: "article_created",
      metadata: { articleId: article.id, title: article.title },
    });
    revalidateTag("public-articles");
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to create article:", error);
    return NextResponse.json({ error: "Artikel gagal dibuat" }, { status: 500 });
  }
}
