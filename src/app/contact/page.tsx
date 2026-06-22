"use client";

import { useState } from "react";
import { ArrowRight, Envelope, MapPin, Phone } from "@phosphor-icons/react";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/use-site-content";

const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const { contact } = useSiteContent();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const payload: unknown = await response.json();
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Pesan belum dapat dikirim";
        throw new Error(message);
      }
      toast({
        title: "Pesan terkirim",
        description: "Terima kasih. Tim kami akan menghubungi Anda secepatnya.",
      });
      setFormData(initialForm);
    } catch (error) {
      toast({
        title: "Pesan gagal dikirim",
        description: error instanceof Error ? error.message : "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader active="contact" />
      <main id="main-content" className="relative overflow-hidden pb-24 pt-36 sm:pb-32 sm:pt-44">
        <div className="hero-grid absolute inset-0 opacity-50" />
        <div className="absolute -right-48 top-10 h-[32rem] w-[32rem] rounded-full bg-emerald-200/50 blur-3xl" />

        <div className="container-wide relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <section>
            <p className="section-label">Mulai percakapan</p>
            <h1 className="mt-6 max-w-2xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Ceritakan apa yang ingin Anda ubah.
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-7 text-slate-600 sm:text-lg">
              Tidak perlu brief yang sempurna. Tujuan, hambatan, atau ide awal sudah cukup untuk memulai percakapan yang berguna.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-950 p-4 text-white"><p className="text-2xl font-semibold">1 hari</p><p className="mt-1 text-xs leading-5 text-emerald-100/70">Target respons awal</p></div><div className="rounded-xl bg-emerald-100 p-4 text-emerald-950"><p className="text-2xl font-semibold">Tanpa biaya</p><p className="mt-1 text-xs leading-5 text-emerald-800/75">Diskusi pertama</p></div></div>

            <div className="mt-12 space-y-5 border-t border-emerald-950/10 pt-8">
              {[
                [Envelope, "Email", contact.email || "hello@jhiro.id"],
                [Phone, "Telepon", contact.phone || "+62 812 3456 7890"],
                [MapPin, "Lokasi", contact.location || "Jakarta, Indonesia"],
              ].map(([Icon, label, value]) => (
                <div key={String(label)} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-5 w-5" weight="duotone" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">{String(label)}</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">{String(value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-950/10 bg-white p-6 sm:p-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Proyek inquiry
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
                Mari mulai dari konteksnya.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama" id="name">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    placeholder="Nama lengkap"
                  />
                </Field>
                <Field label="Email kerja" id="email">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    placeholder="nama@perusahaan.com"
                  />
                </Field>
                <Field label="Nomor telepon" id="phone">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isLoading}
                    placeholder="+62"
                  />
                </Field>
                <Field label="Perusahaan" id="company">
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    disabled={isLoading}
                    placeholder="Opsional"
                  />
                </Field>
              </div>

              <Field label="Apa yang ingin Anda bangun?" id="message">
                <Textarea
                  id="message"
                  rows={6}
                  minLength={10}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isLoading}
                  placeholder="Ceritakan tujuan, masalah, dan gambaran waktunya..."
                />
              </Field>

              <Button
                type="submit"
                size="xl"
                loading={isLoading}
                className="w-full rounded-xl bg-emerald-950 hover:bg-emerald-900"
              >
                Kirim inquiry
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" weight="bold" />}
              </Button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Dengan mengirim formulir ini, Anda setuju dihubungi terkait kebutuhan proyek.
              </p>
            </form>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

