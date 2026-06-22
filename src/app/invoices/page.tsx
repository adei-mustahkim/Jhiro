import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { InvoiceStatus } from '@prisma/client'
import {
  formatCurrency,
  formatDate,
  invoiceStatusLabels,
  invoiceStatusColors,
  isOverdue,
} from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Receipt, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import { RecordActions } from '@/components/admin/record-actions'

async function getInvoices(search?: string, status?: string) {
  const invoices = await prisma.invoice.findMany({
    where: {
      ...(status && status !== 'all' && { status: status as InvoiceStatus }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { client: { companyName: { contains: search, mode: 'insensitive' } } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      client: {
        select: { companyName: true },
      },
      project: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return invoices
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
    redirect('/portal/dashboard')
  }

  const { q, status } = await searchParams
  const invoices = await getInvoices(q, status)

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const paidAmount = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + Number(inv.amount), 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="mt-1 text-muted-foreground">Kelola semua invoice dan pembayaran</p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Invoice
          </Button>
        </Link>
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
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            <div className="text-sm text-muted-foreground">Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" placeholder="Cari invoice..." defaultValue={q} className="pl-10" />
            </div>
            <Select name="status" defaultValue={status || 'all'}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.entries(invoiceStatusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            {(q || status) && (
              <Link href="/invoices">
                <Button variant="ghost">Reset</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-8 text-center">
              <Receipt className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada invoice</p>
              <Link href="/invoices/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Invoice Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">Invoice</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                    <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">
                      Project
                    </th>
                    <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">
                      Keterangan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Jumlah</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Jatuh Tempo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{invoice.client.companyName}</td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                        {invoice.project?.name || '-'}
                      </td>
                      <td
                        className="hidden max-w-[260px] truncate px-4 py-3 text-sm text-muted-foreground lg:table-cell"
                        title={invoice.description || undefined}
                      >
                        {invoice.description || '-'}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(Number(invoice.amount))}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={
                            isOverdue(invoice.dueDate) && invoice.status !== 'PAID'
                              ? 'text-red-600'
                              : ''
                          }
                        >
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
                          <RecordActions
                            viewUrl={`/invoices/${invoice.id}/edit`}
                            endpoint={`/api/v1/invoices/${invoice.id}`}
                            recordName={invoice.invoiceNumber}
                            canDelete={session.user.role === 'SUPER_ADMIN'}
                          />
                          <Link href={`/invoices/${invoice.id}?print=true`} target="_blank">
                            <Button variant="ghost" size="icon" title="Cetak / Simpan ke PDF">
                              <Download className="h-4 w-4" />
                            </Button>
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
  )
}
