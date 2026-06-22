import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate, formatCurrency, projectStatusLabels, projectStatusColors } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Calendar, Clock, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

async function getClientProjects(userId: string) {
  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      projects: {
        where: { deletedAt: null },
        include: {
          manager: { select: { name: true, email: true } },
          _count: {
            select: { revisions: true, files: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return client?.projects || [];
}

export default async function PortalProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN" || session.user.role === "PROJECT_MANAGER") {
    redirect("/dashboard");
  }

  const projects = await getClientProjects(session.user.id);

  const activeProjects = projects.filter(
    (p) => p.status !== "COMPLETED" && p.status !== "ARCHIVED"
  );
  const completedProjects = projects.filter((p) => p.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="text-muted-foreground mt-1">
          Kelola dan pantau semua project Anda
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
              <FolderKanban className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{activeProjects.length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <Clock className="h-8 w-8 text-amber-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{completedProjects.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <FolderKanban className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Project Aktif</h2>
          <div className="grid gap-4">
            {activeProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderKanban className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={projectStatusColors[project.status]}>
                      {projectStatusLabels[project.status]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Manager</p>
                      <p className="text-sm font-medium">
                        {project.manager?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revisi</p>
                      <p className="text-sm font-medium">{project._count.revisions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">File</p>
                      <p className="text-sm font-medium">{project._count.files}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium">
                        {project.deadline ? formatDate(project.deadline) : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/portal/projects/${project.id}`}>
                    <Button variant="outline" className="w-full">
                      Lihat Detail
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Project Selesai</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {completedProjects.map((project) => (
                  <div key={project.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <FolderKanban className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Selesai: {formatDate(project.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={projectStatusColors[project.status]}>
                          {projectStatusLabels[project.status]}
                        </Badge>
                        <Link href={`/portal/projects/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Project</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum memiliki project. Hubungi tim kami untuk memulai project baru.
            </p>
            <Link href="/contact">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Hubungi Kami
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
