"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AssetUpload } from "@/components/admin/asset-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CaseStudyData {
  id: string;
  title: string;
  slug: string;
  problem: string;
  solution: string;
  result: string;
  screenshots: string[];
  createdAt: string;
  deletedAt: string | null;
  seoMeta?: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string | null;
  };
}

export default function CaseStudyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [caseStudy, setCaseStudy] = useState<CaseStudyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    problem: "",
    solution: "",
    result: "",
    screenshots: [] as string[],
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    async function loadCaseStudy() {
      const { id } = await params;
      try {
        const response = await fetch(`/api/v1/case-studies/${id}`);
        if (!response.ok) {
          throw new Error("Case study not found");
        }
        const data = await response.json();
        setCaseStudy(data);
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          problem: data.problem || "",
          solution: data.solution || "",
          result: data.result || "",
          screenshots: data.screenshots || [],
          metaTitle: data.seoMeta?.metaTitle || "",
          metaDescription: data.seoMeta?.metaDescription || "",
          ogImage: data.seoMeta?.ogImage || "",
        });
      } catch {
        toast({
          title: "Error",
          description: "Case study tidak ditemukan",
          variant: "destructive",
        });
        router.push("/admin/case-study");
      } finally {
        setIsLoading(false);
      }
    }
    loadCaseStudy();
  }, [params, router, toast]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!caseStudy) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/case-studies/${caseStudy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan case study");
      }

      toast({
        title: "Case study disimpan",
        description: "Perubahan berhasil disimpan.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Gagal menyimpan",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!caseStudy) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/case-studies/${caseStudy.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus case study");
      }

      toast({
        title: "Case study dihapus",
        description: "Case study berhasil dihapus.",
      });

      router.push("/admin/case-study");
      router.refresh();
    } catch (error) {
      toast({
        title: "Gagal menghapus",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function addScreenshot(url: string) {
    if (url && !form.screenshots.includes(url)) {
      setForm({ ...form, screenshots: [...form.screenshots, url] });
    }
  }

  function removeScreenshot(index: number) {
    setForm({
      ...form,
      screenshots: form.screenshots.filter((_, i) => i !== index),
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!caseStudy) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Edit Case Study</h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link href="/admin/case-study">
            <Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />Kembali ke Case Study</Button>
          </Link>
            {form.screenshots.length > 0 && (
              <Link
                href={`/case-study/${caseStudy.slug}`}
                target="_blank"
              >
                <Button variant="outline">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Lihat di Website
                </Button>
              </Link>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Hapus</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Case Study?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Case study akan
                    dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  URL: /case-study/{form.slug}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konten Case Study</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problem">Problem / Tantangan *</Label>
              <Textarea
                id="problem"
                value={form.problem}
                onChange={(e) =>
                  setForm({ ...form, problem: e.target.value })
                }
                required
                minLength={10}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solusi *</Label>
              <Textarea
                id="solution"
                value={form.solution}
                onChange={(e) =>
                  setForm({ ...form, solution: e.target.value })
                }
                required
                minLength={10}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Hasil *</Label>
              <Textarea
                id="result"
                value={form.result}
                onChange={(e) =>
                  setForm({ ...form, result: e.target.value })
                }
                required
                minLength={10}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screenshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AssetUpload
              kind="image"
              label="Tambah screenshot project"
              value=""
              onChange={(url) => {
                if (url) addScreenshot(url);
              }}
            />

            {form.screenshots.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-3">
                {form.screenshots.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-xl border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Screenshot ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.screenshots.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Tambahkan screenshot untuk menampilkan case study di halaman
                publik.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO (Opsional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={form.metaTitle}
                  onChange={(e) =>
                    setForm({ ...form, metaTitle: e.target.value })
                  }
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image</Label>
                <AssetUpload
                  kind="image"
                  label="Gambar untuk Open Graph"
                  value={form.ogImage}
                  onChange={(url) => setForm({ ...form, ogImage: url })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(e) =>
                  setForm({ ...form, metaDescription: e.target.value })
                }
                maxLength={200}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/case-study">
            <Button type="button" variant="ghost">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}



