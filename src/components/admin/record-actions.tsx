'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface RecordActionsProps {
  viewUrl?: string
  endpoint?: string
  recordName: string
  canDelete?: boolean
}

export function RecordActions({
  viewUrl,
  endpoint,
  recordName,
  canDelete = true,
}: RecordActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteRecord() {
    if (!endpoint) return
    setIsDeleting(true)
    try {
      const response = await fetch(endpoint, { method: 'DELETE' })
      const payload: unknown = await response.json()
      if (!response.ok) {
        const message =
          typeof payload === 'object' &&
          payload !== null &&
          'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : 'Data gagal dihapus'
        throw new Error(message)
      }
      setIsOpen(false)
      toast({ title: 'Data dihapus', description: `${recordName} tidak lagi ditampilkan.` })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Data gagal dihapus',
        description: error instanceof Error ? error.message : 'Silakan coba kembali.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {viewUrl && (
        <Link
          href={viewUrl}
          aria-label={`Lihat ${recordName}`}
          title={`Lihat ${recordName}`}
          className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgb(0,0,0,0.04)] transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_2px_8px_rgb(5,150,105,0.12)] hover:-translate-y-0.5"
        >
          <Eye className="h-[15px] w-[15px] transition-transform duration-200 group-hover:scale-110" />
        </Link>
      )}
      {endpoint && canDelete && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              aria-label={`Hapus ${recordName}`}
              title={`Hapus ${recordName}`}
              className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgb(0,0,0,0.04)] transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-[0_2px_8px_rgb(239,68,68,0.12)] hover:-translate-y-0.5"
            >
              <Trash2 className="h-[15px] w-[15px] transition-transform duration-200 group-hover:scale-110" />
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg">Hapus {recordName}?</DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Tindakan ini akan menghapus konten dari daftar admin dan website publik. Data tidak dapat dikembalikan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isDeleting} className="rounded-xl">
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                loading={isDeleting}
                onClick={() => void deleteRecord()}
                className="rounded-xl"
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
