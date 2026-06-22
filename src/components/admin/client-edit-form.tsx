"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Pencil, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ClientEditValues {
  name: string;
  email: string;
  companyName: string;
  phone: string;
  industry: string;
  address: string;
  notes: string;
  isActive: boolean;
}

interface ClientEditFormProps {
  clientId: string;
  initialValues: ClientEditValues;
}

export function ClientEditForm({ clientId, initialValues }: ClientEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState(initialValues);

  function setValue<Key extends keyof ClientEditValues>(key: Key, value: ClientEditValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function cancel() {
    setValues(initialValues);
    setIsEditing(false);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : "Client gagal diperbarui";
        throw new Error(message);
      }
      toast({ title: "Data client diperbarui", description: "Profil dan status akses berhasil disimpan." });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Perubahan gagal disimpan", description: error instanceof Error ? error.message : "Silakan coba kembali.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-950/[0.035] p-4">
        <div className="flex min-w-0 items-center gap-3">
          {values.isActive ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" /> : <XCircle className="h-5 w-5 shrink-0 text-slate-500" />}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-950">Akses {values.isActive ? "aktif" : "nonaktif"}</p>
            <p className="truncate text-xs text-slate-600">{values.name} · {values.email}</p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit data</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" aria-label="Edit data client">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama PIC" id="client-name"><Input id="client-name" value={values.name} onChange={(event) => setValue("name", event.target.value)} required /></Field>
        <Field label="Email / username" id="client-email"><Input id="client-email" type="email" value={values.email} onChange={(event) => setValue("email", event.target.value)} required /></Field>
        <Field label="Nama perusahaan" id="client-company"><Input id="client-company" value={values.companyName} onChange={(event) => setValue("companyName", event.target.value)} required /></Field>
        <Field label="Telepon" id="client-phone"><Input id="client-phone" value={values.phone} onChange={(event) => setValue("phone", event.target.value)} /></Field>
        <Field label="Industri" id="client-industry"><Input id="client-industry" value={values.industry} onChange={(event) => setValue("industry", event.target.value)} /></Field>
      </div>
      <Field label="Alamat" id="client-address"><Textarea id="client-address" rows={3} value={values.address} onChange={(event) => setValue("address", event.target.value)} /></Field>
      <Field label="Catatan internal" id="client-notes"><Textarea id="client-notes" rows={3} maxLength={1000} value={values.notes} onChange={(event) => setValue("notes", event.target.value)} placeholder="Catatan hanya terlihat oleh tim internal." /></Field>
      <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-950/[0.035] p-4">
        <div>
          <Label htmlFor="client-access">Akses portal client</Label>
          <p className="mt-1 text-xs leading-5 text-slate-600">Jika dinonaktifkan, client tidak dapat login sampai akses diaktifkan kembali.</p>
        </div>
        <Switch id="client-access" checked={values.isActive} onCheckedChange={(checked) => setValue("isActive", checked)} aria-label="Aktifkan akses portal client" />
      </div>
      <div className="flex justify-end gap-3 border-t border-emerald-950/10 pt-5">
        <Button type="button" variant="ghost" onClick={cancel} disabled={isSaving}>Batal</Button>
        <Button type="submit" loading={isSaving}>Simpan perubahan</Button>
      </div>
    </form>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
