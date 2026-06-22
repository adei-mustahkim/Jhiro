import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

export const createInvoiceSchema = z.object({
  clientId: z.string().uuid(),
  projectId: z.string().uuid().optional().nullable(),
  amount: z.coerce.number().positive().max(999999999999),
  description: z.string().trim().max(1000, "Keterangan maksimal 1000 karakter").optional().nullable(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(InvoiceStatus).default("DRAFT"),
});
