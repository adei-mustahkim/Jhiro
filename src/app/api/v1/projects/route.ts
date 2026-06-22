import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { createProjectSchema, projectQuerySchema } from "@/lib/validators/project";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = projectQuerySchema.parse(Object.fromEntries(searchParams));
    const page: number = parsed.page;
    const pageSize: number = parsed.pageSize;
    const status: string | undefined = parsed.status;

    // Build where clause based on role
    const where: Record<string, unknown> = { deletedAt: null };

    if (session.user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
      });
      if (!client) return NextResponse.json({ projects: [], pagination:{page,pageSize,total:0,totalPages:0} });
      where.clientId = client.id;
    }

    if (status) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          client: { select: { id: true, companyName: true, userId: true } },
          manager: { select: { id: true, name: true, email: true } },
          _count: {
            select: {
              revisions: true,
              changeRequests: true,
              files: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    // Check if recipient has unread notifications for each project (batch query)
    const recipientIds = [...new Set(
      projects.map((p) => session.user.role === "CLIENT" ? p.managerId : p.client?.userId).filter((id): id is string => Boolean(id))
    )];
    // Batch unread notifications per recipient using groupBy for efficiency
    const unreadMap = recipientIds.length > 0
      ? await prisma.notification.groupBy({
          by: ['userId'],
          where: { userId: { in: recipientIds }, isRead: false },
          _max: { createdAt: true },
        })
      : [];
    // Transform group result to map for lookup
    const unreadNotifications = unreadMap.map((g) => ({
      userId: g.userId,
      createdAt: g._max.createdAt,
      // dummy link placeholder – we'll match by project later
      link: ''
    }));

    const projectsWithUnreadStatus = projects.map((project) => {
      const recipientId = session.user.role === "CLIENT" ? project.managerId : project.client?.userId;
      let recipientUnreadSince: string | null = null;
      if (recipientId) {
        const unread = unreadNotifications.find(
          (n) => n.userId === recipientId && n.link?.includes(project.id)
        );
        if (unread) {
          recipientUnreadSince = unread.createdAt.toISOString();
        }
      }
      return {
        ...project,
        chatThread: project.chatThread
          ? {
              ...project.chatThread,
              recipientUnreadSince,
            }
          : null,
      };
    });

    return NextResponse.json({
      projects: projectsWithUnreadStatus,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = createProjectSchema.parse(await request.json());
    const project = await prisma.$transaction(async (transaction) => {
      const created = await transaction.project.create({
        data: {
          name: data.name,
          description: data.description ?? null,
          clientId: data.clientId,
          managerId: data.managerId || session.user.id,
          deadline: data.deadline ?? null,
          priority: data.priority,
          status: data.status,
        },
        include: { client: { select: { companyName: true } }, manager: { select: { name: true } } }
      });
      await transaction.chatThread.create({ data: { projectId: created.id } });
      return created;
    });

    await logActivity({
      userId: session.user.id,
      projectId: project.id,
      activity: "project_created",
      metadata: { projectName: project.name },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors }, { status: 400 });
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
