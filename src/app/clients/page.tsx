import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Building2, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { RecordActions } from '@/components/admin/record-actions'

async function getClients(search?: string) {
  const where = {
    deletedAt: null,
    ...(search && {
      OR: [
        { companyName: { contains: search, mode: 'insensitive' as const } },
        { user: { email: { contains: search, mode: 'insensitive' as const } } },
        { industry: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const clients = await prisma.client.findMany({
    where,
    include: {
      user: {
        select: { name: true, email: true, isActive: true },
      },
      projects: {
        where: { deletedAt: null },
        select: { id: true, status: true },
      },
      _count: {
        select: { projects: { where: { deletedAt: null } }, invoices: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return clients
}

export default async function ClientsPage({
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
  const clients = await getClients(q)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="mt-1 text-muted-foreground">Kelola semua client dan informasi mereka</p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Client
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <form method="get" className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Cari client berdasarkan nama, email, atau industri..."
                defaultValue={q}
                className="pl-10"
              />
            </div>
            <Button type="submit">Cari</Button>
            {q && (
              <Link href="/clients">
                <Button variant="ghost">Reset</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Client ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Belum ada client</p>
              <Link href="/clients/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Client Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {clients.map((client) => {
                const activeProjects = client.projects.filter(
                  (p) => p.status !== 'COMPLETED' && p.status !== 'ARCHIVED'
                ).length
                return (
                  <div key={client.id} className="p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{client.companyName}</h3>
                            <Badge variant={client.user?.isActive ? 'success' : 'secondary'}>
                              {client.user?.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.user?.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                          {client.industry && (
                            <p className="text-xs text-muted-foreground">
                              Industri: {client.industry}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden text-right sm:block">
                          <div className="text-sm font-medium">{activeProjects} Active</div>
                          <div className="text-xs text-muted-foreground">
                            {client._count.projects} Total Projects
                          </div>
                        </div>
                        <div className="hidden text-right md:block">
                          <div className="text-sm text-muted-foreground">Bergabung</div>
                          <div className="text-xs">{formatDate(client.createdAt)}</div>
                        </div>
                        <RecordActions
                          viewUrl={`/clients/${client.id}`}
                          endpoint={`/api/v1/clients/${client.id}`}
                          recordName={client.companyName}
                          canDelete={session.user.role === 'SUPER_ADMIN'}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
