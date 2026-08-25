"use client";

import { Database, GraduationCap, Settings2, Sprout, TestTube2, Truck } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../Reveal";

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
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#006400]/[0.06] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#0B7A0B]/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
            Cơ hội cho mọi nền tảng
          </p>
          <h2 className="uppercase mt-3 text-2xl font-extrabold text-[#06301B] sm:text-3xl md:text-4xl">
            Tìm Vị Trí Của Bạn Tại Unifarm
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#06301B]/65 sm:text-[15px]">
            Bạn không nhất thiết phải học nông nghiệp để xây dựng sự nghiệp vững chắc
            trong ngành nông nghiệp.
          </p>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={CONTAINER_VARIANTS}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
                {g.label}
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
      </div>
    </section>
  );
}
