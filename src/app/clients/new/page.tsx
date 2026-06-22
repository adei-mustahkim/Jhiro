import { ClientCreateForm } from "@/components/admin/client-create-form";
import { PageHeader } from "@/components/shared/page-header";
export default function NewClientPage(){return <div className="mx-auto max-w-4xl space-y-7"><PageHeader title="Tambah client" description="Buat profil perusahaan dan akun client baru." backHref="/clients"/><ClientCreateForm/></div>}
