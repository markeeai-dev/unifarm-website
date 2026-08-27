// Dịch lại (backfill) toàn bộ nội dung admin đã lưu TRƯỚC KHI tính năng
// tự động dịch tồn tại — các API route admin chỉ tự dịch khi TẠO MỚI hoặc
// SỬA một bản ghi, nên những bản ghi cũ vẫn có `translations = {}` cho đến
// khi được sửa lại (hoặc chạy script này một lần).
//
// Dùng MyMemory (miễn phí, không cần API key/thẻ thanh toán). Có thể đặt
// biến môi trường MYMEMORY_EMAIL trong .env.local để tăng hạn mức dịch
// mỗi ngày (không bắt buộc).
//
// Usage: node scripts/backfill-translations.mjs [--only=products,jobs,timeline,distributors,blogs]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set (checked process.env and .env.local)");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const TARGET_LOCALES = ["en", "ja", "ko", "zh-TW"];
const MYMEMORY_LANG_CODE = { en: "en", ja: "ja", ko: "ko", "zh-TW": "zh-TW" };
const MAX_CHUNK_BYTES = 450;
const REQUEST_GAP_MS = 350;
const MAX_RETRIES = 4;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Hàng đợi toàn cục — nối đuôi mọi lượt gọi MyMemory thành 1 chuỗi tuần tự,
// cách nhau tối thiểu REQUEST_GAP_MS, dù nhiều Promise.all đang chạy song song.
let requestQueue = Promise.resolve();
function enqueueRequest(fn) {
  const run = requestQueue.then(() => fn());
  requestQueue = run.then(
    () => sleep(REQUEST_GAP_MS),
    () => sleep(REQUEST_GAP_MS)
  );
  return run;
}

function byteLength(s) {
  return Buffer.byteLength(s, "utf8");
}

function chunkText(text) {
  if (byteLength(text) <= MAX_CHUNK_BYTES) return [text];

  const sentences = text.split(/(?<=[.!?…。！？])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (byteLength(candidate) <= MAX_CHUNK_BYTES) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      if (byteLength(sentence) > MAX_CHUNK_BYTES) {
        let piece = "";
        for (const ch of sentence) {
          const next = piece + ch;
          if (byteLength(next) > MAX_CHUNK_BYTES) {
            chunks.push(piece);
            piece = ch;
          } else {
            piece = next;
          }
        }
        current = piece;
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function myMemoryTranslateOneAttempt(text, target) {
  const email = process.env.MYMEMORY_EMAIL;
  const params = new URLSearchParams({ q: text, langpair: `vi|${target}` });
  if (email) params.set("de", email);

  const res = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`);
  if (res.status === 429) {
    const err = new Error("MyMemory API error 429");
    err.status = 429;
    throw err;
  }
  if (!res.ok) throw new Error(`MyMemory API error ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (typeof translated !== "string" || !translated) {
    throw new Error(`Unexpected MyMemory response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  if (translated.startsWith("MYMEMORY WARNING")) throw new Error(translated);
  return decodeEntities(translated);
}

async function myMemoryTranslateOne(text, target) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await enqueueRequest(() => myMemoryTranslateOneAttempt(text, target));
    } catch (err) {
      lastErr = err;
      if (err.status === 429 && attempt < MAX_RETRIES) {
        await sleep(1500 * Math.pow(2, attempt)); // 1.5s, 3s, 6s, 12s
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

async function translateString(text, target) {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const chunks = chunkText(trimmed);
  const translatedChunks = [];
  for (const chunk of chunks) {
    translatedChunks.push(await myMemoryTranslateOne(chunk, target));
  }
  return translatedChunks.join(" ");
}

async function translateHtmlBlocks(html, target) {
  const blockRe = /<(p|h[1-6]|li|blockquote)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  const blocks = [];
  let match;
  let lastIndex = 0;
  let matchedAny = false;

  while ((match = blockRe.exec(html))) {
    matchedAny = true;
    blocks.push({ tag: match[1], attrs: match[2], inner: match[3] });
    lastIndex = blockRe.lastIndex;
  }

  if (!matchedAny) {
    const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!plain) return html;
    const translated = await translateString(plain, target);
    return `<p>${translated}</p>`;
  }

  const translatedBlocks = [];
  for (const block of blocks) {
    const plainInner = block.inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!plainInner) {
      translatedBlocks.push(`<${block.tag}${block.attrs}>${block.inner}</${block.tag}>`);
      continue;
    }
    const translatedInner = await translateString(plainInner, target);
    translatedBlocks.push(`<${block.tag}${block.attrs}>${translatedInner}</${block.tag}>`);
  }

  const trailing = html.slice(lastIndex).trim();
  return translatedBlocks.join("") + (trailing ? `\n${trailing}` : "");
}

function extractLeaves(record, spec) {
  const texts = [];
  const plan = [];
  for (const [field, fieldSpec] of Object.entries(spec)) {
    const value = record[field];
    if (fieldSpec.kind === "string") {
      const s = typeof value === "string" ? value.trim() : "";
      if (s) {
        texts.push(s);
        plan.push({ field, kind: "string" });
      }
    } else if (fieldSpec.kind === "string[]") {
      const arr = Array.isArray(value) ? value : [];
      arr.forEach((item, index) => {
        const s = typeof item === "string" ? item.trim() : "";
        if (s) {
          texts.push(s);
          plan.push({ field, kind: "string[]", index });
        }
      });
    } else if (fieldSpec.kind === "object[]") {
      const arr = Array.isArray(value) ? value : [];
      arr.forEach((item, index) => {
        for (const key of fieldSpec.keys) {
          const raw = item?.[key];
          const s = typeof raw === "string" ? raw.trim() : "";
          if (s) {
            texts.push(s);
            plan.push({ field, kind: "object[]", index, key });
          }
        }
      });
    }
  }
  return { texts, plan };
}

function cloneForRebuild(record, spec) {
  const result = {};
  for (const [field, fieldSpec] of Object.entries(spec)) {
    if (fieldSpec.kind === "html") continue;
    const value = record[field];
    result[field] = Array.isArray(value)
      ? value.map((v) => (v && typeof v === "object" ? { ...v } : v))
      : value;
  }
  return result;
}

function applyLeaves(target, plan, translated) {
  plan.forEach((leaf, i) => {
    const text = translated[i];
    if (leaf.kind === "string") target[leaf.field] = text;
    else if (leaf.kind === "string[]") target[leaf.field][leaf.index] = text;
    else if (leaf.kind === "object[]") target[leaf.field][leaf.index][leaf.key] = text;
  });
}

async function translateEntity(record, spec) {
  const htmlFields = Object.entries(spec).filter(([, s]) => s.kind === "html").map(([f]) => f);
  const plainSpec = Object.fromEntries(Object.entries(spec).filter(([, s]) => s.kind !== "html"));

  const { texts, plan } = extractLeaves(record, plainSpec);
  if (texts.length === 0 && htmlFields.length === 0) return null;

  const result = {};
  await Promise.all(
    TARGET_LOCALES.map(async (locale) => {
      const target = MYMEMORY_LANG_CODE[locale];

      const translatedPlain = [];
      for (const text of texts) {
        translatedPlain.push(await translateString(text, target));
      }

      const translatedHtml = [];
      for (const field of htmlFields) {
        const html = record[field];
        translatedHtml.push(
          typeof html === "string" && html.trim() ? await translateHtmlBlocks(html, target) : ""
        );
      }

      const rebuilt = cloneForRebuild(record, plainSpec);
      applyLeaves(rebuilt, plan, translatedPlain);
      htmlFields.forEach((field, i) => {
        if (translatedHtml[i]) rebuilt[field] = translatedHtml[i];
      });
      result[locale] = rebuilt;
    })
  );
  return result;
}

// Cùng spec với các API route admin (src/lib/translate-content.ts callers).
const ENTITIES = {
  products: {
    spec: {
      name: { kind: "string" },
      subtitle: { kind: "string" },
      standard: { kind: "string" },
      description: { kind: "string" },
      specs: { kind: "object[]", keys: ["label", "value"] },
      commitments: { kind: "string[]" },
    },
    fetchAll: () => sql`SELECT * FROM products`,
    update: (id, translations) =>
      sql`UPDATE products SET translations = ${JSON.stringify(translations)}::jsonb WHERE id = ${id}`,
  },
  jobs: {
    spec: {
      title: { kind: "string" },
      dept: { kind: "string" },
      income: { kind: "string" },
      benefit: { kind: "string" },
      tags: { kind: "string[]" },
    },
    fetchAll: () => sql`SELECT * FROM jobs`,
    update: (id, translations) =>
      sql`UPDATE jobs SET translations = ${JSON.stringify(translations)}::jsonb WHERE id = ${id}`,
  },
  timeline: {
    spec: {
      caption: { kind: "string" },
      partner_title: { kind: "string" },
      partner_bullets: { kind: "string[]" },
      stat: { kind: "object[]", keys: ["label", "value"] },
      bottom: { kind: "string[]" },
      media: { kind: "object[]", keys: ["label"] },
    },
    fetchAll: () => sql`SELECT * FROM timeline_milestones`,
    update: (id, translations) =>
      sql`UPDATE timeline_milestones SET translations = ${JSON.stringify(translations)}::jsonb WHERE id = ${id}`,
  },
  distributors: {
    spec: { name: { kind: "string" } },
    fetchAll: () => sql`SELECT * FROM distributors`,
    update: (id, translations) =>
      sql`UPDATE distributors SET translations = ${JSON.stringify(translations)}::jsonb WHERE id = ${id}`,
  },
  blogs: {
    spec: {
      title: { kind: "string" },
      excerpt: { kind: "string" },
      tag: { kind: "string" },
      content: { kind: "html" },
    },
    fetchAll: () => sql`SELECT * FROM blog_posts`,
    update: (id, translations) =>
      sql`UPDATE blog_posts SET translations = ${JSON.stringify(translations)}::jsonb WHERE id = ${id}`,
  },
};

const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice("--only=".length).split(",") : null;

async function main() {
  for (const [key, entity] of Object.entries(ENTITIES)) {
    if (only && !only.includes(key)) continue;

    const rows = await entity.fetchAll();
    console.log(`\n=== ${key}: ${rows.length} bản ghi ===`);

    let done = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of rows) {
      const hasTranslations =
        row.translations && typeof row.translations === "object" && Object.keys(row.translations).length > 0;
      if (hasTranslations) {
        skipped++;
        continue;
      }

      try {
        const translations = await translateEntity(row, entity.spec);
        if (!translations) {
          skipped++;
          continue;
        }
        await entity.update(row.id, translations);
        done++;
        process.stdout.write(".");
      } catch (err) {
        failed++;
        console.error(`\n  Lỗi khi dịch id=${row.id}:`, err.message);
      }
    }

    console.log(`\n  Đã dịch: ${done} | Bỏ qua (đã có bản dịch/không có nội dung): ${skipped} | Lỗi: ${failed}`);
  }

  console.log("\nHoàn tất backfill.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
