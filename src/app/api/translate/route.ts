import { NextRequest, NextResponse } from "next/server";

/**
 * Dịch tự động (miễn phí, không cần API key) qua endpoint không chính thức
 * của Google Translate — cùng cơ chế widget Google Translate trên web dùng.
 * Dùng để tự động hiển thị bài blog (viết bằng tiếng Việt) sang tiếng Anh
 * khi người đọc chuyển ngôn ngữ, không cần nhập nội dung 2 lần.
 */
export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLang) {
      return NextResponse.json(
        { error: "Missing texts array or targetLang" },
        { status: 400 }
      );
    }

    if (texts.length > 50) {
      return NextResponse.json(
        { error: "Too many texts (max 50)" },
        { status: 400 }
      );
    }

    const separator = "\n\n---SPLIT---\n\n";
    const combined = texts.join(separator);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(combined)}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const fullTranslation = (data[0] as Array<[string, ...unknown[]]>)
      .map((item) => item[0])
      .join("");

    const translations = fullTranslation
      .split(/\n?\s*---\s*SPLIT\s*---\s*\n?/i)
      .map((t: string) => t.trim());

    while (translations.length < texts.length) {
      translations.push(texts[translations.length]);
    }

    return NextResponse.json({
      translations: translations.slice(0, texts.length),
    });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
