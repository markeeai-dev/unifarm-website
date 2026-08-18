"use client";

/**
 * AboutBanner
 * ------------------------------------------------------------------
 * Banner cho trang giới thiệu: Tầm nhìn – Sứ mệnh – 4 Giá trị cốt lõi – Triết lý.
 *
 * Cài đặt phụ thuộc (nếu chưa có):
 *   npm install framer-motion
 *
 * Font chữ (thêm vào layout.tsx bằng next/font, hoặc <link> Google Fonts):
 *   - Be Vietnam Pro  (700/800/900) -> font-display, hỗ trợ tiếng Việt đầy đủ, cảm giác chắc khỏe
 *   - Inter           (400/500/600) -> font-body, dễ đọc ở cỡ nhỏ
 *   - JetBrains Mono  (500)         -> font-mono, dùng cho nhãn/eyebrow nhỏ, gợi cảm giác "công nghệ"
 *
 * Ví dụ next/font (app/layout.tsx):
 *   import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from "next/font/google";
 *   const beVietnamPro = Be_Vietnam_Pro({ subsets: ["vietnamese"], weight: ["700","800","900"], variable: "--font-display" });
 *   const inter = Inter({ subsets: ["vietnamese","latin"], variable: "--font-body" });
 *   const jbMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });
 *   -> <body className={`${beVietnamPro.variable} ${inter.variable} ${jbMono.variable}`}>
 *
 * Sau đó trong tailwind.config: fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"], mono: ["var(--font-mono)"] }
 * (Nếu không cấu hình tailwind, component vẫn chạy tốt với font hệ thống mặc định.)
 * ------------------------------------------------------------------
 */

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/* Nội dung                                                            */
/* ------------------------------------------------------------------ */

const CORE_VALUES = [
  {
    key: "tien-phong",
    title: "Tiên phong",
    desc: "Dẫn dắt, truyền cảm hứng và kiến tạo đội ngũ.",
    from: "#5FB6EE",
    to: "#2E7DC2",
    icon: IconCompass,
  },
  {
    key: "sang-tao",
    title: "Sáng tạo",
    desc: "Là nền tảng phát triển và dẫn đầu.",
    from: "#6FD17A",
    to: "#2E9B4C",
    icon: IconSpark,
  },
  {
    key: "hop-tac",
    title: "Hợp tác",
    desc: "Để đi nhanh và đi xa bền vững.",
    from: "#39BFB0",
    to: "#137A72",
    icon: IconHands,
  },
  {
    key: "nhan-van",
    title: "Nhân văn",
    desc: "Từ con người và vì con người.",
    from: "#FF9376",
    to: "#E15B3D",
    icon: IconHeartPeople,
  },
] as const;

/** Độ lệch dọc + góc nghiêng của từng ô lục giác trên desktop, tạo cảm giác
 * "xếp theo vòng cung" — 2 ô giữa nhô cao, 2 ô hai đầu nghiêng ra và thấp hơn. */
const HEX_ARC = [
  { y: 52, rotate: -16 },
  { y: 8, rotate: -5 },
  { y: 8, rotate: 5 },
  { y: 52, rotate: 16 },
] as const;

/* ------------------------------------------------------------------ */
/* Animation helpers                                                   */
/* ------------------------------------------------------------------ */

const easeOut = [0.22, 1, 0.36, 1] as const;

function useRevealVariants(baseDelay = 0) {
  const reduce = useReducedMotion();
  const hidden: Variants["hidden"] = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 36 };
  return (i: number, extra = 0): Variants => ({
    hidden,
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 1.8,
        delay: reduce ? 0 : baseDelay + i * 0.75 + extra,
        ease: easeOut,
      },
    },
  });
}

/* ------------------------------------------------------------------ */
/* Component chính                                                     */
/* ------------------------------------------------------------------ */

export interface AboutBannerProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function AboutBanner({
  eyebrow = "GIỚI THIỆU",
  title = "Định hướng phát triển",
  subtitle = "Nông nghiệp công nghệ cao theo hướng sinh học — nơi khoa học gặp gỡ đất và nước.",
}: AboutBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat font-body">
      {/* lớp lưới điểm nền rất nhẹ, gợi luống cây / mạch dữ liệu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(#00640022 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 pb-24 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
        <Header eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <VisionMission />
        <CoreValues />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function Header({
  eyebrow,
  title,
  subtitle,
}: Required<Pick<AboutBannerProps, "eyebrow" | "title" | "subtitle">>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.3, ease: easeOut }}
      className="mx-auto max-w-3xl text-center"
    >
      <span
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em]"
        style={{
          color: "#006400",
          borderColor: "#00640033",
          background: "#FFFACD",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "#006400" }}
        />
        {eyebrow}
      </span>

      <h2
        className="mt-5 font-display text-[2.1rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl"
        style={{ color: "#06301B" }}
      >
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
        {subtitle}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Tầm nhìn / Sứ mệnh — hai thẻ "hướng vào nhau"                       */
/* ------------------------------------------------------------------ */

function VisionMission() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const v = useRevealVariants(0.15);

  return (
    <div ref={ref} className="relative mt-14 sm:mt-20">
      {/* clipPath dạng objectBoundingBox — cho phép bo cong mép trên của thẻ
          (kết hợp với mũi nhọn chỉa vào nhau) và tự co giãn theo kích thước thẻ */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <clipPath id="vm-clip-left" clipPathUnits="objectBoundingBox">
            <path d="M0,0.1 Q0.38,-0.12 0.76,0.1 L1,0.5 L0.76,1 L0,1 Z" />
          </clipPath>
          <clipPath id="vm-clip-right" clipPathUnits="objectBoundingBox">
            <path d="M0.24,0.1 Q0.62,-0.12 1,0.1 L1,1 L0.24,1 L0,0.5 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
        {/* Tầm nhìn — mũi nhọn hướng sang phải, chỉa vào Sứ mệnh, mép trên cong lên.
            Icon nằm cạnh chữ (không xếp chồng lên) để card thấp/gọn dù chiều ngang rộng. */}
        <motion.article
          variants={v(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="vm-card vm-card--left relative flex-1 border p-5 pt-8 shadow-[0_14px_32px_-22px_rgba(0,100,0,0.3)] sm:flex sm:items-center sm:gap-5 sm:p-6 sm:pt-9 sm:pr-16"
          style={{
            background: "linear-gradient(160deg, #FFFFFF 0%, #F4FBFF 100%)",
            borderColor: "#2E7DC255",
          }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white [&_svg]:h-6 [&_svg]:w-6"
            style={{ background: "#2E7DC2" }}
          >
            <IconCompass />
          </span>
          <div className="mt-3 sm:mt-0">
            <h3 className="font-display text-lg font-bold text-[#06301B] sm:text-xl">
              Tầm nhìn{" "}
              <span className="font-mono text-xs font-medium text-slate-400">
                (đến 2030)
              </span>
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
              Hệ sinh thái nông nghiệp công nghệ cao dẫn đầu VN, Việt Nam trở
              ngõ và vươn tầm thế giới.
            </p>
          </div>
        </motion.article>

        {/* Huy hiệu nối giữa hai mũi tên */}
        <div className="relative z-10 flex items-center justify-center sm:w-0">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
            }
            transition={{ duration: 0.7, delay: 0.9, ease: easeOut }}
            className="-my-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-lg sm:-mx-6 sm:my-0"
            style={{
              background: "conic-gradient(from 180deg, #2E7DC2, #006400, #2E7DC2)",
            }}
          >
            <span
              className="flex h-[2.15rem] w-[2.15rem] items-center justify-center rounded-full"
              style={{ background: "#06301B" }}
            >
              <IconSeed />
            </span>
          </motion.div>
        </div>

        {/* Sứ mệnh — mũi nhọn hướng sang trái, chỉa vào Tầm nhìn. Icon vẫn nằm
            ở mép ngoài (phải), chữ nằm gần mũi nhọn (trái) trên desktop. */}
        <motion.article
          variants={v(1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="vm-card vm-card--right relative flex-1 border p-5 pt-8 text-right shadow-[0_14px_32px_-22px_rgba(0,100,0,0.3)] sm:flex sm:items-center sm:gap-5 sm:p-6 sm:pt-9 sm:pl-16"
          style={{
            background: "linear-gradient(200deg, #FFFFFF 0%, #FFFDF0 100%)",
            borderColor: "#00640022",
          }}
        >
          <span
            className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white [&_svg]:h-6 [&_svg]:w-6 sm:order-2"
            style={{ background: "#006400" }}
          >
            <IconLeaf />
          </span>
          <div className="mt-3 sm:order-1 sm:mt-0 sm:flex-1">
            <h3 className="font-display text-lg font-bold text-[#06301B] sm:text-xl">
              Sứ mệnh
            </h3>
            <p className="ml-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
              Cung cấp giải pháp nông nghiệp bền vững, vì sức khỏe con người
              & một hành tinh xanh.
            </p>
          </div>
        </motion.article>
      </div>

      <style>{`
        .vm-card { border-radius: 1.75rem; }
        @media (min-width: 640px) {
          .vm-card--left {
            clip-path: url(#vm-clip-left);
            border-radius: 0;
          }
          .vm-card--right {
            clip-path: url(#vm-clip-right);
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 Giá trị cốt lõi — tổ ong                                          */
/* ------------------------------------------------------------------ */

function CoreValues() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const v = useRevealVariants(0.05);

  return (
    <div ref={ref} className="mt-20 sm:mt-28">
      <motion.div
        variants={v(0)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="text-center"
      >
        {/* Trên desktop, cả tiêu đề và phụ đề chạy cong theo 2 đường chỉ xanh phía trên tổ ong
            (xem SVG bên dưới); trên mobile (không có tổ ong/đường cong) hiện chữ thường. */}
        <h3 className="font-display text-2xl font-extrabold tracking-tight text-[#06301B] sm:hidden">
          4 Giá trị cốt lõi
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 sm:hidden">
          Bốn mảnh ghép gắn liền với nhau — nền tảng cho mọi quyết định.
        </p>
      </motion.div>

      {/* Desktop / tablet: tổ ong xếp theo vòng cung — mỗi ô nghiêng nhẹ theo
          đúng góc tiếp tuyến của cung, 2 ô giữa nhô cao hơn 2 ô hai đầu.
          SVG tiêu đề nằm trong luồng bố cục bình thường (không absolute/translate
          âm) để không bao giờ chồng lên khối Tầm nhìn/Sứ mệnh phía trên. */}
      <div className="mt-24 hidden justify-center sm:flex">
        <div className="flex flex-col items-center">
          <svg
            aria-hidden
            className="pointer-events-none block h-28 w-[44rem] max-w-full"
            viewBox="0 -20 880 140"
            preserveAspectRatio="none"
          >
            {/* Đường chỉ xanh thứ nhất — tiêu đề "4 Giá trị cốt lõi" chạy trên đó */}
            <path
              id="core-values-arc-title"
              d="M20,58 Q 440,-28 860,58"
              fill="none"
              stroke="#006400"
              strokeOpacity="0.45"
              strokeWidth="2.5"
              strokeDasharray="2 11"
              strokeLinecap="round"
            />
            {/* Đường chỉ xanh thứ hai — phụ đề chạy song song, thấp hơn và mờ hơn */}
            <path
              id="core-values-arc-subtitle"
              d="M20,100 Q 440,16 860,100"
              fill="none"
              stroke="#006400"
              strokeOpacity="0.25"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <text
              className="font-display"
              fill="#06301B"
              fontSize="30"
              fontWeight="800"
              letterSpacing="1.5"
            >
              <textPath href="#core-values-arc-title" startOffset="50%" textAnchor="middle">
                4 GIÁ TRỊ CỐT LÕI
              </textPath>
            </text>
            <text className="font-body" fill="#64748b" fontSize="20" fontWeight="500">
              <textPath href="#core-values-arc-subtitle" startOffset="50%" textAnchor="middle">
                Bốn mảnh ghép gắn liền với nhau — nền tảng cho mọi quyết định.
              </textPath>
            </text>
          </svg>

          <div className="relative mt-1 flex items-end gap-3">
            {/* điểm nhấn: quầng sáng mềm phía sau, chỉ nằm quanh khối tổ ong */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-[48rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, #87cefa4d, #FFFACD33 55%, transparent 75%)",
              }}
            />
            {CORE_VALUES.map((val, i) => (
              <div
                key={val.key}
                className="hex-cell relative"
                style={{
                  transform: `translateY(${HEX_ARC[i].y}px) rotate(${HEX_ARC[i].rotate}deg)`,
                }}
              >
                <motion.div
                  variants={v(i, 0.35)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="h-full w-full"
                >
                  <HexCard {...val} />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: xếp dọc dạng thẻ bo góc, vẫn giữ ngôn ngữ màu/icon */}
      <div className="mt-10 grid gap-4 sm:hidden">
        {CORE_VALUES.map((val, i) => (
          <motion.div
            key={val.key}
            variants={v(i, 0.35)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-start gap-4 rounded-2xl border border-black/5 p-4 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${val.from}22, ${val.to}14)`,
            }}
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
              style={{
                background: `linear-gradient(160deg, ${val.from}, ${val.to})`,
              }}
            >
              <val.icon />
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-[#06301B]">
                {val.title}
              </h4>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                {val.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .hex-cell {
          width: 16.5rem;
          height: 17.5rem;
        }
        .hex-cell:hover {
          z-index: 30 !important;
        }
        .hex-shape {
          position: relative;
          width: 100%;
          height: 100%;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          box-shadow:
            0 40px 70px -18px rgba(0,0,0,0.5),
            0 20px 34px -14px rgba(0,0,0,0.4),
            0 6px 12px -4px rgba(0,0,0,0.28);
          filter: drop-shadow(0 0 0 transparent);
          transition: transform 400ms cubic-bezier(.22,1,.36,1), box-shadow 400ms ease, filter 400ms ease;
        }
        .hex-cell:hover .hex-shape {
          transform: translateY(-10px) scale(1.05);
          filter: brightness(1.08) saturate(1.15) drop-shadow(0 0 28px var(--hex-glow));
          box-shadow:
            0 46px 76px -16px rgba(0,0,0,0.48),
            0 24px 38px -12px rgba(0,0,0,0.4),
            0 8px 14px -4px rgba(0,0,0,0.3);
        }
        .hex-sheen {
          position: absolute;
          inset: 0;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          background: linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 68%, rgba(0,0,0,0.1) 100%);
          pointer-events: none;
          mix-blend-mode: soft-light;
        }
        .hex-icon svg {
          width: 2.1rem;
          height: 2.1rem;
          transition: transform 400ms cubic-bezier(.22,1,.36,1);
        }
        .hex-cell:hover .hex-icon svg {
          transform: scale(1.12) rotate(-4deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .hex-shape, .hex-icon svg { transition: none; }
          .hex-cell:hover .hex-shape { transform: none; }
        }
      `}</style>
    </div>
  );
}

function HexCard({
  title,
  desc,
  from,
  to,
  icon: Icon,
}: (typeof CORE_VALUES)[number]) {
  return (
    <div
      className="relative h-full w-full"
      style={{ "--hex-glow": to } as React.CSSProperties}
    >
      <div
        className="hex-shape flex h-full w-full flex-col items-center justify-center gap-3 px-10 text-center text-white"
        style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
      >
        <span className="hex-icon text-white">
          <Icon />
        </span>
        <h4 className="font-display text-lg font-bold leading-tight sm:text-xl">
          {title}
        </h4>
        <p className="max-w-[10.5rem] text-[13px] leading-snug text-white/90">
          {desc}
        </p>
        <div className="hex-sheen" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icon (inline SVG, không phụ thuộc thư viện ngoài)                    */
/* ------------------------------------------------------------------ */

function IconCompass() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15 9l-2.2 5.2L9 16l2.2-5.2L15 9z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 4C10 4 4 10 4 18c0 .8 0 1.4.1 2 6.7-.1 10.9-2 13.5-5.6C19.4 11.7 20 8 20 4Z"
        fill="currentColor"
      />
      <path
        d="M5 19c3-4 7-6.5 12.5-8.5"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconSeed() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c4 3 7 6 7 10a7 7 0 11-14 0c0-4 3-7 7-10Z"
        fill="#FFFACD"
      />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z" fill="currentColor" />
    </svg>
  );
}
function IconHands() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12l4-3 4 2 4-2 6 3-4 6-6-1-4-2-4-3z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconHeartPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7-4.4-9.3-8.8C1.4 8.2 3 5 6.2 5c1.8 0 3.1 1 3.8 2.2C10.7 6 12 5 13.8 5 17 5 18.6 8.2 17.3 11.2 15 15.6 12 20 12 20z"
        fill="currentColor"
      />
    </svg>
  );
}