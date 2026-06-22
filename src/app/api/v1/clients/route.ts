import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { createClientSchema } from "@/lib/validators/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const clients = await prisma.client.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        projects: {
          select: { id: true, status: true },
        },
        _count: {
          select: { projects: true, invoices: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = createClientSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(data.password, 12);
    const client = await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({ data: { name:data.name, email:data.email, passwordHash, role:"CLIENT" } });
      return transaction.client.create({ data: { userId:user.id, companyName:data.companyName, phone:data.phone, address:data.address, industry:data.industry }, include:{ user:{select:{id:true,name:true,email:true}} } });
    });

    await logActivity({
      userId: session.user.id,
      activity: "client_created",
      metadata: { clientId: client.id, companyName: data.companyName },
    });

    revalidatePath("/clients");

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error:error.errors[0]?.message ?? "Data tidak valid", details:error.errors }, { status:400 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email tersebut sudah digunakan oleh akun lain" }, { status: 409 });
    }
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
