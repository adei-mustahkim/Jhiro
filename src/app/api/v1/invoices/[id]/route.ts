import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { notifyInvoiceCreated, notifyInvoicePaid } from "@/lib/notification";

const updateInvoiceSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().trim().max(500).optional().nullable(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["DRAFT", "UNPAID", "PARTIAL", "PAID", "OVERDUE"]).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        project: {
          select: { name: true },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Check access for clients
    if (session.user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (client?.id !== invoice.clientId) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = updateInvoiceSchema.parse(await request.json());

    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        project: { select: { name: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "PAID") {
        updateData.paidAt = new Date();
      }
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { companyName: true } },
        project: { select: { name: true } },
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: existing.projectId,
      activity: "invoice_updated",
      metadata: {
        invoiceId: id,
        invoiceNumber: existing.invoiceNumber,
        changes: Object.keys(data),
      },
    });

    // Notify client on status change
    if (data.status === "PAID") {
      await notifyInvoicePaid(
        existing.client.user.id,
        existing.invoiceNumber
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super admin can delete invoices
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only super admin can delete invoices" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      activity: "invoice_deleted",
      metadata: {
        invoiceId: id,
        invoiceNumber: existing.invoiceNumber,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
