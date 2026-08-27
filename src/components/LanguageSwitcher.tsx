"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/lib/i18n/languages";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * LanguageSwitcher — nút cờ chọn ngôn ngữ trên header, đặt cạnh nút
 * "Liên hệ ngay". Bấm mở dropdown 5 lá cờ, chọn xong toàn bộ trang tự
 * dịch theo (xem LanguageProvider.tsx).
 */
export default function LanguageSwitcher() {
  const { t, locale, setLocale, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("Chọn ngôn ngữ")}
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-full bg-[#f2f9ee] px-3 text-sm font-semibold text-[#06301B]/80 transition-colors hover:bg-[#e3f2da]"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {current.flag}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3 w-3 shrink-0 text-[#006400]/70 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {isTranslating && (
          <span
            className="ml-0.5 h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#87CEFA]"
            aria-hidden="true"
            title={t("Đang dịch…")}
          />
        )}
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-2 min-w-[160px] origin-top-right overflow-hidden rounded-2xl border border-black/5 bg-white py-1.5 shadow-[0_20px_45px_-15px_rgba(6,48,27,0.35)] transition-all duration-200 ease-out ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === locale;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive ? "bg-[#f2f9ee] text-[#006400]" : "text-[#06301B]/75 hover:bg-[#f2f9ee]"
              }`}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {lang.flag}
              </span>
              <span className="flex-1">{lang.label}</span>
              {isActive && (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
