import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Briefcase, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'
import { RecordActions } from '@/components/admin/record-actions'

async function getPortfolios(search?: string) {
  const where: {
    deletedAt: null
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' }
      slug?: { contains: string; mode: 'insensitive' }
    }>
  } = { deletedAt: null }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  const portfolios = await prisma.portfolio.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return portfolios
}

export default async function PortfolioAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
    redirect('/portal/dashboard')
  }

  const { q } = await searchParams
  const portfolios = await getPortfolios(q)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="mt-1 text-muted-foreground">Kelola project portfolio dan case study</p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Portfolio
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" placeholder="Cari portfolio..." defaultValue={q} className="pl-10" />
            </div>
            <Button type="submit">Filter</Button>
            {q && (
              <Link href="/admin/portfolio">
                <Button variant="ghost">Reset</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Portfolio Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Portfolio ({portfolios.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {portfolios.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada portfolio</p>
              <Link href="/admin/portfolio/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Portfolio Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
                >
                  <div className="flex aspect-video items-center justify-center overflow-hidden bg-muted">
                    {portfolio.screenshots[0] ? (
                      <img
                        src={portfolio.screenshots[0]}
                        alt={`Preview ${portfolio.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Briefcase className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="line-clamp-1 font-semibold">{portfolio.name}</h3>
                      {portfolio.isFeatured && (
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {portfolio.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {portfolio.technologies.slice(0, 3).map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(portfolio.createdAt)}
                      </span>
                      <div className="flex gap-1">
                        {portfolio.projectUrl && (
                          <Link href={portfolio.projectUrl} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <RecordActions
                          viewUrl={`/admin/portfolio/${portfolio.id}/edit`}
                          endpoint={`/api/v1/portfolios/${portfolio.id}`}
                          recordName={portfolio.name}
                          canDelete={session.user.role === 'SUPER_ADMIN'}
                        />
                      </div>
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
