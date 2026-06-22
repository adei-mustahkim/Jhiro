import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";
import { notifyFileUploaded } from "@/lib/notification";
import prisma from "@/lib/prisma";

const schema = z.object({
  fileName: z.string().trim().min(1).max(255),
  fileUrl: z.string().trim().min(1).max(2000),
  fileSize: z.number().int().nonnegative().max(10 * 1024 * 1024).optional().nullable(),
  category: z.enum(["SOURCE_CODE", "ZIP", "DOCUMENTATION", "VIDEO_TUTORIAL", "LINK", "DATABASE_BACKUP", "OTHER"]),
  version: z.enum(["V1", "V2", "V3", "V4", "V5", "FINAL"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const data = schema.parse(await request.json());
    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: { client: { select: { userId: true } } },
    });
    if (!project) return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    const file = await prisma.projectFile.create({ data: { ...data, projectId: id, uploadedById: session.user.id } });
    await logActivity({ userId: session.user.id, projectId: id, activity: "file_uploaded", metadata: { fileId: file.id, fileName: file.fileName } });
    await notifyFileUploaded(project.client.userId, project.name, file.fileName, project.id);
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data file tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to attach project file:", error);
    return NextResponse.json({ error: "File gagal ditambahkan ke project" }, { status: 500 });
  }
}
