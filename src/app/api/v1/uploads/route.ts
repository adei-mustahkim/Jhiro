import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const imageTypes = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/gif", "gif"], ["image/x-icon", "ico"], ["image/vnd.microsoft.icon", "ico"],
]);
const documentTypes = new Map([
  ["application/pdf", "pdf"], ["application/zip", "zip"], ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"], ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
]);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "PROJECT_MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if ((process.env.STORAGE_PROVIDER ?? "local") !== "local") return NextResponse.json({ error: "Provider storage produksi belum dikonfigurasi" }, { status: 503 });
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = formData.get("kind");
    if (!(file instanceof File)) return NextResponse.json({ error: "File wajib dipilih" }, { status: 400 });
    if (kind !== "image" && kind !== "favicon" && kind !== "file") return NextResponse.json({ error: "Jenis upload tidak valid" }, { status: 400 });
    const allowedTypes = kind === "file" ? new Map([...imageTypes, ...documentTypes]) : imageTypes;
    const extension = allowedTypes.get(file.type);
    if (!extension) return NextResponse.json({ error: kind === "file" ? "Tipe file tidak didukung" : "Gunakan JPG, PNG, WebP, GIF, atau ICO" }, { status: 400 });
    if (kind === "favicon" && !["png", "ico"].includes(extension)) return NextResponse.json({ error: "Favicon harus berupa PNG atau ICO" }, { status: 400 });
    const maximumSize = kind === "file" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maximumSize) return NextResponse.json({ error: `Ukuran maksimum ${kind === "file" ? "10" : "5"} MB` }, { status: 400 });
    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    const fileName = `${kind}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDirectory, fileName), bytes, { flag: "wx" });
    return NextResponse.json({ url: `/uploads/${fileName}`, name: file.name, size: file.size, type: file.type }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload gagal diproses" }, { status: 500 });
  }
}
