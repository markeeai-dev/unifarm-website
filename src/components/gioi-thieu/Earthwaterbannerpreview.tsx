/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUpRight } from "lucide-react";

/* ============================================================
   BẢNG MÀU CHỦ ĐẠO
   ============================================================ */
const C = {
  yellow: "#FFFACD",
  green: "#006400",
  greenSoft: "#0B7A0B",
  blue: "#87CEFA",
  ink: "#12210F",
};

/* Thay các URL ảnh dưới đây bằng ảnh thật của bạn (đặt trong /public) */
const BG_IMAGE = "/images/UNIFARM/bgr.jpg";
const IMG_LEFT =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&auto=format&fit=crop";
const IMG_RIGHT =
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=400&auto=format&fit=crop";

/* ============================================================
   HOOK: phát hiện phần tử lọt vào khung nhìn (1 lần)
   ============================================================ */
function useInView(threshold = 0.25): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

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
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ============================================================
   NÚT "XEM THÊM" — mũi tên + gạch chân màu xanh dương
   ============================================================ */
function MoreLink() {
  return (
    <button type="button" className="group/link mt-3 inline-flex flex-col items-start gap-1.5">
      <span
        className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider transition-colors"
        style={{ color: C.green }}
      >
        Xem thêm
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
          strokeWidth={2.5}
        />
      </span>
      <span
        className="h-[3px] w-6 rounded-full transition-all duration-300 group-hover/link:w-9"
        style={{ background: C.blue }}
      />
    </button>
  );
}

/* ============================================================
   THẺ THÔNG TIN — nhỏ gọn, dùng để đè lên ảnh nền (desktop)
   hoặc xếp dọc bình thường (mobile)
   ============================================================ */
function InfoCard({
  title,
  desc,
  image,
  delay = 0,
  inView,
  compact = false,
  className = "",
}: {
  title: string;
  desc: string;
  image: string;
  delay?: number;
  inView: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`group relative shadow-xl rounded-3xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl ${
        compact ? "p-4 pt-14" : "p-6 pt-16 sm:p-7 sm:pt-24"
      } ${className}`}
      style={{
        background: C.yellow,
        border: "1px solid rgba(0,100,0,0.10)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* ảnh tròn nổi ở góc trên bên phải thẻ */}
      <div
        className={`absolute overflow-hidden rounded-full ring-4 ring-white shadow-lg transition-transform duration-500 group-hover:scale-105 ${
          compact ? "-top-8 -right-4 h-20 w-20" : "-top-11 right-6 h-28 w-28 sm:h-56 sm:w-56"
        }`}
      >
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      <h3
        className={`font-extrabold leading-snug ${compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"}`}
        style={{ color: C.ink }}
      >
        {title}
      </h3>
      <p className={`mt-1.5 leading-relaxed text-gray-600 ${compact ? "text-sm" : "text-base sm:text-lg"}`}>
        {desc}
      </p>
      <MoreLink />
    </div>
  );
}

/* ============================================================
   CHỮ NỀN TRANG TRÍ (watermark trôi ngang liên tục)
   ============================================================ */
function Watermark() {
  const text = "LÀM NÔNG NGHIỆP · YÊU ĐẤT – NƯỚC · ";
  return (
    <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden">
      <div
        className="watermark-track whitespace-nowrap text-6xl font-black uppercase tracking-widest text-white opacity-20 sm:text-8xl"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)" }}
      >
        {text.repeat(4)}
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENT CHÍNH
   ============================================================ */
export default function EarthWaterBannerPreview() {
  const [ref, inView] = useInView(0.2);

  const cardLeft = {
    title: "Yêu Đất",
    desc: "Chúng tôi canh tác bền vững, nuôi dưỡng thổ nhưỡng, giảm thiểu phân bón hóa học.",
    image: IMG_LEFT,
  };
  const cardRight = {
    title: "Yêu Nước",
    desc: "Chúng tôi tiết kiệm nguồn nước, xử lý sạch và tuần hoàn.",
    image: IMG_RIGHT,
  };

  return (
    <section
      ref={ref}
      className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-4 pb-4 pt-6 sm:px-6 lg:px-0 lg:pb-0"
    >
      {/* ================= DESKTOP: ảnh nền cao, 2 thẻ nhỏ đè trực tiếp lên ảnh ================= */}
      <div className="relative hidden lg:block">
        {/* ================= ẢNH HERO ================= */}
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{
            height: "950px",
            opacity: inView ? 1 : 0,
            transform: inView ? "scale(1)" : "scale(0.98)",
            transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
          }}
        >
          <img src={BG_IMAGE} alt="Canh dong nong nghiep xanh" className="h-full w-full object-cover" />

          {/* overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,20,10,0.4) 0%, rgba(0,20,10,0.08) 32%, transparent 58%)",
            }}
          />

          <Watermark />

          {/* ================= CARD TRÁI — đè lên góc dưới-trái của ảnh ================= */}
          <InfoCard
            {...cardLeft}
            inView={inView}
            delay={150}
            compact
            className="absolute bottom-8 left-8 z-20 w-[230px] xl:bottom-60 xl:left-50 xl:w-[460px]"
          />

          {/* ================= CARD PHẢI — đè lên góc dưới-phải của ảnh ================= */}
          <InfoCard
            {...cardRight}
            inView={inView}
            delay={300}
            compact
            className="absolute bottom-8 right-8 z-20 w-[230px] xl:bottom-100 xl:left-300 xl:w-[460px]"
          />
        </div>

        {/* ================= TIÊU ĐỀ BÊN DƯỚI ẢNH ================= */}
        {/* <div
          className="relative z-10 mx-auto mt-8 w-full max-w-2xl px-6 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <h2
            className="text-4xl font-extrabold leading-tight xl:text-[2.75rem]"
            style={{ color: C.green, textShadow: "0 2px 18px rgba(0,0,0,0.08)" }}
          >
            Làm nông nghiệp là
            <br />
            <span style={{ color: C.blue, textShadow: "0 2px 18px rgba(58,166,214,0.18)" }}>
              yêu Đất – Nước
            </span>
          </h2>
        </div> */}
      </div>

      {/* ================= MOBILE / TABLET: xếp dọc gọn gàng ================= */}
      <div className="lg:hidden">
        <div
          className="relative overflow-hidden shadow-xl"
          style={{
            height: "300px",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <img src={BG_IMAGE} alt="Canh dong nong nghiep xanh" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,20,10,0.4), transparent 55%)" }}
          />
        </div>

        {/* <h2
          className="mt-8 text-center text-3xl font-extrabold leading-tight sm:text-4xl"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s",
          }}
        >
          <span style={{ color: C.green }}>Làm nông nghiệp là</span>
          <br />
          <span style={{ color: "#3AA6D6" }}>yêu Đất – Nước</span>
        </h2> */}

        <div className="mt-8 flex flex-col gap-6 sm:gap-7">
          <InfoCard {...cardLeft} inView={inView} delay={200} />
          <InfoCard {...cardRight} inView={inView} delay={350} />
        </div>
      </div>

      <style>{`
        .watermark-track {
          display: inline-block;
          animation: watermarkDrift 30s linear infinite;
        }
        @keyframes watermarkDrift {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
      `}</style>
    </section>
  );
}