import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/projects",
  "/invoices",
  "/clients",
  "/cms",
  "/admin",
  "/settings",
  "/activity-logs",
];

// Routes that require admin role
const adminRoutes = [
  "/settings",
  "/admin",
];

// Routes that require PM or admin role
const pmRoutes = ["/projects", "/invoices"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session) {
    // Redirect logged in users away from login page
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Check admin routes - /settings allows PM, /admin requires SUPER_ADMIN or PM
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute) {
      // /settings allows both SUPER_ADMIN and PROJECT_MANAGER
      if (pathname.startsWith("/settings")) {
        if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
      // /admin requires SUPER_ADMIN or PROJECT_MANAGER
      else if (pathname.startsWith("/admin")) {
        if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    // Check PM routes
    const isPMRoute = pmRoutes.some(
      (route) =>
        pathname.startsWith(route) &&
        !pathname.startsWith("/projects") // Allow clients to see their projects
    );

    if (
      isPMRoute &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "PROJECT_MANAGER"
    ) {
      // Clients can access /invoices but not admin invoice routes
      if (pathname.startsWith("/invoices")) {
        // Allow clients to access their invoices
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api(?!/auth)).*)",
  ],
};
