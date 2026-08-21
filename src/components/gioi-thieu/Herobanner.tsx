/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
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

const BG_VIDEO = "/videos/banana-leaves-blooming-arboretum.mp4";

const STATS = [
  { value: "15+", label: "Năm kinh nghiệm" },
  { value: "600+", label: "Ha vùng trồng liên kết" },
  { value: "100%", label: "Đạt chuẩn VietGAP" },
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
      aria-label="Giới thiệu Unifarm"
    >
      {/* VIDEO NỀN — hoa chuối và buồng chuối non giữa vườn xanh, lật ngang để chủ thể lệch sang phải */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
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
            Safe Food for Life
          </div>

          {/* Tên thương hiệu */}
          <h1
            className={`text-5xl font-extrabold tracking-tight text-white transition-all delay-100 duration-700 sm:text-6xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            UNIFARM
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
            Hệ sinh thái tiên phong
            <br />
            <span style={{ color: COLORS.accent }}>
              nông nghiệp công nghệ cao tại Việt Nam
            </span>
          </p>

          {/* Mô tả */}
          <p
            className={`mt-5 text-base leading-relaxed text-white/90 transition-all delay-200 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            Chuỗi giá trị khép kín: nghiên cứu giống, canh tác thông minh, thu
            hoạch, chế biến và xuất khẩu.
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
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:text-base"
              style={{ background: COLORS.primary }}
            >
              <span
                className="absolute inset-0 -z-10 translate-x-[-105%] transition-transform duration-500 ease-out group-hover:translate-x-0"
                style={{ background: `linear-gradient(90deg, ${COLORS.primaryHover}, #1E6FA8)` }}
              />
              Tìm hiểu ngay
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-[1.5px] border-white/70 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors sm:text-base"
              style={{ background: "rgba(255,255,255,0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            >
              Liên hệ
            </button>
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
