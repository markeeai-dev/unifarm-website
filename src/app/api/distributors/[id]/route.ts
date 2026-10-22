import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { translateEntity, type EntitySpec } from "@/lib/translate-content";

const DISTRIBUTOR_TRANSLATE_SPEC: EntitySpec = {
  name: { kind: "string" },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM distributors WHERE id::text = ${id}`;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ distributor: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { name, province, district, address, hours, phone, sort_order } = body;

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: "Thiếu tên cửa hàng" }, { status: 400 });
  }
  if (!district || !String(district).trim()) {
    return NextResponse.json({ error: "Thiếu quận/huyện" }, { status: 400 });
  }
  if (!address || !String(address).trim()) {
    return NextResponse.json({ error: "Thiếu địa chỉ" }, { status: 400 });
  }

  const current = await sql`SELECT sort_order FROM distributors WHERE id::text = ${id}`;
  if (current.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let sortOrder = Number(sort_order);
  if (!sortOrder || sortOrder <= 0) sortOrder = Number(current[0].sort_order);

  const rows = await sql`
    UPDATE distributors SET
      name = ${name},
      province = ${province || "Hồ Chí Minh"},
      district = ${district},
      address = ${address},
      hours = ${hours || ""},
      phone = ${phone || ""},
      sort_order = ${sortOrder},
      updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `;
  const distributor = rows[0];

  // Dịch 4 ngôn ngữ chạy NGẦM sau khi đã trả response — giữ nguyên bản dịch
  // cũ cho tới khi bản mới dịch xong, tránh bắt admin chờ khi bấm Lưu.
  after(async () => {
    try {
      const translations = await translateEntity({ name }, DISTRIBUTOR_TRANSLATE_SPEC);
      if (translations) {
        await sql`UPDATE distributors SET translations = ${JSON.stringify(translations)}::jsonb WHERE id::text = ${id}`;
      }
    } catch (err) {
      console.error("Background translateEntity failed for distributor", id, err);
    }
  });

  return NextResponse.json({ distributor });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await sql`DELETE FROM distributors WHERE id::text = ${id}`;
  return NextResponse.json({ ok: true });
}
