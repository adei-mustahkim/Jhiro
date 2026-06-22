import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(10, "Password minimal 10 karakter").max(72),
  companyName: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  industry: z.string().trim().max(120).optional().nullable(),
});

export const updateClientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  companyName: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  industry: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  isActive: z.boolean(),
});
