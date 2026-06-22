"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function PasswordChangeForm() {
  const { toast } = useToast();
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (values.newPassword !== values.confirmPassword) {
      toast({ title: "Password tidak cocok", description: "Konfirmasi password baru harus sama.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "password", currentPassword: values.currentPassword, newPassword: values.newPassword }) });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : "Password gagal diperbarui";
        throw new Error(message);
      }
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Password diperbarui", description: "Gunakan password baru saat login berikutnya." });
    } catch (error) {
      toast({ title: "Password gagal diperbarui", description: error instanceof Error ? error.message : "Silakan coba kembali.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return <form onSubmit={submit} className="space-y-4"><Field id="current-password" label="Password saat ini"><Input id="current-password" type="password" value={values.currentPassword} onChange={(event) => setValues({ ...values, currentPassword: event.target.value })} required autoComplete="current-password" /></Field><Field id="new-password" label="Password baru"><Input id="new-password" type="password" minLength={8} maxLength={128} value={values.newPassword} onChange={(event) => setValues({ ...values, newPassword: event.target.value })} required autoComplete="new-password" /></Field><Field id="confirm-password" label="Konfirmasi password baru"><Input id="confirm-password" type="password" minLength={8} maxLength={128} value={values.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} required autoComplete="new-password" /></Field><Button type="submit" className="w-full" loading={isSaving}><KeyRound className="mr-2 h-4 w-4" />Ganti password</Button></form>;
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
