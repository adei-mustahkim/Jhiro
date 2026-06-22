import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSiteContent } from "@/lib/cms-content";
import { InvoiceDetail } from "@/components/shared/invoice-detail";

export default async function AdminInvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  const { id } = await params;
  const { print } = await searchParams;
  const autoPrint = print === "true";

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      project: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const { branding, contact, footer } = await getSiteContent();

  return (
    <div className="py-4">
      <InvoiceDetail
        invoice={{ ...invoice, amount: Number(invoice.amount) }}
        branding={branding}
        contact={contact}
        footer={footer}
        backUrl="/invoices"
        autoPrint={autoPrint}
      />
    </div>
  );
}
