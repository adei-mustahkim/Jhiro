'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface InvoiceEditFormProps {
  invoiceId: string
  invoiceNumber: string
  initialValues: {
    amount: string
    description: string
    dueDate: string
    status: string
  }
}

export function InvoiceEditForm({ invoiceId, invoiceNumber, initialValues }: InvoiceEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [values, setValues] = useState(initialValues)
  const [isSaving, setIsSaving] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch(`/api/v1/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(values.amount),
          description: values.description || null,
          dueDate: values.dueDate,
          status: values.status,
        }),
      })
      const payload: unknown = await response.json()
      if (!response.ok) {
        const message =
          typeof payload === 'object' &&
          payload !== null &&
          'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : 'Invoice gagal diperbarui'
        throw new Error(message)
      }
      toast({ title: 'Invoice diperbarui', description: `${invoiceNumber} berhasil disimpan.` })
      router.push('/invoices')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Perubahan gagal disimpan',
        description: error instanceof Error ? error.message : 'Silakan coba kembali.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formattedAmount = values.amount
    ? new Intl.NumberFormat('id-ID').format(Number(values.amount))
    : ''

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-xl border border-emerald-950/10 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nominal"
          id="invoice-amount"
          helper={formattedAmount ? `Rp ${formattedAmount}` : undefined}
        >
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-500">
              Rp
            </span>
            <Input
              id="invoice-amount"
              inputMode="numeric"
              value={values.amount}
              onChange={(event) =>
                setValues({ ...values, amount: event.target.value.replace(/\D/g, '') })
              }
              className="pl-10"
              required
            />
          </div>
        </Field>
        <Field label="Jatuh tempo" id="invoice-due-date">
          <Input
            id="invoice-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
            required
          />
        </Field>
        <Field label="Status pembayaran" id="invoice-status">
          <Select
            value={values.status}
            onValueChange={(status) => setValues({ ...values, status })}
          >
            <SelectTrigger id="invoice-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="UNPAID">Belum dibayar</SelectItem>
              <SelectItem value="PARTIAL">Dibayar sebagian</SelectItem>
              <SelectItem value="PAID">Lunas</SelectItem>
              <SelectItem value="OVERDUE">Terlambat</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field
        label="Keterangan"
        id="invoice-description"
        helper="Jelaskan tujuan atau termin pembayaran secara singkat."
      >
        <Textarea
          id="invoice-description"
          rows={4}
          maxLength={500}
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </Field>
      <div className="flex justify-end gap-3 border-t border-emerald-950/10 pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" loading={isSaving}>
          Simpan perubahan
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  id,
  helper,
  children,
}: {
  label: string
  id: string
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  )
}
