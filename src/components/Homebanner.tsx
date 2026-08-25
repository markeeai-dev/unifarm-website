"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useIntroReady } from "@/lib/use-intro-ready";

/**
 * HomeBanner — banner chính của trang chủ.
 * Ảnh nền tự động chuyển đổi mỗi 5s, mỗi ảnh tự zoom to/nhỏ trong đúng
 * khoảng thời gian hiển thị của nó (Ken Burns, đổi hướng theo từng ảnh).
 * Có lớp phủ xanh đậm nhiều tầng theo tông thương hiệu. Tiêu đề chính đổi
 * theo từng ảnh, luân phiên 2 kiểu hiệu ứng chữ: "xoay vào" và "chạy vào
 * từng chữ". Dòng chữ mờ to tự động chạy ngang ở đáy banner.
 */

const SLIDES = [
   {
    image: "/images/banana/banana-shrub-3289749.jpg",
    badge: "Hệ sinh thái nông nghiệp công nghệ cao",
    titleLine1: "CÙNG XÂY DỰNG MỘT NỀN",
    titleLine2: "NÔNG NGHIỆP TỐT HƠN",
    desc: "Thành lập từ năm 2009, Unifarm là một trong những hệ sinh thái tiên phong trong lĩnh vực nông nghiệp công nghệ cao tại Việt Nam, phát triển từ nghiên cứu giống, canh tác bền vững, chế biến quy mô lớn đến thị trường.",
  },
  {
    image: "/images/UNIFARM/1787207482427_1582751505492234802_4935324150679931320_939749211a6e5c72f28397e7e138b486.jpg",
    badge: "Giá trị từ tài nguyên",
    titleLine1: "GIÁ TRỊ",
    titleLine2: "BỀN VỮNG",
    desc: "Mục tiêu của chúng tôi là tạo ra nhiều giá trị hơn từ mỗi đơn vị, đồng thời mang lại giá trị bền vững cho khách hàng, người sản xuất, cộng đồng và môi trường.",
  },

  {
    image: "/images/UNIFARM/1787218973789_1582751505492234802_4935324150679931320_ae20e008b6b700cead007d04eae29597.jpg",
    badge: "Hợp tác & Đồng hành",
    titleLine1: "CÙNG XÂY DỰNG NHIỀU",
    titleLine2: "CÁNH ĐỒNG TỐT HƠN",
    desc: "Unifarm đồng hành cùng nông dân, hợp tác xã, doanh nghiệp và nhà đầu tư để xây dựng chuỗi giá trị nông nghiệp hiện đại, minh bạch và hiệu quả.",
  },
];
const ROTATE_MS = 12000;
const CHAR_STAGGER_MS = 22;

// 3 kiểu hiệu ứng chữ tiêu đề — mỗi slide 1 kiểu riêng
const TEXT_STYLES = ["spin", "runin", "swirl"] as const;

const MARQUEE_TEXT = "GROWING A BETTER AGRICULTURE  UNIFARM  VIETNAM  SINCE 2009";

/** Tách chuỗi thành từng ký tự, mỗi ký tự tự chạy animation riêng theo độ trễ so le. */
function AnimatedChars({
  text,
  variant,
  startDelay,
}: {
  text: string;
  variant: (typeof TEXT_STYLES)[number];
  startDelay: number;
}) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={`banner-char banner-char--${variant}`}
          style={{ animationDelay: `${startDelay + i * CHAR_STAGGER_MS}ms` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export default function HomeBanner() {
  const [index, setIndex] = useState(0);
  const introReady = useIntroReady();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];
  const textStyle = TEXT_STYLES[index % TEXT_STYLES.length];
  const zoomDirection = index % 2 === 0 ? "in" : "out";
  const line1Delay = 0;
  const line2Delay = Array.from(slide.titleLine1).length * CHAR_STAGGER_MS + 100;

  return (
    <section
      className={`relative flex min-h-[85vh] w-full items-center overflow-hidden ${
        introReady ? "" : "banner-anim-paused"
      }`}
    >
      {/* Ảnh nền — tự chuyển đổi mỗi 5s, tự zoom trong đúng khoảng đó */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              i === index ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <Image
              key={i === index ? `active-${i}-${zoomDirection}` : `idle-${i}`}
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${
                i === index ? `animate-[home-banner-zoom-${zoomDirection}_${ROTATE_MS}ms_ease-in-out_infinite]` : ""
              }`}
            />
          </div>
        ))}

        {/* Lớp phủ xanh đậm nhiều tầng — multiply xanh cho bóng, screen ánh vàng nhẹ cho sáng.
            z-20: phải cao hơn z-10 của ảnh slide đang active, nếu không lớp phủ sẽ bị ảnh che mất hoàn toàn. */}
        <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#0B5C1F] via-[#06301B] to-[#04220c] opacity-45 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-[#FFFACD]/8 to-transparent mix-blend-screen" />
        {/* Lớp vàng nhẹ riêng cho phần bên trái — nơi đặt chữ, tạo điểm ấm bổ sung cho lớp xanh */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#FFFACD]/20 via-[#FFFACD]/6 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#06301B]/62 via-[#06301B]/30 to-[#06301B]/15" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#06301B]/55 via-transparent to-transparent" />
      </div>

      {/* Nội dung — đổi theo từng slide */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1500px] items-center px-5 py-24 sm:px-8 lg:px-32">
        <div className="w-full max-w-[720px]">
          <div key={index} className={`banner-entrance banner-entrance--${textStyle}`}>
            <span
              className="banner-entrance-item inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm"
              style={{ animationDelay: "0ms" }}
            >
              {slide.badge}
            </span>

            <h1 className="mt-5 text-2xl font-semibold uppercase leading-[1.18] tracking-[0.025em] text-white sm:text-3xl lg:text-[2.5rem]">
              <AnimatedChars
                text={slide.titleLine1}
                variant={textStyle}
                startDelay={line1Delay}
              />
              <br />
              <span className="text-[#FFFACD]">
                <AnimatedChars
                  text={slide.titleLine2}
                  variant={textStyle}
                  startDelay={line2Delay}
                />
              </span>
            </h1>

            <p
              className="banner-entrance-item mt-5 max-w-[620px] text-[15px] leading-relaxed text-white/80 sm:text-base"
              style={{ animationDelay: "550ms" }}
            >
              {slide.desc}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
  {/* ================= NÚT KHÁM PHÁ NGAY ================= */}
  <Link
    href="/san-pham"
    className="banner-entrance-item group relative isolate inline-flex items-center gap-2 overflow-hidden bg-[#FFFACD] px-7 py-3.5 text-sm font-bold text-[#06301B] shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl"
    style={{ animationDelay: "650ms" }}
  >
   {/* Vệt sáng tự chạy */}
    <span
      className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-[#87cefa]/70 blur-md animate-button-shine"
    />

    {/* Màu hover kéo từ trái sang phải */}
    <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover:scale-x-100" />

    <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
      Khám phá Unifarm
    </span>

    <ArrowRight
      className="relative z-10 h-4 w-4 transition-all duration-500 ease-in-out group-hover:translate-x-1"
      strokeWidth={2.5}
    />
  </Link>

  {/* ================= NÚT LIÊN HỆ ================= */}
  <Link
    href="/#contact"
    className="banner-entrance-item group relative isolate inline-flex items-center gap-2 overflow-hidden border border-white/50 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#FFFACD] hover:shadow-lg"
    style={{ animationDelay: "730ms" }}
  >
    {/* Nền hover kéo từ trái sang phải */}
    <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#FFFACD] transition-transform duration-500 ease-out group-hover:scale-x-100" />

    {/* Vệt sáng tự chạy */}
    <span className="pointer-events-none absolute inset-y-0 -left-[80%] z-0 w-[45%] skew-x-[-20deg] bg-white/50 blur-md animate-button-shine" />

    <span className="relative z-10 transition-colors duration-500 group-hover:text-[#06301B]">
      Hợp tác cùng Unifarm
    </span>

    <ArrowRight
      className="relative z-10 h-4 w-4 text-white transition-all duration-500 ease-in-out group-hover:translate-x-1 group-hover:text-[#06301B]"
      strokeWidth={2.5}
    />
  </Link>
</div>
          </div>

          {/* Chấm chỉ báo slide hiện tại */}
          <div className="mt-9 flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <span
                key={s.image}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-[#FFFACD]" : "w-4 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dòng chữ mờ, to, tự động chạy ngang liên tục ở đáy banner */}
      <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 overflow-hidden sm:bottom-2">
        <div className="home-banner-marquee-track flex w-max items-center whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
           <span
            key={i}
            className="
              mr-16
              font-sans
              text-9xl
              font-bold
              uppercase
              tracking-[0.01em]
              leading-none
              text-white
              sm:mr-20
              sm:text-[10rem]
              md:mr-24
              md:text-[11rem]
            "
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.58)",
              opacity: 1,
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0.12) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0.12) 100%)",
            }}
          >
            {MARQUEE_TEXT}
          </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes home-banner-zoom-in {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes home-banner-zoom-out {
          0%   { transform: scale(1.1); }
          50%  { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .home-banner-marquee-track {
          animation: home-banner-marquee-scroll 28s linear infinite;
        }
        @keyframes home-banner-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Badge / mô tả / nút — cùng kiểu fade nhẹ, so le theo animation-delay riêng */
        .banner-entrance-item {
          opacity: 0;
          animation-duration: 650ms;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .banner-entrance--spin .banner-entrance-item {
          animation-name: banner-in-zoom;
        }
        .banner-entrance--runin .banner-entrance-item {
          animation-name: banner-in-rise;
        }
        .banner-entrance--swirl .banner-entrance-item {
          animation-name: banner-in-swirl;
        }
        @keyframes banner-in-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes banner-in-zoom {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes banner-in-swirl {
          from { opacity: 0; transform: scale(1.35) rotate(6deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        /* Từng ký tự trong tiêu đề chính — "xoay vào" hoặc "chạy vào" tuỳ slide */
        .banner-char {
          display: inline-block;
          opacity: 0;
          animation-duration: 560ms;
          animation-fill-mode: both;
        }
        .banner-char--spin {
          animation-name: banner-char-spin;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .banner-char--runin {
          animation-name: banner-char-runin;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .banner-char--swirl {
          animation-name: banner-char-swirl;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes banner-char-spin {
          from { opacity: 0; transform: rotate(60deg) scale(0.4); }
          60%  { opacity: 1; }
          to   { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes banner-char-runin {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes banner-char-swirl {
          0%   { opacity: 0; transform: scale(2.6) rotate(220deg); }
          55%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-banner-marquee-track { animation: none; }
          .banner-entrance-item, .banner-char { animation: none; opacity: 1; }
        }

        /* Giữ hiệu ứng chữ/nút "đóng băng" ở khung hình đầu cho tới khi intro
           loading mở màn xong, để không bị chạy ngầm và kết thúc âm thầm phía
           sau lớp intro. */
        .banner-anim-paused .banner-entrance-item,
        .banner-anim-paused .banner-char {
          animation-play-state: paused;
        }

        /* ================= BUTTON SHINE ================= */
        .animate-button-shine {
          animation: button-shine 2s ease-in-out infinite;
        }

        @keyframes button-shine {
          0% {
            left: -80%;
          }

          45%,
          100% {
            left: 140%;
          }
        }
      `}</style>
    </section>
  );
}
