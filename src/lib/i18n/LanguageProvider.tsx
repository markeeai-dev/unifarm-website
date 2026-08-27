/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/**
 * LanguageProvider — dịch toàn bộ website theo ngôn ngữ đang chọn.
 * ------------------------------------------------------------------
 * Dùng từ điển dịch TĨNH (viết sẵn, lưu trong `dictionary.ts`) — không gọi
 * API dịch trực tuyến nào, không phụ thuộc dịch vụ ngoài, hiển thị tức thì
 * và ổn định 100%. Mọi đoạn chữ tiếng Việt hiển thị trên trang được bọc
 * qua hàm `t("...")`: nếu ngôn ngữ đang chọn là "vi" hoặc chưa có bản dịch
 * cho câu đó, trả về nguyên văn tiếng Việt (an toàn, không bao giờ trắng
 * trang hay hiện "undefined").
 *
 * Nội dung lấy từ database (bài blog, tin tuyển dụng, sản phẩm, cửa
 * hàng...) do admin tự nhập nên KHÔNG có trong từ điển tĩnh này — sẽ luôn
 * hiển thị tiếng Việt bất kể ngôn ngữ đang chọn (phần nội dung do người
 * dùng nhập, không thể dịch sẵn trước).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, type LocaleCode } from "./languages";
import { TRANSLATIONS } from "./dictionary";

const STORAGE_KEY_LOCALE = "unifarm_locale";

type LanguageContextValue = {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  /** Dịch 1 đoạn chữ theo ngôn ngữ đang chọn. Trả về nguyên văn tiếng
   * Việt nếu đang ở "vi" hoặc chưa có bản dịch sẵn cho câu đó. */
  t: (text: string | null | undefined) => string;
  /** Dịch 1 field của nội dung admin (sản phẩm/tin tuyển dụng/timeline/
   * cửa hàng/bài blog) — đọc từ cột `translations` (JSONB) được các API
   * route admin tự dịch sẵn khi lưu (xem `src/lib/translate-content.ts`).
   * Trả về `fallback` (giá trị tiếng Việt gốc) nếu đang ở "vi", hoặc nếu
   * bản ghi chưa có bản dịch cho field/ngôn ngữ đó (vd. lưu trước khi
   * cấu hình GOOGLE_TRANSLATE_API_KEY). Dùng chung cho cả field dạng
   * chuỗi lẫn mảng (specs, commitments, tags...) vì `translations` lưu
   * nguyên cấu trúc field đã dịch. */
  tr: <T,>(translations: Record<string, Record<string, unknown>> | null | undefined, field: string, fallback: T) => T;
  /** Luôn false — giữ lại để LanguageSwitcher không cần đổi API, từ điển
   * tĩnh không có trạng thái "đang dịch". */
  isTranslating: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(STORAGE_KEY_LOCALE);
      if (savedLocale) setLocaleState(savedLocale as LocaleCode);
    } catch {}
  }, []);

  const setLocale = useCallback((l: LocaleCode) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY_LOCALE, l);
    } catch {}
  }, []);

  const t = useCallback(
    (text: string | null | undefined): string => {
      if (!text) return text ?? "";
      if (locale === "vi") return text;
      return TRANSLATIONS[text]?.[locale] ?? text;
    },
    [locale]
  );

  const tr = useCallback(
    <T,>(
      translations: Record<string, Record<string, unknown>> | null | undefined,
      field: string,
      fallback: T
    ): T => {
      if (locale === "vi") return fallback;
      const value = translations?.[locale]?.[field];
      return value === undefined || value === null ? fallback : (value as T);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tr, isTranslating: false }),
    [locale, setLocale, t, tr]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() phải được gọi bên trong <LanguageProvider>");
  }
  return ctx;
}
