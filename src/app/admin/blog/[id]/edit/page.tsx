import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { RecordCreateForm } from "@/components/admin/record-create-form";
import { PageHeader } from "@/components/shared/page-header";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findFirst({ where: { id, deletedAt: null } });
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <PageHeader title="Edit artikel" description="Perbarui isi, thumbnail, dan status publikasi artikel." backHref="/admin/blog" />
      <RecordCreateForm
        endpoint={`/api/v1/articles/${id}`}
        method="PATCH"
        returnUrl="/admin/blog"
        submitLabel="Simpan perubahan"
        initialValues={{
          thumbnail: article.thumbnail ?? "",
          title: article.title,
          excerpt: article.excerpt ?? "",
          content: article.content,
          category: article.category ?? "",
          tags: article.tags.join(", "),
          status: article.status,
        }}
        fields={[
          { key: "thumbnail", label: "Thumbnail", type: "image", placeholder: "Upload thumbnail artikel" },
          { key: "title", label: "Judul", required: true, placeholder: "Judul artikel" },
          { key: "excerpt", label: "Ringkasan", type: "textarea", placeholder: "Ringkasan singkat" },
          { key: "content", label: "Konten", type: "textarea", required: true, placeholder: "Tulis konten artikel" },
          { key: "category", label: "Kategori", placeholder: "Design, engineering, business..." },
          { key: "tags", label: "Tags", placeholder: "design, product, strategy" },
          { key: "status", label: "Status", type: "select", options: [{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }, { value: "ARCHIVED", label: "Archived" }] },
        ]}
      />
    </div>
  );
}
