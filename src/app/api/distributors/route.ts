import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { translateEntity, type EntitySpec } from "@/lib/translate-content";

const DISTRIBUTOR_TRANSLATE_SPEC: EntitySpec = {
  name: { kind: "string" },
};

export async function GET() {
  const rows = await sql`SELECT * FROM distributors ORDER BY sort_order ASC, created_at ASC`;
  return NextResponse.json({ distributors: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  let sortOrder = Number(sort_order);
  if (!sortOrder || sortOrder <= 0) {
    const maxRows = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM distributors`;
    sortOrder = Number(maxRows[0].next);
  }

  const translations = await translateEntity({ name }, DISTRIBUTOR_TRANSLATE_SPEC);

  const rows = await sql`
    INSERT INTO distributors
      (name, province, district, address, hours, phone, translations, sort_order)
    VALUES
      (${name}, ${province || "Hồ Chí Minh"}, ${district}, ${address}, ${hours || ""}, ${phone || ""}, ${JSON.stringify(translations || {})}::jsonb, ${sortOrder})
    RETURNING *
  `;

  return NextResponse.json({ distributor: rows[0] }, { status: 201 });
}
