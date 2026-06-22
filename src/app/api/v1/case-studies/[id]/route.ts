import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { assetUrlSchema } from "@/lib/validators/asset";
import { revalidateTag } from "next/cache";

const updateCaseStudySchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  slug: z.string().trim().min(3).max(200).optional(),
  problem: z.string().trim().min(10).max(5000).optional(),
  solution: z.string().trim().min(10).max(5000).optional(),
  result: z.string().trim().min(10).max(5000).optional(),
  screenshots: z.array(assetUrlSchema).max(12).optional(),
  metrics: z.record(z.string()).optional(),
  metaTitle: z.string().trim().max(100).optional(),
  metaDescription: z.string().trim().max(200).optional(),
  ogImage: assetUrlSchema.optional().nullable(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const caseStudy = await prisma.caseStudy.findFirst({
      where: { id, deletedAt: null },
      include: { seoMeta: true },
    });

    if (!caseStudy) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error("Error fetching case study:", error);
    return NextResponse.json(
      { error: "Failed to fetch case study" },
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

    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = updateCaseStudySchema.parse(await request.json());

    const existing = await prisma.caseStudy.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.problem !== undefined) updateData.problem = data.problem;
    if (data.solution !== undefined) updateData.solution = data.solution;
    if (data.result !== undefined) updateData.result = data.result;
    if (data.screenshots !== undefined) updateData.screenshots = data.screenshots;
    if (data.metrics !== undefined) updateData.metrics = data.metrics;

    // Handle slug change
    if (data.slug !== undefined && data.slug !== existing.slug) {
      const slugExists = await prisma.caseStudy.findFirst({
        where: { slug: data.slug, id: { not: id } },
        select: { id: true },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
      updateData.slug = data.slug;
    }

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: updateData,
    });

    // Update SEO meta if provided
    if (data.metaTitle !== undefined || data.metaDescription !== undefined || data.ogImage !== undefined) {
      const existingSeo = await prisma.sEOMeta.findUnique({
        where: { pageKey: `case-study-${id}` },
      });

      if (existingSeo) {
        await prisma.sEOMeta.update({
          where: { id: existingSeo.id },
          data: {
            metaTitle: data.metaTitle ?? existingSeo.metaTitle,
            metaDescription: data.metaDescription ?? existingSeo.metaDescription,
            ogImage: data.ogImage ?? existingSeo.ogImage,
          },
        });
      } else if (data.metaTitle || data.metaDescription) {
        await prisma.sEOMeta.create({
          data: {
            pageKey: `case-study-${id}`,
            metaTitle: data.metaTitle || caseStudy.title,
            metaDescription: data.metaDescription || "",
            ogImage: data.ogImage,
            caseStudyId: id,
          },
        });
      }
    }

    await logActivity({
      userId: session.user.id,
      activity: "case_study_updated",
      metadata: {
        caseStudyId: id,
        title: caseStudy.title,
      },
    });

    revalidateTag("public-case-studies");

    return NextResponse.json(caseStudy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating case study:", error);
    return NextResponse.json(
      { error: "Failed to update case study" },
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

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Only super admin can delete case studies" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.caseStudy.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.caseStudy.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Also soft delete SEO meta
    await prisma.sEOMeta.updateMany({
      where: { caseStudyId: id },
      data: { updatedAt: new Date() },
    });

    await logActivity({
      userId: session.user.id,
      activity: "case_study_deleted",
      metadata: {
        caseStudyId: id,
        title: existing.title,
      },
    });

    revalidateTag("public-case-studies");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return NextResponse.json(
      { error: "Failed to delete case study" },
      { status: 500 }
    );
  }
}
