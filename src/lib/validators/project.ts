import { z } from "zod";
import { ProjectStatus, ProjectPriority } from "@prisma/client";

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.nativeEnum(ProjectStatus).optional(),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(5000).optional().nullable(),
  clientId: z.string().uuid(),
  managerId: z.string().uuid().optional().nullable(),
  deadline: z.coerce.date().optional().nullable(),
  priority: z.nativeEnum(ProjectPriority).default("MEDIUM"),
  status: z.nativeEnum(ProjectStatus).default("NEW"),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  progress: z.number().int().min(0).max(100).optional(),
  clientId: z.string().uuid().optional(),
});
