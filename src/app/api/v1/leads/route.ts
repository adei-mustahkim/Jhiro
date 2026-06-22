import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { leadSchema } from "@/lib/validators/lead";
import { auth } from "@/lib/auth";

// Simple in-memory rate limiter for leads (production should use Redis)
const leadRateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 leads per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = leadRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    leadRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
    }

    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        message: validatedData.message,
        source: "contact_form",
      },
    });

    await logActivity({
      activity: "lead_created",
      metadata: { leadId: lead.id, source: "contact_form" },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Data tidak valid", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only super admin can delete leads" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    await logActivity({
      userId: session.user.id,
      activity: "lead_deleted",
      metadata: { leadId: id, leadEmail: lead.email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
