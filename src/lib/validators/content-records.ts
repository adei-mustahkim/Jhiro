import { z } from "zod";
import { ArticleStatus, ResourceType } from "@prisma/client";
import { assetUrlSchema } from "@/lib/validators/asset";

export const articleRecordSchema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(10).max(100_000),
  category: z.string().trim().max(100).optional(),
  tags: z.string().optional().default(""),
  thumbnail: z.union([assetUrlSchema, z.literal("")]).optional(),
  status: z.nativeEnum(ArticleStatus).default("DRAFT"),
});

export const portfolioRecordSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(5_000),
  technologies: z.string().optional().default(""),
  projectUrl: z.union([z.string().url(), z.literal("")]).optional(),
  screenshots: z.array(assetUrlSchema).min(1, "Minimal satu gambar portfolio").max(12, "Maksimal 12 gambar portfolio"),
});

export const resourceRecordSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2_000).optional(),
  type: z.nativeEnum(ResourceType),
  category: z.string().trim().max(100).optional(),
  fileUrl: assetUrlSchema,
});
