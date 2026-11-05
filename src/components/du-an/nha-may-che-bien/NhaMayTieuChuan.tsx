"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Thermometer, ShieldCheck, ScanLine, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.3 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
};

const ITEMS = [
  {
    icon: Thermometer,
    title: "Kiểm soát nhiệt độ xuyên suốt",
    desc: "Nhiệt độ được theo dõi liên tục từ khâu sơ chế, cấp đông đến lưu kho, đảm bảo chuỗi lạnh không bị gián đoạn.",
  },
  {
    icon: ShieldCheck,
    title: "Vệ sinh an toàn thực phẩm",
    desc: "Khu vực sản xuất khép kín, công nhân trang bị bảo hộ đầy đủ, tuân thủ quy trình vệ sinh nghiêm ngặt trước khi vào ca.",
  },
  {
    icon: ScanLine,
    title: "Truy xuất nguồn gốc",
    desc: "Mỗi lô nguyên liệu được ghi nhận từ vùng trồng đến thành phẩm, thuận tiện cho việc kiểm soát chất lượng và truy vết khi cần.",
  },
  {
    icon: GraduationCap,
    title: "Đội ngũ được đào tạo bài bản",
    desc: "Công nhân và quản lý ca được huấn luyện định kỳ về thao tác vận hành, an toàn lao động và vệ sinh công nghiệp.",
  },
];

export default function NhaMayTieuChuan() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-white bg-[url('/images/nen_trang.png')] bg-repeat py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
            {t("- CAM KẾT CHẤT LƯỢNG -")}
          </p>
          <h2
            className="mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: C.forest }}
          >
            {t("Chất lượng được kiểm soát ở từng công đoạn")}
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
              className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(6,59,36,0.35)] sm:p-6"
              style={{ borderColor: `${C.green}18`, background: "rgba(255,255,255,0.6)" }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-[#063B24]"
                style={{ background: "rgba(0,100,0,0.08)" }}
              >
                <item.icon
                  className="h-6 w-6 transition-colors duration-300 group-hover:text-white"
                  style={{ color: C.green }}
                  strokeWidth={2}
                />
              </span>
              <h3 className="mt-4 text-base font-extrabold leading-snug" style={{ color: C.forest }}>
                {t(item.title)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t(item.desc)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
