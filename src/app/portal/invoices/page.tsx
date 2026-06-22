import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate, invoiceStatusLabels, invoiceStatusColors, isOverdue } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, Eye, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

async function getClientInvoices(userId: string) {
  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      invoices: {
        include: {
          project: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return client?.invoices || [];
}

export default async function PortalInvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN" || session.user.role === "PROJECT_MANAGER") {
    redirect("/dashboard");
  }

  const invoices = await getClientInvoices(session.user.id);

  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground mt-1">
          Kelola invoice dan histori pembayaran
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{invoices.length}</div>
            <div className="text-sm text-muted-foreground">Total Invoices</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <div className="text-sm text-muted-foreground">Total Amount</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
                <div className="text-sm text-muted-foreground">Paid</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <Clock className="h-8 w-8 text-amber-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-8 text-center">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Belum ada invoice</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Invoice</th>
                    <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Project</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Jumlah</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Jatuh Tempo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                        {invoice.project?.name || "-"}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(Number(invoice.amount))}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={isOverdue(invoice.dueDate) && invoice.status !== "PAID" ? "text-red-600" : ""}>
                          {formatDate(invoice.dueDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={invoiceStatusColors[invoice.status]}>
                          {invoiceStatusLabels[invoice.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/portal/invoices/${invoice.id}`}>
                            <button className="p-2 hover:bg-muted rounded-md" title="Lihat detail invoice">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <Link href={`/portal/invoices/${invoice.id}?print=true`} target="_blank" rel="noopener noreferrer">
                            <button className="p-2 hover:bg-muted rounded-md" title="Cetak / Simpan ke PDF">
                              <Download className="h-4 w-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
