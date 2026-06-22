import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity-logger";
import { assetUrlSchema } from "@/lib/validators/asset";
import { revalidateTag, revalidatePath } from "next/cache";

const createCaseStudySchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).optional(),
  problem: z.string().trim().min(10).max(5000),
  solution: z.string().trim().min(10).max(5000),
  result: z.string().trim().min(10).max(5000),
  screenshots: z.array(assetUrlSchema).max(12).optional().default([]),
  metrics: z.record(z.string()).optional(),
  metaTitle: z.string().trim().max(100).optional(),
  metaDescription: z.string().trim().max(200).optional(),
  ogImage: assetUrlSchema.optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10) || 10));
    const skip = (page - 1) * pageSize;

    // Check if user is admin
    const session = await auth();
    const isAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "PROJECT_MANAGER";

    // Non-admins only see case studies with screenshots
    const where: Record<string, unknown> = {};
    where.deletedAt = null;
    if (!isAdmin) {
      where.screenshots = { isEmpty: false };
    }

    const [caseStudies, total] = await Promise.all([
      prisma.caseStudy.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.caseStudy.count({ where }),
    ]);

    return NextResponse.json({
      caseStudies,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
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

    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = createCaseStudySchema.parse(await request.json());

    // Generate slug if not provided
    let slug = data.slug ? createSlug(data.slug) : createSlug(data.title);

    // Check if slug exists
    const existing = await prisma.caseStudy.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-6)}`;
    }

    // Create case study
    const caseStudy = await prisma.caseStudy.create({
      data: {
        title: data.title,
        slug,
        problem: data.problem,
        solution: data.solution,
        result: data.result,
        screenshots: data.screenshots,
        metrics: data.metrics || {},
      },
    });

    // Create SEO meta if provided
    if (data.metaTitle || data.metaDescription) {
      await prisma.sEOMeta.create({
        data: {
          pageKey: `case-study-${caseStudy.id}`,
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || "",
          ogImage: data.ogImage,
          caseStudyId: caseStudy.id,
        },
      });
    }

    await logActivity({
      userId: session.user.id,
      activity: "case_study_created",
      metadata: {
        caseStudyId: caseStudy.id,
        title: caseStudy.title,
      },
    });

    revalidateTag("public-case-studies");
    revalidatePath("/case-studies");
    revalidatePath(`/case-study/${caseStudy.slug}`);

    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: "Failed to create case study" },
      { status: 500 }
    );
  }
}
