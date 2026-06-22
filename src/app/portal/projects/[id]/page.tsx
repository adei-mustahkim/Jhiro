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
  FileText,
  FolderKanban,
  MessageSquare,
  Upload,
  Clock,
  CheckCircle,
  Plus,
  Download,
  Send,
} from "lucide-react";
import Link from "next/link";
import { ProjectChat } from "@/components/shared/project-chat";
import { ProjectFiles } from "@/components/shared/project-files";
import { ProjectRevisions } from "@/components/shared/project-revisions";

async function getProject(id: string, userId: string) {
  // Verify that the project belongs to the client's user
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!client) {
    return null;
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      clientId: client.id,
      deletedAt: null,
    },
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
      },
      files: {
        include: {
          uploadedBy: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      changeRequests: {
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
      requirement: true,
      chatThread: { include: { messages: { include: { sender: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: "asc" } } } },
    },
  });

  return project;
}

export default async function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SUPER_ADMIN" || session.user.role === "PROJECT_MANAGER") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const project = await getProject(id, session.user.id);

  if (!project) {
    notFound();
  }

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
        <Link href="/portal/projects">
          <Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button>
        </Link>
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
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="revisions" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Revisions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-5"><ProjectRevisions projectId={project.id} role="client" initialRevisions={project.revisions.map(revision=>({id:revision.id,title:revision.title,description:revision.description,priority:revision.priority,status:revision.status,createdAt:revision.createdAt.toISOString(),handlerName:revision.handler?.name}))}/></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-5"><ProjectFiles projectId={project.id} role="client" initialFiles={project.files.map(file=>({id:file.id,fileName:file.fileName,fileUrl:file.fileUrl,fileSize:file.fileSize,category:file.category,version:file.version,createdAt:file.createdAt.toISOString(),uploadedByName:file.uploadedBy.name}))}/></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Invoices</CardTitle>
                  <Link href="/portal/invoices">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  {project.invoices.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">Belum ada invoice</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {project.invoices.map((invoice) => (
                        <Link href={`/portal/invoices/${invoice.id}`} key={invoice.id} className="p-4 flex items-center justify-between transition-colors hover:bg-emerald-950/[0.025]">
                          <div>
                            <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                            <p className="text-xs text-muted-foreground">
                              Jatuh tempo: {formatDate(invoice.dueDate)}
                            </p>
                          </div>
                          <Badge variant="outline">{invoice.status}</Badge>
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
                <span className="text-sm">Revisions</span>
                <span className="font-medium">{project.revisions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Files</span>
                <span className="font-medium">{project.files.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Invoices</span>
                <span className="font-medium">{project.invoices.length}</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
