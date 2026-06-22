import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: Date | string, locale: string = "id-ID"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string, locale: string = "id-ID"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeTime(date: Date | string, locale: string = "id-ID"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return locale === "id-ID" ? " baru saja" : "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return locale === "id-ID"
      ? `${diffInMinutes} menit lalu`
      : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return locale === "id-ID"
      ? `${diffInHours} jam lalu`
      : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return locale === "id-ID"
      ? `${diffInDays} hari lalu`
      : `${diffInDays} days ago`;
  }

  return formatDate(d, locale);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${year}-${random}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function isOverdue(dueDate: Date | string): boolean {
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return d < new Date();
}

export function calculateProgress(startDate: Date, endDate: Date): number {
  const now = new Date();
  const total = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const projectStatusLabels: Record<string, string> = {
  NEW: "Baru",
  REQUIREMENT_GATHERING: "Pengumpulan Kebutuhan",
  DESIGN: "Design",
  DEVELOPMENT: "Development",
  TESTING: "Testing",
  REVIEW: "Review",
  REVISION: "Revisi",
  COMPLETED: "Selesai",
  ARCHIVED: "Arsip",
};

export const projectStatusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  REQUIREMENT_GATHERING: "bg-purple-100 text-purple-700",
  DESIGN: "bg-pink-100 text-pink-700",
  DEVELOPMENT: "bg-amber-100 text-amber-700",
  TESTING: "bg-cyan-100 text-cyan-700",
  REVIEW: "bg-indigo-100 text-indigo-700",
  REVISION: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-700",
};

export const invoiceStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  UNPAID: "Belum Bayar",
  PARTIAL: "Sebagian",
  PAID: "Lunas",
  OVERDUE: "Jatuh Tempo",
};

export const invoiceStatusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  UNPAID: "bg-amber-100 text-amber-700",
  PARTIAL: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
};

export const revisionStatusLabels: Record<string, string> = {
  OPEN: "Terbuka",
  IN_REVIEW: "Sedang Di-review",
  IN_PROGRESS: "Sedang Dikerjakan",
  COMPLETED: "Selesai",
  APPROVED: "Disetujui",
};

export const revisionStatusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-purple-100 text-purple-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
};
