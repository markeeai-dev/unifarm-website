
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Compass } from "lucide-react";
import { useIntroReady } from "@/lib/use-intro-ready";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
          className="relative flex flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,48,27,0.82), rgba(6,48,27,0.9)), url('/images/banana/banana-plantation-aerial.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Badge */}
          <span
            className={`mb-7 inline-flex items-center gap-2 rounded-full border border-[#FFFACD]/40 bg-[#FFFACD]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFFACD] transition-all duration-700 sm:mb-9 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <span className="hero-badge-dot h-1.5 w-1.5 rounded-full bg-[#FFFACD]" />
            {t("Nghề nghiệp tại Unifarm")}
          </span>

          {/* Tiêu đề chính */}
          <h1
            className={`max-w-4xl text-3xl font-extrabold uppercase leading-[1.12] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl lg:text-6xl ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            {t("Nông nghiệp hiện đại cần")}
            {" "}
            <span className="text-[#FFFACD]">
              {t("con người hiện đại")}
            </span>
          </h1>

          {/* Mô tả */}
          <p
            className={`mx-auto mt-5 max-w-3xl text-sm font-light leading-7 text-white/85 transition-all delay-150 duration-700 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            {t("Nông nghiệp hôm nay là sự kết hợp của nhiều lĩnh vực:")}
          </p>

          {/* Các lĩnh vực */}
          <div
            className={`mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-3 transition-all delay-200 duration-700 sm:gap-x-3 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            {[
              "Cây trồng",
              "Công nghệ",
              "Dữ liệu",
              "Sản xuất",
              "Chất lượng",
              "Kinh doanh",
              "Thị trường",
            ].map((item, index, array) => (
              <span
                key={item}
                className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#FFFACD] sm:text-xs sm:tracking-[0.15em]"
              >
                {t(item)}
                {index < array.length - 1 && (
                  <span className="ml-2 text-[#FFFACD]/50 sm:ml-3">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Thông điệp */}
          <p
            className={`mx-auto mt-6 max-w-3xl text-sm font-light leading-7 text-white/75 transition-all delay-200 duration-700 sm:mt-7 sm:text-base sm:leading-8 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            {t(
              "Mỗi công việc đòi hỏi kiến thức và tay nghề khác nhau, nhưng tất cả cùng góp phần tạo nên một nền nông nghiệp chuyên nghiệp, hiệu quả và bền vững hơn."
            )}
          </p>

          {/* Slogan */}
          <div
            className={`mt-7 inline-flex max-w-full items-center justify-center rounded-[14px] border border-[#FFFACD]/25 bg-white/5 px-4 py-3 text-center backdrop-blur-sm transition-all delay-200 duration-700 sm:mt-8 sm:px-7 ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <span className="text-xs font-extrabold uppercase leading-relaxed tracking-[0.1em] text-[#FFFACD] sm:text-sm sm:tracking-[0.16em]">
              {t("Làm việc")} <span className="mx-1 text-white/40">·</span>
              {t("Học nghề")} <span className="mx-1 text-white/40">·</span>
              {t("Giỏi nghề")} <span className="mx-1 text-white/40">·</span>
              {t("Dẫn dắt")}
            </span>
          </div>

          {/* CTA */}
          <div
            className={`mt-8 flex w-full flex-col items-stretch justify-center gap-3 transition-all delay-300 duration-700 sm:mt-9 sm:w-auto sm:flex-row sm:items-center ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <a
              href="/tuyen-dung"
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#006400] to-[#398B42] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_35px_rgba(0,100,0,0.4)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] sm:px-7"
              style={{
                textShadow: "0 1px 3px rgba(6,48,27,0.5)",
              }}
            >
              {t("Khám phá cơ hội nghề nghiệp")}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/20">
                <ArrowRight size={14} />
              </span>
            </a>

            <a
              href="#nghe-chuyen-nghiep"
              className="inline-flex items-center justify-center gap-2.5 rounded-[10px] border border-white/25 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#FFFACD]/60 hover:bg-[#FFFACD]/10"
            >
              <Compass size={17} className="shrink-0" />
              {t("Mô hình đào tạo của Unifarm")}
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
