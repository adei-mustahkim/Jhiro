import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

const schema = z.object({ password: z.string().min(10, "Password minimal 10 karakter").max(72) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const data = schema.parse(await request.json());
    const client = await prisma.client.findFirst({ where: { id, deletedAt: null }, select: { userId: true, companyName: true } });
    if (!client) return NextResponse.json({ error: "Client tidak ditemukan" }, { status: 404 });

    const passwordHash = await bcrypt.hash(data.password, 12);
    await prisma.user.update({ where: { id: client.userId }, data: { passwordHash, isActive: true } });
    await logActivity({ userId: session.user.id, activity: "client_updated", metadata: { clientId: id, companyName: client.companyName, change: "credentials_reset" } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0]?.message ?? "Password tidak valid", details: error.errors }, { status: 400 });
    console.error("Failed to reset client credentials:", error);
    return NextResponse.json({ error: "Credential client gagal diperbarui" }, { status: 500 });
  }
}
