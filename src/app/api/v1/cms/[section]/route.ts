import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cmsSections } from "@/lib/cms-config";
import { logActivity } from "@/lib/activity-logger";
import { revalidateTag } from "next/cache";

const contentSchema = z.record(z.string().trim().max(5000));

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toInputJson(value: Prisma.JsonValue): Prisma.InputJsonValue | undefined {
  if (value === null) return undefined;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    const result: Prisma.InputJsonValue[] = [];
    for (const item of value) {
      const converted = toInputJson(item);
      if (converted !== undefined) result.push(converted);
    }
    return result;
  }
  const result: Record<string, Prisma.InputJsonValue> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined) continue;
    const converted = toInputJson(item);
    if (converted !== undefined) result[key] = converted;
  }
  return result;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ section: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { section } = await params;
    const config = cmsSections[section];
    if (!config) return NextResponse.json({ error: "Section tidak ditemukan" }, { status: 404 });
    const input = contentSchema.parse(await request.json());
    const allowedKeys = new Set(config.fields.map((field) => field.key));
    const filtered: Record<string, string> = {};
    for (const [key, value] of Object.entries(input)) if (allowedKeys.has(key)) filtered[key] = value;
    const existing = await prisma.cMSContent.findUnique({ where: { section_locale: { section: config.databaseSection, locale: "ID" } } });
    const merged: Record<string, Prisma.InputJsonValue> = {};
    if (existing && isJsonObject(existing.content)) for (const [key, value] of Object.entries(existing.content)) {
      if (value === undefined) continue;
      const converted = toInputJson(value);
      if (converted !== undefined) merged[key] = converted;
    }
    for (const [key, value] of Object.entries(filtered)) merged[key] = value;
    const content = await prisma.cMSContent.upsert({
      where: { section_locale: { section: config.databaseSection, locale: "ID" } },
      update: { content: merged },
      create: { section: config.databaseSection, locale: "ID", content: merged },
    });
    await logActivity({ userId: session.user.id, activity: "cms_updated", metadata: { section: config.databaseSection } });
    revalidateTag("cms-content");
    if (["branding", "contact", "footer"].includes(config.databaseSection)) revalidateTag("site-content");
    return NextResponse.json({ id: content.id, updatedAt: content.updatedAt });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Konten tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to update CMS content:", error);
    return NextResponse.json({ error: "Konten gagal disimpan" }, { status: 500 });
  }
}
