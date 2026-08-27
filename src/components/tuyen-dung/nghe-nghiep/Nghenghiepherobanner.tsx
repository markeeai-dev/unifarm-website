/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Compass } from "lucide-react";
import { useIntroReady } from "@/lib/use-intro-ready";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * NgheNghiepHeroBanner — banner đầu trang "Văn hoá & Con đường nghề nghiệp".
 * Nav/logo dùng chung HomeTopHeader (render toàn site trong layout.tsx).
 * Dùng useIntroReady() để đồng bộ hiệu ứng xuất hiện với SiteIntro, giống Tuyendunghero.tsx.
 */

export default function NgheNghiepHeroBanner() {
  const [mounted, setMounted] = useState(false);
  const introReady = useIntroReady();
  const { t } = useLanguage();

  useEffect(() => {
    if (introReady) setMounted(true);
  }, [introReady]);

  return (
    <div className="w-full">
      <section className="relative isolate w-full overflow-hidden">
        <div
          className="relative flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,48,27,0.82), rgba(6,48,27,0.9)), url('/images/banana/banana-plantation-aerial.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span
            className={`mb-9 inline-flex items-center gap-2 rounded-full border border-[#FFFACD]/40 bg-[#FFFACD]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFFACD] transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <span className="hero-badge-dot h-1.5 w-1.5 rounded-full bg-[#FFFACD]" />
            {t("Nghề nghiệp tại Unifarm")}
          </span>

          <h1
            className={`max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {t("Nông Nghiệp Hiện Đại Cần")}{" "}
            <span className="text-[#FFFACD]">{t("Những Con Người Hiện Đại")}</span>
          </h1>

          <p
            className={`mx-auto mt-5 max-w-2xl text-sm font-light text-white/60 transition-all delay-150 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {t(
              "Nông nghiệp hôm nay là sự kết hợp của: Sinh học • Máy móc • Công nghệ • Dữ liệu • Chất lượng • Chuỗi cung ứng • Thị trường. Người làm nông nghiệp cũng cần được học và phát triển như bất kỳ nghề chuyên nghiệp nào khác."
            )}
          </p>

          <div
            className={`mt-9 inline-flex max-w-full items-center gap-2 rounded-[14px] border border-[#FFFACD]/25 bg-white/5 px-5 py-3 text-center backdrop-blur-sm transition-all delay-200 duration-700 sm:gap-3 sm:px-7 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <span className="whitespace-normal break-words text-xs font-bold uppercase tracking-[0.14em] text-[#FFFACD] sm:whitespace-nowrap sm:text-sm sm:tracking-[0.2em]">
              Come to work. Stay to learn. Grow to lead.
            </span>
          </div>

          <div
            className={`mt-9 flex flex-col items-center gap-3 transition-all delay-300 duration-700 sm:flex-row ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <a
              href="/tuyen-dung"
              className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#006400] to-[#FFFACD] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_35px_rgba(0,100,0,0.45)] transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
              style={{ textShadow: "0 1px 3px rgba(6,48,27,0.5)" }}
            >
              {t("Khám phá cơ hội nghề nghiệp")}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20">
                <ArrowRight size={14} />
              </span>
            </a>

            <a
              href="#nghe-chuyen-nghiep"
              className="inline-flex items-center gap-2.5 rounded-[10px] border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#FFFACD]/60 hover:bg-[#FFFACD]/10"
            >
              <Compass size={17} />
              {t("Mô hình đào tạo của chúng tôi")}
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes hero-badge-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .hero-badge-dot {
          animation: hero-badge-blink 2s infinite;
        }
      `}</style>
    </div>
  );
}
