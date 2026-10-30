import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { translateEntity, type EntitySpec } from "@/lib/translate-content";

// Cho phép chạy lâu hơn mặc định — dịch bù nhiều sản phẩm có thể mất vài
// chục giây do hàng đợi MyMemory toàn cục (xem translate-content.ts).
export const maxDuration = 300;

const TARGET_LOCALES = ["en", "ja", "ko", "zh-TW"] as const;

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

/**
 * Quét toàn bộ sản phẩm, dịch bù cho những sản phẩm đang thiếu 1 hoặc nhiều
 * trong 4 ngôn ngữ đích (do lần lưu trước bị lỗi dịch nền — hết hạn mức
 * ngày, mạng chập chờn...). Chạy TUẦN TỰ từng sản phẩm (không song song)
 * để không dồn dập request lên MyMemory nhiều hơn mức hàng đợi đã cho phép.
 * Luôn merge (không ghi đè) vào `translations` hiện có.
 */
export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await sql`SELECT * FROM products ORDER BY sort_order ASC, created_at ASC`;

  let alreadyComplete = 0;
  let fixed = 0;
  let stillIncomplete = 0;
  const stillIncompleteNames: string[] = [];

  for (const product of products) {
    const existing = (product.translations ?? {}) as Record<string, unknown>;
    const missingBefore = TARGET_LOCALES.filter((l) => !existing[l]);
    if (missingBefore.length === 0) {
      alreadyComplete++;
      continue;
    }

    const translations = await translateEntity(
      {
        name: product.name,
        subtitle: product.subtitle,
        standard: product.standard,
        description: product.description,
        specs: product.specs,
        commitments: product.commitments,
        origin: product.origin,
        season: product.season,
        packaging: product.packaging,
        storage: product.storage,
        supply_status: product.supply_status,
      },
      PRODUCT_TRANSLATE_SPEC
    );

    if (!translations) {
      stillIncomplete++;
      stillIncompleteNames.push(product.name);
      continue;
    }

    await sql`UPDATE products SET translations = COALESCE(translations, '{}'::jsonb) || ${JSON.stringify(translations)}::jsonb WHERE id = ${product.id}`;

    const stillMissing = missingBefore.filter((l) => !(l in translations));
    if (stillMissing.length > 0) {
      stillIncomplete++;
      stillIncompleteNames.push(product.name);
    } else {
      fixed++;
    }
  }

  return NextResponse.json({
    total: products.length,
    alreadyComplete,
    fixed,
    stillIncomplete,
    stillIncompleteNames,
  });
}
