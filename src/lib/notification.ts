import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NotificationChannel } from "@prisma/client";

export type NotificationType =
  | "project_update"
  | "revision_submitted"
  | "revision_status_changed"
  | "change_request_submitted"
  | "change_request_approved"
  | "change_request_rejected"
  | "file_uploaded"
  | "message_received"
  | "invoice_created"
  | "invoice_paid"
  | "invoice_overdue"
  | "requirement_approved"
  | "requirement_locked"
  | "system";

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  channel?: NotificationChannel;
  link?: string;
  metadata?: Record<string, unknown>;
}

export async function notify(data: NotificationData): Promise<void> {
  const channel = data.channel ?? NotificationChannel.IN_APP;

  // Create in-app notification
  if (channel === "IN_APP" || channel === "BOTH") {
    await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        channel: "IN_APP",
        link: data.link,
      },
    });
  }

  // Send email if channel is EMAIL or BOTH
  if (channel === "EMAIL" || channel === "BOTH") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true, name: true },
      });
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: data.title,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <h2 style="color: #065f46; font-size: 18px; margin-bottom: 12px;">${data.title}</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">${data.message}</p>
              ${data.link ? `<a href="${process.env.NEXTAUTH_URL}${data.link}" style="display: inline-block; background: #059669; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">Lihat Detail</a>` : ""}
              <hr style="border: none; border-top: 1e5e3ea8 solid; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px;">Jhiro Digital Lab</p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.warn("[Notification] Failed to send email:", error instanceof Error ? error.message : error);
    }
  }
}

export async function notifyProjectUpdate(
  userId: string,
  projectName: string,
  update: string,
  projectId?: string
): Promise<void> {
  await notify({
    userId,
    title: "Update Project",
    message: `${projectName}: ${update}`,
    type: "project_update",
    link: projectId ? `/portal/projects/${projectId}` : undefined,
  });
}

export async function notifyRevisionSubmitted(
  recipientId: string,
  projectName: string,
  revisionTitle: string,
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Revisi Baru",
    message: `Revisi baru di ${projectName}: "${revisionTitle}"`,
    type: "revision_submitted",
    link: `/projects/${projectId}`,
  });
}

export async function notifyRevisionStatusChanged(
  recipientId: string,
  projectName: string,
  revisionTitle: string,
  newStatus: string,
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Status Revisi Diubah",
    message: `Revisi "${revisionTitle}" di ${projectName} sekarang: ${newStatus}`,
    type: "revision_status_changed",
    link: `/portal/projects/${projectId}`,
  });
}

export async function notifyChangeRequestSubmitted(
  recipientId: string,
  projectName: string,
  crTitle: string,
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Change Request Baru",
    message: `CR baru di ${projectName}: "${crTitle}"`,
    type: "change_request_submitted",
    link: `/admin/projects/${projectId}`,
  });
}

export async function notifyChangeRequestDecision(
  recipientId: string,
  projectName: string,
  crTitle: string,
  decision: "APPROVED" | "REJECTED",
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: `Change Request ${decision === "APPROVED" ? "Disetujui" : "Ditolak"}`,
    message: `CR "${crTitle}" di ${projectName} telah ${decision === "APPROVED" ? "disetujui" : "ditolak"}`,
    type: decision === "APPROVED" ? "change_request_approved" : "change_request_rejected",
    link: `/portal/projects/${projectId}`,
  });
}

export async function notifyFileUploaded(
  recipientId: string,
  projectName: string,
  fileName: string,
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "File Baru Diupload",
    message: `File "${fileName}" baru diupload di ${projectName}`,
    type: "file_uploaded",
    link: `/portal/projects/${projectId}/files`,
  });
}

export async function notifyNewMessage(
  recipientId: string,
  projectName: string,
  senderName: string,
  projectId: string,
  recipientPath: "admin" | "client" = "client"
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Pesan Baru",
    message: `${senderName} mengirim pesan di ${projectName}`,
    type: "message_received",
    link: recipientPath === "admin" ? `/projects/${projectId}` : `/portal/projects/${projectId}`,
  });
}

export async function notifyInvoiceCreated(
  recipientId: string,
  invoiceNumber: string,
  amount: string,
  projectName?: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Invoice Baru",
    message: `Invoice ${invoiceNumber} sejumlah ${amount}${projectName ? ` untuk ${projectName}` : ""}`,
    type: "invoice_created",
    link: `/portal/invoices`,
  });
}

export async function notifyInvoicePaid(
  recipientId: string,
  invoiceNumber: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Invoice Lunas",
    message: `Invoice ${invoiceNumber} telah lunas`,
    type: "invoice_paid",
  });
}

export async function notifyInvoiceOverdue(
  recipientId: string,
  invoiceNumber: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Invoice Jatuh Tempo",
    message: `Invoice ${invoiceNumber} telah melewati batas waktu pembayaran`,
    type: "invoice_overdue",
    link: `/portal/invoices`,
  });
}

export async function notifyRequirementApproved(
  recipientId: string,
  projectName: string,
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Requirement Disetujui",
    message: `Requirement untuk ${projectName} telah disetujui`,
    type: "requirement_approved",
    link: `/portal/projects/${projectId}`,
  });
}

export async function notifyRequirementLocked(
  recipientId: string,
  projectName: string,
  projectId: string
): Promise<void> {
  await notify({
    userId: recipientId,
    title: "Requirement Dikunci",
    message: `Requirement untuk ${projectName} telah dikunci`,
    type: "requirement_locked",
    link: `/portal/projects/${projectId}`,
  });
}

// Get unread notification count
export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

// Get notifications for a user
export async function getNotifications(
  userId: string,
  options?: { limit?: number; offset?: number; unreadOnly?: boolean }
) {
  const where: Record<string, unknown> = { userId };
  if (options?.unreadOnly) {
    where.isRead = false;
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 20,
      skip: options?.offset ?? 0,
    }),
    getUnreadCount(userId),
  ]);

  return { notifications, unreadCount };
}

// Mark notification as read
export async function markAsRead(
  notificationId: string,
  userId: string
): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId, // Ensure user owns the notification
    },
    data: {
      isRead: true,
    },
  });
}

// Mark all notifications as read
export async function markAllAsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}
