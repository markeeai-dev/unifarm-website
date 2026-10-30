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

  const rows = await sql`
    INSERT INTO products
      (name, price, category, type, image, gallery, subtitle, standard, description, specs, commitments, origin, season, packaging, storage, supply_status, translations, sort_order)
    VALUES
      (${name}, ${price || 0}, ${category}, ${type || "other"}, ${image || ""},
       ${JSON.stringify(gallery || [])}::jsonb, ${subtitle || ""}, ${standard || ""},
       ${description || ""}, ${JSON.stringify(specs || [])}::jsonb,
       ${JSON.stringify(commitments || [])}::jsonb, ${origin || ""}, ${season || ""},
       ${packaging || ""}, ${storage || ""}, ${supply_status || ""},
       ${JSON.stringify({})}::jsonb, ${sortOrder})
    RETURNING *
  `;
  const product = rows[0];

  // Dịch 4 ngôn ngữ chạy NGẦM sau khi đã trả response — tránh bắt admin
  // chờ cả chục giây gọi API dịch mỗi lần bấm Lưu (xem translate-content.ts).
  after(async () => {
    try {
      const translations = await translateEntity(
        { name, subtitle, standard, description, specs, commitments, origin, season, packaging, storage, supply_status },
        PRODUCT_TRANSLATE_SPEC
      );
      if (translations) {
        // Merge (không ghi đè) — nếu sau này 1 ngôn ngữ lỗi, các ngôn ngữ đã
        // dịch thành công ở lần lưu trước đó trong `translations` vẫn giữ nguyên.
        await sql`UPDATE products SET translations = COALESCE(translations, '{}'::jsonb) || ${JSON.stringify(translations)}::jsonb WHERE id = ${product.id}`;
      }
    } catch (err) {
      console.error("Background translateEntity failed for product", product.id, err);
    }
  });

  return NextResponse.json({ product }, { status: 201 });
}
