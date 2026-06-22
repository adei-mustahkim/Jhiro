import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { assetUrlSchema } from "@/lib/validators/asset";
import { ResourceType } from "@prisma/client";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  type: z.nativeEnum(ResourceType),
  category: z.string().trim().max(100).optional(),
  fileUrl: assetUrlSchema,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = schema.parse(await request.json());
    const item = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        category: data.category || null,
        fileUrl: data.fileUrl,
      },
    });

    await logActivity({ userId: session.user.id, activity: "resource_created", metadata: { resourceId: item.id, title: item.title } });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to create resource:", error);
    return NextResponse.json({ error: "Resource gagal dibuat" }, { status: 500 });
  }
}
