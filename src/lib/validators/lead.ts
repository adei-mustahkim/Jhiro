import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.string().trim().email("Email tidak valid").toLowerCase(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(5000),
});
