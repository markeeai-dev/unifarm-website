"use client";

import Image from "next/image";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function NgheNghiepCTA() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#006400] py-24 text-center md:py-28">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/UNIFARM/bgr.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06301B]/80 via-[#06301B]/75 to-[#06301B]/92"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,250,205,0.2) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-5">
        <Reveal duration={1}>
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#FFFACD]/30 bg-white/10 text-[#FFFACD] backdrop-blur-sm">
            <Leaf size={20} strokeWidth={1.8} />
          </span>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFFACD]">
            {t("Bắt đầu hành trình")}
          </p>
          <h2 className="uppercase mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
            {t("Cùng xây dựng một nền nông nghiệp hiện đại, bền vững và có trách nhiệm.")}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
