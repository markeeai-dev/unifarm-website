"use client";

/**
 * DuanNguyenTac — Section 3 "Nguyên Tắc Phát Triển" của trang
 * "Dự Án & Hợp Tác": chu trình 4 bước Pilot → Validate → Standardize →
 * Scale. Bố cục gọn: ảnh banner ngang mỏng phía trên + hàng 4 bước
 * ngang có đường nối tô dần khi cuộn tới — thay cho bố cục 2 cột
 * ảnh-sticky/timeline-dọc cũ để nhìn nhanh, đỡ chiếm chiều cao trang.
 */

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.35 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  ink: "#12210F",
};

const STEPS = [
  {
    number: "01",
    vi: "Thử nghiệm",
    desc: "Triển khai mô hình quy mô nhỏ tại nông trường Unifarm để kiểm tra tính khả thi kỹ thuật và hiệu quả kinh tế.",
  },
  {
    number: "02",
    vi: "Kiểm chứng",
    desc: "Đối chiếu kết quả qua nhiều vụ mùa, nhiều điều kiện khí hậu và thổ nhưỡng trước khi nhân rộng.",
  },
  {
    number: "03",
    vi: "Chuẩn hóa",
    desc: "Đóng gói quy trình thành SOP rõ ràng, dễ đào tạo và dễ kiểm soát chất lượng khi chuyển giao.",
  },
  {
    number: "04",
    vi: "Nhân rộng",
    desc: "Mở rộng mô hình đã chuẩn hóa tới nhiều vùng trồng và đối tác, bảo đảm hiệu quả bền vững.",
  },
];

export default function DuanNguyenTac() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-white bg-[url('/images/nen_trang.png')] bg-repeat py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
        {/* Header gọn: eyebrow + tiêu đề + 1 dòng mô tả */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: C.green }}
          >
            The Farmer Must Make Money
          </p>
          <h2
            className="uppercase mt-3 text-2xl font-extrabold leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: C.forest }}
          >
            {t("Nguyên Tắc Phát Triển")}
          </h2>
          <p
            className="mt-3 text-sm leading-relaxed sm:text-base"
            style={{ color: C.fresh }}
          >
            {t("Mọi dự án mở rộng tuân thủ quy trình 4 bước:")}
          </p>
        </motion.div>

        {/* Banner ảnh ngang, mỏng gọn */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_-25px_rgba(6,59,36,0.45)] sm:mt-10 sm:aspect-[21/6]"
        >
          <Image
            src="/images/UNIFARM/UNIFARM/hinh-chinh/1787655032414_1582751505492234802_4935324150679931320_249aad34d99469334ad5bdce1de117ce.jpg"
            alt={t("Nông trường Unifarm, minh hoạ hành trình phát triển bền vững")}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#063B24]/80 via-[#063B24]/10 to-transparent" />
          <p className="absolute bottom-4 left-5 max-w-md text-sm font-bold leading-snug text-white sm:bottom-5 sm:left-6 sm:text-base">
            {t("Từ nông trường thí điểm đến chuỗi giá trị nhân rộng")}
          </p>
        </motion.div>

        {/* Hàng 4 bước, đường nối tô dần khi cuộn tới */}
        <div className="relative mt-8 sm:mt-14">
          {/* đường nối ngang — chỉ hiện từ sm trở lên */}
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-[2px] sm:block"
            style={{ background: `${C.forest}18` }}
          />
          <motion.div
            className="absolute left-0 top-[22px] hidden h-[2px] origin-left sm:block"
            style={{ background: C.green, right: 0 }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          />

          {/* đường nối dọc — chỉ hiện trên mobile, nối các mốc thành 1 chuỗi
              thay vì trông rời rạc như 1 danh sách phẳng */}
          <div
            className="absolute left-[22px] top-[22px] bottom-[22px] w-[2px] sm:hidden"
            style={{ background: `${C.forest}18` }}
          />
          <motion.div
            className="absolute left-[22px] top-[22px] w-[2px] origin-top sm:hidden"
            style={{ background: C.green, bottom: 0 }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE }}
                className="relative pl-14 sm:pl-0"
              >
                <span
                  className="absolute left-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white shadow-md sm:relative"
                  style={{ background: C.green }}
                >
                  {step.number}
                </span>

                <div className="flex items-baseline gap-2 sm:mt-4">
                  {/* <p
                    className="text-base font-extrabold uppercase tracking-wide"
                    style={{ color: C.forest }}
                  >
                    {step.en}
                  </p> */}
                  <p className="text-lg font-bold sm:text-[22px]" style={{ color: C.ink }}>
                    {t(step.vi)}
                  </p>
                </div>
                <p className="mt-1.5 text-base leading-relaxed text-neutral-600">
                  {t(step.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}