"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Truck,
  ScissorsLineDashed,
  Snowflake,
  PackageCheck,
  Warehouse,
  Ship,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  ink: "#12210F",
};

type Step = {
  icon: LucideIcon;
  title: string;
  desc: string;
  focus: string;
  image: string;
};

const STEPS: Step[] = [
  {
    icon: Truck,
    title: "Tiếp nhận nguyên liệu",
    desc: "Chuối và dưa hấu được vận chuyển nhanh từ vùng trồng tập trung về nhà máy, kiểm tra độ chín và chất lượng đầu vào.",
    focus: "Kiểm tra đầu vào",
    image: "/images/nha-may-che-bien/nha-may-hero.jpg",
  },
  {
    icon: ScissorsLineDashed,
    title: "Sơ chế & định hình",
    desc: "Phân loại, tách vỏ, cắt gọt theo quy cách thành phẩm dưới điều kiện vệ sinh được kiểm soát chặt chẽ.",
    focus: "Kiểm soát vệ sinh",
    image: "/images/nha-may-che-bien/nha-may-gioi-thieu.jpg",
  },
  {
    icon: Snowflake,
    title: "Cấp đông nhanh IQF",
    desc: "Băng chuyền cấp đông rời (IQF) giữ nguyên màu sắc, kết cấu và hương vị tự nhiên của từng miếng nông sản.",
    focus: "Kiểm soát nhiệt độ",
    image: "/images/nha-may-che-bien/day-chuyen-chuoi-1.jpg",
  },
  {
    icon: PackageCheck,
    title: "Đóng gói thành phẩm",
    desc: "Đóng gói theo quy cách và nhãn mác phù hợp với yêu cầu của từng thị trường, từng đối tác.",
    focus: "Kiểm tra quy cách",
    image: "/images/nha-may-che-bien/day-chuyen-chuoi-2.jpg",
  },
  {
    icon: Warehouse,
    title: "Lưu kho lạnh",
    desc: "Thành phẩm được bảo quản trong kho lạnh đạt chuẩn, duy trì nhiệt độ ổn định đến khi xuất hàng.",
    focus: "Giám sát kho lạnh",
    image: "/images/nha-may-che-bien/day-chuyen-dua-hau-1.jpg",
  },
  {
    icon: Ship,
    title: "Xuất hàng",
    desc: "Đóng container lạnh và vận chuyển đến khách hàng trong nước cũng như các thị trường xuất khẩu.",
    focus: "Kiểm tra trước xuất",
    image: "/images/nha-may-che-bien/day-chuyen-dua-hau-2.jpg",
  },
];

export default function NhaMayQuyTrinh() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section
      id="quy-trinh-san-xuat"
      className="relative w-full overflow-hidden bg-white bg-[url('/images/nen_trang.png')] bg-repeat py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
            {t("- QUY TRÌNH SẢN XUẤT -")}
          </p>
          <h2
            className="mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: C.forest }}
          >
            {t("6 bước khép kín, từ nguyên liệu đến xuất hàng")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: C.fresh }}>
            {t("Mỗi lô nông sản đều đi qua đầy đủ các bước kiểm soát trước khi trở thành thành phẩm cấp đông sẵn sàng xuất khẩu.")}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.65, delay: (i % 3) * 0.1, ease: EASE }}
              className="group overflow-hidden rounded-2xl border bg-white shadow-[0_18px_40px_-28px_rgba(6,59,36,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(6,59,36,0.45)]"
              style={{ borderColor: `${C.green}14` }}
            >
              <div className="relative h-36 w-full overflow-hidden sm:h-40">
                <Image
                  src={step.image}
                  alt={t(step.title)}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <span
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-md"
                  style={{ background: C.green }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                  <step.icon className="h-4 w-4" style={{ color: C.forest }} strokeWidth={2.2} />
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-extrabold leading-snug sm:text-lg" style={{ color: C.ink }}>
                  {t(step.title)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{t(step.desc)}</p>
                <p
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ background: `${C.green}0D`, color: C.green }}
                >
                  <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                  {t(step.focus)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
