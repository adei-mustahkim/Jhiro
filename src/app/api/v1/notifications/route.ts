import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getNotifications, markAsRead, markAllAsRead } from "@/lib/notification";

const patchSchema = z.object({
  id: z.string().uuid().optional(),
  all: z.literal(true).optional(),
}).refine((data) => data.id || data.all, {
  message: "Harus menyertakan 'id' atau 'all: true'",
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await getNotifications(session.user.id, { limit: 20 });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = patchSchema.parse(await request.json());

    if (body.all) {
      await markAllAsRead(session.user.id);
    } else if (body.id) {
      await markAsRead(body.id, session.user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message ?? "Data tidak valid" }, { status: 400 });
    }
    console.error("Failed to update notification:", error);
    return NextResponse.json({ error: "Gagal memperbarui notifikasi" }, { status: 500 });
  }
}
