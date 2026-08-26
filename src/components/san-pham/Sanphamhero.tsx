"use client";

import { useEffect, useState } from "react";
import { useIntroReady } from "@/lib/use-intro-ready";

/**
 * SanPhamHero — banner đầu trang Sản phẩm.
 * Nav/logo dùng chung HomeTopHeader (render toàn site trong layout.tsx).
 * Nền là video, tiêu đề chính/phụ ở giữa tự động đổi mỗi ~4.5s.
 */

const SLIDES = [
  {
    title: "SẢN PHẨM TƯƠI SẠCH MỖI NGÀY",
    subtitle: "Nông sản Unifarm — từ nông trại đến bàn ăn",
  },
  {
    title: "CHUỐI GIÀ NAM MỸ CHUẨN XUẤT KHẨU",
    subtitle: "Đạt chuẩn VietGAP và GlobalG.A.P",
  },
  {
    title: "NÔNG NGHIỆP CÔNG NGHỆ CAO",
    subtitle: "Kiểm soát chất lượng xuyên suốt chuỗi cung ứng",
  },
  {
    title: "GIÁ TRỊ BỀN VỮNG CHO NÔNG SẢN VIỆT",
    subtitle: "Đồng hành cùng nông dân trên mọi vùng trồng",
  },
];
const SLIDE_MS = 4500;

export default function SanPhamHero() {
  const [mounted, setMounted] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const introReady = useIntroReady();

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!introReady) return;
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [introReady]);

  const slide = SLIDES[slideIndex];

  return (
    <div className="w-full">
      <style>{`
        @keyframes sanpham-hero-fade {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ================= HERO (video) ================= */}
      <section className="relative isolate w-full overflow-hidden bg-[#006400]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src="/videos/7.mp4" type="video/mp4" />
        </video>

        {/* Vignette rất nhẹ để chữ luôn rõ trên video */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,20,10,0.5) 0%, rgba(0,20,10,0.18) 40%, rgba(0,20,10,0.05) 65%, transparent 85%)",
          }}
        />

        {/* Lớp phủ xanh lá — cùng tông với DichvuBanner */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,60,10,0.82) 0%, rgba(0,60,10,0.54) 32%, rgba(0,60,10,0.24) 58%, rgba(0,60,10,0.50) 82%, rgba(0,60,10,0.85) 100%)",
          }}
        />

        {/* ================= HERO TEXT (auto-cycling) ================= */}
        <div className="relative flex h-[640px] flex-col items-center justify-center px-6 text-center sm:h-[760px] md:h-[860px]">
          <span
            className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/85 backdrop-blur-sm transition-all duration-700 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Sản phẩm Unifarm
          </span>

          <div key={slideIndex} style={{ animation: "sanpham-hero-fade 700ms ease-out" }}>
            <h1 className="uppercase max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-[20px] md:text-[22px] lg:text-[28px]">
              {slide.subtitle}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
