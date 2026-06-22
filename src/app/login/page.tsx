"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(error === "CredentialsSignin" ? "Email atau password salah." : null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setErrorMessage("Email atau password salah. Periksa kembali data login Anda.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("Login belum berhasil. Periksa koneksi lalu coba kembali.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {errorMessage && (
        <div className="flex gap-3 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800" role="alert">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-slate-800">Email</Label>
        <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="nama@perusahaan.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isLoading} className="h-12 border-slate-300 bg-white px-4 text-slate-950 placeholder:text-slate-500 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 disabled:bg-slate-50 disabled:opacity-100" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password" className="text-sm font-semibold text-slate-800">Password</Label>
          <Link href="/forgot-password" className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:text-emerald-900 hover:underline">Lupa password?</Link>
        </div>
        <div className="relative">
          <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Masukkan password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={isLoading} className="h-12 border-slate-300 bg-white px-4 pr-12 text-slate-950 placeholder:text-slate-500 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20 disabled:bg-slate-50 disabled:opacity-100" />
          <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-slate-600 transition-colors hover:text-emerald-800 focus-visible:ring-inset" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full bg-emerald-700 text-white shadow-none hover:bg-emerald-800" disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memeriksa akun...</> : <>Masuk ke workspace<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>

      <p className="text-center text-sm text-slate-600">Belum memiliki akun? <Link href="/contact" className="font-semibold text-emerald-700 underline-offset-4 hover:text-emerald-900 hover:underline">Hubungi kami</Link></p>
    </form>
  );
}

function LoginFormFallback() {
  return <div className="mt-8 grid min-h-72 place-items-center rounded-xl bg-slate-50" role="status"><div className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-700" /><p className="mt-3 text-sm text-slate-600">Menyiapkan halaman login...</p></div></div>;
}

export default function LoginPage() {
  return (
    <main id="main-content" className="relative min-h-dvh overflow-hidden bg-emerald-50/30 px-4 py-6 sm:px-6 sm:py-10 lg:grid lg:place-items-center">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_-45px_rgba(6,78,59,0.55)] lg:min-h-[700px] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden="true" />
          <BrandMark size="lg" showTagline className="relative" textClassName="[&>span:first-child]:text-white [&>span:last-child]:text-emerald-200" />
          <div className="relative max-w-lg">
            <p className="text-sm font-semibold text-emerald-300">Jhiro Workspace</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.035em] text-white">Satu ruang kerja untuk project, revisi, file, dan invoice.</h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-7 text-emerald-100">Pantau pekerjaan dengan konteks yang utuh dan komunikasi yang terhubung antara tim Jhiro dan client.</p>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-emerald-100"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-800"><ShieldCheck className="h-4 w-4" /></span><span>Akses aman sesuai peran dan kepemilikan project.</span></div>
        </section>

        <section className="flex flex-col justify-center px-6 py-8 sm:px-12 sm:py-12 lg:px-14">
          <div className="mb-10 lg:hidden"><BrandMark size="lg" showTagline /></div>
          <div className="w-full max-w-md self-center">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Selamat datang kembali</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-emerald-950">Masuk ke akun Anda</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Gunakan email dan password yang terdaftar untuk melanjutkan.</p>
            </div>
            <Suspense fallback={<LoginFormFallback />}><LoginForm /></Suspense>

            {process.env.NODE_ENV === "development" && (
              <details className="mt-8 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <summary className="cursor-pointer font-semibold text-slate-800">Akun demo development</summary>
                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-xs leading-5">
                  <p><strong>Admin:</strong> admin@jhiro.id / admin123</p>
                  <p><strong>PM:</strong> ahmad@jhiro.id / pm123456</p>
                  <p><strong>Client:</strong> budi@techvision.co.id / client123</p>
                </div>
              </details>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
