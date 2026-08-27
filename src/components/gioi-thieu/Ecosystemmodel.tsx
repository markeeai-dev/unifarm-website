"use client";

/**
 * EcosystemModel
 * ------------------------------------------------------------------
 * Khối "Hệ sinh thái khép kín & Mô hình vận hành": 2 cột full-bleed —
 * trái 40% (nền xanh cây, nội dung "Mạng lưới thành viên & liên kết"
 * căn giữa theo chiều dọc) và phải 60% (5 trụ cột hoạt động dạng tổ
 * ong, xuất hiện theo hiệu ứng "nở hoa" từ ô trung tâm ra khi cuộn tới).
 * ------------------------------------------------------------------
 */

import { useRef, type ComponentType, type CSSProperties } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Dna,
  TrendingUp,
  Cog,
  Factory,
  Tablet,
  Building2,
  Network,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const C = {
  yellow: "#FFFACD",
  green: "#006400",
  blue: "#87CEFA",
};

/** Các sắc độ mở rộng từ đúng 3 tông màu chủ đạo — dùng để mỗi ô tổ ong có
 * một điểm nhấn màu riêng biệt thay vì lặp lại một gradient duy nhất. */
const TONES = {
  green: { from: "#0B9B0B", to: C.green },
  blue: { from: C.blue, to: "#2E7DC2" },
  gold: { from: C.yellow, to: "#D9A91A" },
} as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Nội dung                                                            */
/* ------------------------------------------------------------------ */

const PILLARS: {
  key: string;
  title: string;
  subtitle?: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: (typeof TONES)[keyof typeof TONES];
  /** Độ trễ xuất hiện — tạo hiệu ứng "nở" từ ô giữa ra ngoài */
  bloomDelay: number;
}[] = [
  {
    key: "giong",
    title: "Nghiên cứu & Giống",
    subtitle: "Tuyển chọn giống tối ưu cho điều kiện sản xuất thực tế.",
    icon: Dna,
    tone: TONES.green,
    bloomDelay: 0.18,
  },
  {
    key: "san-xuat",
    title: "Sản xuất nông nghiệp",
    subtitle: "Vận hành nông trường chuẩn mực, thu thập dữ liệu và kiểm chứng giải pháp.",
    icon: TrendingUp,
    tone: TONES.blue,
    bloomDelay: 0.24,
  },
  {
    key: "chuyen-giao",
    title: "Liên kết chuỗi giá trị",
    subtitle: "Chuyển giao công nghệ và bao tiêu đầu ra theo tiêu chuẩn thị trường.",
    icon: Cog,
    tone: TONES.gold,
    bloomDelay: 0,
  },
  {
    key: "che-bien",
    title: "Sau thu hoạch & Chế biến",
    subtitle: "Xử lý đóng gói, kho lạnh và chế biến gia tăng giá trị.",
    icon: Factory,
    tone: TONES.blue,
    bloomDelay: 0.36,
  },
  {
    key: "giai-phap",
    title: "Thị trường & Khách hàng",
    subtitle: "Xây dựng chương trình cung ứng bền vững, ổn định và kỷ luật.",
    icon: Tablet,
    tone: TONES.green,
    bloomDelay: 0.42,
  },
];

const MEMBER_NETWORK = [
  "Vietplants",
  "Green Agritech",
  "Univita",
  "Unifarm Ventures",
  "Unifarm Foodtech",
  "Unifarm Highland",
  "Vafarm",
  "Unifarm Miền Bắc",
  "Nông trường Dầu Tiếng & Phú Giáo",
];

/* ------------------------------------------------------------------ */
/* Animation helpers                                                   */
/* ------------------------------------------------------------------ */

function useRevealVariants() {
  const reduce = useReducedMotion();
  const hidden: Variants["hidden"] = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 32 };
  return (i: number, extra = 0): Variants => ({
    hidden,
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.8,
        delay: reduce ? 0 : i * 0.15 + extra,
        ease: easeOut,
      },
    },
  });
}

/** Hiệu ứng "nở hoa": bung ra từ nhỏ -> lớn, kèm xoay nhẹ, dùng spring
 * cho cảm giác nảy tự nhiên, mượt hơn hẳn so với fade tuyến tính. */
function useHexBloomVariants() {
  const reduce = useReducedMotion();
  return (delay: number): Variants => ({
    hidden: reduce
      ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
      : { opacity: 0, scale: 0.35, y: 26, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: reduce
        ? { duration: 0 }
        : {
            type: "spring",
            stiffness: 130,
            damping: 14,
            mass: 0.7,
            delay,
          },
    },
  });
}

/* ------------------------------------------------------------------ */
/* Thẻ lục giác — 1 trụ cột hoạt động                                  */
/* ------------------------------------------------------------------ */

function HexPillar({
  title,
  subtitle,
  icon: Icon,
  tone,
}: (typeof PILLARS)[number]) {
  const { t } = useLanguage();
  return (
    <div
      className="hex-cell relative"
      style={{ "--hex-glow": `${tone.to}99` } as CSSProperties}
    >
      <div
        className="hex-shape flex h-full w-full flex-col items-center justify-center gap-3 px-7 text-center"
        style={{
          background: `linear-gradient(165deg, #ffffff 45%, ${tone.from}26 100%)`,
        }}
      >
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md"
          style={{ background: `linear-gradient(145deg, ${tone.from}, ${tone.to})` }}
        >
          <Icon className="h-7 w-7" strokeWidth={2} />
        </span>
        <h4 className="uppercase text-[15px] font-extrabold leading-snug text-[#06301B] sm:text-base">
          {t(title)}
        </h4>
        {subtitle ? (
          <p className="text-[11px] leading-snug text-slate-500 sm:text-[14px] sm:text-[#06301B]">{t(subtitle)}</p>
        ) : null}
        <span
          className="h-[3px] w-8 rounded-full"
          style={{ background: `linear-gradient(90deg, ${tone.from}, ${tone.to})` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cột trái — Mạng lưới thành viên & liên kết (nền xanh cây)           */
/* ------------------------------------------------------------------ */

function MemberNetworkPanel({
  variants,
  className = "",
}: {
  variants: Variants;
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <motion.div
      variants={variants}
      className={`relative flex h-full flex-col items-center justify-center overflow-hidden px-8 py-14 text-center sm:px-10 ${className}`}
      style={{
        background: `radial-gradient(120% 140% at 50% 0%, #0a7a0a 0%, ${C.green} 55%, #033303 100%)`,
      }}
    >
      {/* Đốm sáng trang trí phía sau */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `${C.blue}33` }}
      />

      {/* TIÊU ĐỀ CHÍNH của cả khối */}
      <span
        className="relative z-10 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider"
        style={{ background: C.yellow, color: C.green }}
      >
        {t("Mô hình vận hành")}
      </span>
      <h2 className="uppercase relative z-10 mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
        {t("Vòng Tuần Hoàn Hệ Sinh Thái")}
      </h2>
      <p className="relative z-10 mt-3 max-w-xs text-sm leading-relaxed text-white/75 sm:text-base">
        {t("Vận hành đồng bộ từ nghiên cứu đến khách hàng và lấy phản hồi thị trường quay lại cải tiến nghiên cứu.")}
      </p>

      <div className="relative z-10 my-7 h-px w-16 bg-white/20" />

      <span
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white/15"
        style={{ background: `linear-gradient(145deg, ${C.blue}, #2E7DC2)` }}
      >
        <Network className="h-7 w-7" strokeWidth={2} />
      </span>

      <h3 className="uppercase relative z-10 mt-5 text-xl font-extrabold text-white sm:text-2xl">
        {t("Mạng lưới thành viên & liên kết")}
      </h3>
      <p className="relative z-10 mt-2 max-w-xs text-sm leading-relaxed text-white/70">
        {t("Hệ thống công ty thành viên phối hợp xuyên suốt trong toàn chuỗi giá trị.")}
      </p>

      <ul className="relative z-10 mt-6 flex flex-col items-center gap-2.5">
        {MEMBER_NETWORK.map((name) => (
          <li
            key={name}
            className="flex items-center gap-2 text-sm font-medium leading-snug text-white/90"
          >
            <Building2
              className="h-4 w-4 shrink-0"
              style={{ color: C.yellow }}
              strokeWidth={2}
            />
            {t(name)}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Component chính                                                     */
/* ------------------------------------------------------------------ */

export default function EcosystemModel() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const v = useRevealVariants();
  const hexV = useHexBloomVariants();

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 sm:py-20 lg:py-24"
    >
      {/* ================= DESKTOP: 2 cột 40% - 60%, full-bleed ================= */}
      <div className="hidden w-full lg:grid lg:grid-cols-[2fr_3fr] lg:items-stretch">
        {/* CỘT TRÁI (40%) — Mạng lưới thành viên, nền xanh cây, căn giữa dọc */}
        <MemberNetworkPanel variants={v(1, 0.2)} />

        {/* CỘT PHẢI (60%) — 5 trụ cột dạng tổ ong, nền ảnh cố định (bg-fixed) */}
        <div
          className="relative overflow-hidden bg-fixed bg-cover bg-center px-6 py-12"
          style={{
            backgroundImage:
              "url('/images/UNIFARM/1787207482427_1582751505492234802_4935324150679931320_939749211a6e5c72f28397e7e138b486.jpg')",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "rgba(0,100,0,0.12)" }}
          />

          <h3 className="uppercase relative z-10 text-center text-xl font-extrabold text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.8)]">
            {t("5 Trụ cột hoạt động")}
          </h3>

          <div className="relative z-10 mt-10 flex flex-col items-center">
            <div className="flex justify-center gap-8">
              {[PILLARS[0], PILLARS[1]].map((p) => (
                <motion.div
                  key={p.key}
                  variants={hexV(p.bloomDelay)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <HexPillar {...p} />
                </motion.div>
              ))}
            </div>
            <div className="-mt-16 flex justify-center">
              <motion.div
                variants={hexV(PILLARS[2].bloomDelay)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <HexPillar {...PILLARS[2]} />
              </motion.div>
            </div>
            <div className="-mt-16 flex justify-center gap-8">
              {[PILLARS[3], PILLARS[4]].map((p) => (
                <motion.div
                  key={p.key}
                  variants={hexV(p.bloomDelay)}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <HexPillar {...p} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET: xếp dọc gọn gàng, full-bleed ================= */}
      <div className="flex w-full flex-col gap-6 lg:hidden">
        <MemberNetworkPanel variants={v(1)} className="rounded-2xl" />

        <motion.div
          variants={v(3)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative overflow-hidden bg-cover bg-center px-5 py-8"
          style={{
            backgroundImage:
              "url('/images/UNIFARM/1787207482427_1582751505492234802_4935324150679931320_939749211a6e5c72f28397e7e138b486.jpg')",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "rgba(0,100,0,0.12)" }}
          />

          <h3 className="uppercase relative z-10 text-center text-lg font-extrabold text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.8)]">
            {t("5 Trụ cột hoạt động")}
          </h3>
          <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.key}
                variants={hexV(i * 0.12)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className={`flex flex-col items-center gap-2 bg-white p-4 text-center shadow-sm ${
                  i === PILLARS.length - 1 ? "col-span-2 sm:col-span-1" : ""
                }`}
                style={{ borderTop: `3px solid ${p.tone.to}` }}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-md"
                  style={{ background: `linear-gradient(145deg, ${p.tone.from}, ${p.tone.to})` }}
                >
                  <p.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h4 className="uppercase text-sm font-extrabold leading-snug text-[#06301B]">
                  {t(p.title)}
                </h4>
                {p.subtitle ? (
                  <p className="text-xs leading-snug text-slate-500">
                    {t(p.subtitle)}
                  </p>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .hex-cell {
          width: 13.5rem;
          height: 14.5rem;
        }
        .hex-cell:hover {
          z-index: 30;
        }
        .hex-shape {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          box-shadow:
            0 24px 40px -14px rgba(0,100,0,0.25),
            0 10px 18px -8px rgba(0,0,0,0.12);
          transition: transform 400ms cubic-bezier(.22,1,.36,1), filter 400ms ease, box-shadow 400ms ease;
        }
        .hex-cell:hover .hex-shape {
          transform: translateY(-8px) scale(1.06);
          filter: saturate(1.2) brightness(1.03) drop-shadow(0 0 26px var(--hex-glow));
        }
        @media (prefers-reduced-motion: reduce) {
          .hex-shape { transition: none; }
          .hex-cell:hover .hex-shape { transform: none; }
        }
      `}</style>
    </section>
  );
}