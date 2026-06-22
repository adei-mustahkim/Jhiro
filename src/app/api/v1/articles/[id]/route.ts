import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity-logger";
import { articleRecordSchema } from "@/lib/validators/content-records";
import { revalidateTag } from "next/cache";

interface RouteContext { params: Promise<{ id: string }> }

async function authorize() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user: session.user };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const authorization = await authorize();
    if (authorization.error) return authorization.error;
    const { id } = await params;
    const current = await prisma.article.findFirst({ where: { id, deletedAt: null } });
    if (!current) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    const data = articleRecordSchema.parse(await request.json());
    const base = createSlug(data.title) || "article";
    const duplicate = await prisma.article.findFirst({ where: { slug: base, NOT: { id } }, select: { id: true } });
    const slug = duplicate ? `${base}-${Date.now().toString().slice(-6)}` : base;
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        category: data.category || null,
        tags: data.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
        thumbnail: data.thumbnail || null,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? current.publishedAt ?? new Date() : null,
      },
    });
    await logActivity({ userId: authorization.user.id, activity: "article_updated", metadata: { articleId: id, title: article.title } });
    revalidateTag("public-articles");
    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to update article:", error);
    return NextResponse.json({ error: "Artikel gagal diperbarui" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const authorization = await authorize();
    if (authorization.error) return authorization.error;
    const { id } = await params;
    const article = await prisma.article.findFirst({ where: { id, deletedAt: null }, select: { title: true } });
    if (!article) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    await prisma.article.update({ where: { id }, data: { deletedAt: new Date() } });
    await logActivity({ userId: authorization.user.id, activity: "article_deleted", metadata: { articleId: id, title: article.title } });
    revalidateTag("public-articles");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json({ error: "Artikel gagal dihapus" }, { status: 500 });
  }
}
