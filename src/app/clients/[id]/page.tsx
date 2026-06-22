import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Envelope, Folder, Phone } from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, projectStatusLabels } from "@/lib/utils";
import { ClientCredentialReset } from "@/components/admin/client-credential-reset";
import { ClientEditForm } from "@/components/admin/client-edit-form";
import { PageHeader } from "@/components/shared/page-header";

interface ClientDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetail({ params }: ClientDetailProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  const { id } = await params;

  const client = await prisma.client.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: true,
      projects: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="space-y-7">
      <PageHeader title={client.companyName} description="Profil klien dan proyek yang terhubung." backHref="/clients" backLabel="Kembali ke klien" />

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi klien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Info icon={Envelope} label="Email" value={client.user.email} />
              <Info icon={Phone} label="Telepon" value={client.phone || "Belum diisi"} />
              <div>
                <p className="text-xs text-muted-foreground">Industri</p>
                <p className="mt-1 text-sm font-medium">{client.industry || "Belum diisi"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bergabung</p>
                <p className="mt-1 text-sm font-medium">{formatDate(client.createdAt)}</p>
              </div>
              <div className="border-t border-emerald-950/10 pt-5">
                <p className="mb-3 text-sm font-semibold text-emerald-950">Akses portal</p>
                <ClientCredentialReset
                  clientId={client.id}
                  email={client.user.email}
                  hasPassword={Boolean(client.user.passwordHash)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit data & status</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientEditForm
                clientId={client.id}
                initialValues={{
                  name: client.user.name,
                  email: client.user.email,
                  companyName: client.companyName,
                  phone: client.phone || "",
                  industry: client.industry || "",
                  address: client.address || "",
                  notes: client.notes || "",
                  isActive: client.user.isActive,
                }}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Proyek</CardTitle>
            <Badge variant="outline">{client.projects.length} proyek</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {client.projects.length === 0 ? (
              <div className="p-8 text-center">
                <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Belum ada proyek</p>
              </div>
            ) : (
              <div className="divide-y">
                {client.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {projectStatusLabels[project.status as keyof typeof projectStatusLabels] || project.status}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {project.progress}%
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Envelope; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-emerald-700" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}



