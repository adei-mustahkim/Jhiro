import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyChangeRequestDecision } from "@/lib/notification";

const updateChangeRequestSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  type: z.enum(["new_feature", "new_page", "new_module", "integration"]).optional(),
  estimatedCost: z.number().nonnegative().optional().nullable(),
  status: z.enum(["SUBMITTED", "REVIEWED", "APPROVED", "REJECTED", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const changeRequest = await prisma.changeRequest.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            client: {
              select: {
                id: true,
                userId: true,
                companyName: true,
              },
            },
            managerId: true,
          },
        },
      },
    });

    if (!changeRequest) {
      return NextResponse.json(
        { error: "Change request not found" },
        { status: 404 }
      );
    }

    // Check access for clients
    if (session.user.role === "CLIENT") {
      if (changeRequest.project.client.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(changeRequest);
  } catch (error) {
    console.error("Error fetching change request:", error);
    return NextResponse.json(
      { error: "Failed to fetch change request" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and PM can update change requests
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json(
        { error: "Only admin and project managers can update change requests" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const data = updateChangeRequestSchema.parse(await request.json());

    const existing = await prisma.changeRequest.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            client: { select: { userId: true } },
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Change request not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost;
    if (data.status !== undefined) updateData.status = data.status;

    const changeRequest = await prisma.changeRequest.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { name: true },
        },
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: existing.project.id,
      activity: "change_request_updated",
      metadata: {
        changeRequestId: id,
        title: changeRequest.title,
        changes: Object.keys(data),
      },
    });

    // Notify client on status change
    if (data.status && (data.status === "APPROVED" || data.status === "REJECTED")) {
      await notifyChangeRequestDecision(
        existing.project.client.userId,
        existing.project.name,
        changeRequest.title,
        data.status as "APPROVED" | "REJECTED",
        existing.project.id
      );
    }

    return NextResponse.json(changeRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating change request:", error);
    return NextResponse.json(
      { error: "Failed to update change request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super admin can delete change requests
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Only super admin can delete change requests" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.changeRequest.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Change request not found" },
        { status: 404 }
      );
    }

    await prisma.changeRequest.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      projectId: existing.project.id,
      activity: "change_request_deleted",
      metadata: {
        changeRequestId: id,
        title: existing.title,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting change request:", error);
    return NextResponse.json(
      { error: "Failed to delete change request" },
      { status: 500 }
    );
  }
}
