import { PortfolioForm } from "@/components/admin/portfolio-form";
import { PageHeader } from "@/components/shared/page-header";

export default function NewPortfolioPage(){return <div className="mx-auto max-w-5xl space-y-7"><PageHeader title="Tambah portfolio" description="Susun project story dan galeri gambar untuk website." backHref="/admin/portfolio"/><PortfolioForm endpoint="/api/v1/portfolios" returnUrl="/admin/portfolio" submitLabel="Simpan portfolio"/></div>}
