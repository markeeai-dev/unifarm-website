"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Factory, Snowflake, Users, PackageCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.4 } as const;

const STATS = [
  { icon: Factory, value: "5.000+ m²", label: "Diện tích nhà xưởng & kho lạnh" },
  { icon: Snowflake, value: "IQF", label: "Công nghệ cấp đông nhanh khép kín" },
  { icon: Users, value: "300+", label: "Nhân sự vận hành theo ca" },
  { icon: PackageCheck, value: "2", label: "Dây chuyền chính: Chuối & Dưa hấu" },
];

export default function NhaMayThongSo() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat pb-0 pt-0">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-20 -mt-16 grid grid-cols-2 gap-3 rounded-3xl border border-white/60 bg-white/95 p-5 shadow-[0_30px_70px_-20px_rgba(6,59,36,0.4)] backdrop-blur-sm sm:-mt-20 sm:grid-cols-4 sm:gap-4 sm:p-7"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
              className="flex flex-col items-center gap-2 px-1 text-center sm:items-start sm:text-left"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(0,100,0,0.08)" }}
              >
                <s.icon className="h-5 w-5" style={{ color: "#006400" }} strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-xl font-extrabold leading-none sm:text-2xl" style={{ color: "#063B24" }}>
                  {s.value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium leading-snug text-neutral-500 sm:text-xs">
                  {t(s.label)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
