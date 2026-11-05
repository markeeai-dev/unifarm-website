/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { useIntroReady } from "@/lib/use-intro-ready";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * NhaMayBanner — Hero Banner cho trang "Nhà máy chế biến"
 * -------------------------------------------------------
 * Đồng bộ cấu trúc/hiệu ứng với HeroBanner.tsx (Về chúng tôi) và
 * DuanBanner.tsx (Dự án & Hợp tác): ảnh nền full-bleed, 2 lớp overlay
 * gradient xanh (vignette dọc + phủ xanh đậm dần về bên trái), badge
 * nhấp nháy + tiêu đề có từ nhấn màu accent + mô tả + 2 nút CTA kiểu
 * "shine button", nội dung neo về góc dưới-trái banner.
 */

const HERO_IMAGE = "/images/nha-may-che-bien/nha-may-hero.jpg";

const COLORS = {
  primary: "#006400",
  accent: "#87CEFA",
};

const TEXT_SHADOW = "0 2px 16px rgba(0,20,10,0.55)";

export default function NhaMayBanner() {
  const [mounted, setMounted] = useState(false);
  const introReady = useIntroReady();
  const { t } = useLanguage();

  useEffect(() => {
    if (introReady) setMounted(true);
  }, [introReady]);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-label={t("Nhà máy chế biến Unifarm")}
    >
      <Image src={HERO_IMAGE} alt="" fill priority quality={90} sizes="100vw" className="absolute inset-0 object-cover" />

      {/* Vignette rất nhẹ để chữ luôn rõ trên ảnh */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,20,10,0.55) 0%, rgba(0,20,10,0.2) 40%, rgba(0,20,10,0.06) 65%, transparent 85%)",
        }}
      />

      {/* Lớp phủ xanh lá — đậm bên trái (chỗ chữ), nhạt dần sang phải */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,60,10,0.5) 0%, rgba(0,60,10,0.3) 32%, rgba(0,60,10,0.12) 58%, rgba(0,60,10,0.28) 82%, rgba(0,60,10,0.6) 100%)",
        }}
      />

      {/* Đốm sáng trang trí, tạo chiều sâu */}
      <div
        className="hero-blob pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(135,206,250,0.22)" }}
        aria-hidden="true"
      />

      {/* NỘI DUNG — neo sát đáy banner */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-8xl px-4 pb-96 sm:px-6 lg:px-40">
        <div className="w-full max-w-3xl">
          {/* eyebrow badge */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{
              background: "#FFFACD",
              border: "1px solid rgba(0,100,0,0.25)",
              color: COLORS.primary,
            }}
          >
            <span
              className="hero-icon-pulse flex h-5 w-5 items-center justify-center rounded-full text-white"
              style={{ background: COLORS.primary }}
            >
              <Leaf className="h-3 w-3" strokeWidth={2.5} />
            </span>
            {t("Dự án chế biến sâu")}
          </div>

          {/* Tiêu đề chính */}
          <h1
            className={`uppercase text-3xl font-extrabold leading-[1.15] tracking-tight text-white transition-all delay-100 duration-700 sm:text-4xl lg:text-5xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            {t("Nhà máy chế biến")} <span style={{ color: COLORS.accent }}>{t("Unifarm")}</span>
          </h1>

          {/* Tagline */}
          <p
            className={`mt-5 text-lg font-semibold italic leading-snug text-white transition-all delay-150 duration-700 sm:text-xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            &ldquo;{t("Từ vùng nguyên liệu đến chuỗi lạnh xuất khẩu")}&rdquo;
          </p>

          {/* Mô tả */}
          <p
            className={`mt-5 text-base leading-relaxed text-white/90 transition-all delay-200 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            {t(
              "Tổ hợp chế biến sâu chuối và dưa hấu, vận hành theo dây chuyền cấp đông IQF khép kín nối liền vùng trồng tập trung của Unifarm với thị trường xuất khẩu."
            )}
          </p>

          {/* Nút hành động */}
          <div
            className={`mt-9 flex flex-wrap items-center gap-4 transition-all delay-300 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <Link
              href="#quy-trinh-san-xuat"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden bg-[#FFFACD] px-7 py-3.5 text-sm font-bold text-[#06301B] shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-[#87cefa]/70 blur-md animate-button-shine" />
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                {t("Xem quy trình sản xuất")}
              </span>
              <ArrowRight
                className="relative z-10 h-4 w-4 transition-all duration-500 ease-in-out group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>

            <Link
              href="/du-an-hop-tac#hop-tac"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden border border-white/50 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#FFFACD] hover:shadow-lg sm:text-base"
            >
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#FFFACD] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-white/50 blur-md animate-button-shine" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#06301B]">
                {t("Liên hệ hợp tác")}
              </span>
              <ArrowRight
                className="relative z-10 h-4 w-4 text-white transition-all duration-500 ease-in-out group-hover:translate-x-1 group-hover:text-[#06301B]"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .hero-blob {
          animation: heroBlobFloat 10s ease-in-out infinite;
        }
        @keyframes heroBlobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -22px) scale(1.08); }
        }
        .hero-icon-pulse {
          animation: heroIconPulse 2.4s ease-in-out infinite;
        }
        @keyframes heroIconPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,100,0,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(0,100,0,0); }
        }
        .animate-button-shine {
          animation: button-shine 2s ease-in-out infinite;
        }
        @keyframes button-shine {
          0% { left: -80%; }
          45%, 100% { left: 140%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-blob, .hero-icon-pulse { animation: none; }
        }
      `}</style>
    </section>
  );
}
