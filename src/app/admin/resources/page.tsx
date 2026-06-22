import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ResourceType } from '@prisma/client'

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
import { Plus, Search, Download, FileText, Filter } from 'lucide-react'
import Link from 'next/link'
import { RecordActions } from '@/components/admin/record-actions'

async function getResources(search?: string, type?: string) {
  const resources = await prisma.resource.findMany({
    where: {
      ...(type && type !== 'all' && { type: type as ResourceType }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
  })

  return resources
}

const typeLabels: Record<string, string> = {
  TEMPLATE: 'Template',
  EBOOK: 'E-Book',
  GUIDE: 'Guide',
  CHECKLIST: 'Checklist',
}

const typeColors: Record<string, string> = {
  TEMPLATE: 'bg-blue-100 text-blue-700',
  EBOOK: 'bg-purple-100 text-purple-700',
  GUIDE: 'bg-green-100 text-green-700',
  CHECKLIST: 'bg-amber-100 text-amber-700',
}

export default async function ResourcesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
    redirect('/portal/dashboard')
  }

  const { q, type } = await searchParams
  const resources = await getResources(q, type)
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloadCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola template, e-book, dan resource lainnya
          </p>
        </div>
        <Link href="/admin/resources/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Resource
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{resources.length}</div>
            <div className="text-sm text-muted-foreground">Total Resources</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <div className="text-sm text-muted-foreground">Total Downloads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {resources.filter((r) => r.type === 'TEMPLATE').length}
            </div>
            <div className="text-sm text-muted-foreground">Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {resources.filter((r) => r.type === 'EBOOK').length}
            </div>
            <div className="text-sm text-muted-foreground">E-Books</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" placeholder="Cari resource..." defaultValue={q} className="pl-10" />
            </div>
            <Select name="type" defaultValue={type || 'all'}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Type</SelectItem>
                {Object.entries(typeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            {(q || type) && (
              <Button asChild variant="ghost">
                <Link href="/admin/resources">Reset</Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Resource ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {resources.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada resource</p>
              <Link href="/admin/resources/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Resource Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{resource.title}</h3>
                          <Badge className={typeColors[resource.type]}>
                            {typeLabels[resource.type]}
                          </Badge>
                        </div>
                        {resource.description && (
                          <p className="line-clamp-1 text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(resource.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden text-right sm:block">
                        <div className="flex items-center gap-1 text-sm">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          {resource.downloadCount} downloads
                        </div>
                      </div>
                      <RecordActions
                        viewUrl={`/admin/resources/${resource.id}/edit`}
                        endpoint={`/api/v1/resources/${resource.id}`}
                        recordName={resource.title}
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
