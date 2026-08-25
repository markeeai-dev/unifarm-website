/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * QuoteSlider — "Những câu nói về nông nghiệp công nghệ cao"
 * -----------------------------------------------------------------
 * - Ảnh nền full-bleed, hiệu ứng Ken Burns (zoom chậm dần lớn ra) chạy
 *   suốt thời lượng mỗi slide rồi reset khi slide kế tiếp lên hình.
 * - Tự động chuyển slide theo vòng lặp vô hạn (slide cuối quay lại slide
 *   đầu), có thanh tiến trình (progress bar) thay cho chấm tròn thường —
 *   cho thấy rõ thời điểm chuyển slide tiếp theo, giống Instagram Story.
 * - Palette: nền phủ gradient xanh lá đậm (#006400) → đen để chữ luôn
 *   rõ trên mọi ảnh, dấu ngoặc kép & thanh tiến trình dùng xanh dương
 *   nhạt (#87cefa) làm điểm nhấn "công nghệ", eyebrow + tên dùng vàng
 *   nhạt (#fffacd) làm điểm nhấn ấm.
 * -----------------------------------------------------------------
 * THAY ẢNH THẬT: các URL trong mảng SLIDES bên dưới đang dùng ảnh
 * placeholder (picsum.photos) — thay bằng ảnh nông trại công nghệ cao
 * thật của bạn trước khi lên production.
 */

type Slide = {
  image: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const SLIDES: Slide[] = [
  {
    image: "/images/UNIFARM/2.jpg",
    quote:
      "Nông nghiệp không thể cạnh tranh chỉ bằng diện tích lớn hơn, mà phải đến từ giống tốt hơn, dữ liệu chuẩn xác và sử dụng tài nguyên hiệu quả hơn.",
    name: "xxxx xxxx",
    role: "Lãnh đạo Unifarm",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    image: "/images/UNIFARM/1787218973806_1582751505492234802_4935324150679931320_d6fbae39f7d85301ab39d1b72b8fdb82.jpg",
    quote:
      "Một chuỗi giá trị không thể bền vững nếu khách hàng có sản phẩm, doanh nghiệp có nguyên liệu nhưng người nông dân thua lỗ.",
    name: "xxxx xxxx",
    role: "Giám đốc Phát triển Chuỗi liên kết",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
  {
    image: "/images/banana-leaf-drops.jpg",
    quote:
      "QC không tạo ra chất lượng. QC chỉ xác nhận hệ thống có tạo ra chất lượng hay không. Chất lượng thuộc về mọi người.",
    name: "xxxx xxxx",
    role: "Trưởng bộ phận Đảm bảo chất lượng",
    avatar: "https://i.pravatar.cc/160?img=51",
  },
  {
    image: "/images/banana/banana-plantation-aerial.jpg",
    quote:
      "Tri thức lớn lên khi được chia sẻ. Những gì học được từ đồng ruộng, thử nghiệm và cả thất bại đều là tài sản quý cho ngành.",
    name: "xxxx xxxx",
    role: "Chuyên gia R&D Unifarm",
    avatar: "https://i.pravatar.cc/160?img=68",
  },
];

const SLIDE_DURATION = 6000; // ms mỗi slide hiển thị

export default function QuoteSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  return (
<section className="relative isolate min-h-[460px] w-full overflow-hidden bg-black sm:min-h-[540px] lg:min-h-[590px]">
        <style>{`
        @keyframes qs-kenburns {
          0%   { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes qs-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes qs-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background layers — one per slide, cross-fade via opacity */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <div
            key={i === index ? `active-${index}` : `idle-${i}`}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url(${s.image})`,
              animation:
                i === index
                  ? `qs-kenburns ${SLIDE_DURATION + 1400}ms ease-out forwards`
                  : "none",
            }}
          />
          {/* Brand-toned overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00230f]/90 via-[#00230f]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 mx-auto flex h-full max-w-[1500px] flex-col justify-center px-5 py-14 sm:px-8 sm:py-16 lg:px-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#87cefa] sm:text-sm">
          Góc nhìn về nông nghiệp hiện đại
        </p>

        {/* Quote mark */}
        <svg
          viewBox="0 0 48 32"
          className="mb-5 h-10 w-10 text-[#87cefa]/70 sm:h-12 sm:w-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="M2 20c0-8 5-13 12-15M2 20c0 6 3 10 9 10M20 20c0-8 5-13 12-15M20 20c0 6 3 10 9 10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div key={index} style={{ animation: "qs-fadeup 700ms ease-out both" }}>
          <blockquote className="max-w-3xl text-3xl font-extrabold leading-snug text-white sm:text-2xl sm:leading-tight lg:text-[32px] lg:leading-tight">
            {SLIDES[index].quote}
          </blockquote>

          <div className="mt-8 flex items-center gap-3">
            <img
              src={SLIDES[index].avatar}
              alt={SLIDES[index].name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-[#87cefa]/60 sm:h-12 sm:w-12"
            />
            <div className="leading-tight">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#fffacd]/80">
                {SLIDES[index].role}
              </p>
              <p className="text-base font-bold text-white sm:text-lg">
                {SLIDES[index].name}
              </p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-10 flex items-center gap-2.5 sm:mt-14">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Đi tới slide ${i + 1}`}
              aria-current={i === index}
              className="relative h-1.5 w-9 overflow-hidden rounded-full bg-white/25 transition-colors hover:bg-white/40 sm:w-12"
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[#87cefa]"
                style={
                  i === index
                    ? {
                        animation: `qs-progress ${SLIDE_DURATION}ms linear forwards`,
                      }
                    : i < index
                    ? { width: "100%" }
                    : { width: "0%" }
                }
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}