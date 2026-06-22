import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArticleStatus } from '@prisma/client'

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
import { Plus, Search, FileText, Filter } from 'lucide-react'
import Link from 'next/link'
import { RecordActions } from '@/components/admin/record-actions'

async function getArticles(search?: string, status?: string) {
  const articles = await prisma.article.findMany({
    where: {
      deletedAt: null,
      ...(status && status !== 'all' && { status: status as ArticleStatus }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      author: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return articles
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-red-100 text-red-700',
}

export default async function BlogAdminPage({
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
  const articles = await getArticles(q, status)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-1 text-muted-foreground">Kelola artikel dan konten blog</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Artikel
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{articles.length}</div>
            <div className="text-sm text-muted-foreground">Total Articles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {articles.filter((a) => a.status === 'PUBLISHED').length}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {articles.filter((a) => a.status === 'DRAFT').length}
            </div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" placeholder="Cari artikel..." defaultValue={q} className="pl-10" />
            </div>
            <Select name="status" defaultValue={status || 'all'}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
            {(q || status) && (
              <Link href="/admin/blog">
                <Button variant="ghost">Reset</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {articles.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada artikel</p>
              <Link href="/admin/blog/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Artikel Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {articles.map((article) => (
                <div key={article.id} className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.slug}</p>
                        <p className="text-xs text-muted-foreground">
                          Author: {article.author.name} • {formatDate(article.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[article.status]}>
                        {statusLabels[article.status]}
                      </Badge>
                      <RecordActions
                        viewUrl={`/admin/blog/${article.id}/edit`}
                        endpoint={`/api/v1/articles/${article.id}`}
                        recordName={article.title}
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
