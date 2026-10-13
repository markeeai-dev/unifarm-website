"use client";

import { ArrowRight, Gauge, Gem, Wallet, Wrench } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const FORMULA_STEPS = ["KỸ NĂNG", "NĂNG SUẤT", "GIÁ TRỊ", "THU NHẬP"];

const STEP_ICONS = [Wrench, Gauge, Gem, Wallet];

export default function KyNangThuNhap() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#06301B] py-16 md:py-20">
      <div className="absolute inset-0">
        <Image
          src="/images/UNIFARM/1787207482427_1582751505492234802_4935324150679931320_939749211a6e5c72f28397e7e138b486.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06301B] via-[#06301B]/95 to-[#06301B]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,250,205,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F5E98A]">
            {t("Kỹ năng tạo ra thu nhập")}
          </p>
        </Reveal>

        <div className="mt-14">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
            {FORMULA_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={step} className="flex flex-col items-center gap-3 sm:flex-row sm:gap-0">
                  <Reveal delay={i * 0.12} duration={0.8}>
                    <div className="group relative flex w-full min-w-[9.5rem] flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-6 text-center backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:border-[#FFFACD]/40 hover:bg-white/[0.09] sm:px-7">
                      <span
                        aria-hidden
                        className="absolute -top-3 right-3 text-[11px] font-black tracking-wide text-[#FFFACD]/30"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFFACD]/12 text-[#FFFACD] shadow-inner transition-transform duration-400 group-hover:scale-110">
                        <Icon size={20} strokeWidth={1.8} />
                      </span>
                      <span className="text-sm font-extrabold tracking-wide text-[#FFFACD] sm:text-base">
                        {t(step)}
                      </span>
                    </div>
                  </Reveal>

                  {i < FORMULA_STEPS.length - 1 && (
                    <motion.div
                      className="mx-1 hidden shrink-0 sm:mx-3 sm:block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                    >
                      <ArrowRight size={22} className="text-[#FFFACD]/70" />
                    </motion.div>
                  )}
                  {i < FORMULA_STEPS.length - 1 && (
                    <ArrowRight
                      size={20}
                      className="mx-auto rotate-90 text-[#FFFACD]/60 sm:hidden"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Reveal delay={0.4} duration={1} className="mt-8">
            <div className="mx-auto h-[3px] max-w-xl overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-[#0B7A0B] via-[#006400] to-[#FFFACD]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              />
            </div>
          </Reveal>

          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-white/60 sm:text-base">
            {t("Kỹ năng tốt hơn giúp mỗi người tạo ra nhiều giá trị hơn và có thu nhập tốt hơn.")}
          </p>
        </div>
      </div>
    </section>
  );
}
