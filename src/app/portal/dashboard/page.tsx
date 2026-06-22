import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate, projectStatusLabels, projectStatusColors } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { Folder, Clock, CurrencyDollar } from "@phosphor-icons/react/dist/ssr";

async function getClientProjects(userId: string) {
  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      projects: {
        where: { deletedAt: null },
        include: {
          manager: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        where: { status: { in: ["UNPAID", "OVERDUE", "DRAFT"] } },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  return client;
}

export default async function PortalDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN" || session.user.role === "PROJECT_MANAGER") {
    redirect("/dashboard");
  }

  const clientData = await getClientProjects(session.user.id);

  if (!clientData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dasbor</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang, {session.user.name}
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Akun Anda belum terhubung dengan data klien.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Hubungi tim kami untuk mengaktifkan akses portal.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeProjects = clientData.projects.filter(
    (p) => p.status !== "COMPLETED" && p.status !== "ARCHIVED"
  );
  const completedProjects = clientData.projects.filter(
    (p) => p.status === "COMPLETED"
  );
  const pendingInvoices = clientData.invoices;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-emerald-950/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1>Dasbor</h1><p className="mt-2 text-muted-foreground">Selamat datang, {session.user.name} dari {clientData.companyName}</p></div>
        <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">Portal client</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Proyek Aktif"
          value={activeProjects.length}
          icon={Folder}
        />
        <StatCard
          title="Proyek Selesai"
          value={completedProjects.length}
          icon={Folder}
        />
        <StatCard
          title="Invoice Tertunda"
          value={pendingInvoices.length}
          icon={Clock}
        />
        <StatCard
          title="Jumlah Tertunda"
          value={formatCurrency(
            pendingInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0)
          )}
          icon={CurrencyDollar}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Proyek Aktif</h2>
          <Link href="/portal/projects">
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </Link>
        </div>
        <div className="grid gap-4">
          {activeProjects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Belum ada proyek aktif</p>
              </CardContent>
            </Card>
          ) : (
            activeProjects.slice(0, 3).map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                    <Badge className={projectStatusColors[project.status]}>
                      {projectStatusLabels[project.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div>
                      Manager: <span className="text-foreground">{project.manager?.name}</span>
                    </div>
                    {project.deadline && (
                      <div>
                        Deadline: <span className="text-foreground">
                          {formatDate(project.deadline)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progres</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/portal/projects/${project.id}`}>
                      <Button variant="outline" size="sm">Lihat Detail</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {pendingInvoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Invoice Tertunda</h2>
            <Link href="/portal/invoices">
              <Button variant="outline" size="sm">Lihat Semua</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {pendingInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Jatuh tempo: {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(Number(invoice.amount))}</p>
                      <Badge
                        variant={
                          invoice.status === "OVERDUE"
                            ? "danger"
                            : invoice.status === "DRAFT"
                            ? "secondary"
                            : "warning"
                        }
                      >
                        {invoice.status === "OVERDUE"
                          ? "Terlambat"
                          : invoice.status === "DRAFT"
                          ? "Draf"
                          : invoice.status === "UNPAID"
                          ? "Belum Dibayar"
                          : invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


