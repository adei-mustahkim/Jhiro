import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { resourceRecordSchema } from "@/lib/validators/content-records";
import { revalidateTag } from "next/cache";

interface RouteContext { params: Promise<{ id: string }> }

async function authorize() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { user: session.user };
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource tidak ditemukan" }, { status: 404 });
    }

    // Increment download count for public downloads
    const { searchParams } = new URL(request.url);
    const incrementDownload = searchParams.get("download") === "true";

    if (incrementDownload) {
      await prisma.resource.update({
        where: { id },
        data: {
          downloadCount: { increment: 1 },
        },
      });

      await logActivity({
        activity: "resource_downloaded",
        metadata: { resourceId: id, title: resource.title },
      });

      revalidateTag("public-resources");
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json({ error: "Resource gagal dimuat" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const authorization = await authorize();
    if (authorization.error) return authorization.error;
    const { id } = await params;
    const current = await prisma.resource.findUnique({ where: { id }, select: { id: true } });
    if (!current) return NextResponse.json({ error: "Resource tidak ditemukan" }, { status: 404 });
    const data = resourceRecordSchema.parse(await request.json());
    const item = await prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        category: data.category || null,
        fileUrl: data.fileUrl,
      },
    });
    await logActivity({ userId: authorization.user.id, activity: "resource_updated", metadata: { resourceId: id, title: item.title } });
    revalidateTag("public-resources");
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to update resource:", error);
    return NextResponse.json({ error: "Resource gagal diperbarui" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const authorization = await authorize();
    if (authorization.error) return authorization.error;
    const { id } = await params;
    const item = await prisma.resource.findUnique({ where: { id }, select: { title: true } });
    if (!item) return NextResponse.json({ error: "Resource tidak ditemukan" }, { status: 404 });
    await prisma.resource.delete({ where: { id } });
    await logActivity({ userId: authorization.user.id, activity: "resource_deleted", metadata: { resourceId: id, title: item.title } });
    revalidateTag("public-resources");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete resource:", error);
    return NextResponse.json({ error: "Resource gagal dihapus" }, { status: 500 });
  }
}
