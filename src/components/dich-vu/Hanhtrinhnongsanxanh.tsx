"use client";

/**
 * HanhTrinhNongSanXanh — "Hành trình đồng hành cùng nông dân"
 * ------------------------------------------------------------------
 * 4 khối dịch vụ xếp so le trái/phải (không dùng card/grid): Tư vấn mô
 * hình → Cung ứng đầu vào → Chuyển giao công nghệ → Du lịch trải nghiệm.
 * Một đường chỉ dọc ở giữa "chạy" theo đúng % đã cuộn qua section (dùng
 * scrollYProgress của framer-motion, làm mượt bằng spring cho cảm giác
 * "rê" nhẹ chứ không giật cục) — khác với kiểu chỉ sáng rời rạc theo
 * từng mốc. Ảnh dùng đúng hiệu ứng "focus pull" (mờ nhoè + phóng to nhẹ
 * rồi nét dần) như ở AgriTechHero, và toàn bộ hiệu ứng xuất hiện dùng
 * `viewport={{ once: false }}` nên cuộn ra rồi cuộn lại vẫn chạy lại.
 */

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: false, amount: 0.35 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  soft: "#8FBF72",
  cream: "#F7F4E8",
  blue: "#87CEFA",
  ink: "#12210F",
};

type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  bullets: string[];
  steps?: { number: string; label: string }[];
  highlight: { label: string; value: string };
  cta: string;
  image: string;
  imageSide: "left" | "right";
};

const SERVICES: Service[] = [
  {
    id: "tu-van-mo-hinh",
    number: "01",
    title: "Tư vấn mô hình nông nghiệp công nghệ cao",
    description:
      "Unifarm cung cấp giải pháp toàn diện giúp xây dựng mô hình nông nghiệp CNC hiệu quả, bền vững và cạnh tranh.",
    bullets: [
      "Tư vấn quy hoạch và phát triển trang trại tập trung.",
      "Thiết kế mô hình tối ưu theo khí hậu và thổ nhưỡng vùng.",
      "Tối ưu hóa quy trình vận hành và quản lý sản xuất.",
    ],
    highlight: {
      label: "Định hướng đầu ra",
      value: "Tiêu chuẩn VietGAP, GLOBALGAP và xuất khẩu.",
    },
    cta: "Liên hệ tư vấn",
    image: "/images/UNIFARM/bgr.jpg",
    imageSide: "left",
  },
  {
    id: "cung-ung-dau-vao",
    number: "02",
    title: "Cung ứng đầu vào nông nghiệp",
    description:
      "Hệ sinh thái đầu vào chất lượng cao, phù hợp điều kiện canh tác Việt Nam, giúp nâng cao năng suất và tối ưu chi phí.",
    bullets: [
      "Giống cây trồng: chất lượng cao, năng suất vượt trội, kháng bệnh.",
      "Giải pháp tưới & thiết bị: hệ thống tiên tiến, tiết kiệm nước và nhân công.",
      "Vật tư & dinh dưỡng: phân bón, chế phẩm sinh học an toàn, thân thiện môi trường.",
    ],
    highlight: {
      label: "Cam kết",
      value: "Nguồn gốc rõ ràng, chất lượng đảm bảo, giao hàng nhanh chóng.",
    },
    cta: "Liên hệ cung ứng",
    image:
      "/images/banana/banana-shrub-3289749.jpg",
    imageSide: "right",
  },
  {
    id: "chuyen-giao-cong-nghe",
    number: "03",
    title: "Chuyển giao công nghệ trồng trọt",
    description:
      "Tiếp nhận, nghiên cứu và nội địa hóa các công nghệ tiên tiến để tạo ra giải pháp toàn diện, dễ ứng dụng và hiệu quả.",
    bullets: ["Nguồn công nghệ: các quốc gia phát triển (Israel, Nhật Bản, Đài Loan...)."],
    steps: [
      { number: "01", label: "Tiếp nhận và nghiên cứu." },
      { number: "02", label: "Thử nghiệm và tối ưu hóa (nội địa hóa)." },
      { number: "03", label: "Chuyển giao quy trình và đồng hành cùng nông dân." },
    ],
    highlight: {
      label: "Công nghệ cốt lõi",
      value: "Hệ thống tưới & quản lý tự động, kiểm soát sâu bệnh sinh học.",
    },
    cta: "Liên hệ chuyển giao",
    image: "/images/UNIFARM/1787218973789_1582751505492234802_4935324150679931320_ae20e008b6b700cead007d04eae29597.jpg",
    imageSide: "left",
  },
  {
    id: "du-lich-trai-nghiem",
    number: "04",
    title: "Du lịch trải nghiệm nông nghiệp",
    description:
      "Kết nối cộng đồng với nông nghiệp hiện đại thông qua các hoạt động tham quan, trải nghiệm và học hỏi thực tế tại trang trại CNC Unifarm.",
    bullets: [
      "Tham quan mô hình trang trại công nghệ cao thực tế.",
      "Trải nghiệm quy trình sản xuất và thu hoạch trực tiếp.",
      "Hoạt động giáo dục nâng cao nhận thức về nông nghiệp sạch.",
    ],
    highlight: {
      label: "Đối tượng",
      value: "Phù hợp học sinh, sinh viên, doanh nghiệp và gia đình.",
    },
    cta: "Đăng ký tham quan",
    image: "/images/banana/bananas-musa-571542.jpg",
    imageSide: "right",
  },
];

export default function HanhTrinhNongSanXanh() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  // Spring nhẹ (settle nhanh) — chỉ đủ làm mượt góc cạnh, không kéo dài
  // animation nền sau khi người dùng đã dừng cuộn, đỡ tốn khung hình hơn.
  const lineProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 32, mass: 0.15 });

  return (
    <section
      id="hanh-trinh"
      className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-28"
    >
      <HeaderBlock />

      <div
        ref={containerRef}
        className="relative mx-auto mt-6 max-w-[1400px] px-5 sm:mt-10 sm:px-8 lg:px-10"
      >
        {/* đường chỉ dọc ở giữa — track tĩnh + phần "chạy theo cuộn" phủ lên trên */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block"
          style={{ background: "rgba(6,59,36,0.12)" }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px origin-top -translate-x-1/2 lg:block"
          style={{
            scaleY: lineProgress,
            background: `linear-gradient(to bottom, ${C.green}, ${C.soft})`,
            boxShadow: `0 0 14px ${C.green}77`,
          }}
          aria-hidden
        />

        {SERVICES.map((service, i) => (
          <ServiceBlock
            key={service.id}
            service={service}
            index={i}
            total={SERVICES.length}
            progress={lineProgress}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Header — eyebrow + tiêu đề lớn + line-draw                          */
/* ------------------------------------------------------------------ */

function HeaderBlock() {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8, ease: EASE }}
        className="text-xs font-bold uppercase tracking-[0.32em]"
        style={{ color: C.green }}
      >
        Hành trình đồng hành cùng nông dân
      </motion.p>

      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="font-display mt-4 max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-6xl"
        style={{ color: C.forest }}
      >
        Tư vấn <span style={{ color: C.soft }}>→</span> Cung ứng{" "}
        <span style={{ color: C.soft }}>→</span> Chuyển giao{" "}
        <span style={{ color: C.soft }}>→</span> Trải nghiệm
      </motion.h2>

      <motion.div
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1, delay: 0.35, ease: EASE }}
        className="mt-7 h-px w-full max-w-[220px] origin-left"
        style={{ background: C.green }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Một khối dịch vụ — ảnh + nội dung so le trái/phải quanh đường chỉ    */
/* ------------------------------------------------------------------ */

function ServiceBlock({
  service,
  index,
  total,
  progress,
}: {
  service: Service;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const isImageLeft = service.imageSide === "left";
  const center = (index + 0.5) / total;
  const dotOpacity = useTransform(progress, [center - 0.08, center + 0.02], [0.3, 1]);
  const dotScale = useTransform(progress, [center - 0.08, center + 0.02], [1, 1.7]);

  return (
    <div
      className={`relative flex flex-col gap-8 py-14 sm:py-16 lg:items-center lg:gap-16 lg:py-20 ${
        isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* chấm trên đường chỉ, sáng dần theo tiến độ cuộn thực tế */}
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
        style={{
          background: C.green,
          boxShadow: `0 0 0 6px ${C.green}22`,
          opacity: dotOpacity,
          scale: dotScale,
        }}
        aria-hidden
      />

      <div className="lg:w-1/2">
        <ImageReveal src={service.image} alt={service.title} />
      </div>

      <div className="lg:w-1/2">
        <ContentBlock service={service} slideFromRight={!isImageLeft} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ảnh — hiệu ứng "focus pull" giống AgriTechHero, chạy lại mỗi lần vào */
/* lại viewport (viewport once:false) + Ken Burns rất nhẹ liên tục      */
/* ------------------------------------------------------------------ */

const focusReveal: Variants = {
  hidden: { opacity: 0, scale: 1.15, filter: "blur(22px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE } },
};

function ImageReveal({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={focusReveal}
      className="relative h-64 w-full overflow-hidden sm:h-96 lg:h-[420px]"
      style={{ boxShadow: "0 30px 60px -20px rgba(6,59,36,0.35)" }}
    >
      <div className="journey-zoom relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" }}
      />
      <style>{`
        @keyframes journeyZoom { 0%, 100% { transform: scale(1.04); } 50% { transform: scale(1.14); } }
        .journey-zoom { animation: journeyZoom 11s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .journey-zoom { animation: none; } }
      `}</style>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Nội dung — số / tiêu đề / mô tả / bullet / (quy trình) / highlight   */
/* trồi vào so le, hướng trượt tùy theo cột đang nằm bên nào            */
/* ------------------------------------------------------------------ */

function ContentBlock({ service, slideFromRight }: { service: Service; slideFromRight: boolean }) {
  const variants: Variants = {
    hidden: { opacity: 0, x: slideFromRight ? 60 : -60 },
    show: (delay: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay, ease: EASE },
    }),
  };

  return (
    <div>
      <motion.span
        custom={0}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={variants}
        className="font-display block text-5xl font-black leading-none sm:text-6xl"
        style={{ color: C.soft }}
      >
        {service.number}
      </motion.span>

      <motion.h3
        custom={0.1}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={variants}
        className="font-display mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:text-[2rem]"
        style={{ color: C.forest }}
      >
        {service.title}
      </motion.h3>

      <motion.p
        custom={0.2}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={variants}
        className="mt-4 text-base font-semibold leading-relaxed"
        style={{ color: C.fresh }}
      >
        {service.description}
      </motion.p>

      <motion.ul
        custom={0.3}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={variants}
        className="mt-5 space-y-2.5"
      >
        {service.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-neutral-600">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: C.blue }} />
            {b}
          </li>
        ))}
      </motion.ul>

      {service.steps && (
        <motion.div
          custom={0.4}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={variants}
          className="mt-6 space-y-3 border-l pl-4"
          style={{ borderColor: "rgba(6,59,36,0.12)" }}
        >
          {service.steps.map((s) => (
            <div key={s.number} className="flex items-baseline gap-3">
              <span className="font-display text-lg font-black" style={{ color: C.green }}>
                {s.number}
              </span>
              <span className="text-sm font-medium text-neutral-600">{s.label}</span>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div
        custom={0.5}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={variants}
        className="mt-6 border-t pt-4 text-sm"
        style={{ borderColor: "rgba(6,59,36,0.12)" }}
      >
        <span className="font-bold uppercase tracking-wide" style={{ color: C.ink }}>
          {service.highlight.label}:
        </span>{" "}
        <span className="text-neutral-600">{service.highlight.value}</span>
      </motion.div>

      <motion.button
        custom={0.6}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={variants}
        type="button"
        className="group mt-7 inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5"
        style={{ background: C.green }}
      >
        {service.cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>
    </div>
  );
}
