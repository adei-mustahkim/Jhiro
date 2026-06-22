import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, User, FolderKanban } from "lucide-react";

async function getActivityLogs(search?: string, activity?: string) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { activity: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { project: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (activity && activity !== "all") {
    where.activity = activity;
  }

  const logs = await prisma.activityLog.findMany({
    where,
    include: {
      user: {
        select: { name: true, email: true },
      },
      project: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return logs;
}

function formatMetadata(metadata: Record<string, unknown> | null): string | null {
  if (!metadata) return null;
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(", ");
}

export default async function ActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; activity?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
    redirect("/portal/dashboard");
  }

  const { q, activity } = await searchParams;
  const logs = await getActivityLogs(q, activity);

  const uniqueActivities = [...new Set(logs.map((log) => log.activity))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Aktivitas</h1>
        <p className="text-muted-foreground mt-1">
          Riwayat aktivitas sistem dan pengguna
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold tabular-nums">{logs.length}</div>
            <div className="text-sm text-muted-foreground">Aktivitas Terbaru</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold tabular-nums">
              {new Set(logs.filter((l) => l.userId).map((l) => l.userId)).size}
            </div>
            <div className="text-sm text-muted-foreground">Pengguna Aktif</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold tabular-nums">
              {logs.filter((l) => l.activity.includes("login")).length}
            </div>
            <div className="text-sm text-muted-foreground">Total Login</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold tabular-nums">
              {logs.filter((l) => l.activity.includes("file")).length}
            </div>
            <div className="text-sm text-muted-foreground">Aktivitas Berkas</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Cari aktivitas, pengguna, atau proyek..."
                defaultValue={q}
                className="pl-10"
              />
            </div>
            <Select name="activity" defaultValue={activity || "all"}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Aktivitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aktivitas</SelectItem>
                {uniqueActivities.map((act) => (
                  <SelectItem key={act} value={act}>
                    {act.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            {(q || activity) && (
              <Button variant="ghost" type="button" asChild>
                <Link href="/activity-logs">Reset</Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      {log.userId ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : (
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {log.user?.name || "System"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.activity.replace(/_/g, " ")}
                        </Badge>
                        {log.project && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <FolderKanban className="h-3 w-3" />
                            {log.project.name}
                          </span>
                        )}
                      </div>
                      {formatMetadata(log.metadata as Record<string, unknown> | null) && (
                        <p className="text-xs text-muted-foreground">
                          {formatMetadata(log.metadata as Record<string, unknown> | null)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </p>
                      {log.ipAddress && (
                        <p className="text-xs text-muted-foreground">
                          IP: {log.ipAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
