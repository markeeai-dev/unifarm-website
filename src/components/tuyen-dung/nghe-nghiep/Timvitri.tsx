"use client";

import { Database, GraduationCap, Settings2, Sprout, TestTube2, Truck } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const GROUPS = [
  { icon: Sprout, label: "Lao động nông nghiệp" },
  { icon: Settings2, label: "Kỹ thuật viên vận hành" },
  { icon: TestTube2, label: "Kỹ sư nông nghiệp" },
  { icon: Database, label: "Chuyên gia dữ liệu & IT" },
  { icon: Truck, label: "Nhân sự Logistics & Kinh doanh" },
  { icon: GraduationCap, label: "Sinh viên thực tập thực chiến" },
];

const CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function TimViTri() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#006400]/[0.06] blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFFACD]/50 blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#006400]/20 bg-white/70 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#006400] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006400]" />
            {t("Cơ hội cho mọi ngành nghề")}
          </span>
          <h2 className="uppercase mt-5 text-2xl font-extrabold tracking-tight text-[#06301B] sm:text-3xl md:text-4xl">
            {t("Không Nhất Thiết Phải Học Nông Nghiệp Để Làm Nông Nghiệp")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#06301B]/65 sm:text-[15px]">
            {t(
              "Nông nghiệp hiện đại cần kỹ sư, kỹ thuật viên, người làm công nghệ, dữ liệu, chất lượng, kinh doanh, chuỗi cung ứng và nhiều ngành nghề khác."
            )}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={CONTAINER_VARIANTS}
            className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1"
          >
            {GROUPS.map((g, i) => (
              <motion.div
                key={g.label}
                variants={ITEM_VARIANTS}
                className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-white px-5 py-4 text-left shadow-[0_2px_10px_rgba(15,40,20,0.06)] ring-1 ring-[#06301B]/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,40,20,0.14)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#006400]/10 text-[#006400] transition-all duration-400 group-hover:bg-[#006400] group-hover:text-white group-hover:scale-105">
                  <g.icon size={19} strokeWidth={1.8} />
                </span>
                <span className="flex-1 text-[13.5px] font-semibold leading-snug text-[#06301B]">
                  {t(g.label)}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 select-none text-xs font-black text-[#06301B]/15"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <Reveal className="order-1 lg:order-2" duration={1} delay={0.1}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_35px_80px_-30px_rgba(15,40,20,0.5)]">
              <Image
                src="/images/UNIFARM/ptn.jpg"
                alt={t("Nhà màng ứng dụng công nghệ cao tại Unifarm")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06301B]/55 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
