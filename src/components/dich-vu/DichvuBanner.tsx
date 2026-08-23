/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

/**
 * HeroBanner — trang giới thiệu Unifarm
 * -------------------------------------------------------
 * - Nền là video nông sản xanh (thay cho slideshow ảnh trước đây).
 * - Không còn lớp phủ trắng/xanh bên trái — chữ đặt trực tiếp trên
 *   video, dùng màu sáng + text-shadow để luôn đọc được.
 * - Nội dung chữ neo về phía dưới banner, có thêm dải số liệu nhanh
 *   và gợi ý cuộn xuống.
 */

const BG_VIDEO = "/videos/banana-leaves-closeup.mp4";

const STATS = [
  { value: "04", label: "Dịch vụ chuyên biệt" },
  { value: "15+", label: "Năm đồng hành" },
  { value: "100%", label: "Hỗ trợ tận nơi" },
];

const COLORS = {
  primary: "#006400", // xanh lá đậm — nút chính & điểm nhấn
  primaryHover: "#0B7A0B",
  accent: "#87CEFA", // xanh dương nhạt — nổi bật trên video, dùng cho tagline nhấn
};

const TEXT_SHADOW = "0 2px 16px rgba(0,20,10,0.55)";

export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "800px" }}
      aria-label="Dịch vụ Unifarm"
    >
      {/* VIDEO NỀN — cận cảnh lá chuối xanh mướt đung đưa */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={BG_VIDEO} type="video/mp4" />
      </video>

      {/* Vignette rất nhẹ để chữ luôn rõ trên video */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,20,10,0.5) 0%, rgba(0,20,10,0.18) 40%, rgba(0,20,10,0.05) 65%, transparent 85%)",
        }}
      />

      {/* Lớp phủ xanh lá — đậm bên trái (chỗ chữ), nhạt dần sang phải, vẫn giữ 1 lớp xanh nhẹ bên phải */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,60,10,0.8) 0%, rgba(0,60,10,0.52) 32%, rgba(0,60,10,0.22) 58%, rgba(0,60,10,0.50) 82%, rgba(0,60,10,1.20) 100%)",
        }}
      />

      {/* Đốm sáng trang trí, tạo chiều sâu */}
      <div
        className="hero-blob pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(135,206,250,0.22)" }}
        aria-hidden="true"
      />

      {/* NỘI DUNG — neo sát đáy banner (absolute bottom-0, không phụ thuộc flex h-full), tránh chồng lên video bên phải */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-8xl px-4 pb-40 sm:px-6 lg:px-40">
          <div className="w-full max-w-xl">
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
            Dịch vụ Unifarm
          </div>

          {/* Tên thương hiệu */}
          <h1
            className={`text-5xl font-extrabold tracking-tight text-white transition-all delay-100 duration-700 sm:text-6xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            DỊCH VỤ
            <span
              className="mt-2 block h-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                background: `linear-gradient(90deg, #FFFACD, ${COLORS.accent})`,
                width: mounted ? "64px" : "0px",
                transitionDelay: "500ms",
              }}
            />
          </h1>

          {/* Tagline — 2 dòng, dòng dưới tô màu nhấn */}
          <p
            className={`mt-5 text-xl font-semibold leading-snug text-white transition-all delay-150 duration-700 sm:text-2xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            Tư vấn – Cung ứng – Chuyển giao
            <br />
            <span style={{ color: COLORS.accent }}>
              trọn vẹn hành trình nông nghiệp công nghệ cao
            </span>
          </p>

          {/* Mô tả */}
          <p
            className={`mt-5 text-base leading-relaxed text-white/90 transition-all delay-200 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            Đồng hành cùng nhà nông từ tư vấn mô hình, cung ứng đầu vào chuyển giao công nghệ đến trải nghiệm thực tế tại trang trại Unifarm.
          </p>

          {/* Dải số liệu nhanh */}
          <div
            className={`mt-6 flex flex-wrap gap-x-6 gap-y-2 transition-all delay-[250ms] duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span
                  className="text-lg font-extrabold"
                  style={{ color: "#FFFACD", textShadow: TEXT_SHADOW }}
                >
                  {s.value}
                </span>
                <span className="text-xs font-medium text-white/85" style={{ textShadow: TEXT_SHADOW }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Nút hành động */}
          <div
            className={`mt-9 flex flex-wrap items-center gap-4 transition-all delay-300 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <Link
              href="#hanh-trinh"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden bg-[#FFFACD] px-7 py-3.5 text-sm font-bold text-[#06301B] shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              {/* Vệt sáng tự chạy */}
              <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-[#87cefa]/70 blur-md animate-button-shine" />
              {/* Màu hover kéo từ trái sang phải */}
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                Xem dịch vụ
              </span>
              <ArrowRight
                className="relative z-10 h-4 w-4 transition-all duration-500 ease-in-out group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>

            <Link
              href="/#contact"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden border border-white/50 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#FFFACD] hover:shadow-lg sm:text-base"
            >
              {/* Nền hover kéo từ trái sang phải */}
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#FFFACD] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              {/* Vệt sáng tự chạy */}
              <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-white/50 blur-md animate-button-shine" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#06301B]">
                Liên hệ
              </span>
              <ArrowRight
                className="relative z-10 h-4 w-4 text-white transition-all duration-500 ease-in-out group-hover:translate-x-1 group-hover:text-[#06301B]"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Gợi ý cuộn xuống */}
      {/* <div
        className={`hero-scroll-hint absolute bottom-6 right-8 z-10 hidden flex-col items-center gap-1.5 text-xs font-medium text-white/80 transition-opacity duration-700 sm:flex ${
          mounted ? "opacity-80" : "opacity-0"
        }`}
        style={{ textShadow: TEXT_SHADOW }}
      >
        Cuộn xuống
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div> */}

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
        .hero-scroll-hint svg {
          animation: heroScrollBounce 1.8s ease-in-out infinite;
        }
        @keyframes heroScrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-blob, .hero-icon-pulse, .hero-scroll-hint svg { animation: none; }
        }
      `}</style>
    </section>
  );
}
