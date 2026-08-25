import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

const VALID_CATEGORIES = ["fresh", "seedling", "processed"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM products WHERE id::text = ${id}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product: rows[0] });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const {
    name,
    price,
    category,
    type,
    image,
    gallery,
    subtitle,
    standard,
    description,
    specs,
    commitments,
    sort_order,
  } = body;

  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: "Thiếu tên sản phẩm" }, { status: 400 });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Danh mục không hợp lệ" }, { status: 400 });
  }

  const current = await sql`SELECT id FROM products WHERE id::text = ${id}`;
  if (current.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows = await sql`
    UPDATE products SET
      name = ${name},
      price = ${price || 0},
      category = ${category},
      type = ${type || "other"},
      image = ${image || ""},
      gallery = ${JSON.stringify(gallery || [])}::jsonb,
      subtitle = ${subtitle || ""},
      standard = ${standard || ""},
      description = ${description || ""},
      specs = ${JSON.stringify(specs || [])}::jsonb,
      commitments = ${JSON.stringify(commitments || [])}::jsonb,
      sort_order = ${Number(sort_order) || 0},
      updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM products WHERE id::text = ${id}`;
  return NextResponse.json({ ok: true });
}
