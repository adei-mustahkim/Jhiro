"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import Link from "next/link";
import type { CMSFieldConfig } from "@/lib/cms-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AssetUpload } from "@/components/admin/asset-upload";

interface CMSEditorProps {
  slug: string;
  title: string;
  description: string;
  fields: CMSFieldConfig[];
  initialValues: Record<string, string>;
}

export function CMSEditor({ slug, title, description, fields, initialValues }: CMSEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setIsSaved(false);
    try {
      const response = await fetch(`/api/v1/cms/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : "Konten gagal disimpan";
        throw new Error(message);
      }
      setIsSaved(true);
      router.refresh();
      toast({ title: "Konten tersimpan", description: "Perubahan CMS berhasil diterapkan." });
    } catch (error) {
      toast({ title: "Konten gagal disimpan", description: error instanceof Error ? error.message : "Silakan coba kembali.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><h1>{title}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{description}</p></div>
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/cms"><Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />Kembali ke CMS</Button></Link>
            <a href="/" target="_blank" rel="noreferrer"><Button variant="outline">Lihat website</Button></a>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-6 rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-[0_14px_35px_-28px_rgba(6,78,59,0.35)] sm:p-8">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.upload ? (
                <AssetUpload value={values[field.key] ?? ""} onChange={(value) => { setValues((current) => ({ ...current, [field.key]: value })); setIsSaved(false); }} kind={field.upload} label={field.placeholder} />
              ) : field.multiline ? (
                <Textarea id={field.key} rows={field.key === "headline" ? 3 : 5} value={values[field.key] ?? ""} placeholder={field.placeholder} onChange={(event) => { setValues((current) => ({ ...current, [field.key]: event.target.value })); setIsSaved(false); }} />
              ) : (
                <Input id={field.key} value={values[field.key] ?? ""} placeholder={field.placeholder} onChange={(event) => { setValues((current) => ({ ...current, [field.key]: event.target.value })); setIsSaved(false); }} />
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 border-t border-emerald-950/10 pt-6">
            <Button type="submit" loading={isSaving}>Simpan perubahan</Button>
            {isSaved && <span className="inline-flex items-center gap-2 text-sm text-emerald-700"><CheckCircle className="h-4 w-4" weight="fill" />Tersimpan</span>}
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-emerald-950/10 bg-emerald-950/[0.035] p-5">
          <p className="text-sm font-semibold text-emerald-950">Sebelum menyimpan</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-500"><li>Gunakan bahasa yang ringkas dan spesifik.</li><li>Perubahan diterapkan pada konten locale Indonesia.</li><li>Buka website setelah menyimpan untuk memeriksa hasilnya.</li></ul>
        </aside>
      </form>
    </div>
  );
}
