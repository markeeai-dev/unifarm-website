"use client";

/**
 * CoreValues — "4 Giá trị cốt lõi".
 * Full-width split layout: trái là ảnh full-bleed đúng 50% chiều rộng
 * viewport (không container/margin), phải là lưới 2x2 thẻ giá trị dính
 * sát nhau (không gap, không bo góc) — hàng trên nền vàng-trắng, hàng
 * dưới nền trắng-vàng. Hover/tap vào 1 ô bên phải => ảnh + tiêu đề bên
 * trái đổi theo, crossfade mượt. Stagger reveal khi cuộn tới.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Compass, Sparkles, Handshake, HeartHandshake, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CORE_VALUES = [
  {
    key: "tien-phong",
    title: "Tiên phong",
    desc: "Luôn đặt chuẩn cao nhất cho tất cả thị trường về an toàn, trung thực, khả năng truy xuất và trách nhiệm.",
    color: "#2E86C1",
    icon: Compass,
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/1787241249309_1582751505492234802_4935324150679931320_5796821ad794969b4257804d1d917521.jpg",
  },
  {
    key: "sang-tao",
    title: "Sáng tạo",
    desc: "Lấy nhu cầu thị trường để quay lại thiết kế giống, sản phẩm và quy trình sản xuất.",
    color: "#2E8B57",
    icon: Sparkles,
    image: "/images/UNIFARM/chuoi.jpg",
  },
  {
    key: "hop-tac",
    title: "Hợp tác",
    desc: "Hệ sinh thái chỉ bền vững khi khách hàng, doanh nghiệp, người lao động và người sản xuất đều tạo ra giá trị kinh tế.",
    color: "#178A80",
    icon: Handshake,
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/1787655032314_1582751505492234802_4935324150679931320_4304a0fc22944be026df21ac68e180ec.jpg",
  },
  {
    key: "nhan-van",
    title: "Nhân văn",
    desc: "Không ngừng quan sát, thử nghiệm có đối chứng, đo lường và cải tiến liên tục vì con người.",
    color: "#C9642F",
    icon: HeartHandshake,
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/nhan-van.jpg",
  },
] as const;

/* Thẻ 1 & 4 (index 0, 3): nền trắng nen_trang | Thẻ 2 & 3 (index 1, 2): nền vàng nen_vang */
function getCardVariant(index: number): "trang" | "vang" {
  return index === 0 || index === 3 ? "trang" : "vang";
}

function ValueCard({
  val,
  index,
  active,
  onActivate,
}: {
  val: (typeof CORE_VALUES)[number];
  index: number;
  active: boolean;
  onActivate: (i: number) => void;
}) {
  const Icon: LucideIcon = val.icon;
  const variant = getCardVariant(index);

  return (
    <motion.button
      type="button"
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onClick={() => onActivate(index)}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      className={[
        "group relative flex min-h-[190px] flex-col justify-start overflow-hidden p-6 text-left transition-all duration-500 sm:min-h-[220px] sm:p-8 lg:min-h-0",
        variant === "vang"
          ? "bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat"
          : "bg-white bg-[url('/images/nen_trang.png')] bg-repeat",
      ].join(" ")}
    >
      {/* lớp phủ để đảm bảo độ tương phản chữ, đổi nhẹ theo trạng thái active */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          variant === "vang" ? "bg-white/55" : "bg-gradient-to-br from-[#fff8e1]/0 via-transparent to-[#fff8e1]/60"
        } ${active ? "opacity-30" : "opacity-80"}`}
      />

      {/* viền active thay cho border-radius trước đây */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 2px ${val.color}`,
          opacity: active ? 1 : 0,
        }}
      />

      {/* số thứ tự watermark góc */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-4 -right-2 select-none text-[5.5rem] font-black leading-none text-[#06301B]/[0.05] sm:text-[6.5rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative z-10 flex items-center justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center text-white shadow-[0_10px_22px_-8px_rgba(6,40,20,0.35)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-6"
          style={{ background: val.color }}
        >
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <span
          className="h-2.5 w-2.5 transition-all duration-500"
          style={{
            background: active ? val.color : "transparent",
            boxShadow: active ? `0 0 0 3px ${val.color}33` : "0 0 0 1px rgba(6,48,27,0.15)",
          }}
        />
      </div>

      <div className="relative z-10 mt-4">
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: val.color }}
        >
          Giá trị {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-1.5 text-lg font-extrabold uppercase leading-tight tracking-tight text-[#06301B] sm:text-xl lg:text-2xl">
          {val.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-600 sm:text-[18px]">
          {val.desc}
        </p>
      </div>

      {/* gạch chân tiến trình, giãn ra khi active — luôn neo đáy thẻ */}
      <span
        aria-hidden
        className="relative z-10 mt-auto block h-[3px] pt-4 transition-all duration-500"
        style={{
          width: active ? "3.5rem" : "1.5rem",
          background: val.color,
          opacity: active ? 1 : 0.4,
        }}
      />
    </motion.button>
  );
}

export default function CoreValues() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeVal = CORE_VALUES[active];

  return (
    <section className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat pt-0 pb-20 font-body sm:pb-0">
      {/* đốm sáng trang trí phía sau */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#87cefa]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ffb08a]/10 blur-3xl" />
      </div>

      {/* Header — giữ trong container căn giữa cho dễ đọc */}
      {/* <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto max-w-2xl px-5 text-center sm:px-8"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#006400]/40 sm:w-14" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-[#006400]">
            Nền tảng cho mọi quyết định
          </span>
          <span className="h-px w-8 bg-[#006400]/40 sm:w-14" />
        </div>
        <h2 className="uppercase mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#06301B] sm:text-4xl md:text-5xl">
          4 Giá Trị Cốt Lõi
        </h2>

        <svg
          width="150"
          height="14"
          viewBox="0 0 150 14"
          fill="none"
          className="mx-auto mt-4"
          aria-hidden="true"
        >
          <motion.path
            d="M3 10C34 3 62 3 75 7.5C88 12 116 12 147 5"
            stroke="#006400"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
          />
        </svg>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
          Bốn mảnh ghép gắn liền với nhau — kim chỉ nam cho mọi quyết định của Unifarm.
        </p>
      </motion.div> */}

      {/* Split full-width: trái ảnh đúng 50% / phải grid 2x2 dính sát, không bo góc */}
      <div ref={ref} className="relative flex w-full flex-col lg:min-h-[70vh] lg:flex-row lg:items-stretch">
        {/* ẢNH BÊN TRÁI — full-bleed 50% */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative w-full overflow-hidden lg:w-1/2"
        >
          <div className="relative aspect-[4/3] w-full lg:sticky lg:top-0 lg:aspect-auto lg:h-[70vh]">
            {CORE_VALUES.map((val, i) => (
              <motion.div
                key={val.key}
                className="absolute inset-0"
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Image
                  src={val.image}
                  alt={val.title}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </motion.div>
            ))}

            {/* gradient đáy để chữ dễ đọc */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Icon nổi góc */}
            <span
              className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center text-white shadow-[0_12px_28px_-8px_rgba(6,40,20,0.4)] transition-colors duration-500 sm:left-8 sm:top-8"
              style={{ background: activeVal.color }}
            >
              {(() => {
                const Icon = activeVal.icon;
                return <Icon size={22} strokeWidth={1.8} />;
              })()}
            </span>

            {/* Tiêu đề chính đè lên ảnh, crossfade theo thẻ đang chọn — bỏ đoạn mô tả nhỏ phía dưới */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVal.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span
                    className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: activeVal.color }}
                  >
                    Giá trị {String(active + 1).padStart(2, "0")} / 04
                  </span>
                  <h3 className="mt-2 text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {activeVal.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* LƯỚI GIÁ TRỊ BÊN PHẢI — dính sát nhau, không gap, không bo góc */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
          className="grid w-full grid-cols-1 sm:grid-cols-2 lg:h-[70vh] lg:w-1/2 lg:grid-rows-2"
        >
          {CORE_VALUES.map((val, i) => (
            <ValueCard
              key={val.key}
              val={val}
              index={i}
              active={active === i}
              onActivate={setActive}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}