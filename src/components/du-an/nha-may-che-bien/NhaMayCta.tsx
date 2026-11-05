"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.3 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  cream: "#FFFACD",
  blue: "#87CEFA",
};

const POINTS = [
  "Phản hồi đề xuất hợp tác trong 24h làm việc",
  "Tư vấn kỹ thuật và quy cách sản phẩm miễn phí",
  "Đồng hành dài hạn cùng đối tác cung ứng & tiêu thụ",
];

export default function NhaMayCta() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24">
      <Image
        src="/images/nha-may-che-bien/day-chuyen-chuoi-1.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(110deg, rgba(6,20,13,0.96) 15%, rgba(6,59,36,0.92) 55%, rgba(6,59,36,0.8) 100%)" }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "rgba(135,206,250,0.16)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1300px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.cream }}>
            {t("- HỢP TÁC CÙNG UNIFARM -")}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-4xl">
            {t("Sẵn sàng cho đơn hàng và hợp tác dài hạn")}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            {t("Liên hệ với Unifarm để trao đổi về hợp tác cung ứng nguyên liệu, gia công chế biến hoặc tiêu thụ sản phẩm cấp đông IQF.")}
          </p>

          <ul className="mt-6 space-y-2.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0" style={{ color: C.blue }} strokeWidth={2.2} />
                <span className="text-sm leading-relaxed text-white/85">{t(point)}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/du-an-hop-tac#hop-tac"
            className="group relative isolate mt-8 inline-flex items-center gap-2 overflow-hidden bg-[#FFFACD] px-7 py-3.5 text-sm font-bold text-[#06301B] shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
          >
            <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <span className="relative z-10">{t("Gửi đề xuất hợp tác")}</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 ease-in-out group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
          className="rounded-3xl border p-6 backdrop-blur-sm sm:p-7"
          style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            {t("Liên hệ trực tiếp")}
          </p>

          <a
            href="tel:02743889887"
            className="group mt-5 flex items-center gap-3.5 border-b pb-4 transition-opacity hover:opacity-80"
            style={{ borderColor: "rgba(255,255,255,0.12)" }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Phone className="h-5 w-5" style={{ color: C.cream }} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">{t("Hotline")}</p>
              <p className="text-base font-bold text-white">(0274) 3889887</p>
            </div>
          </a>

          <a
            href="mailto:info@unifarm.com.vn"
            className="group mt-4 flex items-center gap-3.5 transition-opacity hover:opacity-80"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Mail className="h-5 w-5" style={{ color: C.cream }} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55">{t("Email")}</p>
              <p className="truncate text-base font-bold text-white">info@unifarm.com.vn</p>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
