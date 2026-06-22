import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import type { SiteContent } from "@/types/site-content";

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringsFromJson(value: Prisma.JsonValue): Record<string, string> {
  const result: Record<string, string> = {};
  if (isJsonObject(value)) {
    for (const [key, item] of Object.entries(value)) if (typeof item === "string") result[key] = item;
  }
  return result;
}

const readSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const records = await prisma.cMSContent.findMany({
      where: { locale: "ID", section: { in: ["branding", "contact", "footer"] } },
      select: { section: true, content: true },
    });
    const content: SiteContent = { branding: {}, contact: {}, footer: {} };
    for (const record of records) {
      if (record.section === "branding" || record.section === "contact" || record.section === "footer") {
        content[record.section] = stringsFromJson(record.content);
      }
    }
    return content;
  },
  ["public-site-content-v1"],
  { revalidate: 300, tags: ["site-content", "cms-content"] },
);

const readCMSSection = unstable_cache(
  async (section: string): Promise<Record<string, string>> => {
    const record = await prisma.cMSContent.findUnique({ where: { section_locale: { section, locale: "ID" } }, select: { content: true } });
    return record ? stringsFromJson(record.content) : {};
  },
  ["cms-section-v1"],
  { revalidate: 300, tags: ["cms-content"] },
);

const readCMSSections = unstable_cache(
  async (sections: string[]): Promise<Record<string, Prisma.JsonObject>> => {
    const records = await prisma.cMSContent.findMany({ where: { locale: "ID", section: { in: sections } }, select: { section: true, content: true } });
    return Object.fromEntries(records.flatMap((record) => isJsonObject(record.content) ? [[record.section, record.content]] : []));
  },
  ["cms-sections-v1"],
  { revalidate: 300, tags: ["cms-content"] },
);

export async function getSiteContent(): Promise<SiteContent> {
  try { return await readSiteContent(); }
  catch { return { branding: {}, contact: {}, footer: {} }; }
}

export async function getCMSStrings(section: string): Promise<Record<string, string>> {
  try { return await readCMSSection(section); }
  catch { return {}; }
}

export async function getCMSSections(sections: string[]): Promise<Record<string, Prisma.JsonObject>> {
  try { return await readCMSSections(sections); }
  catch { return {}; }
}
