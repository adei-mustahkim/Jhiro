import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime, projectStatusLabels, projectStatusColors } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  FileText,
  FolderKanban,
  MessageSquare,
  Receipt,
  Upload,
  GitPullRequest,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { ProjectAdminControls } from "@/components/admin/project-admin-controls";
import { ProjectChat } from "@/components/shared/project-chat";
import { ProjectFiles } from "@/components/shared/project-files";
import { ProjectRevisions } from "@/components/shared/project-revisions";

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id, deletedAt: null },
    include: {
      client: {
        select: {
          id: true,
          companyName: true,
          user: { select: { name: true, email: true } },
        },
      },
      manager: {
        select: { id: true, name: true, email: true },
      },
      revisions: {
        include: {
          handler: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      files: {
        include: {
          uploadedBy: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
      changeRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      requirement: true,
      chatThread: { include: { messages: { include: { sender: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: "asc" } } } },
      activityLogs: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
      _count: {
        select: {
          revisions: true,
          files: true,
          changeRequests: true,
        },
      },
    },
  });

  return project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const [clients, managers] = await Promise.all([
    prisma.client.findMany({ where: { deletedAt: null }, select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
    prisma.user.findMany({ where: { role: { in: ["SUPER_ADMIN", "PROJECT_MANAGER"] }, isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge className={projectStatusColors[project.status]}>
                {projectStatusLabels[project.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {project.client.companyName}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Link href="/projects"><Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button></Link>
          <ProjectAdminControls projectId={project.id} initialValues={{name:project.name,description:project.description??"",clientId:project.clientId,managerId:project.managerId??"none",deadline:project.deadline?project.deadline.toISOString().slice(0,10):"",priority:project.priority,status:project.status,progress:project.progress}} clients={clients.map(client=>({id:client.id,label:client.companyName}))} managers={managers.map(manager=>({id:manager.id,label:manager.name}))}/>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-bold">{project.progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revisions">Revisions</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {project.description || "Tidak ada deskripsi"}
                  </p>
                </CardContent>
              </Card>

              {project.requirement && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Business Goals</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.requirement.businessGoals}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Requested Features</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {project.requirement.requestedFeatures}
                      </p>
                    </div>
                    {project.requirement.references && (
                      <div>
                        <h4 className="font-medium mb-2">References</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.requirement.references}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.activityLogs.length === 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="text-sm">Project created</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(project.createdAt)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      project.activityLogs.map((log) => (
                        <div key={log.id} className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{log.user?.name || "System"}</span>{" "}
                              {log.activity.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(log.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revisions" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Revisions ({project.revisions.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-5"><ProjectRevisions projectId={project.id} role="admin" initialRevisions={project.revisions.map(revision=>({id:revision.id,title:revision.title,description:revision.description,priority:revision.priority,status:revision.status,createdAt:revision.createdAt.toISOString(),handlerName:revision.handler?.name}))}/></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Files ({project.files.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-5"><ProjectFiles projectId={project.id} role="admin" initialFiles={project.files.map(file=>({id:file.id,fileName:file.fileName,fileUrl:file.fileUrl,fileSize:file.fileSize,category:file.category,version:file.version,createdAt:file.createdAt.toISOString(),uploadedByName:file.uploadedBy.name}))}/></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Invoices ({project.invoices.length})</CardTitle>
                  <Link href="/invoices"><Button variant="outline" size="sm">Lihat invoices</Button></Link>
                </CardHeader>
                <CardContent className="p-0">
                  {project.invoices.length === 0 ? (
                    <div className="p-6 text-center">
                      <Receipt className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">Belum ada invoice</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {project.invoices.map((invoice) => (
                        <Link href={`/invoices/${invoice.id}`} key={invoice.id} className="p-4 flex items-center justify-between transition-colors hover:bg-emerald-950/[0.025]">
                          <div>
                            <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                            <p className="text-xs text-muted-foreground">
                              Jatuh tempo: {formatDate(invoice.dueDate)}
                            </p>
                          </div>
                          <Badge>{invoice.status}</Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectChat projectId={project.id} currentUserId={session.user.id} initialMessages={(project.chatThread?.messages??[]).map(message=>({id:message.id,message:message.message,createdAt:message.createdAt.toISOString(),sender:message.sender}))}/>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <Link href={`/clients/${project.client.id}`} className="text-sm font-medium text-emerald-800 hover:underline">{project.client.companyName}</Link>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Project Manager</p>
                  <p className="text-sm font-medium">
                    {project.manager?.name || "Belum ditugaskan"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="text-sm font-medium">
                    {project.deadline ? formatDate(project.deadline) : "Belum ditentukan"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Dibuat</p>
                  <p className="text-sm font-medium">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Revisions</span>
                </div>
                <span className="font-medium">{project._count.revisions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Files</span>
                </div>
                <span className="font-medium">{project._count.files}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Invoices</span>
                </div>
                <span className="font-medium">{project.invoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Change Requests</span>
                </div>
                <span className="font-medium">{project._count.changeRequests}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
