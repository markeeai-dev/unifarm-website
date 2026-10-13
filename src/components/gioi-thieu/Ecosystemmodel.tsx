"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Building2,
  Network,
  Sprout,
  Factory,
  ArrowDown,
  Leaf,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const ECOSYSTEM_UNITS = [
  "Vietplants",
  "Vafarm",
  "Green Agritech",
  "Unifarm Foodtech",
  "Unifarm Ventures",
  "Univita",
];

const PRODUCTION_UNITS = [
  "Dầu Tiếng",
  "Phú Giáo",
  "Đồng Phú",
  "Phước Hòa",
  "Highland",
  "Miền Bắc",
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function EcosystemModel() {
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
  });

  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.65, ease: easeOut },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden py-8 sm:py-10 lg:py-12"
      style={{
        backgroundImage: "url('/images/UNIFARM/bgr.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Lớp phủ tối rất nhẹ, giúp tiêu đề nổi bật nhưng vẫn nhìn rõ ảnh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/[0.12]"
      />

      {/* Ánh sáng nhẹ ở phần đầu section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-black/20 to-transparent"
      />

      <div className="relative mx-auto max-w-[1180px] px-4 sm:px-7 lg:px-8">
        {/* TIÊU ĐỀ */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#315d32] shadow-lg backdrop-blur-md sm:text-xs">
            <Leaf className="h-3.5 w-3.5" />
            {t("Mô hình vận hành")}
          </span>

          <h2 className="mt-4 text-2xl font-black uppercase leading-tight tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] sm:text-3xl lg:text-4xl">
            {t("Hệ sinh thái Unifarm")}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl rounded-xl bg-[#16351d]/70 px-4 py-2.5 text-xs leading-6 text-white shadow-lg backdrop-blur-sm sm:text-sm sm:leading-7">
            {t(
              "Các đơn vị trong hệ sinh thái phát triển những năng lực chuyên biệt và kết nối với nhau để cùng tạo ra sản phẩm, giải pháp và giá trị cho khách hàng, người sản xuất và đối tác."
            )}
          </p>
        </motion.header>

        {/* KHUNG HỆ SINH THÁI */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-6 max-w-5xl sm:mt-8"
        >
          <div className="rounded-[22px] border border-white/80 bg-[#fffdf5]/95 p-3 shadow-[0_24px_70px_-25px_rgba(0,0,0,0.38)] backdrop-blur-md sm:rounded-[28px] sm:p-4 lg:p-5">
            {/* ĐƠN VỊ ĐẦU MỐI */}
            <div className="flex justify-center">
              <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#d8c779] bg-gradient-to-r from-[#fff7c9] to-[#f5edb1] px-4 py-3.5 shadow-[0_8px_20px_-12px_rgba(49,93,50,0.3)] transition-transform duration-300 hover:-translate-y-0.5 sm:px-5 sm:py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#315d32] text-[#fff7c9] sm:h-11 sm:w-11">
                  <Network
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    strokeWidth={1.8}
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b7743] sm:text-[10px]">
                    {t("Đầu mối hệ sinh thái")}
                  </p>

                  <h3 className="mt-0.5 text-base font-extrabold uppercase tracking-wide text-[#24452a] sm:text-lg">
                    {t("Unifarm tổng")}
                  </h3>

                  <p className="mt-0.5 text-[11px] leading-5 text-[#52624b] sm:text-xs">
                    {t(
                      "Kết nối các đơn vị thành viên và đơn vị sản xuất"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* KẾT NỐI XUỐNG */}
            <div className="flex flex-col items-center py-2.5 sm:py-3">
              <div className="h-3 w-px bg-[#a6b58b] sm:h-4" />

              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d6e0c8] bg-[#e8edda] text-[#557640]">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>

              <div className="h-3 w-px bg-[#a6b58b] sm:h-4" />
            </div>

            {/* CÁC ĐƠN VỊ THÀNH VIÊN */}
            <div className="rounded-xl border border-[#dce3d0] bg-[#f4f5e9]/95 p-3 sm:rounded-2xl sm:p-4">
              <div className="mb-3 flex items-center justify-center gap-2 text-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#dfe8d1] text-[#41663a]">
                  <Building2 className="h-4 w-4" />
                </span>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#315335] sm:text-sm">
                    {t("Các đơn vị thành viên")}
                  </h4>

                  <p className="mt-0.5 text-[10px] leading-4 text-[#69745d] sm:text-xs">
                    {t("Năng lực chuyên biệt trong hệ sinh thái")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-6">
                {ECOSYSTEM_UNITS.map((name, i) => (
                  <motion.div
                    key={name}
                    variants={fadeUp}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    transition={{ delay: 0.12 + i * 0.045 }}
                    className="group flex min-h-[56px] items-center gap-2 rounded-lg border border-[#dfe5d3] bg-white/90 px-2.5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#91a875] hover:bg-white hover:shadow-[0_8px_18px_-12px_rgba(49,93,50,0.35)] sm:min-h-[62px] sm:justify-center sm:px-2 sm:text-center"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#edf1df] text-[#557640] transition-colors group-hover:bg-[#dfe8d1]">
                      <Sprout className="h-4 w-4" />
                    </span>

                    <span className="text-[11px] font-bold leading-snug text-[#3e5738] sm:text-xs">
                      {t(name)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* KẾT NỐI XUỐNG */}
            <div className="flex flex-col items-center py-2.5 sm:py-3">
              <div className="h-3 w-px bg-[#a6b58b] sm:h-4" />

              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d6e0c8] bg-[#e8edda] text-[#557640]">
                <ArrowDown className="h-3.5 w-3.5" />
              </span>

              <div className="h-3 w-px bg-[#a6b58b] sm:h-4" />
            </div>

            {/* CÁC ĐƠN VỊ SẢN XUẤT */}
            <div className="rounded-xl border border-[#d9dfc8] bg-[#edf2e4]/95 p-3 sm:rounded-2xl sm:p-4">
              <div className="mb-3 flex items-center justify-center gap-2 text-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d7e5ce] text-[#41663a]">
                  <Factory className="h-4 w-4" />
                </span>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#315335] sm:text-sm">
                    {t("Các đơn vị sản xuất Unifarm")}
                  </h4>

                  <p className="mt-0.5 text-[10px] text-[#69745d] sm:text-xs">
                    {t("Mạng lưới cơ sở sản xuất")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-6">
                {PRODUCTION_UNITS.map((name, i) => (
                  <motion.div
                    key={name}
                    variants={fadeUp}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    transition={{ delay: 0.36 + i * 0.04 }}
                    className="flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-[#d8e1ce] bg-white/85 px-2.5 py-2 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[#91a875] hover:bg-white sm:min-h-[44px]"
                  >
                    <Sprout className="h-3.5 w-3.5 shrink-0 text-[#66884b]" />

                    <span className="text-[11px] font-semibold leading-snug text-[#4b6042] sm:text-xs">
                      {t(name)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* THÔNG ĐIỆP CUỐI SECTION */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-x-2.5 gap-y-2 rounded-xl border border-white/25 bg-[#16351d]/65 px-3 py-3 text-center text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-lg backdrop-blur-sm sm:mt-5 sm:gap-x-4 sm:text-[10px]"
        >
          <span>{t("Kết nối năng lực")}</span>

          <span className="h-1 w-1 rounded-full bg-[#e7d98b]" />

          <span>{t("Phối hợp trong chuỗi giá trị")}</span>

          <span className="h-1 w-1 rounded-full bg-[#e7d98b]" />

          <span>{t("Tạo giá trị bền vững")}</span>
        </motion.div>
      </div>
    </section>
  );
}