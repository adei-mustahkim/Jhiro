import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { PageHeader } from "@/components/shared/page-header";

export default async function EditPortfolioPage({params}:{params:Promise<{id:string}>}){const{id}=await params;const portfolio=await prisma.portfolio.findFirst({where:{id,deletedAt:null}});if(!portfolio)notFound();return <div className="mx-auto max-w-5xl space-y-7"><PageHeader title="Edit portfolio" description="Atur ulang cover, urutan galeri, dan cerita project." backHref="/admin/portfolio"/><PortfolioForm endpoint={`/api/v1/portfolios/${id}`} method="PATCH" returnUrl="/admin/portfolio" submitLabel="Simpan perubahan" initialValues={{name:portfolio.name,description:portfolio.description,technologies:portfolio.technologies.join(", "),projectUrl:portfolio.projectUrl??"",screenshots:portfolio.screenshots}}/></div>}
