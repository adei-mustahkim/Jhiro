import { notFound, redirect } from 'next/navigation'
import { InvoiceEditForm } from '@/components/admin/invoice-edit-form'
import { PageHeader } from '@/components/shared/page-header'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
    redirect('/portal/dashboard')
  }

  const { id } = await params
  const invoice = await prisma.invoice.findUnique({ where: { id } })
  if (!invoice) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PageHeader
        title="Edit invoice"
        description={`Perbarui nominal, jatuh tempo, status, dan keterangan ${invoice.invoiceNumber}.`}
        backHref="/invoices"
        backLabel="Kembali ke invoice"
      />
      <InvoiceEditForm
        invoiceId={invoice.id}
        invoiceNumber={invoice.invoiceNumber}
        initialValues={{
          amount: invoice.amount.toString(),
          description: invoice.description ?? '',
          dueDate: invoice.dueDate.toISOString().slice(0, 10),
          status: invoice.status,
        }}
      />
    </div>
  )
}
