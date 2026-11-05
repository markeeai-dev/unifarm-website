"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.3 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
};

const POINTS = [
  "Nguyên liệu lấy trực tiếp từ vùng trồng tập trung của Unifarm, rút ngắn thời gian từ thu hoạch đến chế biến.",
  "Dây chuyền cấp đông nhanh IQF giữ trọn màu sắc, kết cấu và hương vị tự nhiên của nông sản.",
  "Kho lạnh và khu vực sơ chế khép kín, kiểm soát nhiệt độ và vệ sinh an toàn thực phẩm trong toàn bộ quy trình.",
];

export default function NhaMayGioiThieu() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
              {t("- GIỚI THIỆU -")}
            </p>
            <h2
              className="mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: C.forest }}
            >
              {t("Gia tăng giá trị ngay tại vùng nguyên liệu")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {t("Nhà máy chế biến Unifarm là mắt xích nối giữa vùng trồng tập trung và thị trường tiêu thụ, giúp nông sản được sơ chế, cấp đông và đóng gói ngay khi đạt độ chín tối ưu — thay vì chỉ bán thô nguyên liệu tươi.")}
            </p>

            <ul className="mt-6 space-y-3.5">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: C.green }}
                    strokeWidth={2.2}
                  />
                  <span className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                    {t(point)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-[0_30px_70px_-25px_rgba(6,59,36,0.35)]">
              <Image
                src="/images/nha-may-che-bien/nha-may-gioi-thieu.jpg"
                alt={t("Bên trong nhà máy chế biến Unifarm")}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 hidden w-40 overflow-hidden rounded-2xl border-4 border-white shadow-[0_20px_45px_-15px_rgba(6,59,36,0.45)] sm:block sm:w-48">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/nha-may-che-bien/nha-may-cong-nho.jpg"
                  alt={t("Cổng Nhà máy chế biến Unifarm")}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
