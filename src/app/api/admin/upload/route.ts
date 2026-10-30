import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { isAdminAuthed } from "@/lib/admin-auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_PREFIXES = ["image/", "video/"];

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Thiếu file" }, { status: 400 });
  }

  const isAllowed = ALLOWED_PREFIXES.some((p) => file.type.startsWith(p));
  if (!isAllowed) {
    return NextResponse.json({ ok: false, message: "Chỉ chấp nhận file ảnh hoặc video" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return NextResponse.json(
      { ok: false, message: `File vượt quá ${Math.round(limit / (1024 * 1024))}MB` },
      { status: 400 },
    );
  }

  // Lưu vào Vercel Blob Storage (có CDN riêng) thay vì nhét file nhị phân
  // vào Postgres — tránh tốn hạn mức "network transfer" của database mỗi
  // khi có người xem ảnh (xem ghi chú trong /api/media/[id]/route.ts).
  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.MEDIA_READ_WRITE_TOKEN,
  });

  return NextResponse.json({
    ok: true,
    filename: file.name,
    url: blob.url,
  });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ ok: false, message: "Thiếu url" }, { status: 400 });
  }
  await del(url, { token: process.env.MEDIA_READ_WRITE_TOKEN });
  return NextResponse.json({ ok: true });
}
