import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyNewMessage } from "@/lib/notification";

const schema = z.object({ message: z.string().trim().min(1).max(5000) });

async function getAccessibleProject(projectId: string, userId: string, role: string) {
  if (role === "SUPER_ADMIN" || role === "PROJECT_MANAGER") {
    return prisma.project.findFirst({ where: { id: projectId, deletedAt: null }, include: { client: { select: { userId: true } } } });
  }
  const client = await prisma.client.findUnique({ where: { userId }, select: { id: true } });
  if (!client) return null;
  return prisma.project.findFirst({ where: { id: projectId, clientId: client.id, deletedAt: null }, include: { client: { select: { userId: true } } } });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const project = await getAccessibleProject(id, session.user.id, session.user.role);
    if (!project) return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    const thread = await prisma.chatThread.findUnique({
      where: { projectId: id },
      include: {
        messages: {
          include: { sender: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return NextResponse.json({ messages: thread?.messages ?? [] });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Gagal memuat pesan" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const data = schema.parse(await request.json());
    const project = await getAccessibleProject(id, session.user.id, session.user.role);
    if (!project) return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    const thread = await prisma.chatThread.upsert({ where: { projectId: id }, update: {}, create: { projectId: id } });
    const message = await prisma.chatMessage.create({ data: { threadId: thread.id, senderId: session.user.id, message: data.message, mentions: [], attachments: [] }, include: { sender: { select: { id: true, name: true, role: true } } } });
    await logActivity({ userId: session.user.id, projectId: id, activity: "message_sent", metadata: { messageId: message.id } });
    const recipientId = session.user.role === "CLIENT" ? project.managerId : project.client.userId;
    if (recipientId && recipientId !== session.user.id) {
      try {
        await notifyNewMessage(recipientId, project.name, session.user.name ?? session.user.email, project.id, session.user.role === "CLIENT" ? "admin" : "client");
      } catch {
        console.warn("Failed to send message notification");
      }
    }
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Pesan tidak valid" }, { status: 400 });
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Pesan gagal dikirim" }, { status: 500 });
  }
}
