import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyChangeRequestSubmitted } from "@/lib/notification";

const createChangeRequestSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(5000),
  type: z.enum(["new_feature", "new_page", "new_module", "integration"]),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    // Build where clause based on role
    const where: Record<string, unknown> = {};

    if (session.user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (!client) {
        return NextResponse.json({ changeRequests: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
      }
      where.project = { clientId: client.id, deletedAt: null };
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10) || 10));
    const skip = (page - 1) * pageSize;

    const [changeRequests, total] = await Promise.all([
      prisma.changeRequest.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              client: { select: { companyName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.changeRequest.count({ where }),
    ]);

    return NextResponse.json({
      changeRequests,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching change requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch change requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only clients can submit change requests
    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can submit change requests" },
        { status: 403 }
      );
    }

    const data = createChangeRequestSchema.parse(await request.json());

    // Verify client owns the project
    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!client) {
      return NextResponse.json(
        { error: "Client profile not found" },
        { status: 404 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        clientId: client.id,
        deletedAt: null,
      },
      select: { id: true, name: true, managerId: true },
    });
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const changeRequest = await prisma.changeRequest.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        type: data.type,
        status: "SUBMITTED",
      },
      include: {
        project: {
          select: { name: true },
        },
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: data.projectId,
      activity: "change_request_created",
      metadata: {
        changeRequestId: changeRequest.id,
        title: changeRequest.title,
        type: changeRequest.type,
      },
    });

    // Notify PM if assigned (fire-and-forget)
    if (project.managerId) {
      try {
        await notifyChangeRequestSubmitted(
          project.managerId,
          project.name,
          changeRequest.title,
          project.id
        );
      } catch {
        console.warn("Failed to send change request notification");
      }
    }

    return NextResponse.json(changeRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating change request:", error);
    return NextResponse.json(
      { error: "Failed to create change request" },
      { status: 500 }
    );
  }
}
