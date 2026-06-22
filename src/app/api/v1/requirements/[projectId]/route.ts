import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyRequirementApproved, notifyRequirementLocked } from "@/lib/notification";

const createRequirementSchema = z.object({
  businessGoals: z.string().trim().min(10).max(5000),
  requestedFeatures: z.string().trim().min(10).max(10000),
  references: z.string().trim().max(2000).optional().nullable(),
  attachments: z.array(z.string()).optional().default([]),
});

const updateRequirementSchema = z.object({
  businessGoals: z.string().trim().min(10).max(5000).optional(),
  requestedFeatures: z.string().trim().min(10).max(10000).optional(),
  references: z.string().trim().max(2000).optional().nullable(),
  attachments: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "APPROVED", "LOCKED"]).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    // Check access
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      include: {
        client: { select: { userId: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access
    if (
      session.user.role === "CLIENT" &&
      project.client.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const requirement = await prisma.requirementTracker.findUnique({
      where: { projectId },
    });

    return NextResponse.json(requirement || null);
  } catch (error) {
    console.error("Error fetching requirement:", error);
    return NextResponse.json(
      { error: "Failed to fetch requirement" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and PM can create requirements
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json(
        { error: "Only admin and project managers can create requirements" },
        { status: 403 }
      );
    }

    const { projectId } = await params;
    const data = createRequirementSchema.parse(await request.json());

    // Verify project exists
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true, name: true, client: { select: { userId: true } } },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if requirement already exists
    const existing = await prisma.requirementTracker.findUnique({
      where: { projectId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Requirement already exists for this project. Use PATCH to update." },
        { status: 409 }
      );
    }

    const requirement = await prisma.requirementTracker.create({
      data: {
        projectId,
        businessGoals: data.businessGoals,
        requestedFeatures: data.requestedFeatures,
        references: data.references,
        attachments: data.attachments,
        status: "DRAFT",
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId,
      activity: "requirement_created",
      metadata: {
        requirementId: requirement.id,
      },
    });

    return NextResponse.json(requirement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating requirement:", error);
    return NextResponse.json(
      { error: "Failed to create requirement" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and PM can update requirements
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json(
        { error: "Only admin and project managers can update requirements" },
        { status: 403 }
      );
    }

    const { projectId } = await params;
    const data = updateRequirementSchema.parse(await request.json());

    // Verify project exists
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true, name: true, client: { select: { userId: true } } },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.requirementTracker.findUnique({
      where: { projectId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Requirement not found. Create one first." },
        { status: 404 }
      );
    }

    // Check if locked - cannot update locked requirements
    if (existing.status === "LOCKED") {
      return NextResponse.json(
        { error: "Requirement is locked and cannot be modified" },
        { status: 403 }
      );
    }

    // Handle status transitions
    const currentStatus = existing.status;
    const newStatus = data.status;

    if (newStatus) {
      // Validate status transitions
      if (currentStatus === "DRAFT" && newStatus === "LOCKED") {
        return NextResponse.json(
          { error: "Cannot lock directly from DRAFT. Must be APPROVED first." },
          { status: 400 }
        );
      }
      if (currentStatus === "APPROVED" && newStatus === "DRAFT") {
        return NextResponse.json(
          { error: "Cannot revert from APPROVED to DRAFT" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.businessGoals !== undefined) updateData.businessGoals = data.businessGoals;
    if (data.requestedFeatures !== undefined) updateData.requestedFeatures = data.requestedFeatures;
    if (data.references !== undefined) updateData.references = data.references;
    if (data.attachments !== undefined) updateData.attachments = data.attachments;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "LOCKED") {
        updateData.lockedAt = new Date();
      }
    }

    const requirement = await prisma.requirementTracker.update({
      where: { projectId },
      data: updateData,
    });

    await logActivity({
      userId: session.user.id,
      projectId,
      activity: "requirement_updated",
      metadata: {
        requirementId: requirement.id,
        previousStatus: currentStatus,
        newStatus: requirement.status,
      },
    });

    // Send notifications on status changes
    if (newStatus === "APPROVED" && currentStatus === "DRAFT") {
      await notifyRequirementApproved(
        project.client.userId,
        project.name,
        projectId
      );
    }
    if (newStatus === "LOCKED" && currentStatus === "APPROVED") {
      await notifyRequirementLocked(
        project.client.userId,
        project.name,
        projectId
      );
    }

    return NextResponse.json(requirement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating requirement:", error);
    return NextResponse.json(
      { error: "Failed to update requirement" },
      { status: 500 }
    );
  }
}
