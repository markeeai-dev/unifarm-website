import type { LocaleCode } from "./i18n/languages";

type TargetLocale = Exclude<LocaleCode, "vi">;

const TARGET_LOCALES: TargetLocale[] = ["en", "ja", "ko", "zh-TW"];

/** Mã ngôn ngữ đích theo đúng chuẩn MyMemory (langpair=vi|xx). */
const MYMEMORY_LANG_CODE: Record<TargetLocale, string> = {
  en: "en",
  ja: "ja",
  ko: "ko",
  "zh-TW": "zh-TW",
};

/** MyMemory giới hạn ~500 byte UTF-8 mỗi lượt gọi — cắt an toàn dưới mốc này. */
const MAX_CHUNK_BYTES = 450;
/** Khoảng cách tối thiểu giữa 2 lượt gọi MyMemory BẤT KỲ (toàn cục, không
 * theo từng ngôn ngữ) — tránh gửi dồn dập nhiều request cùng lúc (4 ngôn
 * ngữ đích) khiến MyMemory trả 429. */
const REQUEST_GAP_MS = 350;
const MAX_RETRIES = 4;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Hàng đợi toàn cục — nối đuôi mọi lượt gọi MyMemory thành 1 chuỗi tuần
 * tự duy nhất, cách nhau tối thiểu REQUEST_GAP_MS, dù có nhiều Promise.all
 * đang chạy song song ở phía gọi. */
let requestQueue: Promise<void> = Promise.resolve();

function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
  const run = requestQueue.then(() => fn());
  // Chuỗi tiếp theo chỉ đợi khoảng nghỉ, không đợi kết quả `fn()` (để lỗi
  // không làm treo hàng đợi) — nhưng vẫn đảm bảo request kế tiếp cách xa
  // đủ REQUEST_GAP_MS so với lúc request này ĐƯỢC GỬI.
  requestQueue = run.then(
    () => sleep(REQUEST_GAP_MS),
    () => sleep(REQUEST_GAP_MS)
  ) as Promise<void>;
  return run;
}

function byteLength(s: string): number {
  return Buffer.byteLength(s, "utf8");
}

/** Cắt 1 chuỗi dài thành các đoạn ≤ MAX_CHUNK_BYTES, ưu tiên cắt ở ranh giới câu/dấu câu. */
function chunkText(text: string): string[] {
  if (byteLength(text) <= MAX_CHUNK_BYTES) return [text];

  const sentences = text.split(/(?<=[.!?…。！？])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (byteLength(candidate) <= MAX_CHUNK_BYTES) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      // Câu tự nó cũng quá dài — cắt cứng theo ký tự.
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

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function myMemoryTranslateOneAttempt(text: string, target: string): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL;
  const params = new URLSearchParams({
    q: text,
    langpair: `vi|${target}`,
  });
  if (email) params.set("de", email);

  const res = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`);
  if (res.status === 429) {
    const err = new Error("MyMemory API error 429") as Error & { status?: number };
    err.status = 429;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`MyMemory API error ${res.status}`);
  }
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (typeof translated !== "string" || !translated) {
    throw new Error(`Unexpected MyMemory response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  // "MYMEMORY WARNING..." xuất hiện khi vượt hạn mức ngày — coi như lỗi.
  if (translated.startsWith("MYMEMORY WARNING")) {
    throw new Error(translated);
  }
  return decodeEntities(translated);
}

/** Gọi MyMemory qua hàng đợi toàn cục (1 request tại 1 thời điểm), tự
 * retry với backoff tăng dần khi bị 429 (dồn dập request). */
async function myMemoryTranslateOne(text: string, target: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await enqueueRequest(() => myMemoryTranslateOneAttempt(text, target));
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      if (status === 429 && attempt < MAX_RETRIES) {
        await sleep(1500 * Math.pow(2, attempt)); // 1.5s, 3s, 6s, 12s
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

/** Dịch 1 chuỗi (có thể dài, tự động cắt đoạn) sang 1 ngôn ngữ đích. */
async function translateString(text: string, target: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const chunks = chunkText(trimmed);
  const translatedChunks: string[] = [];
  for (const chunk of chunks) {
    translatedChunks.push(await myMemoryTranslateOne(chunk, target));
  }
  return translatedChunks.join(" ");
}

/**
 * Dịch nội dung HTML dạng khối (đầu ra Tiptap: p/h1-h6/li/blockquote phẳng,
 * không lồng sâu) — tách theo từng khối, bỏ thẻ inline bên trong (b/i/a...)
 * để lấy chữ thuần rồi dịch, sau đó bọc lại đúng thẻ khối gốc. Định dạng
 * inline (đậm/nghiêng/link) trong bản dịch sẽ mất, nhưng cấu trúc đoạn/tiêu
 * đề vẫn giữ nguyên — đánh đổi hợp lý vì MyMemory không hỗ trợ dịch HTML.
 */
async function translateHtmlBlocks(html: string, target: string): Promise<string> {
  const blockRe = /<(p|h[1-6]|li|blockquote)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  const blocks: { tag: string; attrs: string; inner: string }[] = [];
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let matchedAny = false;

  while ((match = blockRe.exec(html))) {
    matchedAny = true;
    blocks.push({ tag: match[1], attrs: match[2], inner: match[3] });
    lastIndex = blockRe.lastIndex;
  }

  if (!matchedAny) {
    // Không nhận diện được cấu trúc khối quen thuộc — dịch cả khối như văn bản thuần,
    // bọc lại trong 1 thẻ <p> duy nhất để tránh mất trắng nội dung.
    const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!plain) return html;
    const translated = await translateString(plain, target);
    return `<p>${translated}</p>`;
  }

  const translatedBlocks: string[] = [];
  for (const block of blocks) {
    const plainInner = block.inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!plainInner) {
      translatedBlocks.push(`<${block.tag}${block.attrs}>${block.inner}</${block.tag}>`);
      continue;
    }
    const translatedInner = await translateString(plainInner, target);
    translatedBlocks.push(`<${block.tag}${block.attrs}>${translatedInner}</${block.tag}>`);
  }

  // Phần dư sau khối cuối cùng (thường rỗng/whitespace) — giữ nguyên.
  const trailing = html.slice(lastIndex).trim();
  return translatedBlocks.join("") + (trailing ? `\n${trailing}` : "");
}

type FieldSpec =
  | { kind: "string" }
  | { kind: "string[]" }
  | { kind: "object[]"; keys: string[] }
  | { kind: "html" };

export type EntitySpec = Record<string, FieldSpec>;

type Leaf =
  | { field: string; kind: "string" }
  | { field: string; kind: "string[]"; index: number }
  | { field: string; kind: "object[]"; index: number; key: string };

function extractLeaves(
  record: Record<string, unknown>,
  spec: EntitySpec
): { texts: string[]; plan: Leaf[] } {
  const texts: string[] = [];
  const plan: Leaf[] = [];

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
          const raw = (item as Record<string, unknown> | null | undefined)?.[key];
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

function cloneForRebuild(record: Record<string, unknown>, spec: EntitySpec): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [field, fieldSpec] of Object.entries(spec)) {
    if (fieldSpec.kind === "html") continue;
    const value = record[field];
    result[field] = Array.isArray(value)
      ? value.map((v) => (v && typeof v === "object" ? { ...(v as object) } : v))
      : value;
  }
  return result;
}

function applyLeaves(target: Record<string, unknown>, plan: Leaf[], translated: string[]) {
  plan.forEach((leaf, i) => {
    const text = translated[i];
    if (leaf.kind === "string") {
      target[leaf.field] = text;
    } else if (leaf.kind === "string[]") {
      (target[leaf.field] as string[])[leaf.index] = text;
    } else if (leaf.kind === "object[]") {
      (target[leaf.field] as Record<string, unknown>[])[leaf.index][leaf.key] = text;
    }
  });
}

/**
 * Dịch một bản ghi admin (sản phẩm / tin tuyển dụng / mốc timeline /
 * cửa hàng / bài blog) sang 4 ngôn ngữ đích, theo `spec` mô tả field nào
 * cần dịch và kiểu dữ liệu của nó. Dùng MyMemory (miễn phí, không cần
 * API key/thẻ thanh toán — https://mymemory.translated.net).
 *
 * Trả về `null` nếu KHÔNG có nội dung nào để dịch, hoặc nếu gọi API thất
 * bại (mạng, hết hạn mức ngày...) — KHÔNG throw, để thao tác lưu nội dung
 * gốc tiếng Việt trong route admin luôn thành công dù dịch tự động lỗi.
 */
export async function translateEntity(
  record: Record<string, unknown>,
  spec: EntitySpec
): Promise<Record<TargetLocale, Record<string, unknown>> | null> {
  const htmlFields = Object.entries(spec).filter(([, s]) => s.kind === "html").map(([f]) => f);
  const plainSpec: EntitySpec = Object.fromEntries(
    Object.entries(spec).filter(([, s]) => s.kind !== "html")
  );

  const { texts, plan } = extractLeaves(record, plainSpec);
  if (texts.length === 0 && htmlFields.length === 0) return null;

  const result = {} as Record<TargetLocale, Record<string, unknown>>;

  try {
    // Dịch tuần tự trong cùng 1 ngôn ngữ (mỗi lượt gọi chỉ dịch 1 chuỗi —
    // MyMemory không hỗ trợ dịch theo lô), nhưng chạy song song giữa 4
    // ngôn ngữ đích để không quá chậm.
    await Promise.all(
      TARGET_LOCALES.map(async (locale) => {
        const target = MYMEMORY_LANG_CODE[locale];

        const translatedPlain: string[] = [];
        for (const text of texts) {
          translatedPlain.push(await translateString(text, target));
        }

        const translatedHtml: string[] = [];
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
  } catch (err) {
    console.error("translateEntity: MyMemory call failed, skipping auto-translation:", err);
    return null;
  }

  return result;
}
