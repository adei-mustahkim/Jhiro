import { z } from "zod";

export const assetUrlSchema = z.string().refine((value) => {
  if (value.startsWith("/uploads/")) return true;
  try { new URL(value); return true; } catch { return false; }
}, "URL asset tidak valid");
