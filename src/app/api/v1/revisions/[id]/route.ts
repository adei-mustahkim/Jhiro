import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyRevisionStatusChanged } from "@/lib/notification";

const schema = z.object({ status: z.enum(["OPEN", "IN_REVIEW", "IN_PROGRESS", "COMPLETED", "APPROVED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const data = schema.parse(await request.json());
    const current = await prisma.revision.findUnique({ where: { id }, include: { project: { include: { client: { select: { userId: true } } } } } });
    if (!current) return NextResponse.json({ error: "Revisi tidak ditemukan" }, { status: 404 });
    const revision = await prisma.revision.update({ where: { id }, data: { status: data.status, handlerId: data.status === "OPEN" ? null : session.user.id } });
    await logActivity({ userId: session.user.id, projectId: current.projectId, activity: "revision_updated", metadata: { revisionId: id, status: data.status } });
    // Notify client (fire-and-forget)
    try {
      await notifyRevisionStatusChanged(current.project.client.userId, current.project.name, current.title, data.status, current.projectId);
    } catch {
      console.warn("Failed to send revision status notification");
    }
    return NextResponse.json(revision);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Status tidak valid" }, { status: 400 });
    console.error("Failed to update revision:", error);
    return NextResponse.json({ error: "Status revisi gagal diperbarui" }, { status: 500 });
  }
}
