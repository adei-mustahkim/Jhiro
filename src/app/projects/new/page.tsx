import prisma from "@/lib/prisma";
import { ProjectCreateForm } from "@/components/admin/project-create-form";
import { PageHeader } from "@/components/shared/page-header";
export default async function NewProjectPage(){const clients=await prisma.client.findMany({where:{deletedAt:null},select:{id:true,companyName:true},orderBy:{companyName:"asc"}});return <div className="mx-auto max-w-5xl space-y-7"><PageHeader title="Buat project" description="Hubungkan project baru dengan client dan tentukan prioritasnya." backHref="/projects"/><ProjectCreateForm clients={clients}/></div>}
