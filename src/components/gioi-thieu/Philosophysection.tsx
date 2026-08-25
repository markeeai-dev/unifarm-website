"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * PhilosophySection — "Triết lý: Làm nông nghiệp là yêu Đất – Nước"
 * ------------------------------------------------------------------
 * - Bố cục 2 cột 50/50: trái là ảnh, phải là nội dung.
 * - Cột ảnh tự động chuyển đổi giữa ảnh "Đất" và ảnh "Nước", mỗi ảnh
 *   tự zoom nhẹ (Ken Burns) và hiển thị ~5s; chữ chú thích ("Yêu Đất"
 *   / "Yêu Nước") trượt từ dưới lên mỗi lần đổi ảnh.
 * - Cột nội dung dùng nền nen_trang.png (sáng) để chữ luôn rõ nét.
 * ------------------------------------------------------------------ */

const SLIDES = [
  { src: "/images/agrihero/seedling-sprout.jpg", caption: "Yêu Đất" },
  { src: "/images/hero/rice-paddy-water.jpg", caption: "Yêu Nước" },
] as const;

const SLIDE_INTERVAL = 5000;

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
  <section
    ref={ref}
    className="relative flex w-full flex-col overflow-hidden py-12 sm:flex-row sm:py-16 lg:py-20"
  >
      {/* CỘT TRÁI — ảnh tự zoom nhẹ & tự chuyển đổi Đất ⇄ Nước */}
      <div className="relative h-[360px] w-full overflow-hidden sm:h-auto sm:w-1/2">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="philosophy-slide absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={s.src}
              alt={s.caption}
              fill
              priority={i === 0}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="philosophy-slide-img object-cover"
            />
          </div>
        ))}

        {/* phủ tối nhẹ đáy ảnh để chữ chú thích luôn rõ */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(to top, rgba(6,20,13,0.8), rgba(6,20,13,0.15) 60%, transparent)",
          }}
        />

        <div className="absolute inset-x-0 bottom-8 px-8 sm:bottom-10 sm:px-10">
          <span
            key={active}
            className="philosophy-caption inline-block text-3xl font-extrabold text-white sm:text-4xl"
            style={{ textShadow: "0 8px 22px rgba(0,0,0,0.55)" }}
          >
            {SLIDES[active].caption}
          </span>
        </div>
      </div>

      {/* CỘT PHẢI — nội dung, nền nen_trang.png cho chữ rõ nét */}
      <div className="relative flex w-full items-center bg-[#fdf9ee] bg-[url('/images/nen_trang.png')] bg-repeat sm:w-1/2">
        <div
          className="mx-auto w-[85%] max-w-2xl px-6 py-16 transition-all duration-1000 ease-out sm:px-12 sm:py-20 lg:max-w-5xl lg:px-0"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <h3 className="uppercase text-2xl font-extrabold leading-snug text-[#06301B] sm:text-3xl lg:text-4xl">
            “Làm nông nghiệp là yêu Đất – Nước”
            <span className="ml-3 inline-flex translate-y-1 align-middle">
              <IconLotus />
            </span>
          </h3>

          <div className="mt-8 divide-y divide-[#00640022]">
            <div className="py-5 first:pt-0">
              <p className="text-lg font-bold text-[#006400] sm:text-3xl">
                Yêu Đất
              </p>
              <p className="mt-1.5 text-[20px] leading-relaxed text-slate-600">
                Chúng tôi canh tác bền vững, nuôi dưỡng thổ nhưỡng, giảm thiểu
                phân bón hóa học.
              </p>
            </div>

            <div className="py-5 last:pb-0">
              <p className="text-lg font-bold text-[#1E6FA8] sm:text-3xl">
                Yêu Nước
              </p>
              <p className="mt-1.5 text-[20px] leading-relaxed text-slate-600">
                Chúng tôi tiết kiệm nguồn nước, xử lý sạch và tuần hoàn.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .philosophy-slide-img {
          animation: philosophyKenBurns 16s ease-in-out infinite alternate;
        }
        @keyframes philosophyKenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .philosophy-caption {
          animation: philosophyCaptionRise 700ms ease-out;
        }
        @keyframes philosophyCaptionRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .philosophy-slide-img, .philosophy-caption { animation: none; }
        }
      `}</style>
    </section>
  );
}

function IconLotus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3c1.5 3 1.5 6 0 9-1.5-3-1.5-6 0-9z" fill="#006400" />
      <path
        d="M12 12c2.8-2 5.6-2.4 8-1-1.4 2.4-3.8 3.8-8 4 4.2.2 6.6 1.6 8 4-2.4 1.4-5.2 1-8-1"
        fill="#006400"
        opacity="0.85"
      />
      <path
        d="M12 12c-2.8-2-5.6-2.4-8-1 1.4 2.4 3.8 3.8 8 4-4.2.2-6.6 1.6-8 4 2.4 1.4 5.2 1 8-1"
        fill="#006400"
        opacity="0.85"
      />
    </svg>
  );
}
