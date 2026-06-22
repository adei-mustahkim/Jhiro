import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
import { hasAllPermissions, hasAnyPermission, hasPermission } from "@/lib/permissions";

describe("role permissions", () => {
  it("allows admin to delete projects", () => expect(hasPermission("SUPER_ADMIN", "projects:delete")).toBe(true));
  it("prevents clients from updating projects", () => expect(hasPermission("CLIENT", "projects:update")).toBe(false));
  it("allows project managers to manage project data", () => expect(hasAllPermissions("PROJECT_MANAGER", ["projects:read", "projects:create", "projects:update"])).toBe(true));
  it("detects any matching client permission", () => expect(hasAnyPermission("CLIENT", ["projects:delete", "invoices:read"])).toBe(true));
});
