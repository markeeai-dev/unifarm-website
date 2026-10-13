"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIntroReady } from "@/lib/use-intro-ready";
import { useForcePlayVideo } from "@/lib/use-force-play-video";
import { useIsInAppBrowser } from "@/lib/use-is-inapp-browser";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const BG_VIDEO = "/videos/7.mp4";
const POSTER = "/video-posters/7.jpg";
const WEBP_LOOP = "/video-loops/7.webp";

const SLIDES = [
  {
    category: "CHẤT LƯỢNG",
    title: "MỘT TIÊU CHUẨN SẢN PHẨM CHO MỌI THỊ TRƯỜNG",
    subtitle:
      "Chất lượng sản phẩm được xây dựng thống nhất trong toàn hệ thống, dù phục vụ thị trường trong nước hay xuất khẩu.",
  },
  {
    category: "AN TOÀN",
    title: "AN TOÀN TỪ NÔNG TRẠI ĐẾN SẢN PHẨM",
    subtitle:
      "Kiểm soát đầu vào, quá trình sản xuất và sau thu hoạch, đáp ứng các yêu cầu về an toàn thực phẩm và giới hạn dư lượng của từng thị trường.",
  },
  {
    category: "TƯƠI NGON",
    title: "GIỮ TRỌN PHẨM CHẤT TỰ NHIÊN",
    subtitle:
      "Từ lựa chọn giống, thời điểm thu hoạch đến sơ chế, đóng gói và bảo quản nhằm giữ được chất lượng và đặc tính tự nhiên của sản phẩm.",
  },
  {
    category: "SINH HỌC & BỀN VỮNG",
    title: "TỐT HƠN CHO CON NGƯỜI VÀ MÔI TRƯỜNG",
    subtitle:
      "Tăng cường các giải pháp sinh học, giảm phụ thuộc vào hóa chất và chăm sóc sức khỏe cây trồng, đất và nước trong suốt quá trình sản xuất.",
  },
];

const SLIDE_MS = 4500;

export default function SanPhamHero() {
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const introReady = useIntroReady();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useForcePlayVideo(videoRef);

  const isInAppBrowser = useIsInAppBrowser();
  const slide = SLIDES[slideIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!introReady) return;

    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, [introReady]);

  return (
    <div className="w-full">
      <style>{`
        @keyframes sanpham-hero-fade {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sanpham-hero-title {
          width: 100%;
          max-width: 1700px;
          margin-inline: auto;
          font-size: clamp(1.75rem, 4vw, 2.7rem);
          line-height: 1.16;
          letter-spacing: -0.035em;
          text-wrap: balance;
          overflow-wrap: break-word;
        }

        .sanpham-hero-description {
          width: 100%;
          max-width: 850px;
          margin-inline: auto;
          text-wrap: pretty;
        }

        @media (max-width: 640px) {
          .sanpham-hero-title {
            font-size: clamp(1.65rem, 7vw, 2.25rem);
            line-height: 1.2;
            letter-spacing: -0.025em;
          }

          .sanpham-hero-description {
            font-size: 0.875rem;
            line-height: 1.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sanpham-hero-slide {
            animation: none !important;
          }
        }
      `}</style>

      {/* HERO VIDEO */}
      <section className="relative isolate w-full overflow-hidden bg-[#163d20]">
        {/* Ảnh dự phòng khi video chưa tải */}
        <Image
          src={POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 -z-20 object-cover"
        />

        {/* WebP động cho trình duyệt tích hợp ứng dụng */}
        {isInAppBrowser === true && (
          <Image
            src={WEBP_LOOP}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="pointer-events-none absolute inset-0 -z-20 object-cover"
          />
        )}

        {/* Video nền trên trình duyệt thông thường */}
        {isInAppBrowser === false && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={POSTER}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
          >
            <source src={BG_VIDEO} type="video/mp4" />
          </video>
        )}

        {/* Lớp phủ giúp nội dung dễ đọc */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,20,10,0.62) 0%, rgba(0,20,10,0.24) 42%, rgba(0,20,10,0.10) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,50,15,0.50) 0%, rgba(0,50,15,0.18) 50%, rgba(0,50,15,0.40) 100%)",
          }}
        />

        {/* Nội dung banner */}
        <div className="relative flex min-h-[88svh] flex-col items-center justify-center px-5 py-20 text-center sm:min-h-0 sm:h-[740px] sm:px-8 sm:py-16 md:h-[820px] lg:h-[880px]">
          {/* Nhãn cố định */}
          <span
            className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#153d20]/55 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.20em] text-white shadow-lg backdrop-blur-md transition-all duration-700 ease-out sm:mb-6 sm:px-5 sm:text-xs ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e2e9b0]" />
            {t("Sản phẩm Unifarm")}
          </span>

          {/* Slide tự động thay đổi */}
          <div
            key={slideIndex}
            className="sanpham-hero-slide mx-auto flex w-full max-w-6xl flex-col items-center"
            style={{
              animation: "sanpham-hero-fade 700ms ease-out both",
            }}
          >
            <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e4edb7] drop-shadow-md sm:mb-5 sm:text-xs md:text-sm">
              {t(slide.category)}
            </p>

            <h1 className="sanpham-hero-title font-black uppercase text-white [text-shadow:0_3px_18px_rgba(0,0,0,0.5)]">
              {t(slide.title)}
            </h1>

            <p className="sanpham-hero-description mt-5 text-sm font-medium text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:mt-6 sm:text-base sm:leading-8 md:text-lg lg:text-xl">
              {t(slide.subtitle)}
            </p>
          </div>

          {/* Nút chuyển slide */}
          <div
            className={`mt-9 flex items-center justify-center gap-2.5 transition-opacity duration-700 sm:mt-11 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            aria-label={`Slide ${slideIndex + 1} / ${SLIDES.length}`}
          >
            {SLIDES.map((item, index) => (
              <button
                key={item.category}
                type="button"
                aria-label={`${t("Chuyển đến slide")} ${index + 1}: ${t(item.category)}`}
                aria-current={slideIndex === index ? "true" : undefined}
                onClick={() => setSlideIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  slideIndex === index
                    ? "w-9 bg-[#e2e9b0] sm:w-12"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}