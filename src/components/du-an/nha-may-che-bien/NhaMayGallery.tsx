"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
};

const GALLERY = [
  {
    src: "/images/nha-may-che-bien/day-chuyen-chuoi-1.jpg",
    caption: "Chuối sau sơ chế được đưa qua băng chuyền cấp đông IQF.",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/images/nha-may-che-bien/day-chuyen-chuoi-2.jpg",
    caption: "Tách vỏ và cắt gọt thủ công theo quy cách thành phẩm.",
    span: "",
  },
  {
    src: "/images/nha-may-che-bien/day-chuyen-dua-hau-2.jpg",
    caption: "Dưa hấu nguyên trái được phân loại trước khi sơ chế.",
    span: "",
  },
  {
    src: "/images/nha-may-che-bien/day-chuyen-dua-hau-1.jpg",
    caption: "Dưa hấu được cắt miếng, đóng gói theo cùng tiêu chuẩn vệ sinh.",
    span: "sm:col-span-2",
  },
];

export default function NhaMayGallery() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
            {t("- HÌNH ẢNH THỰC TẾ -")}
          </p>
          <h2
            className="mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: C.forest }}
          >
            {t("Bên trong nhà máy chế biến")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: C.fresh }}>
            {t("Đội ngũ vận hành làm việc trực tiếp trên dây chuyền, dưới điều kiện kiểm soát nhiệt độ và vệ sinh nghiêm ngặt.")}
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
          {GALLERY.map((item, i) => (
            <motion.div
              key={item.src}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
              className={`group relative overflow-hidden rounded-2xl shadow-[0_20px_50px_-28px_rgba(6,59,36,0.4)] ${item.span}`}
            >
              <div className="relative aspect-[4/3] w-full sm:h-full">
                <Image
                  src={item.src}
                  alt={t(item.caption)}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium leading-snug text-white sm:p-5">
                  {t(item.caption)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
