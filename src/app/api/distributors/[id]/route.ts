import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

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
  return NextResponse.json({ distributor: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await sql`DELETE FROM distributors WHERE id::text = ${id}`;
  return NextResponse.json({ ok: true });
}
