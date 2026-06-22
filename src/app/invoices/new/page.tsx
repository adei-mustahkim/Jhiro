import prisma from "@/lib/prisma";
import { InvoiceCreateForm } from "@/components/admin/invoice-create-form";
import { PageHeader } from "@/components/shared/page-header";
export default async function NewInvoicePage(){const [clients,projects]=await Promise.all([prisma.client.findMany({where:{deletedAt:null},select:{id:true,companyName:true},orderBy:{companyName:"asc"}}),prisma.project.findMany({where:{deletedAt:null},select:{id:true,name:true,clientId:true},orderBy:{name:"asc"}})]);return <div className="mx-auto max-w-5xl space-y-7"><PageHeader title="Buat invoice" description="Catat tagihan baru dan hubungkan dengan client atau project." backHref="/invoices"/><InvoiceCreateForm clients={clients} projects={projects}/></div>}
