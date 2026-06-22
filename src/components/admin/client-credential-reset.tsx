"use client";

import { useState } from "react";
import { Copy, KeyRound, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const random = new Uint32Array(12);
  window.crypto.getRandomValues(random);
  return `Jh!${Array.from(random, (value) => alphabet[value % alphabet.length]).join("")}7`;
}

export function ClientCredentialReset({ clientId, email, hasPassword }: { clientId: string; email: string; hasPassword: boolean }) {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!hasPassword);
  const [isSaved, setIsSaved] = useState(false);

  function preparePassword() {
    setPassword(generatePassword());
    setIsEditing(true);
    setIsSaved(false);
  }

  async function save() {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/clients/${clientId}/credentials`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message = typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string" ? payload.error : "Credential gagal diperbarui";
        throw new Error(message);
      }
      setIsSaved(true);
      toast({ title: "Credential siap", description: "Salin password dan bagikan melalui saluran yang aman." });
    } catch (error) {
      toast({ title: "Credential gagal diperbarui", description: error instanceof Error ? error.message : "Silakan coba kembali.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); toast({ title: `${label} disalin` }); }
    catch { toast({ title: "Tidak dapat menyalin", description: "Salin credential secara manual.", variant: "destructive" }); }
  }

  if (!isEditing) return <Button type="button" variant="outline" className="w-full" onClick={preparePassword}><KeyRound className="mr-2 h-4 w-4" />Reset password client</Button>;

  return <div className="space-y-3 rounded-xl bg-emerald-950/[0.035] p-4"><div><p className="text-xs font-medium text-slate-500">Username</p><div className="mt-1 flex items-center gap-2"><code className="min-w-0 flex-1 break-all text-sm text-emerald-950">{email}</code><Button type="button" variant="ghost" size="icon-sm" onClick={() => void copy(email, "Username")} aria-label="Salin username"><Copy className="h-4 w-4" /></Button></div></div><div><p className="text-xs font-medium text-slate-500">Password baru</p><div className="mt-1 flex items-center gap-2"><Input value={password} onChange={(event) => { setPassword(event.target.value); setIsSaved(false); }} minLength={10} maxLength={72} placeholder="Buat password sementara" className="font-mono" /><Button type="button" variant="outline" size="icon" onClick={preparePassword} aria-label="Buat password otomatis"><RefreshCw className="h-4 w-4" /></Button>{isSaved && <Button type="button" variant="outline" size="icon" onClick={() => void copy(password, "Password")} aria-label="Salin password"><Copy className="h-4 w-4" /></Button>}</div></div><Button type="button" className="w-full" loading={isSaving} disabled={password.length < 10 || isSaved} onClick={() => void save()}>{isSaved ? "Password sudah disimpan" : "Simpan password baru"}</Button>{isSaved && <p className="text-xs leading-5 text-amber-800">Password hanya tersedia di sini. Salin sebelum meninggalkan halaman.</p>}</div>;
}
