import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { updateProjectSchema } from "@/lib/validators/project";
import { z } from "zod";
import { notifyProjectUpdate } from "@/lib/notification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check access for clients (before fetching full data)
    if (session.user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (!client) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Verify client owns this project
      const projectExists = await prisma.project.findFirst({
        where: { id, clientId: client.id, deletedAt: null },
        select: { id: true },
      });
      if (!projectExists) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
    }

    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        client: {
          select: {
            id: true,
            userId: true,
            companyName: true,
            user: { select: { email: true, name: true } },
          },
        },
        manager: {
          select: { id: true, name: true, email: true, image: true },
        },
        requirement: true,
        revisions: {
          include: { handler: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
        changeRequests: {
          orderBy: { createdAt: "desc" },
        },
        files: {
          include: { uploadedBy: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
        },
        chatThread: {
          include: {
            messages: {
              include: { sender: { select: { id: true, name: true, image: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if recipient has unread notifications for this project
    const recipientId = session.user.role === "CLIENT" ? project.managerId : project.client?.userId;
    let recipientUnreadSince: string | null = null;
    if (recipientId) {
      const unreadNotification = await prisma.notification.findFirst({
        where: {
          userId: recipientId,
          isRead: false,
          link: {
            contains: project.id,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      if (unreadNotification) {
        recipientUnreadSince = unreadNotification.createdAt.toISOString();
      }
    }

    const responseData = {
      ...project,
      chatThread: project.chatThread
        ? {
            ...project.chatThread,
            recipientUnreadSince,
          }
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
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
    const body = updateProjectSchema.parse(await request.json());
    const existing = await prisma.project.findFirst({ where:{id,deletedAt:null}, select:{id:true} });
    if (!existing) return NextResponse.json({ error:"Project not found" }, { status:404 });
    const { name, description, status, progress, priority, deadline, managerId, clientId } = body;

    // Validate clientId exists if provided
    if (clientId) {
      const client = await prisma.client.findFirst({ where: { id: clientId, deletedAt: null }, select: { id: true } });
      if (!client) return NextResponse.json({ error: "Client tidak ditemukan" }, { status: 400 });
    }

    // Validate managerId exists if provided
    if (managerId) {
      const manager = await prisma.user.findFirst({ where: { id: managerId, role: "PROJECT_MANAGER" }, select: { id: true } });
      if (!manager) return NextResponse.json({ error: "Manajer tidak ditemukan" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description ?? null }),
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        ...(priority && { priority }),
        ...(deadline !== undefined && { deadline: deadline ?? null }),
        ...(managerId !== undefined && { managerId: managerId ?? null }),
        ...(clientId !== undefined && { clientId }),
      },
      include: {
        client: { select: { companyName: true } },
        manager: { select: { name: true } },
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: project.id,
      activity: "project_updated",
      metadata: { updates: body },
    });

    const client = await prisma.client.findUnique({ where: { id: project.clientId }, select: { userId: true } });
    if (client) {
      const summary = progress !== undefined ? `Progress diperbarui menjadi ${progress}%` : "Informasi project diperbarui";
      await notifyProjectUpdate(client.userId, project.name, summary, project.id);
    }

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error:error.errors[0]?.message ?? "Data tidak valid", details:error.errors }, { status:400 });
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Soft delete
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await logActivity({
      userId: session.user.id,
      projectId: id,
      activity: "project_deleted",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
