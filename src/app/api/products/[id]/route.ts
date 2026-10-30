import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { translateEntity, type EntitySpec } from "@/lib/translate-content";

const VALID_CATEGORIES = ["fresh", "seedling", "processed"];

const PRODUCT_TRANSLATE_SPEC: EntitySpec = {
  name: { kind: "string" },
  subtitle: { kind: "string" },
  standard: { kind: "string" },
  description: { kind: "string" },
  specs: { kind: "object[]", keys: ["label", "value"] },
  commitments: { kind: "string[]" },
  origin: { kind: "string" },
  season: { kind: "string" },
  packaging: { kind: "string" },
  storage: { kind: "string" },
  supply_status: { kind: "string" },
};

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
    origin,
    season,
    packaging,
    storage,
    supply_status,
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
      origin = ${origin || ""},
      season = ${season || ""},
      packaging = ${packaging || ""},
      storage = ${storage || ""},
      supply_status = ${supply_status || ""},
      sort_order = ${Number(sort_order) || 0},
      updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `;
  const product = rows[0];

  // Dịch 4 ngôn ngữ chạy NGẦM sau khi đã trả response — giữ nguyên bản dịch
  // cũ cho tới khi bản mới dịch xong, tránh bắt admin chờ khi bấm Lưu.
  after(async () => {
    try {
      const translations = await translateEntity(
        { name, subtitle, standard, description, specs, commitments, origin, season, packaging, storage, supply_status },
        PRODUCT_TRANSLATE_SPEC
      );
      if (translations) {
        // Merge (không ghi đè) — nếu 1 ngôn ngữ lỗi lần này, bản dịch cũ của
        // ngôn ngữ đó (lần lưu trước) vẫn được giữ thay vì mất trắng.
        await sql`UPDATE products SET translations = COALESCE(translations, '{}'::jsonb) || ${JSON.stringify(translations)}::jsonb WHERE id::text = ${id}`;
      }
    } catch (err) {
      console.error("Background translateEntity failed for product", id, err);
    }
  });

  return NextResponse.json({ product });
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
