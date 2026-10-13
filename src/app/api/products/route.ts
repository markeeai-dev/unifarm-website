import { NextRequest, NextResponse } from "next/server";
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

  let sortOrder = Number(sort_order) || 0;
  if (sortOrder <= 0) {
    const rows = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM products`;
    sortOrder = Number(rows[0].next);
  }

  const translations = await translateEntity(
    { name, subtitle, standard, description, specs, commitments, origin, season, packaging, storage, supply_status },
    PRODUCT_TRANSLATE_SPEC
  );

  const rows = await sql`
    INSERT INTO products
      (name, price, category, type, image, gallery, subtitle, standard, description, specs, commitments, origin, season, packaging, storage, supply_status, translations, sort_order)
    VALUES
      (${name}, ${price || 0}, ${category}, ${type || "other"}, ${image || ""},
       ${JSON.stringify(gallery || [])}::jsonb, ${subtitle || ""}, ${standard || ""},
       ${description || ""}, ${JSON.stringify(specs || [])}::jsonb,
       ${JSON.stringify(commitments || [])}::jsonb, ${origin || ""}, ${season || ""},
       ${packaging || ""}, ${storage || ""}, ${supply_status || ""},
       ${JSON.stringify(translations || {})}::jsonb, ${sortOrder})
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] }, { status: 201 });
}
