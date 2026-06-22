import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity-logger";
import { portfolioRecordSchema } from "@/lib/validators/content-records";
import { revalidateTag } from "next/cache";

interface RouteContext { params: Promise<{ id: string }> }

async function authorize() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { user: session.user };
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const authorization = await authorize();
    if (authorization.error) return authorization.error;
    const { id } = await params;
    const current = await prisma.portfolio.findFirst({ where: { id, deletedAt: null } });
    if (!current) return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    const data = portfolioRecordSchema.parse(await request.json());
    const base = createSlug(data.name) || "project";
    const duplicate = await prisma.portfolio.findFirst({ where: { slug: base, NOT: { id } }, select: { id: true } });
    const item = await prisma.portfolio.update({
      where: { id },
      data: {
        name: data.name,
        slug: duplicate ? `${base}-${Date.now().toString().slice(-6)}` : base,
        description: data.description,
        technologies: data.technologies.split(",").map((value) => value.trim()).filter(Boolean),
        screenshots: data.screenshots,
        projectUrl: data.projectUrl || null,
      },
    });
    await logActivity({ userId: authorization.user.id, activity: "portfolio_updated", metadata: { portfolioId: id, name: item.name } });
    revalidateTag("public-portfolios");
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to update portfolio:", error);
    return NextResponse.json({ error: "Portfolio gagal diperbarui" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const authorization = await authorize();
    if (authorization.error) return authorization.error;
    const { id } = await params;
    const item = await prisma.portfolio.findFirst({ where: { id, deletedAt: null }, select: { name: true } });
    if (!item) return NextResponse.json({ error: "Portfolio tidak ditemukan" }, { status: 404 });
    await prisma.portfolio.update({ where: { id }, data: { deletedAt: new Date() } });
    await logActivity({ userId: authorization.user.id, activity: "portfolio_deleted", metadata: { portfolioId: id, name: item.name } });
    revalidateTag("public-portfolios");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete portfolio:", error);
    return NextResponse.json({ error: "Portfolio gagal dihapus" }, { status: 500 });
  }
}
