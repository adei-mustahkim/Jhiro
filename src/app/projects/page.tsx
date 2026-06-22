import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDate, projectStatusLabels, projectStatusColors } from '@/lib/utils'
import { ProjectStatus } from '@prisma/client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, FolderKanban, Calendar, Filter } from 'lucide-react'
import Link from 'next/link'
import { RecordActions } from '@/components/admin/record-actions'

async function getProjects(search?: string, status?: string) {
  const projects = await prisma.project.findMany({
    where: {
      deletedAt: null,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(status && status !== 'all' && { status: status as ProjectStatus }),
    },
    include: {
      client: {
        select: { companyName: true },
      },
      manager: {
        select: { name: true, email: true },
      },
      _count: {
        select: { revisions: true, files: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return projects
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
    redirect('/portal/dashboard')
  }

  const { q, status } = await searchParams
  const projects = await getProjects(q, status)

  const statusCounts = await prisma.project.groupBy({
    by: ['status'],
    where: { deletedAt: null },
    _count: true,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">Kelola semua project dan progressnya</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Project Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        {statusCounts.map((count) => (
          <Card key={count.status}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{count._count}</div>
              <div className="text-sm text-muted-foreground">
                {projectStatusLabels[count.status]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" placeholder="Cari project..." defaultValue={q} className="pl-10" />
            </div>
            <Select name="status" defaultValue={status || 'all'}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.entries(projectStatusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            {(q || status) && (
              <Link href="/projects">
                <Button variant="ghost">Reset</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Project ({projects.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <FolderKanban className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada project</p>
              <Link href="/projects/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Project Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <div key={project.id} className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FolderKanban className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Badge className={projectStatusColors[project.status]}>
                            {projectStatusLabels[project.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.client.companyName}
                        </p>
                        {project.manager && (
                          <p className="text-xs text-muted-foreground">
                            PM: {project.manager.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden text-right sm:block">
                        <div className="text-sm">
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      {project.deadline && (
                        <div className="hidden text-right md:block">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(project.deadline)}
                          </div>
                        </div>
                      )}
                      <RecordActions
                        viewUrl={`/projects/${project.id}`}
                        endpoint={`/api/v1/projects/${project.id}`}
                        recordName={project.name}
                        canDelete={session.user.role === 'SUPER_ADMIN'}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
