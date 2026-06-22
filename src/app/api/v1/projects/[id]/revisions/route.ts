import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyRevisionSubmitted } from "@/lib/notification";

const schema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(5000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "CLIENT") return NextResponse.json({ error: "Hanya client yang dapat mengirim revisi" }, { status: 403 });
    const { id } = await params;
    const data = schema.parse(await request.json());
    const client = await prisma.client.findUnique({ where: { userId: session.user.id }, select: { id: true } });
    if (!client) return NextResponse.json({ error: "Profil client tidak ditemukan" }, { status: 404 });
    const project = await prisma.project.findFirst({ where: { id, clientId: client.id, deletedAt: null }, select: { id: true, name: true, managerId: true } });
    if (!project) return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    const revision = await prisma.revision.create({ data: { projectId: id, title: data.title, description: data.description, priority: data.priority, attachments: [] } });
    await logActivity({ userId: session.user.id, projectId: id, activity: "revision_created", metadata: { revisionId: revision.id, title: revision.title } });
    if (project.managerId) {
      try {
        await notifyRevisionSubmitted(project.managerId, project.name, revision.title, project.id);
      } catch {
        console.warn("Failed to send revision notification");
      }
    }
    return NextResponse.json(revision, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data revisi tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to create revision:", error);
    return NextResponse.json({ error: "Revisi gagal dikirim" }, { status: 500 });
  }
}
