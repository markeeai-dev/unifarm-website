"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ApplyFinalCTA() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#006400] py-20 text-center md:py-24">
      {/* Background image */}
      <Image
        src="/images/banana-leaf-drops.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority={false}
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay to keep text readable + preserve brand tone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#006400]/85"
      />

      {/* Gold radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,250,205,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-5">
        <Reveal duration={1}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFFACD]">
            {t("Sẵn sàng chưa?")}
          </p>
          <h2 className="uppercase mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
            {t("Bắt đầu hành trình của bạn tại Unifarm")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65">
            {t("Chọn một vị trí phù hợp và gửi hồ sơ cho chúng tôi.")}
          </p>
          <a
            href="mailto:tuyendung@unifarm.com?subject=%E1%BB%A8ng%20tuy%E1%BB%83n%20t%E1%BA%A1i%20Unifarm"
            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#FFFACD] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#06301B] transition-transform hover:scale-105"
          >
            {t("Ứng tuyển ngay")}
            <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
