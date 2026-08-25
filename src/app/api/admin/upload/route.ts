import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

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

  const buffer = Buffer.from(await file.arrayBuffer());

  const [row] = (await sql`
    INSERT INTO media (filename, mime_type, data, size_bytes)
    VALUES (${file.name}, ${file.type}, ${buffer}, ${file.size})
    RETURNING id
  `) as { id: string }[];

  return NextResponse.json({
    ok: true,
    id: row.id,
    filename: file.name,
    url: `/api/media/${row.id}`,
  });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, message: "Thiếu id" }, { status: 400 });
  }
  await sql`DELETE FROM media WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
