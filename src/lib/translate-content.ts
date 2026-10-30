import type { LocaleCode } from "./i18n/languages";

type TargetLocale = Exclude<LocaleCode, "vi">;

const TARGET_LOCALES: TargetLocale[] = ["en", "ja", "ko", "zh-TW"];

/** Mã ngôn ngữ đích theo đúng chuẩn Google Translate. */
const GOOGLE_LANG_CODE: Record<TargetLocale, string> = {
  en: "en",
  ja: "ja",
  ko: "ko",
  "zh-TW": "zh-TW",
};

/** Endpoint dịch miễn phí của Google Translate (không cần API key/thẻ thanh
 * toán — dùng chung cơ chế với trang translate.google.com) — chất lượng dịch
 * tốt hơn hẳn MyMemory, đặc biệt với tiếng Trung phồn thể (zh-TW). Không phải
 * API chính thức có SLA nên vẫn giữ hàng đợi + retry bên dưới để chịu được
 * lỗi/giới hạn tốc độ tạm thời. */
const GOOGLE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

/** Giữ chunk vừa phải để URL (GET) không quá dài — Google không giới hạn
 * ngặt như MyMemory (450 byte) nhưng vẫn cắt an toàn. */
const MAX_CHUNK_BYTES = 1800;
/** Khoảng cách tối thiểu giữa 2 lượt gọi BẤT KỲ (toàn cục, không theo từng
 * ngôn ngữ) — tránh gửi dồn dập nhiều request cùng lúc (4 ngôn ngữ đích)
 * khiến endpoint tạm thời chặn (429). */
const REQUEST_GAP_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Hàng đợi toàn cục — nối đuôi mọi lượt gọi dịch thành 1 chuỗi tuần
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

async function googleTranslateOneAttempt(text: string, target: string): Promise<string> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "vi",
    tl: target,
    dt: "t",
    q: text,
  });

  const res = await fetch(`${GOOGLE_ENDPOINT}?${params.toString()}`);
  if (res.status === 429) {
    const err = new Error("Google Translate error 429") as Error & { status?: number };
    err.status = 429;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`Google Translate error ${res.status}`);
  }
  const data = await res.json();
  // Dạng trả về: [[[ "translated chunk", "original chunk", null, null, ... ], ...], null, "vi", ...]
  const segments = data?.[0];
  if (!Array.isArray(segments)) {
    throw new Error(`Unexpected Google Translate response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  const translated = segments.map((seg: unknown[]) => seg?.[0] ?? "").join("");
  if (!translated) {
    throw new Error(`Empty Google Translate response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return decodeEntities(translated);
}

/** Gọi Google Translate qua hàng đợi toàn cục (1 request tại 1 thời điểm),
 * tự retry (ngắn) khi bị chặn tạm thời (429) — nếu vẫn lỗi thì để nơi gọi
 * rơi sang MyMemory (xem `translateOneChunk`) thay vì chờ lâu ở đây. */
const GOOGLE_RETRIES = 0;
async function googleTranslateOne(text: string, target: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= GOOGLE_RETRIES; attempt++) {
    try {
      return await enqueueRequest(() => googleTranslateOneAttempt(text, target));
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      if (status === 429 && attempt < GOOGLE_RETRIES) {
        await sleep(1500);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

/** MyMemory — dự phòng khi Google Translate tạm thời bị chặn (429 kéo dài).
 * Chất lượng kém hơn Google với một số ngôn ngữ (vd. zh-TW) nhưng không bị
 * chặn theo IP như endpoint Google không chính thức, nên dùng làm lưới an
 * toàn để không phải chờ Google tự gỡ chặn mới dịch tiếp được. */
async function myMemoryTranslateOneAttempt(text: string, target: string): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL;
  const params = new URLSearchParams({ q: text, langpair: `vi|${target}` });
  if (email) params.set("de", email);

  const res = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`);
  if (!res.ok) throw new Error(`MyMemory error ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (typeof translated !== "string" || !translated || translated.startsWith("MYMEMORY WARNING")) {
    throw new Error(`MyMemory unusable response: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return decodeEntities(translated);
}

async function myMemoryTranslateOne(text: string, target: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      return await enqueueRequest(() => myMemoryTranslateOneAttempt(text, target));
    } catch (err) {
      lastErr = err;
      await sleep(800 * (attempt + 1));
    }
  }
  throw lastErr;
}

/** Dịch 1 đoạn ngắn: ưu tiên Google (chất lượng cao hơn), tự động rơi sang
 * MyMemory nếu Google đang tạm bị chặn/lỗi — không bao giờ chờ Google quá
 * lâu trước khi có kết quả dịch. */
async function translateOneChunk(text: string, target: string): Promise<string> {
  try {
    return await googleTranslateOne(text, target);
  } catch {
    return await myMemoryTranslateOne(text, target);
  }
}

/** Dịch 1 chuỗi (có thể dài, tự động cắt đoạn) sang 1 ngôn ngữ đích. */
async function translateString(text: string, target: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const chunks = chunkText(trimmed);
  const translatedChunks: string[] = [];
  for (const chunk of chunks) {
    translatedChunks.push(await translateOneChunk(chunk, target));
  }
  return translatedChunks.join(" ");
}

/**
 * Dịch nội dung HTML dạng khối (đầu ra Tiptap: p/h1-h6/li/blockquote phẳng,
 * không lồng sâu) — tách theo từng khối, bỏ thẻ inline bên trong (b/i/a...)
 * để lấy chữ thuần rồi dịch, sau đó bọc lại đúng thẻ khối gốc. Định dạng
 * inline (đậm/nghiêng/link) trong bản dịch sẽ mất, nhưng cấu trúc đoạn/tiêu
 * đề vẫn giữ nguyên — đánh đổi hợp lý vì endpoint dịch dạng text không hỗ trợ dịch HTML.
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
 * cần dịch và kiểu dữ liệu của nó. Dùng endpoint dịch miễn phí của Google
 * Translate (không cần API key/thẻ thanh toán).
 *
 * Mỗi ngôn ngữ đích được dịch và bắt lỗi ĐỘC LẬP (Promise.allSettled) — một
 * ngôn ngữ lỗi (hết hạn mức ngày, mạng chập chờn...) không còn kéo theo 3
 * ngôn ngữ còn lại mất trắng như trước (Promise.all cũ: 1 lỗi -> cả 4 đều
 * null). Trả về object chỉ gồm những ngôn ngữ dịch THÀNH CÔNG; nơi gọi cần
 * merge (không ghi đè) vào `translations` hiện có trong DB để không mất các
 * ngôn ngữ đã dịch ở lần lưu trước. Trả về `null` chỉ khi KHÔNG có nội dung
 * nào để dịch, hoặc CẢ 4 ngôn ngữ đều lỗi — không throw, để thao tác lưu nội
 * dung gốc tiếng Việt trong route admin luôn thành công dù dịch tự động lỗi.
 */
export async function translateEntity(
  record: Record<string, unknown>,
  spec: EntitySpec
): Promise<Partial<Record<TargetLocale, Record<string, unknown>>> | null> {
  const htmlFields = Object.entries(spec).filter(([, s]) => s.kind === "html").map(([f]) => f);
  const plainSpec: EntitySpec = Object.fromEntries(
    Object.entries(spec).filter(([, s]) => s.kind !== "html")
  );

  const { texts, plan } = extractLeaves(record, plainSpec);
  if (texts.length === 0 && htmlFields.length === 0) return null;

  // Dịch tuần tự trong cùng 1 ngôn ngữ (mỗi lượt gọi chỉ dịch 1 chuỗi —
  // endpoint không hỗ trợ dịch theo lô), nhưng chạy song song giữa 4
  // ngôn ngữ đích để không quá chậm. `allSettled` để 1 ngôn ngữ lỗi không
  // làm rớt kết quả của 3 ngôn ngữ còn lại.
  const settled = await Promise.allSettled(
    TARGET_LOCALES.map(async (locale) => {
      const target = GOOGLE_LANG_CODE[locale];

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

      return { locale, rebuilt };
    })
  );

  const result: Partial<Record<TargetLocale, Record<string, unknown>>> = {};
  for (const outcome of settled) {
    if (outcome.status === "fulfilled") {
      result[outcome.value.locale] = outcome.value.rebuilt;
    } else {
      console.error("translateEntity: Google Translate call failed for one locale, skipping it:", outcome.reason);
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
