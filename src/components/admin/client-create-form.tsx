"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, Eye, EyeOff, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ClientValues {
  name: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  industry: string;
  address: string;
}

interface CreatedAccount {
  id: string;
  companyName: string;
  email: string;
  password: string;
}

const initialValues: ClientValues = { name: "", email: "", password: "", companyName: "", phone: "", industry: "", address: "" };

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const random = new Uint32Array(12);
  window.crypto.getRandomValues(random);
  const body = Array.from(random, (value) => alphabet[value % alphabet.length]).join("");
  return `Jh!${body}7`;
}

export function ClientCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<CreatedAccount | null>(null);

  useEffect(() => {
    setValues((current) => current.password ? current : { ...current, password: generatePassword() });
  }, []);

  function set(key: keyof ClientValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} disalin`, description: "Siap dibagikan kepada client melalui saluran yang aman." });
    } catch {
      toast({ title: "Tidak dapat menyalin", description: "Salin teks secara manual dari kolom credential.", variant: "destructive" });
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : "Client gagal dibuat";
        throw new Error(message);
      }
      if (typeof payload !== "object" || payload === null || !("id" in payload) || typeof payload.id !== "string") throw new Error("Respons server tidak valid");
      setCreatedAccount({ id: payload.id, companyName: values.companyName, email: values.email, password: values.password });
      toast({ title: "Akun client siap", description: "Salin credential sebelum meninggalkan halaman ini." });
      router.refresh();
    } catch (error) {
      toast({ title: "Client gagal dibuat", description: error instanceof Error ? error.message : "Silakan coba kembali.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  if (createdAccount) {
    return (
      <section className="rounded-2xl border border-emerald-950/10 bg-white p-6 sm:p-8" aria-labelledby="account-ready-title">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <h2 id="account-ready-title" className="text-xl font-semibold text-emerald-950">Akun client siap digunakan</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Bagikan credential berikut kepada {createdAccount.companyName}. Password hanya ditampilkan pada halaman ini.</p>
          </div>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <Credential label="Username (email)" value={createdAccount.email} onCopy={() => void copy(createdAccount.email, "Username")} />
          <Credential label="Password sementara" value={createdAccount.password} onCopy={() => void copy(createdAccount.password, "Password")} />
        </div>
        <div className="mt-5 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          Minta client mengganti password melalui menu Profile setelah login pertama.
        </div>
        <div className="mt-7 flex justify-end">
          <Button onClick={() => router.push(`/clients/${createdAccount.id}`)}>Lihat detail client</Button>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-7 rounded-2xl border border-emerald-950/10 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama PIC" id="name"><Input id="name" value={values.name} onChange={(event) => set("name", event.target.value)} required placeholder="Nama lengkap" /></Field>
        <Field label="Email / username" id="email" helper="Email ini digunakan client untuk login."><Input id="email" type="email" value={values.email} onChange={(event) => set("email", event.target.value)} required placeholder="nama@perusahaan.com" autoComplete="off" /></Field>
        <Field label="Nama perusahaan" id="company"><Input id="company" value={values.companyName} onChange={(event) => set("companyName", event.target.value)} required placeholder="Nama perusahaan" /></Field>
        <Field label="Telepon" id="phone"><Input id="phone" value={values.phone} onChange={(event) => set("phone", event.target.value)} placeholder="+62" /></Field>
        <Field label="Industri" id="industry"><Input id="industry" value={values.industry} onChange={(event) => set("industry", event.target.value)} placeholder="Teknologi, retail, properti..." /></Field>
      </div>

      <div className="rounded-xl bg-emerald-950/[0.035] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field label="Password sementara" id="password" helper="Dibuat otomatis. Minimal 10 karakter.">
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={values.password} onChange={(event) => set("password", event.target.value)} minLength={10} maxLength={72} required autoComplete="new-password" className="pr-11 font-mono" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-slate-500 hover:text-emerald-800" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Button type="button" variant="outline" className="shrink-0" onClick={() => { set("password", generatePassword()); setShowPassword(true); }}>
            <RefreshCw className="mr-2 h-4 w-4" />Buat ulang
          </Button>
        </div>
      </div>

      <Field label="Alamat" id="address"><Textarea id="address" value={values.address} onChange={(event) => set("address", event.target.value)} rows={3} placeholder="Alamat perusahaan" /></Field>
      <div className="flex justify-end gap-3 border-t border-emerald-950/10 pt-6"><Button type="button" variant="ghost" onClick={() => router.back()}>Batal</Button><Button type="submit" loading={isSaving}>Buat client & akun</Button></div>
    </form>
  );
}

function Field({ label, id, helper, children }: { label: string; id: string; helper?: string; children: React.ReactNode }) {
  return <div className="min-w-0 flex-1 space-y-2"><Label htmlFor={id}>{label}</Label>{children}{helper && <p className="text-xs text-slate-500">{helper}</p>}</div>;
}

function Credential({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return <div className="rounded-xl border border-emerald-950/10 bg-background p-4"><p className="text-xs font-medium text-slate-500">{label}</p><div className="mt-2 flex items-center gap-3"><code className="min-w-0 flex-1 break-all text-sm font-semibold text-emerald-950">{value}</code><Button type="button" variant="outline" size="icon" onClick={onCopy} aria-label={`Salin ${label}`}><Copy className="h-4 w-4" /></Button></div></div>;
}
