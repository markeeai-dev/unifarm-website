"use client";

/**
 * AboutBanner
 * ------------------------------------------------------------------
 * Banner cho trang giới thiệu: Tiêu đề "GROWING A BETTER AGRICULTURE" +
 * Tầm nhìn – Sứ mệnh. Phần "4 Giá trị cốt lõi" đã tách riêng sang
 * `Corevalues.tsx` để dễ quản lý/tái sử dụng độc lập.
 *
 * Cài đặt phụ thuộc (nếu chưa có):
 *   npm install framer-motion
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/* ------------------------------------------------------------------ */
/* Animation helpers                                                   */
/* ------------------------------------------------------------------ */

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Component chính                                                     */
/* ------------------------------------------------------------------ */

export interface AboutBannerProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function AboutBanner({
  eyebrow = "MỤC ĐÍCH & NGUYÊN TẮC",
  title = "GROWING A BETTER AGRICULTURE",
  subtitle = "Một nền nông nghiệp tạo ra sản phẩm tốt hơn, sử dụng tài nguyên hiệu quả hơn và mang lại cuộc sống tốt hơn cho những người tham gia.",
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

      {/* <div className="relative mx-auto max-w-[1500px] px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
        <Header eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </div> */}

      {/* Dải Tầm nhìn / Sứ mệnh — full-bleed, 2 ảnh 50/50 */}
      <VisionMission />
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
        className="uppercase mt-5 font-extrabold text-[2.1rem] font-extrabold leading-[1.12] tracking-tight sm:text-4xl"
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
/* Tầm nhìn / Sứ mệnh — 2 ảnh full-bleed 50/50, tiêu đề phủ lên ảnh,   */
/* ảnh tròn ở giữa chèn đè lên trên, nằm giữa hai ảnh                  */
/* ------------------------------------------------------------------ */

function VisionMission() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();
  const backOut = [0.34, 1.56, 0.64, 1] as const;

  const sideTiming = (dir: "left" | "right") => ({
    duration: reduce ? 0 : 1.5,
    delay: reduce ? 0 : dir === "left" ? 0.1 : 0.3,
    ease: easeOut,
  });

  const badgeTiming = (i: number) => ({
    duration: reduce ? 0 : 0.9,
    delay: reduce ? 0 : 0.9 + i * 0.15,
    ease: easeOut,
  });

  return (
    <div ref={ref} className="relative w-full">
      {/* Ảnh full-bleed 50/50 */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2">
        {/* Ảnh trái — Tầm nhìn */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={sideTiming("left")}
          className="group relative h-[62vw] max-h-[520px] min-h-[320px] w-full overflow-hidden sm:h-[42vw] sm:max-h-[560px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/images/UNIFARM/UNIFARM/hinh-chinh/IMG_4854.JPG"
            alt={t("Tầm nhìn Unifarm")}
            className="h-full w-full object-cover"
            initial={{ scale: 1.05 }}
            animate={
              inView
                ? { scale: [1.05, 1.14, 1.05] }
                : { scale: 1.05 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 7,
                    delay: 1.6,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
            }
          />
          {/* lớp phủ tối để chữ nổi bật */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06301B]/85 via-[#06301B]/25 to-[#06301B]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />

          {/* Nội dung chữ phủ lên ảnh */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9 lg:p-12">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={badgeTiming(0)}
              className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[#F4FFE8] backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF6B]" />
              {t("Đến 2030")}
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={badgeTiming(1)}
              className="uppercase text-3xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl"
            >
              {t("Tầm nhìn")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={badgeTiming(2)}
              className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 sm:text-[22px]"
            >
              {t("Hệ sinh thái nông nghiệp công nghệ cao dẫn đầu Việt Nam, vươn tầm thế giới.")}
            </motion.p>
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ ...badgeTiming(3), ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
              className="mt-5 block h-[2px] w-14 bg-[#B7FF6B]"
            />
          </div>
        </motion.div>

        {/* Ảnh phải — Sứ mệnh */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={sideTiming("right")}
          className="group relative h-[62vw] max-h-[520px] min-h-[320px] w-full overflow-hidden sm:h-[42vw] sm:max-h-[560px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/images/UNIFARM/1787218973806_1582751505492234802_4935324150679931320_d6fbae39f7d85301ab39d1b72b8fdb82.jpg"
            alt={t("Sứ mệnh Unifarm")}
            className="h-full w-full object-cover"
            initial={{ scale: 1.05 }}
            animate={
              inView
                ? { scale: [1.05, 1.14, 1.05] }
                : { scale: 1.05 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 7,
                    delay: 1.9,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06301B]/85 via-[#06301B]/25 to-[#06301B]/10" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:items-end sm:p-9 lg:p-12">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={badgeTiming(0)}
              className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[#F4FFE8] backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7FF6B]" />
              {t("Cam kết")}
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={badgeTiming(1)}
              className="uppercase text-3xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] sm:text-right sm:text-4xl lg:text-5xl"
            >
              {t("Sứ mệnh")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={badgeTiming(2)}
              className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 sm:text-right sm:text-[22px]"
            >
              {t("Cung cấp giải pháp nông nghiệp bền vững, vì sức khỏe con người và một hành tinh xanh.")}
            </motion.p>
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ ...badgeTiming(3), ease: "easeOut" }}
              style={{ transformOrigin: "right" }}
              className="mt-5 block h-[2px] w-14 bg-[#B7FF6B] sm:ml-auto"
            />
          </div>
        </motion.div>
      </div>

      {/* Ảnh tròn ở giữa, chèn đè lên đường nối giữa 2 ảnh */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
        animate={
          inView
            ? { opacity: 1, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 0.4, rotate: -30 }
        }
        transition={{
          duration: reduce ? 0 : 1.3,
          delay: reduce ? 0 : 0.55,
          ease: backOut,
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 sm:h-40 sm:w-40 lg:h-52 lg:w-52"
      >
        <motion.div
          className="pointer-events-auto relative h-full w-full cursor-pointer overflow-hidden rounded-full shadow-[0_25px_60px_-12px_rgba(0,60,20,0.55)] ring-[6px] ring-white sm:ring-[8px]"
          whileHover={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 1.1, ease: easeOut }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRztd8dEt6y61-RxCHWiqdEOISvYACyKY2F8Mvu8JYAw&s=10"
            alt={t("Hạt giống Unifarm")}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 rounded-full shadow-[inset_0_0_0_2px_rgba(0,100,0,0.25)]" />
        </motion.div>
        {/* vòng nhẫn khẽ động đậy quanh ảnh tròn, gợi mạch kết nối 2 vế */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            inView
              ? { opacity: [0, 0.5, 0], scale: [0.9, 1.35, 1.6] }
              : { opacity: 0, scale: 0.9 }
          }
          transition={{
            duration: reduce ? 0 : 2.2,
            delay: reduce ? 0 : 1.3,
            ease: "easeOut",
          }}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: "#B7FF6B" }}
        />
      </motion.div>
    </div>
  );
}