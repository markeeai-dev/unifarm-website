/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { useIntroReady } from "@/lib/use-intro-ready";

/**
 * DuanBanner — Hero Banner cho trang "Dự Án & Hợp Tác"
 * -------------------------------------------------------
 * Cấu trúc/hiệu ứng đồng bộ với DichvuBanner.tsx: video nền, các lớp
 * overlay gradient xanh, badge/tiêu đề/tagline/mô tả trồi vào tuần tự,
 * dải thẻ số liệu và 2 nút CTA kiểu "shine button" (đúng class/keyframe).
 * Khác biệt: tiêu đề chính ở đây là 1 câu dài (không phải tên thương
 * hiệu ngắn) nên xuống dòng tự nhiên thay vì có gạch chân underline.
 */

const BG_VIDEO = "/videos/unripe-green-bananas-on-tree.mp4";

const STATS = [
  { value: "1.694+ ha", label: "Tổng diện tích vùng trồng lõi" },
  { value: "100%", label: "Chuẩn VietGAP / GlobalG.A.P định hướng xuất khẩu" },
  { value: "15+ năm", label: "Kinh nghiệm nghiên cứu, chuẩn hóa và chuyển giao" },
];

const COLORS = {
  primary: "#006400", // xanh lá đậm — nút chính & điểm nhấn
  primaryHover: "#0B7A0B",
  accent: "#87CEFA", // xanh dương nhạt — nổi bật trên video
};

const TEXT_SHADOW = "0 2px 16px rgba(0,20,10,0.55)";

export default function DuanBanner() {
  const [mounted, setMounted] = useState(false);
  const introReady = useIntroReady();

  useEffect(() => {
    if (introReady) setMounted(true);
  }, [introReady]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "860px" }}
      aria-label="Dự án & Hợp tác Unifarm"
    >
      {/* VIDEO NỀN */}
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
            "linear-gradient(to top, rgba(0,20,10,0.55) 0%, rgba(0,20,10,0.2) 40%, rgba(0,20,10,0.06) 65%, transparent 85%)",
        }}
      />

      {/* Lớp phủ xanh lá — đậm bên trái (chỗ chữ), nhạt dần sang phải */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,60,10,0.82) 0%, rgba(0,60,10,0.54) 32%, rgba(0,60,10,0.24) 58%, rgba(0,60,10,0.5) 82%, rgba(0,60,10,1.2) 100%)",
        }}
      />

      {/* Đốm sáng trang trí, tạo chiều sâu */}
      <div
        className="hero-blob pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(135,206,250,0.22)" }}
        aria-hidden="true"
      />

      {/* NỘI DUNG — neo sát đáy banner */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-8xl px-4 pb-32 sm:px-6 lg:px-40">
        <div className="w-full max-w-2xl">
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
            Hạ tầng &amp; Dự án Unifarm
          </div>

          {/* Tiêu đề chính */}
          <h1
            className={`uppercase text-3xl font-extrabold leading-[1.15] tracking-tight text-white transition-all delay-100 duration-700 sm:text-4xl lg:text-5xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            Hệ thống nông trường công nghệ cao{" "}
            <span style={{ color: COLORS.accent }}>&amp; chuỗi giá trị khép kín</span>
          </h1>

          {/* Tagline */}
          <p
            className={`mt-5 text-lg font-semibold italic leading-snug text-white transition-all delay-150 duration-700 sm:text-xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            &ldquo;Unifarm không cần sở hữu mọi cánh đồng. Chúng tôi cùng bạn xây dựng nhiều
            cánh đồng tốt hơn.&rdquo;
          </p>

          {/* Mô tả */}
          <p
            className={`mt-5 text-base leading-relaxed text-white/90 transition-all delay-200 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ textShadow: TEXT_SHADOW }}
          >
            Kết nối đồng bộ từ vùng trồng tập trung quy mô 1.694+ ha, ứng dụng công nghệ Sinh
            học – Tự động hóa – Số hóa, các tổ hợp chế biến sâu sau thu hoạch đến dịch vụ
            chuyển giao kỹ thuật thực chiến cho nhà nông.
          </p>

          {/* Dải thẻ số liệu */}
          <div
            className={`mt-7 grid grid-cols-1 gap-3 transition-all delay-[250ms] duration-700 sm:grid-cols-3 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border px-4 py-3 backdrop-blur-sm"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  background: "rgba(0,40,10,0.28)",
                }}
              >
                <div
                  className="text-xl font-extrabold"
                  style={{ color: "#FFFACD", textShadow: TEXT_SHADOW }}
                >
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-medium leading-snug text-white/85">
                  {s.label}
                </div>
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
              href="#tru-cot"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden bg-[#FFFACD] px-7 py-3.5 text-sm font-bold text-[#06301B] shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
            >
              {/* Vệt sáng tự chạy */}
              <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-[#87cefa]/70 blur-md animate-button-shine" />
              {/* Màu hover kéo từ trái sang phải */}
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                Khám phá dự án
              </span>
              <ArrowRight
                className="relative z-10 h-4 w-4 transition-all duration-500 ease-in-out group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>

            <Link
              href="#hop-tac"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden border border-white/50 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#FFFACD] hover:shadow-lg sm:text-base"
            >
              {/* Nền hover kéo từ trái sang phải */}
              <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#FFFACD] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              {/* Vệt sáng tự chạy */}
              <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-white/50 blur-md animate-button-shine" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#06301B]">
                Liên hệ hợp tác
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
