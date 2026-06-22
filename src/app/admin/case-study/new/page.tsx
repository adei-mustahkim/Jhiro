"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AssetUpload } from "@/components/admin/asset-upload";

export default function CaseStudyNewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/v1/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat case study");
      }

      toast({
        title: "Case study dibuat",
        description: "Case study berhasil dibuat dan siap diedit.",
      });

      router.push(`/admin/case-study/${data.id}/edit`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Gagal membuat case study",
        description: error instanceof Error ? error.message : "Silakan coba kembali.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  return (
    <div className="space-y-6">
      <PageHeader title="Case Study Baru" description="Tambahkan case study baru untuk menampilkan hasil project." backHref="/admin/case-study" backLabel="Kembali ke Case Study" />

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
                  placeholder="Contoh: Velora Commerce Platform"
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
                  placeholder="velora-commerce (kosongkan untuk auto-generate)"
                />
                <p className="text-xs text-muted-foreground">
                  URL: /case-study/{form.slug || "auto-generate"}
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
                placeholder="Jelaskan masalah atau tantangan yang dihadapi client..."
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
                placeholder="Jelaskan solusi yang kami berikan..."
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
                placeholder="Jelaskan hasil dan dampak dari solusi..."
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
              label="Upload screenshot project"
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
                  placeholder="Judul untuk SEO (kosongkan = judul case study)"
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
                placeholder="Deskripsi singkat untuk SEO..."
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
            {isSaving ? "Menyimpan..." : "Simpan Case Study"}
          </Button>
        </div>
      </form>
    </div>
  );
}

