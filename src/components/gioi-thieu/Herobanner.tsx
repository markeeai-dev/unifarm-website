/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * HeroBanner — trang giới thiệu Unifarm
 * -------------------------------------------------------
 * - Slideshow ảnh nông sản xanh tự chuyển đổi, mỗi ảnh tự zoom nhẹ
 *   (kiểu Ken Burns) trong lúc hiển thị rồi mờ dần sang ảnh kế tiếp.
 * - Lớp phủ màu trắng (đậm bên trái, trong dần sang phải) để chữ bên
 *   trái luôn đọc được mà vẫn thấy ảnh nền.
 * - Nội dung chữ neo về phía dưới banner.
 */

const BG_IMAGES = [
  "/images/hero/green-leaves-sunburst.jpg",
  "/images/hero/green-lettuce-rows.jpg",
  "/images/agrihero/farmer-tending-vegetables.jpg",
  "/images/banana/banana-plantation-aerial.jpg",
];

const SLIDE_INTERVAL = 5500;

const COLORS = {
  overlayLight: "255, 255, 255", // rgb của nền trắng — dùng cho gradient phủ
  ink: "#06301B", // xanh lá đậm gần đen — tiêu đề chính, chữ nổi trên nền trắng
  primary: "#006400", // xanh lá đậm — nút chính & điểm nhấn
  primaryHover: "#0B7A0B",
  accent: "#1E6FA8", // xanh dương đậm hơn accent gốc — đủ tương phản trên nền trắng
  body: "#3F4B45", // xám ánh xanh — chữ mô tả
};

export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % BG_IMAGES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "650px" }}
      aria-label="Giới thiệu Unifarm"
    >
      {/* ẢNH NỀN — slideshow nông sản xanh, tự zoom nhẹ rồi mờ dần chuyển ảnh */}
      <div className="absolute inset-0">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className="hero-slide absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={src}
              alt="Nông sản xanh Unifarm"
              fill
              priority={i === 0}
              className="hero-slide-img object-cover object-right"
            />
          </div>
        ))}
      </div>

      {/* LỚP MỜ bổ sung bên trái — tự nhạt dần sang phải bằng mask-image */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 30%, transparent 62%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 30%, transparent 62%)",
        }}
      />

      {/* LỚP PHỦ MÀU — trắng đậm bên trái (để chữ nổi), trong dần sang phải */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right,
            rgba(${COLORS.overlayLight}, 0.96) 0%,
            rgba(${COLORS.overlayLight}, 0.9) 28%,
            rgba(${COLORS.overlayLight}, 0.62) 52%,
            rgba(${COLORS.overlayLight}, 0.2) 74%,
            rgba(${COLORS.overlayLight}, 0) 92%)`,
        }}
      />

      {/* NỘI DUNG — neo về phía dưới banner */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-end px-6 pb-20 pt-24 sm:px-10 sm:pb-24 lg:px-16">
        <div className="w-full max-w-xl">
          {/* eyebrow badge */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{
              background: "#FFFACD",
              border: `1px solid rgba(0,100,0,0.25)`,
              color: COLORS.primary,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Safe Food for Life
          </div>

          {/* Tên thương hiệu */}
          <h1
            className={`text-5xl font-extrabold tracking-tight transition-all delay-100 duration-700 sm:text-6xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ color: COLORS.ink }}
          >
            UNIFARM
          </h1>

          {/* Tagline */}
          <p
            className={`mt-4 text-xl font-semibold leading-snug transition-all delay-150 duration-700 sm:text-2xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ color: COLORS.primary }}
          >
            Hệ sinh thái tiên phong trong lĩnh vực nông nghiệp công nghệ cao
            tại Việt Nam
          </p>

          {/* Mô tả */}
          <p
            className={`mt-5 text-base leading-relaxed transition-all delay-200 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ color: COLORS.body }}
          >
            Chuỗi giá trị khép kín: nghiên cứu giống, canh tác thông minh, thu
            hoạch, chế biến và xuất khẩu.
          </p>

          {/* Nút hành động */}
          <div
            className={`mt-9 flex flex-wrap items-center gap-4 transition-all delay-300 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <button
              type="button"
              className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:text-base"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.primary)
              }
            >
              Tìm hiểu ngay
            </button>

            <button
              type="button"
              className="rounded-full px-7 py-3 text-sm font-semibold transition-colors sm:text-base"
              style={{
                border: `1.5px solid ${COLORS.accent}`,
                color: COLORS.accent,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(30,111,168,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Liên hệ
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hero-slide-img {
          animation: heroKenBurns 16s ease-in-out infinite alternate;
        }
        @keyframes heroKenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-slide-img { animation: none; }
        }
      `}</style>
    </section>
  );
}
