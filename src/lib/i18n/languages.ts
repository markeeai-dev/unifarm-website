export type LocaleCode = "vi" | "en" | "ja" | "ko" | "zh-TW";

export type LanguageOption = {
  code: LocaleCode;
  label: string;
  flag: string;
};

/**
 * Danh sách ngôn ngữ hỗ trợ. `code` là mã gửi cho Google Translate qua
 * `/api/translate` (đã có sẵn, dùng chung với bản dịch bài blog).
 * "HongKong" dùng `zh-TW` (Hán tự phồn thể) vì Google Translate không có
 * mã riêng cho zh-HK ở endpoint không chính thức này — zh-TW là lựa chọn
 * gần nhất cho chữ phồn thể.
 */
export const LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh-TW", label: "香港", flag: "🇭🇰" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

export const DEFAULT_LOCALE: LocaleCode = "vi";
