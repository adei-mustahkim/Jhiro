import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import type { Prisma } from '@prisma/client'

export type ActivityType =
  | 'login'
  | 'logout'
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'revision_created'
  | 'revision_updated'
  | 'change_request_created'
  | 'change_request_updated'
  | 'change_request_deleted'
  | 'file_uploaded'
  | 'file_deleted'
  | 'file_downloaded'
  | 'invoice_created'
  | 'invoice_updated'
  | 'invoice_deleted'
  | 'client_created'
  | 'client_updated'
  | 'client_deleted'
  | 'account_password_updated'
  | 'requirement_created'
  | 'requirement_updated'
  | 'message_sent'
  | 'article_created'
  | 'article_updated'
  | 'article_deleted'
  | 'portfolio_created'
  | 'portfolio_updated'
  | 'portfolio_deleted'
  | 'case_study_created'
  | 'case_study_updated'
  | 'case_study_deleted'
  | 'resource_created'
  | 'resource_updated'
  | 'resource_deleted'
  | 'cms_updated'
  | 'system_init'
  | 'lead_created'
  | 'lead_deleted'
  | 'resource_downloaded'

interface ActivityLogData {
  userId?: string | null
  projectId?: string | null
  activity: ActivityType
  metadata?: Prisma.InputJsonValue
  ipAddress?: string | null
}

export async function logActivity(data: ActivityLogData): Promise<void> {
  try {
    const headersList = await headers()
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || null

    await prisma.activityLog.create({
      data: {
        userId: data.userId,
        projectId: data.projectId,
        activity: data.activity,
        metadata: data.metadata,
        ipAddress: ip ?? data.ipAddress,
      },
    })
  } catch (error) {
    // Log to console but don't throw - activity logging should not break flows
    console.error('Failed to log activity:', error)
  }
}

export async function getActivityLogs(options?: {
  limit?: number
  offset?: number
  userId?: string
  projectId?: string
  activity?: ActivityType
  startDate?: Date
  endDate?: Date
}) {
  const where: Record<string, unknown> = {}

  if (options?.userId) {
    where.userId = options.userId
  }

  if (options?.projectId) {
    where.projectId = options.projectId
  }

  if (options?.activity) {
    where.activity = options.activity
  }

  if (options?.startDate || options?.endDate) {
    where.createdAt = {}
    if (options.startDate) {
      ;(where.createdAt as Record<string, Date>).gte = options.startDate
    }
    if (options.endDate) {
      ;(where.createdAt as Record<string, Date>).lte = options.endDate
    }
  }

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    }),
    prisma.activityLog.count({ where }),
  ])

  return { logs, total }
}

export function getActivityLabel(activity: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    login: 'Login',
    logout: 'Logout',
    project_created: 'Project dibuat',
    project_updated: 'Project diupdate',
    project_deleted: 'Project dihapus',
    revision_created: 'Revisi dibuat',
    revision_updated: 'Revisi diupdate',
    change_request_created: 'Change Request dibuat',
    change_request_updated: 'Change Request diupdate',
    change_request_deleted: 'Change Request dihapus',
    file_uploaded: 'File diupload',
    file_deleted: 'File dihapus',
    file_downloaded: 'File didownload',
    invoice_created: 'Invoice dibuat',
    invoice_updated: 'Invoice diupdate',
    invoice_deleted: 'Invoice dihapus',
    client_created: 'Client dibuat',
    client_updated: 'Client diupdate',
    client_deleted: 'Client dihapus',
    account_password_updated: 'Password akun diperbarui',
    requirement_created: 'Requirement dibuat',
    requirement_updated: 'Requirement diupdate',
    message_sent: 'Pesan dikirim',
    article_created: 'Artikel dibuat',
    article_updated: 'Artikel diupdate',
    article_deleted: 'Artikel dihapus',
    portfolio_created: 'Portfolio dibuat',
    portfolio_updated: 'Portfolio diupdate',
    portfolio_deleted: 'Portfolio dihapus',
    case_study_created: 'Studi kasus dibuat',
    case_study_updated: 'Studi kasus diupdate',
    case_study_deleted: 'Studi kasus dihapus',
    resource_created: 'Resource dibuat',
    resource_updated: 'Resource diupdate',
    resource_deleted: 'Resource dihapus',
    cms_updated: 'CMS diupdate',
    system_init: 'System initialized',
    lead_created: 'Lead baru',
    lead_deleted: 'Lead dihapus',
    resource_downloaded: 'Resource diunduh',
  }

  return labels[activity] || activity
}

export function getActivityIcon(activity: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    login: 'log-in',
    logout: 'log-out',
    project_created: 'folder-plus',
    project_updated: 'folder-edit',
    project_deleted: 'folder-x',
    revision_created: 'file-plus',
    revision_updated: 'file-edit',
    change_request_created: 'plus-circle',
    change_request_updated: 'edit',
    change_request_deleted: 'trash-2',
    file_uploaded: 'upload',
    file_deleted: 'trash-2',
    file_downloaded: 'download',
    invoice_created: 'receipt',
    invoice_updated: 'receipt',
    invoice_deleted: 'trash-2',
    client_created: 'user-plus',
    client_updated: 'user-edit',
    client_deleted: 'user-x',
    account_password_updated: 'key',
    requirement_created: 'clipboard-list',
    requirement_updated: 'clipboard',
    message_sent: 'message-circle',
    article_created: 'file-text',
    article_updated: 'file-text',
    article_deleted: 'file-x',
    portfolio_created: 'briefcase',
    portfolio_updated: 'briefcase',
    portfolio_deleted: 'trash-2',
    case_study_created: 'briefcase',
    case_study_updated: 'briefcase',
    case_study_deleted: 'trash-2',
    resource_created: 'download',
    resource_updated: 'file-edit',
    resource_deleted: 'file-x',
    cms_updated: 'settings',
    system_init: 'server',
    lead_created: 'user-plus',
    lead_deleted: 'user-x',
    resource_downloaded: 'download',
  }

  return icons[activity] || 'activity'
}
