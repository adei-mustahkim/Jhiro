import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import authConfig from "@/auth.config";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { client: true },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (!user.isActive) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as Role,
        };
      },
    }),
  ],

});

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { client: true },
  });

  return user;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as Role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireClient() {
  return requireRole(["CLIENT"]);
}

export async function requirePM() {
  return requireRole(["PROJECT_MANAGER", "SUPER_ADMIN"]);
}

export async function requireAdmin() {
  return requireRole(["SUPER_ADMIN"]);
}
