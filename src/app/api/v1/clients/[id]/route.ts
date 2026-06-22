import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { logActivity } from '@/lib/activity-logger'
import prisma from '@/lib/prisma'
import { updateClientSchema } from '@/lib/validators/client'
import { revalidatePath } from 'next/cache'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'PROJECT_MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const data = updateClientSchema.parse(await request.json())
    const current = await prisma.client.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true, user: { select: { isActive: true } } },
    })
    if (!current) return NextResponse.json({ error: 'Client tidak ditemukan' }, { status: 404 })

    const client = await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: current.userId },
        data: { name: data.name, email: data.email, isActive: data.isActive },
      })
      return transaction.client.update({
        where: { id },
        data: {
          companyName: data.companyName,
          phone: data.phone || null,
          address: data.address || null,
          industry: data.industry || null,
          notes: data.notes || null,
        },
        include: { user: { select: { id: true, name: true, email: true, isActive: true } } },
      })
    })

    await logActivity({
      userId: session.user.id,
      activity: 'client_updated',
      metadata: {
        clientId: id,
        companyName: data.companyName,
        accessChanged: current.user.isActive !== data.isActive,
      },
    })
    revalidatePath('/clients')
    revalidatePath(`/clients/${id}`)
    return NextResponse.json(client)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Data client tidak valid', details: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email tersebut sudah digunakan oleh akun lain' },
        { status: 409 }
      )
    }
    console.error('Failed to update client:', error)
    return NextResponse.json({ error: 'Client gagal diperbarui' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Hanya super admin yang dapat menghapus client' },
        { status: 403 }
      )
    }

    const { id } = await context.params
    const current = await prisma.client.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true, companyName: true },
    })
    if (!current) return NextResponse.json({ error: 'Client tidak ditemukan' }, { status: 404 })

    await prisma.$transaction([
      prisma.client.update({ where: { id }, data: { deletedAt: new Date() } }),
      prisma.user.update({ where: { id: current.userId }, data: { isActive: false } }),
    ])

    await logActivity({
      userId: session.user.id,
      activity: 'client_deleted',
      metadata: { clientId: id, companyName: current.companyName },
    })
    revalidatePath('/clients')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete client:', error)
    return NextResponse.json({ error: 'Client gagal dihapus' }, { status: 500 })
  }
}
