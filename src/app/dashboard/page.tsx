import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Overview } from "@/components/admin/overview";
import { StatCard } from "@/components/shared/stat-card";
import { Users, Folder, Receipt, CurrencyDollar } from "@phosphor-icons/react/dist/ssr";

async function getDashboardStats() {
  const [
    totalClients,
    totalProjects,
    activeProjects,
    completedProjects,
    pendingInvoices,
    recentActivity,
    projectManagers,
    totalArticles,
    projectStatusCounts,
  ] = await Promise.all([
    prisma.client.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.project.count({
      where: { status: { not: "COMPLETED" }, deletedAt: null },
    }),
    prisma.project.count({
      where: { status: "COMPLETED", deletedAt: null },
    }),
    prisma.invoice.count({
      where: { status: { in: ["UNPAID", "OVERDUE"] } },
    }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { name: true } },
      },
    }),
    prisma.user.count({
      where: {
        role: { in: ["SUPER_ADMIN", "PROJECT_MANAGER"] },
        isActive: true,
      },
    }),
    prisma.article.count({ where: { deletedAt: null } }),
    prisma.project.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
  ]);

  const paidInvoices = await prisma.invoice.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  });

  return {
    totalClients,
    totalProjects,
    activeProjects,
    completedProjects,
    pendingInvoices,
    recentActivity,
    totalRevenue: paidInvoices._sum.amount || 0,
    projectManagers,
    totalArticles,
    projectStatusCounts,
  };
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-emerald-950/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1>Dasbor</h1><p className="mt-2 text-muted-foreground">Selamat datang kembali, {session.user.name}</p></div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800"><span className="h-2 w-2 rounded-full bg-emerald-500" />Sistem operasional aktif</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Klien"
          value={stats.totalClients}
          subtitle="Total terdaftar"
          icon={Users}
        />
        <StatCard
          title="Proyek Aktif"
          value={stats.activeProjects}
          subtitle={`Total: ${stats.totalProjects} proyek`}
          icon={Folder}
        />
        <StatCard
          title="Invoice Tertunda"
          value={stats.pendingInvoices}
          subtitle="Perlu ditagih"
          icon={Receipt}
        />
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(Number(stats.totalRevenue))}
          subtitle="Dari invoice lunas"
          icon={CurrencyDollar}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ikhtisar Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={stats.projectStatusCounts.map((item) => ({
              name: item.status.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
              value: item._count,
              fill: item.status === "NEW" ? "#059669"
                : item.status === "REQUIREMENT_GATHERING" ? "#10b981"
                : item.status === "DESIGN" ? "#34d399"
                : item.status === "DEVELOPMENT" ? "#047857"
                : item.status === "TESTING" ? "#065f46"
                : item.status === "REVIEW" ? "#064e3b"
                : item.status === "REVISION" ? "#0d9488"
                : item.status === "COMPLETED" ? "#059669"
                : "#6ee7b7",
            }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada aktivitas
                </p>
              ) : (
                stats.recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{log.user?.name || "System"}</span>{" "}
                        <span className="text-muted-foreground">{log.activity}</span>
                        {log.project && (
                          <>
                            {" "}
                            <span className="font-medium">{log.project.name}</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Proyek Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tabular-nums">{stats.completedProjects}</span>
              <Badge variant="success" className="mb-1">Selesai</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Manajer Proyek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tabular-nums">{stats.projectManagers}</span>
              <span className="text-muted-foreground mb-1">aktif</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Artikel Dipublikasikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tabular-nums">{stats.totalArticles}</span>
              <span className="text-muted-foreground mb-1">artikel</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


