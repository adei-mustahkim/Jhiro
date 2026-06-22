import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const file = await prisma.projectFile.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true },
        },
        uploadedBy: {
          select: { id: true },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    await prisma.projectFile.delete({
      where: { id },
    });

    // Delete physical file from disk
    try {
      const filePath = join(process.cwd(), "public", file.fileUrl);
      await unlink(filePath);
    } catch {
      // File may not exist on disk - log but don't fail
      console.warn("Physical file not found on disk:", file.fileUrl);
    }

    await logActivity({
      userId: session.user.id,
      projectId: file.project.id,
      activity: "file_deleted",
      metadata: {
        fileId: id,
        fileName: file.fileName,
        projectName: file.project.name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "File gagal dihapus" }, { status: 500 });
  }
}
