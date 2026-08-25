import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

const VALID_CATEGORIES = ["fresh", "seedling", "processed"];

export async function GET() {
  const rows = await sql`SELECT * FROM products ORDER BY sort_order ASC, created_at ASC`;
  return NextResponse.json({ products: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  let sortOrder = Number(sort_order) || 0;
  if (sortOrder <= 0) {
    const rows = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM products`;
    sortOrder = Number(rows[0].next);
  }

  const rows = await sql`
    INSERT INTO products
      (name, price, category, type, image, gallery, subtitle, standard, description, specs, commitments, sort_order)
    VALUES
      (${name}, ${price || 0}, ${category}, ${type || "other"}, ${image || ""},
       ${JSON.stringify(gallery || [])}::jsonb, ${subtitle || ""}, ${standard || ""},
       ${description || ""}, ${JSON.stringify(specs || [])}::jsonb,
       ${JSON.stringify(commitments || [])}::jsonb, ${sortOrder})
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] }, { status: 201 });
}
