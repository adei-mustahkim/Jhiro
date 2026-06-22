import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createInvoiceSchema } from "@/lib/validators/invoice";
import { logActivity } from "@/lib/activity-logger";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = createInvoiceSchema.parse(await request.json());
    if (data.projectId) {
      const project = await prisma.project.findFirst({ where: { id: data.projectId, clientId: data.clientId, deletedAt: null }, select: { id: true } });
      if (!project) return NextResponse.json({ error: "Project tidak terhubung dengan client yang dipilih" }, { status: 400 });
    }

    const date = new Date();
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const invoiceNumber = `INV-${datePart}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: data.clientId,
        projectId: data.projectId ?? null,
        amount: data.amount,
        description: data.description ?? null,
        dueDate: data.dueDate,
        status: data.status,
      },
      include: {
        client: { select: { companyName: true } },
        project: { select: { name: true } },
      },
    });

    await logActivity({ userId: session.user.id, projectId: data.projectId ?? undefined, activity: "invoice_created", metadata: { invoiceId: invoice.id, invoiceNumber } });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Data invoice tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to create invoice:", error);
    return NextResponse.json({ error: "Invoice gagal dibuat" }, { status: 500 });
  }
}
