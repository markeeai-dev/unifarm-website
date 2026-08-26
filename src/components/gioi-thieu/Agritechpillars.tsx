"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dna,
  Bug,
  Cpu,
  Recycle,
  ShieldCheck,
  Sprout,
  Handshake,
  Leaf,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data — nội dung lấy trực tiếp từ brief                             */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    id: "01",
    key: "biotech",
    title: "Khoa học Giống & Nuôi cấy mô",
    tagline: "Gốc rễ của sức đề kháng",
    desc: "Chọn lọc các cá thể ưu tú, khảo nghiệm thực địa nghiêm ngặt về sức đề kháng và năng suất thương phẩm.",
    points: ["Giống ưu tú", "Sinh học", "Năng suất"],
    icon: Dna,
    accent: "green",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/DSC_0016.JPG",
  },
  {
    id: "02",
    key: "automation",
    title: "Quản lý Dịch hại Sinh học (IPM)",
    tagline: "Bàn tay chăm sóc chính xác",
    desc: "Tận dụng vi sinh vật bản địa, bẫy sinh học và nuôi dưỡng hệ sinh thái tự nhiên trên cánh đồng.",
    points: ["Sinh học", "IPM", "Hệ sinh thái"],
    icon: Bug,
    accent: "sky",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/DSC_9897.JPG",
  },
  {
    id: "03",
    key: "digital",
    title: "Tự động hóa & Giảm tổn thương",
    tagline: "Bộ não dữ liệu của nông trại",
    desc: "Ứng dụng hệ thống tưới chính xác và cáp treo đưa buồng chuối về nhà đóng gói an toàn.",
    points: ["Tưới chính xác", "Tự động hóa", "Giảm hao hụt"],
    icon: Cpu,
    accent: "green",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/IMG_2455.JPG",
  },
  {
    id: "04",
    key: "circular",
    title: "Nông nghiệp Tuần hoàn",
    tagline: "Khép kín, không lãng phí",
    desc: "Tái chế thân lá cây trồng thành nguồn hữu cơ dinh dưỡng nuôi dưỡng lại thổ nhưỡng.",
    points: ["Tái chế", "Hữu cơ", "Tái tạo đất"],
    icon: Recycle,
    accent: "sky",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/Uom cay giong 1.jpg",
  },
];

const STATS = [
  {
    label: "Tỉ lệ kháng bệnh Panama",
    value: "97–99",
    unit: "%",
    note: "Giống chuối cấy mô Uni126",
    icon: ShieldCheck,
    progress: 98,
  },
  {
    label: "Năng suất bình quân",
    value: "65",
    unit: "tấn/ha/năm",
    note: "Vượt trội so với canh tác truyền thống",
    icon: Sprout,
    progress: 82,
  },
  {
    label: "Chính sách hợp tác",
    value: "Đồng hành",
    unit: "cùng nông dân",
    note: "Chuyển giao công nghệ & bao tiêu sản phẩm — không cạnh tranh",
    icon: Handshake,
    progress: null,
  },
];

/* ------------------------------------------------------------------ */
/*  Hook: reveal khi cuộn tới                                          */
/* ------------------------------------------------------------------ */

function useInView(threshold = 0.2): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ------------------------------------------------------------------ */
/*  Minh hoạ động cho từng trụ cột (SVG + CSS keyframes riêng)          */
/* ------------------------------------------------------------------ */

function PillarArt({ pillarKey, tone }: { pillarKey: string; tone: string }) {
  const stroke = tone === "green" ? "#006400" : "#1c7fb0";
  const soft = tone === "green" ? "#d8f0d2" : "#e2f4fd";

  if (pillarKey === "biotech") {
    return (
      <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="120" height="90" rx="14" fill={soft} />
        <g className="atx-leaf-sway" style={{ transformOrigin: "60px 78px" }}>
          <path d="M60 78 C60 50 40 40 30 22" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M60 78 C60 46 78 38 88 20" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M60 78 C60 40 60 30 60 14" stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="30" cy="20" rx="9" ry="5" fill={stroke} opacity="0.85" transform="rotate(-35 30 20)" />
          <ellipse cx="88" cy="18" rx="9" ry="5" fill={stroke} opacity="0.85" transform="rotate(35 88 18)" />
          <ellipse cx="60" cy="12" rx="8" ry="5" fill={stroke} opacity="0.9" />
        </g>
        <circle cx="60" cy="78" r="4" fill={stroke} className="atx-pulse-dot" />
      </svg>
    );
  }

  if (pillarKey === "automation") {
    return (
      <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="120" height="90" rx="14" fill={soft} />
        <line x1="20" y1="18" x2="100" y2="18" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        {[28, 48, 68, 88].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="18" x2={x} y2="30" stroke={stroke} strokeWidth="2" />
            <circle
              cx={x}
              cy="34"
              r="3.2"
              fill={stroke}
              className="atx-drip"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          </g>
        ))}
        <path d="M14 70 Q60 54 106 70" stroke={stroke} strokeWidth="2" fill="none" opacity="0.5" />
      </svg>
    );
  }

  if (pillarKey === "digital") {
    return (
      <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="120" height="90" rx="14" fill={soft} />
        <rect x="16" y="16" width="88" height="58" rx="6" fill="none" stroke={stroke} strokeWidth="2" />
        <polyline
          points="24,58 40,42 54,50 70,28 88,36 96,24"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="atx-draw-line"
        />
        <rect x="16" y="16" width="88" height="6" fill={stroke} opacity="0.18" className="atx-scan" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="120" height="90" rx="14" fill={soft} />
      <g className="atx-spin-slow" style={{ transformOrigin: "60px 45px" }}>
        <path
          d="M60 20 A25 25 0 1 1 37 33"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M32 26 L37 33 L44 27" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M60 70 A25 25 0 1 1 83 57"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M88 64 L83 57 L76 63" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sơ đồ vòng lặp trung tâm (chỉ desktop)                              */
/* ------------------------------------------------------------------ */

function LoopDiagram({
  inView,
  active,
  setActive,
}: {
  inView: boolean;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}) {
  const CIRC = 2 * Math.PI * 168;
  const positions = [
    { top: "0%", left: "50%", translate: "-translate-x-1/2" },
    { top: "50%", left: "100%", translate: "-translate-x-full -translate-y-1/2" },
    { top: "100%", left: "50%", translate: "-translate-x-1/2 -translate-y-full" },
    { top: "50%", left: "0%", translate: "-translate-y-1/2" },
  ];

  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="200" cy="200" r="168" fill="none" stroke="#e6e0c9" strokeWidth="2" />
        <circle
          cx="200"
          cy="200"
          r="168"
          fill="none"
          stroke="#006400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          style={{
            strokeDashoffset: inView ? 0 : CIRC,
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.65,0,0.35,1)",
          }}
        />
      </svg>

      {/* Ô giữa — ảnh cố định riêng biệt, khác với 4 ảnh xung quanh */}
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-[#fffacd] shadow-[0_10px_30px_-12px_rgba(0,100,0,0.35)] lg:h-44 lg:w-44 xl:h-52 xl:w-52">
        <Image
          src="/images/banana/banana-shrub-3289749.jpg"
          alt="Giống chuối Uni126"
          fill
          sizes="160px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 text-center">
          <Leaf className="h-5 w-5 text-white" />
          <span className="mt-1 font-mono text-xs font-semibold uppercase tracking-wide text-white">
            Uni126
          </span>
        </div>
      </div>

      {/* Đốm sáng chạy trên vòng tròn, chỉ về đúng ô đang active */}
      <div
        className="atx-travel-dot pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#006400] transition-[top,left] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          top: positions[active].top,
          left: positions[active].left,
          opacity: inView ? 1 : 0,
        }}
      />

      {PILLARS.map((p, i) => {
        const pos = positions[i];
        const isActive = active === i;
        const Icon = p.icon;
        return (
          <button
            key={p.id}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`group absolute h-[108px] w-[108px] overflow-hidden rounded-full lg:h-32 lg:w-32 xl:h-36 xl:w-36 ${pos.translate} bg-white text-center shadow-sm transition-all duration-500 ${
              isActive
                ? "scale-110 ring-4 ring-[#006400] shadow-[0_14px_28px_-12px_rgba(0,100,0,0.45)]"
                : "ring-2 ring-[#e6e0c9] hover:ring-[#87cefa]"
            }`}
            style={{
              top: pos.top,
              left: pos.left,
              opacity: inView ? 1 : 0,
              transform: `${inView ? "scale(1)" : "scale(0.6)"}`,
              transitionDelay: `${0.4 + i * 0.15}s`,
            }}
          >
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 font-mono text-[10px] font-bold tracking-widest text-white">
              <Icon className="h-3.5 w-3.5" />
              {p.id}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component chính                                                    */
/* ------------------------------------------------------------------ */

export default function AgriTechPillars() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [diagramRef, diagramInView] = useInView(0.35);
  const [statsRef, statsInView] = useInView(0.3);
  const [headerRef, headerInView] = useInView(0.4);

  // Tự động chuyển trụ cột khi sơ đồ đã vào khung hình; dừng khi người dùng rê chuột vào để đọc
  useEffect(() => {
    if (!diagramInView || paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setActive((a) => (a + 1) % PILLARS.length);
    }, 4200);
    return () => clearInterval(id);
  }, [diagramInView, paused]);

  return (
    <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-28">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap');

        .atx-display { font-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; }
        .atx-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .atx-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes atxLeafSway { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
        .atx-leaf-sway { animation: atxLeafSway 4.5s ease-in-out infinite; }

        @keyframes atxPulseDot { 0%,100% { opacity: 0.35; r: 3px; } 50% { opacity: 1; r: 5px; } }
        .atx-pulse-dot { animation: atxPulseDot 2.2s ease-in-out infinite; }

        @keyframes atxDrip { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(26px); opacity: 0; } }
        .atx-drip { animation: atxDrip 1.8s ease-in infinite; transform-box: fill-box; transform-origin: center; }

        @keyframes atxScan { 0% { transform: translateY(0); opacity: 0.35; } 50% { opacity: 0.05; } 100% { transform: translateY(46px); opacity: 0.35; } }
        .atx-scan { animation: atxScan 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }

        @keyframes atxDrawLine { from { stroke-dasharray: 140; stroke-dashoffset: 140; } to { stroke-dasharray: 140; stroke-dashoffset: 0; } }
        .atx-draw-line { animation: atxDrawLine 2.4s ease-out infinite alternate; }

        @keyframes atxSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .atx-spin-slow { animation: atxSpinSlow 14s linear infinite; }

        @keyframes atxFloatBlob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(14px,-18px) scale(1.05); } }
        .atx-float-blob { animation: atxFloatBlob 9s ease-in-out infinite; }

        @keyframes atxRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        .atx-rise { animation: atxRise 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes atxTravelDot { 0%,100% { box-shadow: 0 0 0 0 rgba(0,100,0,0.5); } 50% { box-shadow: 0 0 0 8px rgba(0,100,0,0); } }
        .atx-travel-dot { animation: atxTravelDot 1.8s ease-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .atx-leaf-sway, .atx-pulse-dot, .atx-drip, .atx-scan, .atx-draw-line, .atx-spin-slow, .atx-float-blob, .atx-rise, .atx-travel-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* nền trang trí */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="atx-float-blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#87cefa]/25 blur-3xl" />
        <div
          className="atx-float-blob absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#fffacd] blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <svg
          className="absolute inset-x-0 top-0 h-full w-full opacity-[0.04]"
          aria-hidden="true"
        >
          <pattern id="atx-leafgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 Q15 10 30 30 T60 30" stroke="#006400" strokeWidth="1.5" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#atx-leafgrid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        {/* ---------- Header ---------- */}
        <div ref={headerRef} className="mx-auto max-w-2xl text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-[#006400]/20 bg-[#fffacd] px-4 py-1.5 ${
              headerInView ? "atx-rise" : "opacity-0"
            }`}
          >
            <Leaf className="h-3.5 w-3.5 text-[#006400]" />
            <span className="atx-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0a3d0a]">
              Nền tảng công nghệ xanh
            </span>
          </div>
          <h2
            className={`uppercase atx-display mt-5 whitespace-nowrap font-extrabold leading-tight text-[#0a3d0a] ${
              headerInView ? "atx-rise" : "opacity-0"
            }`}
            style={{ animationDelay: "0.1s", fontSize: "clamp(0.95rem, 4.4vw, 3rem)" }}
          >
            Giảm Hóa Chất – Tăng Giá Trị
          </h2>
          <p
            className={`atx-body mt-4 text-base leading-relaxed text-[#3a4a33] sm:text-lg ${
              headerInView ? "atx-rise" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            Giảm phụ thuộc không cần thiết vào hóa chất thông qua giống tốt,
            sức khỏe đất, chế phẩm sinh học và dữ liệu đồng ruộng.
          </p>
        </div>

        {/* ---------- Sơ đồ vòng lặp: vòng tròn bên trái, chi tiết bên phải ---------- */}
        <div
          ref={diagramRef}
          className="mt-14 md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16"
        >
          {/* cột trái — sơ đồ vòng lặp, rê chuột vào cũng tạm dừng tự động chạy */}
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <LoopDiagram inView={diagramInView} active={active} setActive={setActive} />

            {/* chỉ báo dạng bước cho mobile (vòng tròn ẩn trên mobile) */}
            <div className="mx-auto flex max-w-md items-center justify-between md:hidden">
              {PILLARS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  className={`flex flex-col items-center gap-1.5 transition-opacity ${
                    active === i ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      active === i ? "border-[#006400] bg-[#fffacd]" : "border-[#e6e0c9] bg-white"
                    }`}
                  >
                    <p.icon className="h-4 w-4 text-[#0a3d0a]" />
                  </span>
                  <span className="atx-mono text-[10px] font-bold text-[#0a3d0a]/60">{p.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* cột phải — thẻ chi tiết trụ cột đang chọn, rê chuột vào sẽ dừng tự động chạy để đọc */}
          <div
            className="mt-8 md:mt-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {PILLARS.map((p, i) => {
              const isActive = active === i;
              return (
                <div key={p.id} className={`${isActive ? "block atx-rise" : "hidden"}`}>
                  <div className="relative overflow-hidden rounded-3xl border border-[#e6e0c9] shadow-[0_20px_45px_-25px_rgba(10,60,10,0.35)]">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-white/45" />
                    <div className="relative flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
                      <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-44 sm:w-48">
                        <PillarArt pillarKey={p.key} tone={p.accent} />
                      </div>
                      <div>
                      <div className="flex items-center gap-2">
                        <span className="atx-mono text-xs font-bold tracking-widest text-[#006400]/60">
                          {p.id}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#006400]/30" />
                        <span className="atx-body text-xs font-medium uppercase tracking-wide text-[#4a90c4]">
                          {p.tagline}
                        </span>
                      </div>
                      <h3 className="uppercase atx-display mt-1.5 text-xl font-bold text-[#006400] sm:text-2xl">
                        {p.title}
                      </h3>
                      <p className="atx-body mt-2.5 text-sm leading-relaxed text-[#006400] sm:text-base">
                        {p.desc}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {p.points.map((pt) => (
                          <li
                            key={pt}
                            className="atx-body rounded-full bg-[#f3f7ec] px-3 py-1 text-xs font-medium text-[#0a3d0a]"
                          >
                            {pt}
                          </li>
                        ))}
                      </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* chấm điều hướng + trạng thái tự động chạy */}
            <div className="mt-5 flex items-center justify-center gap-3 md:justify-start">
              {PILLARS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  aria-label={`Xem ${p.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === i ? "w-8 bg-[#006400]" : "w-2 bg-[#e6e0c9] hover:bg-[#87cefa]"
                  }`}
                />
              ))}
              {paused && (
                <button
                  onClick={() => setPaused(false)}
                  className="atx-mono ml-1 text-[10px] font-semibold uppercase tracking-wide text-[#4a90c4] hover:text-[#006400]"
                >
                  Tiếp tục tự động
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Lợi thế cạnh tranh ---------- */}
        <div ref={statsRef} className="mt-24 sm:mt-28">
          <div className="mx-auto max-w-xl text-center">
            <span
              className={`atx-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4a90c4] ${
                statsInView ? "atx-rise" : "opacity-0"
              }`}
            >
              Vì sao khác biệt
            </span>
            <h3
              className={`uppercase atx-display mt-2 text-2xl font-extrabold text-[#0a3d0a] sm:text-3xl ${
                statsInView ? "atx-rise" : "opacity-0"
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              Lợi thế cạnh tranh vượt trội
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`relative overflow-hidden rounded-3xl border border-[#e6e0c9] bg-white p-6 ${
                    statsInView ? "atx-rise" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${0.15 + i * 0.15}s` }}
                >
                  <div
                    className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-70"
                    style={{ background: i % 2 === 0 ? "#fffacd" : "#eaf7ff" }}
                  />
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#006400]">
                      <Icon className="h-5 w-5 text-[#fffacd]" />
                    </div>

                    <div className="atx-mono mt-5 flex items-baseline gap-1.1">
                      <span className="text-3xl font-bold text-[#0a3d0a] sm:text-[2.25rem]">
                        {s.value}
                      </span>
                      <span className="text-sm font-semibold text-[#4a90c4]">{s.unit}</span>
                    </div>
                    <p className="atx-body mt-1 text-sm font-semibold text-[#0a3d0a]">{s.label}</p>
                    <p className="atx-body mt-1.5 text-xs leading-relaxed text-[#5c6a55]">{s.note}</p>

                    {s.progress !== null && (
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#f0eedb]">
                        <div
                          className="h-full rounded-full bg-[#006400] transition-all duration-[1400ms] ease-out"
                          style={{ width: statsInView ? `${s.progress}%` : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- CTA ---------- */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#006400] px-6 py-8 text-center sm:mt-20 sm:flex-row sm:px-10 sm:text-left">
          <div>
            <p className="atx-display text-lg font-bold text-white sm:text-xl">
              Đồng hành cùng nông dân — chuyển giao công nghệ, bao tiêu sản phẩm
            </p>
            <p className="atx-body mt-1.5 text-sm text-[#c9e8c0]">
              Chúng tôi không cạnh tranh với nông dân, mà cùng nông dân đi xa hơn.
            </p>
          </div>
          <Link
            href="/du-an-hop-tac#hop-tac"
            className="atx-body inline-flex shrink-0 items-center gap-2 rounded-full bg-[#fffacd] px-6 py-3 text-sm font-semibold text-[#0a3d0a] transition-transform hover:scale-[1.03] active:scale-95"
          >
            Hợp tác cùng Unifarm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}