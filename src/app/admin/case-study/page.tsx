import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import { RecordActions } from '@/components/admin/record-actions'

export default async function CaseStudyAdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
    redirect('/portal/dashboard')
  }

  const caseStudies = await prisma.caseStudy.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { seoMeta: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola case study yang ditampilkan di halaman publik.
          </p>
        </div>
        <Link href="/admin/case-study/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Case Study Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Case Study ({caseStudies.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {caseStudies.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Belum ada case study</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Case study menampilkan hasil dan solusi yang kami berikan kepada client.
              </p>
              <Link href="/admin/case-study/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Case Study Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {caseStudies.map((cs) => (
                <div key={cs.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      {cs.screenshots.length > 0 ? (
                        <ImageIcon className="h-6 w-6 text-emerald-700" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/case-study/${cs.id}/edit`}
                        className="font-medium text-emerald-800 hover:underline"
                      >
                        {cs.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {cs.screenshots.length} screenshot
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(cs.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      {cs.screenshots.length > 0 && (
                        <Link href={`/case-study/${cs.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Lihat
                          </Button>
                        </Link>
                      )}
                      <RecordActions
                        viewUrl={`/admin/case-study/${cs.id}/edit`}
                        endpoint={`/api/v1/case-studies/${cs.id}`}
                        recordName={cs.title}
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
