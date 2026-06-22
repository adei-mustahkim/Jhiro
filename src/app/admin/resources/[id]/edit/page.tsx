import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { RecordCreateForm } from "@/components/admin/record-create-form";
import { PageHeader } from "@/components/shared/page-header";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <PageHeader title="Edit resource" description="Perbarui file dan informasi resource yang tersedia." backHref="/admin/resources" />
      <RecordCreateForm
        endpoint={`/api/v1/resources/${id}`}
        method="PATCH"
        returnUrl="/admin/resources"
        submitLabel="Simpan perubahan"
        initialValues={{
          fileUrl: resource.fileUrl,
          title: resource.title,
          description: resource.description ?? "",
          type: resource.type,
          category: resource.category ?? "",
        }}
        fields={[
          { key: "fileUrl", label: "File resource", type: "file", required: true, placeholder: "Upload file" },
          { key: "title", label: "Judul", required: true },
          { key: "description", label: "Deskripsi", type: "textarea" },
          { key: "type", label: "Tipe", type: "select", options: [{ value: "TEMPLATE", label: "Template" }, { value: "EBOOK", label: "Ebook" }, { value: "GUIDE", label: "Guide" }, { value: "CHECKLIST", label: "Checklist" }] },
          { key: "category", label: "Kategori", placeholder: "Planning, design..." },
        ]}
      />
    </div>
  );
}
