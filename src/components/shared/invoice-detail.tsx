"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Landmark, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate, invoiceStatusLabels, invoiceStatusColors } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InvoiceDetailProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    amount: number;
    description: string | null;
    dueDate: Date | string;
    status: string;
    createdAt: Date | string;
    client: {
      companyName: string;
      phone: string | null;
      address: string | null;
      user: {
        name: string;
        email: string;
      };
    };
    project?: {
      name: string;
    } | null;
  };
  branding: Record<string, string>;
  contact: Record<string, string>;
  footer: Record<string, string>;
  backUrl: string;
  autoPrint?: boolean;
}

export function InvoiceDetail({
  invoice,
  branding,
  contact,
  footer,
  backUrl,
  autoPrint = false,
}: InvoiceDetailProps) {
  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const brandName = branding.name || "Nama bisnis belum diatur";
  const brandTagline = branding.tagline || "";
  const brandEmail = contact.email || footer.email || "";
  const brandPhone = contact.phone || footer.phone || "";
  const brandAddress = contact.location || contact.address || footer.location || footer.address || "";
  const bankName = contact.bankName || footer.bankName || "";
  const bankAccount = contact.bankAccount || footer.bankAccount || "";
  const bankAccountName = contact.bankAccountName || footer.bankAccountName || "";
  const hasPaymentAccount = Boolean(bankName && bankAccount && bankAccountName);
  const hasTaxRate = typeof contact.invoiceTaxRate === "string" && contact.invoiceTaxRate.trim() !== "";
  const parsedTaxRate = Number(contact.invoiceTaxRate || 0);
  const taxRate = Number.isFinite(parsedTaxRate) ? Math.min(Math.max(parsedTaxRate, 0), 100) : 0;
  const subtotal = invoice.amount;
  const taxAmount = subtotal * taxRate / 100;
  const totalAmount = subtotal + taxAmount;
  const paymentNote = contact.invoicePaymentNote || "";
  const footerNote = contact.invoiceFooter || footer.description || "";

  return (
    <div className="mx-auto max-w-4xl space-y-5 print:my-0 print:mx-auto print:max-w-none print:p-0">
      {/* Inline styles for A4 page breaking constraints */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.2cm 1.5cm;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          /* Ensure everything fits on exactly 1 page */
          html, body, .workspace-main {
            height: auto !important;
            overflow: visible !important;
          }
          .print-hidden-element {
            display: none !important;
          }
        }
      `}</style>

      {/* Action Buttons - Hidden when printing */}
      <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
        <Link href={backUrl}>
          <Button variant="ghost" className="text-emerald-800 hover:text-emerald-950 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </Link>
        <Button onClick={() => window.print()} className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium shadow-sm transition-all duration-200">
          <Printer className="h-4 w-4 mr-2" />
          Cetak / Unduh PDF
        </Button>
      </div>

      {/* Invoice Sheet */}
      <div className="rounded-2xl border border-emerald-950/10 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] print:rounded-none print:border-none print:p-0 print:shadow-none print-no-break">
        
        {/* Top Header Grid */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-100">
          <div className="space-y-2.5">
            {/* Branding Logo & Name */}
            <div className="flex items-center gap-2.5">
              {branding.logoUrl ? (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-white rounded-lg border border-emerald-950/10">
                  <img src={branding.logoUrl} alt="" className="h-full w-full object-contain" />
                </span>
              ) : (
                <span className="grid h-9 w-9 shrink-0 place-items-center bg-emerald-950 font-semibold text-white rounded-lg text-sm">
                  {brandName.charAt(0)}
                </span>
              )}
              <div className="leading-none">
                <span className="block font-bold tracking-tight text-emerald-950 text-base">{brandName}</span>
                {brandTagline && <span className="mt-0.5 block text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{brandTagline}</span>}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed font-medium">
              {brandAddress || "Lokasi bisnis belum diatur di CMS"}
            </p>
          </div>

          <div className="text-right space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-emerald-950">INVOICE</h1>
            <p className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">{invoice.invoiceNumber}</p>
          </div>
        </div>

        {/* 4-Column Metadata Summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-5 my-4 bg-slate-50/60 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tanggal Tagihan</span>
            <span className="mt-1 block font-semibold text-slate-700">{formatDate(invoice.createdAt)}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Jatuh Tempo</span>
            <span className="mt-1 block font-semibold text-slate-700">{formatDate(invoice.dueDate)}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">ID Tagihan</span>
            <span className="mt-1 block font-mono font-semibold text-slate-500 truncate" title={invoice.id}>{invoice.id.slice(0, 8)}...</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Pembayaran</span>
            <span className="mt-1 block">
              <Badge className={`text-[10px] font-semibold px-2 py-0 h-5 border shadow-none ${invoiceStatusColors[invoice.status] || "bg-slate-100 text-slate-700"}`}>
                {invoiceStatusLabels[invoice.status] || invoice.status}
              </Badge>
            </span>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid md:grid-cols-2 gap-6 py-4 border-b border-slate-100 text-xs">
          {/* Bill From */}
           <div className="p-4 rounded-xl border border-slate-50 bg-emerald-50/20">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 mb-2">Pemberi Tagihan (Bill From)</h3>
            <div className="space-y-1 text-slate-600">
              <p className="font-bold text-slate-800 text-sm">{brandName}</p>
              {brandAddress && <p className="leading-relaxed">{brandAddress}</p>}
              <div className="pt-1.5 space-y-0.5">
                {brandEmail && <p>Email: <span className="font-medium text-slate-800">{brandEmail}</span></p>}
                {brandPhone && <p>Telp: <span className="font-medium text-slate-800">{brandPhone}</span></p>}
                {!brandEmail && !brandPhone && <p className="text-amber-700">Kontak penerbit belum diatur di CMS.</p>}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="p-4 rounded-xl border border-slate-100 bg-white">
            <h3 className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 mb-2">Penerima Tagihan (Bill To)</h3>
            <div className="space-y-1 text-slate-600">
              <p className="font-bold text-slate-800 text-sm">{invoice.client.companyName}</p>
              <p className="font-medium">{invoice.client.user.name}</p>
              {invoice.client.address && (
                <p className="leading-relaxed text-slate-500">{invoice.client.address}</p>
              )}
              <div className="pt-1.5 space-y-0.5">
                <p>Email: <span className="font-medium text-slate-800">{invoice.client.user.email}</span></p>
                {invoice.client.phone && (
                  <p>Telp: <span className="font-medium text-slate-800">{invoice.client.phone}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Context Summary */}
        {invoice.project && (
          <div className="py-2.5 px-4 my-4 bg-emerald-50/35 rounded-lg border border-emerald-950/5 text-xs text-slate-600 flex items-center gap-2">
            <span className="font-bold text-emerald-800 uppercase text-[9px] tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded">Proyek</span>
            <span className="font-medium">{invoice.project.name}</span>
          </div>
        )}

        {/* Itemized Table */}
        <div className="py-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-2">Deskripsi Layanan / Item</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 pr-4 align-top max-w-lg">
                  <p className="font-bold text-slate-800 text-sm">
                    {invoice.project ? `Pengembangan Proyek: ${invoice.project.name}` : "Layanan Pengembangan Produk Digital"}
                  </p>
                  {invoice.description && (
                    <p className="mt-1 text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
                      {invoice.description}
                    </p>
                  )}
                </td>
                <td className="py-3.5 text-right font-bold text-slate-800 text-sm align-top">
                  {formatCurrency(subtotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Section */}
        <div className="grid md:grid-cols-5 gap-6 pt-5 border-t border-slate-100 text-xs">
          {/* Payment Info */}
          <div className="md:col-span-3 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100/60">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5 text-emerald-700" />
              Petunjuk Pembayaran Transfer
            </h4>
            <div className="text-[11px] text-slate-500 leading-relaxed font-medium space-y-1">
              {hasPaymentAccount ? <><p>Mohon selesaikan transfer ke rekening resmi:</p><div className="bg-white p-2 rounded-lg border border-slate-100 mt-1 space-y-0.5"><p>Bank: <span className="font-bold text-slate-800">{bankName}</span></p><p>No. Rekening: <span className="font-bold font-mono text-emerald-900 text-xs">{bankAccount}</span></p><p>Atas Nama: <span className="font-bold text-slate-800">{bankAccountName}</span></p></div><p className="text-[10px] text-amber-700 pt-1 flex items-center gap-1 font-semibold"><CheckCircle2 className="h-3 w-3 shrink-0" />{paymentNote || `Sertakan berita transfer: ${invoice.invoiceNumber}`}</p></>:<p className="rounded-lg bg-amber-50 p-3 text-amber-800">Rekening pembayaran belum diatur pada CMS → Informasi kontak.</p>}
            </div>
          </div>

          {/* Subtotal & Final Total */}
          <div className="md:col-span-2 space-y-2 text-right self-end">
            <div className="flex justify-between text-slate-500 font-medium px-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-medium px-1">
              <span>{hasTaxRate ? `Pajak (${taxRate}%):` : "Pajak (belum diatur):"}</span>
              <span>{hasTaxRate ? formatCurrency(taxAmount) : "—"}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 px-1 text-sm bg-emerald-50/50 py-1.5 rounded-lg border border-emerald-950/5">
              <span className="pl-2">Total Tagihan:</span>
              <span className="text-emerald-900 pr-2">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center text-[10px] text-slate-400 font-medium border-t border-slate-100 mt-8">
          {footerNote && <p>{footerNote}</p>}
          {brandEmail && <p className="mt-0.5">Pertanyaan terkait invoice dapat dikirim ke {brandEmail}.</p>}
        </div>
      </div>
    </div>
  );
}
