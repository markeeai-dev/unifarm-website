"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Settings, ShoppingBasket } from "lucide-react";
import { useIsMobile } from "@/lib/use-is-mobile";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/* ============================================================
   BẢNG MÀU CHỦ ĐẠO
   ============================================================ */
const C = {
  yellow: "#FFFACD",
  yellowDeep: "#F5E98A",
  green: "#006400",
  greenSoft: "#0B7A0B",
  blue: "#87CEFA",
  ink: "#0B1F14",
};

/* ============================================================
   HOOK: phát hiện phần tử lọt vào khung nhìn (1 lần duy nhất)
   ============================================================ */
function useInView(threshold = 0.3): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
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
   HOOK: đếm số chạy mượt (easeOutExpo) khi inView = true
   ============================================================ */
function useCountUp(target: number, inView: boolean, duration = 2800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let raf: number;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(2, -10 * t);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : ease(progress);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return value;
}

function formatVN(num: number, decimals = 0) {
  return num.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ============================================================
   ICON ĐỘNG TÙY CHỈNH — thay cho icon tĩnh, mỗi icon tự chạy liên tục
   ============================================================ */

type StatIconProps = {
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
};

// Nhân sự — đồng hồ với kim giờ/phút tự xoay liên tục
function ClockSpinIcon({ className = "h-7 w-7", style, strokeWidth = 1.8 }: StatIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <line
        x1="12" y1="12" x2="12" y2="7.2"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
        className="clock-hand clock-hand--min"
      />
      <line
        x1="12" y1="12" x2="15.2" y2="12"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
        className="clock-hand clock-hand--hour"
      />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

// Độ phủ công nghệ — 2 bánh răng ăn khớp, tự xoay ngược chiều nhau liên tục
function GearsSpinIcon({ className = "h-7 w-7", style, strokeWidth = 2.2 }: StatIconProps) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      <Settings className="gear-spin gear-spin--cw absolute left-0 top-0 h-[64%] w-[64%]" strokeWidth={strokeWidth} />
      <Settings className="gear-spin gear-spin--ccw absolute bottom-0 right-0 h-[52%] w-[52%]" strokeWidth={strokeWidth} />
    </span>
  );
}

// Vốn chủ sở hữu — đồng tiền tự "leo" lên bậc thang tăng trưởng, lặp liên tục
function GrowthStepsIcon({ className = "h-7 w-7", style }: StatIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <rect x="2" y="17" width="3.6" height="5" rx="0.6" fill="currentColor" opacity="0.3" />
      <rect x="7" y="13" width="3.6" height="9" rx="0.6" fill="currentColor" opacity="0.5" />
      <rect x="12" y="9" width="3.6" height="13" rx="0.6" fill="currentColor" opacity="0.7" />
      <rect x="17" y="4" width="3.6" height="18" rx="0.6" fill="currentColor" opacity="0.9" />
      <g className="coin-climb">
        <circle cx="4" cy="14" r="2.3" fill="currentColor" />
        <text x="4" y="15" fontSize="2.6" fontWeight="700" textAnchor="middle" fill="white">
          $
        </text>
      </g>
    </svg>
  );
}

// Tăng trưởng CAGR — các mũi tên/chevron liên tục trồi lên rồi mờ dần, lặp vô hạn
function RisingArrowsIcon({ className = "h-7 w-7", style, strokeWidth = 2.4 }: StatIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="5 16 12 9 19 16" className="chevron-rise" style={{ animationDelay: "0s" }} />
      <polyline points="5 20.5 12 13.5 19 20.5" className="chevron-rise" style={{ animationDelay: "0.45s" }} />
    </svg>
  );
}

/* ============================================================
   COMPONENT: số đếm hiển thị
   ============================================================ */
function AnimatedNumber({
  target,
  inView,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  target: number;
  inView: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const value = useCountUp(target, inView);
  return (
    <span>
      {prefix}
      {formatVN(value, decimals)}
      {suffix}
    </span>
  );
}

/* ============================================================
   DỮ LIỆU 4 CHỈ SỐ NỔI BẬT
   ============================================================ */
const STATS = [
  {
    icon: ClockSpinIcon,
    label: "Nguồn giống & R&D",
    target: 0,
    decimals: 0,
    prefix: "",
    suffix: "",
    unit: "",
    textValue: "Giống ưu tú",
    detail: "Tuyển chọn giống thích nghi cao, năng suất và kháng sâu bệnh.",
    accent: C.blue,
  },
  {
    icon: GearsSpinIcon,
    label: "Hiệu quả tài nguyên",
    target: 0,
    decimals: 0,
    prefix: "",
    suffix: "",
    unit: "",
    textValue: "Tối ưu chi phí",
    detail: "Tối ưu hóa chi phí và giảm thiểu lãng phí trên từng mét vuông đất.",
    accent: C.green,
  },
  {
    icon: GrowthStepsIcon,
    label: "Con người có nghề",
    target: 2000,
    decimals: 0,
    prefix: "",
    suffix: "+",
    unit: "nhân viên",
    textValue: "",
    detail: "Đào tạo công nhân, kỹ sư lành nghề và hiểu sâu sắc về cây trồng.",
    accent: C.greenSoft,
  },
  {
    icon: RisingArrowsIcon,
    label: "Dữ liệu & Quản trị",
    target: 0,
    decimals: 0,
    prefix: "",
    suffix: "",
    unit: "",
    textValue: "Quản trị số",
    detail: "Vận hành nông trại và ra quyết định dựa trên dữ liệu thực tế.",
    accent: C.ink,
  },
];

const EXPORT_MARKETS = [
  "Nhật Bản",
  "Hàn Quốc",
  "Trung Quốc",
  "Đông Nam Á",
  "Trung Đông",
  "Đức",
  "Hà Lan",
  "Pháp",
];

/* ============================================================
   BẢN ĐỒ THẾ GIỚI DẠNG CHẤM (thay cho icon quả địa cầu xoay)
   ============================================================ */

// Tạo cụm chấm rải đều (giả-ngẫu nhiên nhưng cố định — an toàn cho SSR,
// không dùng Math.random()) trong 1 hình elip, mô phỏng dáng lục địa.
function makeClusterDots(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  count: number,
  seed: number
) {
  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.sin(seed * 999 + i * 12.9898) * 43758.5453;
    const angleFrac = a - Math.floor(a);
    const b = Math.sin(seed * 777 + i * 78.233) * 12543.123;
    const radiusFrac = b - Math.floor(b);
    const angle = angleFrac * Math.PI * 2;
    const radius = Math.sqrt(radiusFrac);
    // làm tròn 2 chữ số thập phân — tránh lệch hydration do sai số dấu phẩy động
    // (Math.sin/cos có thể lệch vài ULP cuối giữa môi trường render server và trình duyệt)
    dots.push({
      x: Math.round((cx + Math.cos(angle) * rx * radius) * 100) / 100,
      y: Math.round((cy + Math.sin(angle) * ry * radius) * 100) / 100,
    });
  }
  return dots;
}

// Vị trí tương đối các lục địa trên viewBox 0 0 200 100
const MAP_CLUSTERS = [
  { cx: 30, cy: 30, rx: 15, ry: 13, count: 22, seed: 1 }, // Bắc Mỹ
  { cx: 40, cy: 62, rx: 8, ry: 16, count: 14, seed: 2 }, // Nam Mỹ
  { cx: 96, cy: 20, rx: 8, ry: 8, count: 10, seed: 3 }, // Châu Âu
  { cx: 96, cy: 50, rx: 11, ry: 18, count: 16, seed: 4 }, // Châu Phi
  { cx: 145, cy: 30, rx: 27, ry: 20, count: 34, seed: 5 }, // Châu Á
  { cx: 165, cy: 74, rx: 9, ry: 7, count: 8, seed: 6 }, // Úc
];

// 11 điểm thị trường xuất khẩu chính, khớp với EXPORT_MARKETS — sáng & nhấp nháy
// mỗi điểm có anchor + offset riêng để đặt tên nước không đè lên nhau
const MARKET_DOTS = [
  { x: 172, y: 24, label: "Nhật Bản", flagId: "jp", dx: -4, dy: 6, anchor: "end" as const },
  { x: 156, y: 15, label: "Hàn Quốc", flagId: "kr", dx: 0, dy: 6, anchor: "middle" as const },
  { x: 138, y: 21, label: "Trung Quốc", flagId: "cn", dx: -3, dy: 6, anchor: "end" as const },
  { x: 153, y: 53, label: "Đông Nam Á", flagId: "sg", dx: 4, dy: 1, anchor: "start" as const },
  { x: 111, y: 40, label: "Trung Đông", flagId: "ae", dx: -4, dy: 1, anchor: "end" as const },
  { x: 95, y: 9, label: "Hà Lan", flagId: "nl", dx: 0, dy: -3, anchor: "middle" as const },
  { x: 92, y: 15, label: "Đức", flagId: "de", dx: 4, dy: 1, anchor: "start" as const },
  { x: 88, y: 22, label: "Pháp", flagId: "fr", dx: -4, dy: 6, anchor: "end" as const },
  // { x: 28, y: 24, label: "Bắc Mỹ", flagId: "us", dx: 4, dy: 1, anchor: "start" as const },
  // { x: 96, y: 54, label: "Châu Phi", flagId: "africa", dx: 4, dy: 6, anchor: "start" as const },
  // { x: 166, y: 76, label: "Châu Đại Dương", flagId: "au", dx: -4, dy: 6, anchor: "end" as const },
];

// Điểm gốc — Việt Nam, nơi xuất phát các "đường bay" xuất khẩu trên bản đồ
const VN_ORIGIN = { x: 139, y: 45, label: "Việt Nam", flagId: "vn", dx: -4, dy: 6, anchor: "end" as const };

// Toạ độ 1 ngôi sao 5 cánh — dùng cho quốc kỳ Việt Nam & Trung Quốc
function starPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

/* ============================================================
   LÁ CỜ NHỎ CẮM TẠI TỪNG QUỐC GIA TRÊN BẢN ĐỒ
   ============================================================ */
function FlagPin({ x, y, id, scale = 1 }: { x: number; y: number; id: string; scale?: number }) {
  const w = 5.6 * scale;
  const h = 3.6 * scale;
  const poleTop = y - 6.4 * scale;

  let body: ReactNode;
  switch (id) {
    case "vn":
      body = (
        <>
          <rect width={w} height={h} fill="#DA251D" />
          <path d={starPath(w / 2, h / 2, h * 0.32)} fill="#FFCD00" />
        </>
      );
      break;
    case "jp":
      body = (
        <>
          <rect width={w} height={h} fill="#fff" />
          <circle cx={w / 2} cy={h / 2} r={h * 0.3} fill="#BC002D" />
        </>
      );
      break;
    case "kr":
      body = (
        <>
          <rect width={w} height={h} fill="#fff" />
          <path d={`M ${w / 2} ${h / 2 - h * 0.32} A ${h * 0.32} ${h * 0.32} 0 0 1 ${w / 2} ${h / 2 + h * 0.32} A ${h * 0.16} ${h * 0.16} 0 0 1 ${w / 2} ${h / 2} Z`} fill="#CD2E3A" />
          <path d={`M ${w / 2} ${h / 2 + h * 0.32} A ${h * 0.32} ${h * 0.32} 0 0 1 ${w / 2} ${h / 2 - h * 0.32} A ${h * 0.16} ${h * 0.16} 0 0 1 ${w / 2} ${h / 2} Z`} fill="#0047A0" />
        </>
      );
      break;
    case "cn":
      body = (
        <>
          <rect width={w} height={h} fill="#DE2910" />
          <path d={starPath(w * 0.28, h * 0.32, h * 0.34)} fill="#FFDE00" />
        </>
      );
      break;
    case "sg":
      body = (
        <>
          <rect width={w} height={h / 2} fill="#EF3340" />
          <rect y={h / 2} width={w} height={h / 2} fill="#fff" />
          <circle cx={w * 0.32} cy={h * 0.3} r={h * 0.2} fill="#fff" />
          <circle cx={w * 0.4} cy={h * 0.3} r={h * 0.2} fill="#EF3340" />
        </>
      );
      break;
    case "ae":
      body = (
        <>
          <rect width={w} height={h / 3} fill="#00732F" />
          <rect y={h / 3} width={w} height={h / 3} fill="#fff" />
          <rect y={(2 * h) / 3} width={w} height={h / 3} fill="#000" />
          <rect width={w * 0.28} height={h} fill="#FF0000" />
        </>
      );
      break;
    case "de":
      body = (
        <>
          <rect width={w} height={h / 3} fill="#000" />
          <rect y={h / 3} width={w} height={h / 3} fill="#DD0000" />
          <rect y={(2 * h) / 3} width={w} height={h / 3} fill="#FFCE00" />
        </>
      );
      break;
    case "fr":
      body = (
        <>
          <rect width={w / 3} height={h} fill="#0055A4" />
          <rect x={w / 3} width={w / 3} height={h} fill="#fff" />
          <rect x={(2 * w) / 3} width={w / 3} height={h} fill="#EF4135" />
        </>
      );
      break;
    case "nl":
      body = (
        <>
          <rect width={w} height={h / 3} fill="#AE1C28" />
          <rect y={h / 3} width={w} height={h / 3} fill="#fff" />
          <rect y={(2 * h) / 3} width={w} height={h / 3} fill="#21468B" />
        </>
      );
      break;
    case "us":
      body = (
        <>
          <rect width={w} height={h} fill="#fff" />
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} y={(i * h) / 4} width={w} height={h / 8} fill="#B22234" />
          ))}
          <rect width={w * 0.4} height={h * 0.6} fill="#3C3B6E" />
        </>
      );
      break;
    case "africa":
      body = (
        <>
          <rect width={w} height={h / 3} fill="#009A44" />
          <rect y={h / 3} width={w} height={h / 3} fill="#FFCE00" />
          <rect y={(2 * h) / 3} width={w} height={h / 3} fill="#DE2110" />
        </>
      );
      break;
    case "au":
      body = (
        <>
          <rect width={w} height={h} fill="#00247D" />
          <rect y={h * 0.35} width={w * 0.4} height={h * 0.3} fill="#fff" />
          <rect x={w * 0.15} width={w * 0.1} height={h} fill="#fff" />
          <circle cx={w * 0.72} cy={h * 0.32} r={h * 0.09} fill="#fff" />
          <circle cx={w * 0.88} cy={h * 0.5} r={h * 0.09} fill="#fff" />
          <circle cx={w * 0.68} cy={h * 0.7} r={h * 0.09} fill="#fff" />
        </>
      );
      break;
    default:
      body = <rect width={w} height={h} fill="#ccc" />;
  }

  return (
    <g>
      <line x1={x} y1={y - 1.6} x2={x} y2={poleTop} stroke="#f2f2f2" strokeWidth={0.35} />
      <g transform={`translate(${x}, ${poleTop})`}>
        {body}
        <rect width={w} height={h} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={0.25} />
      </g>
    </g>
  );
}

/* ============================================================
   THẺ CHỈ SỐ (STAT CARD)
   ============================================================ */
function StatCard({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const { t } = useLanguage();
  const [ref, inView] = useInView(0.35);
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className="stat-card group relative overflow-hidden bg-white p-6 transition-all duration-500 ease-out sm:p-7"
      style={
        {
          boxShadow: "0 4px 20px rgba(0,100,0,0.08)",
          border: "1px solid rgba(0,100,0,0.08)",
          transitionDelay: `${index * 110}ms`,
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(28px)",
          "--stat-accent": stat.accent,
        } as CSSProperties
      }
    >
      {/* viền sáng chạy tự động phía trên — theo màu riêng của từng thẻ */}
      <span
        className="shimmer-line absolute inset-x-0 top-0 h-[3px]"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${stat.accent} 35%, ${stat.accent} 65%, transparent)`,
        }}
      />

      {/* icon động — làm điểm nhấn, không nền */}
      <div
        className="float-icon relative mb-6 inline-flex h-20 w-20 items-center justify-center"
        style={{ animationDelay: `${index * 0.4}s` }}
      >
        <span
          className="absolute inset-0 rounded-full opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-90"
          style={{ background: stat.accent }}
        />
        <Icon
          className="relative z-10 h-14 w-14 transition-transform duration-300 group-hover:scale-110"
          style={{ color: stat.accent, filter: `drop-shadow(0 8px 16px ${stat.accent}55)` }}
          strokeWidth={1.8}
        />
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: stat.accent }}>
        {t(stat.label)}
      </h3>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span
          className="text-4xl font-extrabold tabular-nums tracking-tight sm:text-[2.75rem]"
          style={{ color: C.ink }}
        >
          {stat.textValue ? (
            t(stat.textValue)
          ) : (
            <AnimatedNumber
              target={stat.target}
              inView={inView}
              decimals={stat.decimals || 0}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          )}
        </span>
        {stat.unit ? (
          <span className="text-base font-semibold" style={{ color: stat.accent }}>
            {t(stat.unit)}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm italic leading-relaxed text-gray-500">
        {t(stat.detail)}
      </p>

      {/* chấm sáng góc dưới - hover glow */}
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: stat.accent }}
      />
    </div>
  );
}

/* ============================================================
   THẺ THỊ TRƯỜNG XUẤT KHẨU (GLOBE ĐỘNG)
   ============================================================ */
function ExportCard() {
  const { t } = useLanguage();
  const [ref, inView] = useInView(0.3);
  const isMobile = useIsMobile();
  // Nhãn/lá cờ trong SVG dùng đơn vị viewBox nên co theo bề rộng khung chứa —
  // ở mobile khung hẹp hơn nhiều lần so với desktop khiến chữ chỉ còn ~5-6px,
  // không đọc được. Phóng to các phần tử nhãn (không đổi vị trí điểm) để bù lại.
  const S = isMobile ? 2.3 : 1;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-white p-7 transition-all duration-700 ease-out sm:p-9"
      style={{
        boxShadow: "0 6px 28px rgba(0,100,0,0.08)",
        border: "1px solid rgba(0,100,0,0.08)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
      }}
    >
      <div className="flex flex-col gap-7">
        {/* bản đồ xuất khẩu động — lưới kinh vĩ tuyến + đường bay tới từng thị trường */}
        <div
          className="relative h-60 w-full overflow-hidden sm:h-72"
          style={{
            background: `radial-gradient(130% 150% at 25% 15%, ${C.greenSoft}, ${C.green} 55%, ${C.ink} 100%)`,
          }}
        >
          {/* lưới kinh vĩ tuyến mờ */}
          <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full opacity-[0.14]">
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={((i + 1) * 100) / 6} x2={200} y2={((i + 1) * 100) / 6} stroke="#fff" strokeWidth={0.3} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={((i + 1) * 200) / 10} y1={0} x2={((i + 1) * 200) / 10} y2={100} stroke="#fff" strokeWidth={0.3} />
            ))}
          </svg>

          <span className="ring-pulse absolute -left-8 -top-8 h-24 w-24 rounded-full" style={{ borderColor: C.blue }} />
          <span
            className="ring-pulse absolute -bottom-10 -right-10 h-28 w-28 rounded-full"
            style={{ borderColor: C.yellow, animationDelay: "1s" }}
          />

          <svg viewBox="0 0 200 100" className="relative z-10 h-full w-full">
            {MAP_CLUSTERS.flatMap((cluster) =>
              makeClusterDots(cluster.cx, cluster.cy, cluster.rx, cluster.ry, cluster.count, cluster.seed).map(
                (d, i) => (
                  <circle
                    key={`${cluster.seed}-${i}`}
                    cx={d.x}
                    cy={d.y}
                    r={0.9}
                    fill="rgba(255,255,255,0.35)"
                  />
                )
              )
            )}

            {/* đường bay xuất khẩu từ Việt Nam tới từng thị trường */}
            {MARKET_DOTS.map((m) => (
              <path
                key={`path-${m.label}`}
                d={`M ${VN_ORIGIN.x} ${VN_ORIGIN.y} Q ${(VN_ORIGIN.x + m.x) / 2} ${Math.min(VN_ORIGIN.y, m.y) - 14} ${m.x} ${m.y}`}
                fill="none"
                stroke={C.yellow}
                strokeWidth={0.5}
                strokeDasharray="2.4 2.4"
                strokeLinecap="round"
                className="flight-path"
                opacity={0.75}
              />
            ))}

            {/* điểm gốc Việt Nam */}
            <circle cx={VN_ORIGIN.x} cy={VN_ORIGIN.y} r={2.4 * S} fill={C.blue} />
            <circle
              className="market-dot-pulse"
              cx={VN_ORIGIN.x}
              cy={VN_ORIGIN.y}
              r={2.4 * S}
              fill="none"
              stroke={C.blue}
              strokeWidth={0.6 * S}
            />
            <FlagPin x={VN_ORIGIN.x} y={VN_ORIGIN.y} id={VN_ORIGIN.flagId} scale={S} />
            <text
              x={VN_ORIGIN.x + VN_ORIGIN.dx * S}
              y={VN_ORIGIN.y + VN_ORIGIN.dy * S}
              textAnchor={VN_ORIGIN.anchor}
              fontSize={4.6 * S}
              fontWeight={800}
              fill={C.blue}
              className="map-label"
            >
              {t(VN_ORIGIN.label)}
            </text>

            {MARKET_DOTS.map((m) => (
              <g key={m.label}>
                <title>{t(m.label)}</title>
                <circle
                  className="market-dot-pulse"
                  cx={m.x}
                  cy={m.y}
                  r={1.6 * S}
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={0.6 * S}
                />
                <circle cx={m.x} cy={m.y} r={1.8 * S} fill={C.yellow} />
                <FlagPin x={m.x} y={m.y} id={m.flagId} scale={S} />
                <text
                  x={m.x + m.dx * S}
                  y={m.y + m.dy * S}
                  textAnchor={m.anchor}
                  fontSize={4.2 * S}
                  fontWeight={700}
                  fill="#fff"
                  className="map-label"
                >
                  {t(m.label)}
                </text>
              </g>
            ))}
          </svg>

          <span className="absolute left-4 top-4 z-20 rounded-full bg-black/25 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {t("Bản đồ xuất khẩu toàn cầu")}
          </span>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: C.greenSoft }}>
              {t("Thị trường xuất khẩu")}
            </h3>
            <div className="mt-1 flex items-baseline justify-center gap-1 sm:justify-start">
              <span className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: C.ink }}>
                <AnimatedNumber target={66} inView={inView} suffix="%" />
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t("Cung ứng chuyên nghiệp đi các thị trường Nhật Bản, Hàn Quốc, Trung Quốc, Trung Đông...")}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {EXPORT_MARKETS.map((m) => (
              <span
                key={m}
                className="market-chip rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300"
                style={{ background: C.yellow, color: C.green }}
              >
                {t(m)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   THẺ THỊ PHẦN NỘI ĐỊA (DONUT ĐỘNG)
   ============================================================ */
function DomesticCard() {
  const { t } = useLanguage();
  const [ref, inView] = useInView(0.3);
  const target = 60;
  const value = useCountUp(target, inView, 2800);

  const R = 60;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (value / 100) * CIRC;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-white p-7 transition-all duration-700 ease-out sm:p-9"
      style={{
        boxShadow: "0 6px 28px rgba(0,100,0,0.08)",
        border: "1px solid rgba(0,100,0,0.08)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transitionDelay: "120ms",
      }}
    >
      <div className="flex flex-col gap-7">
        {/* bảng thị phần — đồng bộ chiều cao & bố cục với thẻ bản đồ xuất khẩu */}
        <div
          className="relative flex h-60 w-full items-center justify-center overflow-hidden sm:h-72"
          style={{
            background: `radial-gradient(130% 150% at 75% 15%, ${C.blue}, ${C.greenSoft} 55%, ${C.ink} 100%)`,
          }}
        >
          <span className="ring-pulse absolute -right-8 -top-8 h-24 w-24 rounded-full" style={{ borderColor: C.yellow }} />
          <span
            className="ring-pulse absolute -bottom-10 -left-10 h-28 w-28 rounded-full"
            style={{ borderColor: C.blue, animationDelay: "1s" }}
          />

          <div className="relative z-10 h-44 w-44 sm:h-52 sm:w-52">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="14" />
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={C.yellow}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.1s linear", filter: `drop-shadow(0 0 10px ${C.yellow}88)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white sm:text-4xl">
                <AnimatedNumber target={60} inView={inView} suffix="%" />
              </span>
              <ShoppingBasket className="mt-1 h-5 w-5" style={{ color: C.yellow }} />
            </div>
          </div>

          <span className="absolute left-4 top-4 z-20 rounded-full bg-black/25 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {t("Thị phần nội địa")}
          </span>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: C.greenSoft }}>
              {t("Thị phần nội địa")}
            </h3>
            <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: C.ink }}>
              {t("Dưa lưới, Chuối, Dứa MD2, …")}
            </p>
          </div>

          <p className="max-w-sm text-center text-sm leading-relaxed text-gray-500 sm:text-right">
            {t("Cung ứng ổn định các dòng nông sản cao cấp, đáp ứng trọn vẹn tiêu chuẩn khắt khe của các đại siêu thị và doanh nghiệp thực phẩm lớn tại Việt Nam.")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENT CHÍNH
   ============================================================ */
export default function StatsSectionPreview() {
  const { t } = useLanguage();
  const [headRef, headInView] = useInView(0.4);

  return (
    <section className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-24">
      {/* nền trang trí mờ */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: C.yellow }}
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: C.blue }}
      />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* tiêu đề khối 1 */}
        <div
          ref={headRef}
          className="mb-12 transition-all duration-700 ease-out"
          style={{
            opacity: headInView ? 1 : 0,
            transform: headInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ background: C.yellow, color: C.green }}
          >
            {t("Nền tảng cạnh tranh")}
          </span>
          <h2
            className="uppercase mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: C.ink }}
          >
            {t("KHẢ NĂNG CẠNH TRANH ĐẾN TỪ ĐÂU?")}
          </h2>
        </div>

        {/* grid 4 chỉ số */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>

        {/* tiêu đề khối 2 */}
        <div className="mb-8 mt-20">
          <h2 className="uppercase text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: C.ink }}>
            {t("KẾT NỐI THỊ TRƯỜNG NỘI ĐỊA &")}{" "}
            <span style={{ color: C.green }}>{t("XUẤT KHẨU")}</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            {t("Cung ứng ổn định cho các đối tác toàn cầu")}
          </p>
        </div>

        {/* grid 2 thẻ thị trường */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ExportCard />
          <DomesticCard />
        </div>
      </div>

      {/* ===================== CSS hiệu ứng ===================== */}
      <style>{`
        .float-icon {
          animation: floatY 3.2s ease-in-out infinite;
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .shimmer-line {
          background: linear-gradient(
            90deg,
            transparent,
            ${C.blue} 25%,
            ${C.yellow} 50%,
            ${C.green} 75%,
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3.5s linear infinite;
          opacity: 0.85;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .stat-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 16px 40px rgba(0,100,0,0.18) !important;
          border-color: var(--stat-accent, rgba(135,206,250,0.6)) !important;
        }

        .ring-pulse {
          border: 1.5px solid;
          animation: ringPulse 2.6s ease-out infinite;
        }
        @keyframes ringPulse {
          0% { transform: scale(0.7); opacity: 0.7; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        .spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .market-chip:hover {
          background: ${C.green} !important;
          color: #fff !important;
          transform: translateY(-2px);
        }

        /* Nhân sự — kim đồng hồ tự xoay liên tục */
        .clock-hand {
          transform-origin: 12px 12px;
          animation: clockSpin linear infinite;
        }
        .clock-hand--min {
          animation-duration: 4s;
        }
        .clock-hand--hour {
          animation-duration: 8s;
        }
        @keyframes clockSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Độ phủ công nghệ — 2 bánh răng ăn khớp xoay ngược chiều nhau */
        .gear-spin {
          transform-origin: center;
        }
        .gear-spin--cw {
          animation: spin 4s linear infinite;
        }
        .gear-spin--ccw {
          animation: spinReverse 3s linear infinite;
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Vốn chủ sở hữu — đồng tiền leo bậc thang, lặp liên tục */
        .coin-climb {
          animation: coinClimb 2.6s ease-in-out infinite;
        }
        @keyframes coinClimb {
          0% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate(13px, -10px); opacity: 0; }
        }

        /* Tăng trưởng CAGR — mũi tên trồi lên rồi mờ dần, lặp vô hạn */
        .chevron-rise {
          animation: chevronRise 1.6s ease-in-out infinite;
        }
        @keyframes chevronRise {
          0% { transform: translateY(4px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(-6px); opacity: 0; }
        }

        /* Bản đồ xuất khẩu — chấm thị trường nhấp nháy lan toả */
        .market-dot-pulse {
          animation: marketDotPulse 2.2s ease-out infinite;
        }
        @keyframes marketDotPulse {
          0% { r: 1.6; opacity: 0.9; }
          100% { r: 5; opacity: 0; }
        }

        /* Bản đồ xuất khẩu — đường bay chảy dần từ Việt Nam tới từng thị trường */
        .flight-path {
          animation: flightFlow 2.4s linear infinite;
        }
        @keyframes flightFlow {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }

        /* Bản đồ — tên quốc gia có viền tối để luôn rõ chữ trên nền bản đồ */
        .map-label {
          paint-order: stroke;
          stroke: rgba(4,34,12,0.75);
          stroke-width: 2.6px;
          stroke-linejoin: round;
        }
      `}</style>
    </section>
  );
}