import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export type Permission =
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "clients:read"
  | "clients:create"
  | "clients:update"
  | "clients:delete"
  | "invoices:read"
  | "invoices:create"
  | "invoices:update"
  | "invoices:delete"
  | "articles:read"
  | "articles:create"
  | "articles:update"
  | "articles:delete"
  | "portfolio:read"
  | "portfolio:create"
  | "portfolio:update"
  | "portfolio:delete"
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "cms:read"
  | "cms:update"
  | "analytics:read"
  | "activity:read";

const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
    "clients:read",
    "clients:create",
    "clients:update",
    "clients:delete",
    "invoices:read",
    "invoices:create",
    "invoices:update",
    "invoices:delete",
    "articles:read",
    "articles:create",
    "articles:update",
    "articles:delete",
    "portfolio:read",
    "portfolio:create",
    "portfolio:update",
    "portfolio:delete",
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "cms:read",
    "cms:update",
    "analytics:read",
    "activity:read",
  ],
  PROJECT_MANAGER: [
    "projects:read",
    "projects:create",
    "projects:update",
    "clients:read",
    "clients:create",
    "clients:update",
    "invoices:read",
    "invoices:create",
    "invoices:update",
    "articles:read",
    "articles:create",
    "articles:update",
    "portfolio:read",
    "portfolio:create",
    "portfolio:update",
    "cms:read",
    "cms:update",
    "analytics:read",
    "activity:read",
  ],
  CLIENT: [
    "projects:read",
    "clients:read",
    "invoices:read",
    "articles:read",
    "portfolio:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export async function checkPermission(
  permission: Permission
): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  return hasPermission(session.user.role, permission);
}

export async function checkAnyPermission(
  permissions: Permission[]
): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  return hasAnyPermission(session.user.role, permissions);
}

export async function checkAllPermissions(
  permissions: Permission[]
): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  return hasAllPermissions(session.user.role, permissions);
}

export async function requirePermission(permission: Permission): Promise<void> {
  const hasAccess = await checkPermission(permission);
  if (!hasAccess) {
    throw new Error("You don't have permission to perform this action");
  }
}

export async function requireAnyPermission(
  permissions: Permission[]
): Promise<void> {
  const hasAccess = await checkAnyPermission(permissions);
  if (!hasAccess) {
    throw new Error("You don't have permission to perform this action");
  }
}

export async function requireAllPermissions(
  permissions: Permission[]
): Promise<void> {
  const hasAccess = await checkAllPermissions(permissions);
  if (!hasAccess) {
    throw new Error("You don't have permission to perform this action");
  }
}

// Client ownership check for projects
export async function canAccessProject(
  projectId: string,
  clientId?: string
): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  // Admin and PM can access all projects
  if (
    session.user.role === "SUPER_ADMIN" ||
    session.user.role === "PROJECT_MANAGER"
  ) {
    return true;
  }

  // Client can only access their own projects
  if (session.user.role === "CLIENT" && clientId) {
    const prisma = (await import("@/lib/prisma")).default;
    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
    });
    return client?.id === clientId;
  }

  return false;
}

// Require client ownership for specific resource
export async function requireProjectAccess(
  projectId: string,
  clientId?: string
): Promise<void> {
  const hasAccess = await canAccessProject(projectId, clientId);
  if (!hasAccess) {
    throw new Error("You don't have access to this project");
  }
}
