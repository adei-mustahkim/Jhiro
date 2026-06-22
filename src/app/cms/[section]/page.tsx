import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { cmsSections } from "@/lib/cms-config";
import { CMSEditor } from "@/components/admin/cms-editor";

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default async function CMSSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const config = cmsSections[section];
  if (!config) notFound();
  const content = await prisma.cMSContent.findUnique({ where: { section_locale: { section: config.databaseSection, locale: "ID" } } });
  const initialValues: Record<string, string> = {};
  if (content && isJsonObject(content.content)) {
    for (const field of config.fields) {
      const value = content.content[field.key];
      if (typeof value === "string") initialValues[field.key] = value;
    }
  }
  return <CMSEditor slug={section} title={config.title} description={config.description} fields={config.fields} initialValues={initialValues} />;
}
