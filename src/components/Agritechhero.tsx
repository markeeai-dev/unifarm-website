"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Leaf, Recycle, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * AgriTechHero
 * -------------------------------------------------------------
 * Section giới thiệu "Nông nghiệp công nghệ cao".
 * - Bên trái: 2 ảnh chèn lên nhau. Khi cuộn tới, CHÍNH ẢNH trượt
 *   vào khung (không dùng lớp phủ màu) — mượt, không bị đứng hình.
 *   Ảnh dưới trượt vào từ trái -> phải, ảnh trên trượt vào từ
 *   phải -> trái, có độ trễ tạo cảm giác lần lượt.
 * - Bên phải: badge, tiêu đề 2 dòng, thẻ số liệu + 2 mục nổi bật,
 *   đoạn giới thiệu, danh sách gạch đầu dòng + nút CTA.
 * - Hiệu ứng chạy lại mỗi khi cuộn tới lại section (once: false).
 *
 * Cài đặt: npm install framer-motion lucide-react
 * ------------------------------------------------------------- */

// Mỗi mục bên phải trượt vào dần từ bên phải, xuất hiện lần lượt theo delay.
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },

  show: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const VIEWPORT = {
  once: false,
  amount: 0.35,
} as const;

/* =========================================================
   HIỆU ỨNG "FOCUS PULL" — ảnh mờ nhòe + phóng to nhẹ, rồi nét
   dần về đúng tỉ lệ, như ống kính máy ảnh bắt nét. Khác lạ hơn
   hẳn kiểu fade/slide/curtain thông thường.
   ========================================================= */
const focusReveal = (delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    scale: 1.15,
    filter: "blur(22px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
  },
});

const FEATURES = [
  {
    icon: Leaf,
    title: "Mục đích cốt lõi",
    desc: "Unifarm bắt đầu với một câu hỏi đơn giản: Làm thế nào để nông nghiệp Việt Nam có thể cạnh tranh tốt hơn?",
  },
  {
    icon: Recycle,
    title: "Nền tảng vận hành",
    desc: "Kết nối toàn diện với Con người • Dữ liệu • Tiêu chuẩn • Công nghệ làm nền tảng vững chắc.",
  },
];

const CHECKLIST = ["Tối ưu hóa từng đơn vị tài nguyên", "Đồng hành cùng nông dân Việt"];

export default function AgriTechHero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 md:py-28">
      {/* Khối trang trí nền */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#FFFACD] blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(#006400 0.7px, transparent 0.7px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, black 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        {/* ============ BÊN TRÁI: 2 ẢNH XẾP CHỒNG, VUÔNG GÓC ============ */}
        <div className="relative mx-auto h-[520px] w-full max-w-xl sm:h-[600px] lg:h-[680px] lg:max-w-none">
          {/* Khung viền trang trí lệch góc — điểm nhấn hiện đại phía sau ảnh */}
          <motion.div
            initial={{ opacity: 0, rotate: -8, scale: 0.85 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -left-4 -top-4 z-0 h-[60%] w-[64%] border-2 border-[#006400]/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-3 -right-3 z-20 h-16 w-16 bg-[#FFFACD]"
          />

          {/* ẢNH LỚN PHÍA SAU — mờ nhòe bắt nét dần */}
          <motion.div
            variants={focusReveal(0)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="absolute left-0 top-0 z-0 h-[82%] w-[88%] overflow-hidden bg-neutral-100 shadow-2xl shadow-[#006400]/20"
          >
            <div className="ath-zoom relative h-full w-full">
              <Image
                src="/images/UNIFARM/UNIFARM/peggy_marco-banana-2058196_1920.jpg"
                alt={t("Kỹ sư kiểm tra chất lượng nông sản trong nhà kính")}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 88vw, 42vw"
              />
            </div>
          </motion.div>

          {/* ẢNH NHỎ PHÍA TRƯỚC — mờ nhòe bắt nét dần, trễ hơn 1 nhịp */}
          <motion.div
            variants={focusReveal(0.28)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="absolute bottom-0 right-0 z-10 h-[62%] w-[68%] overflow-hidden border-[6px] border-[#FFFDF3] bg-neutral-100 shadow-2xl shadow-[#006400]/25"
          >
            <div className="ath-zoom relative h-full w-full" style={{ animationDelay: "0.3s" }}>
              <Image
                src="/images/UNIFARM/UNIFARM/thaithu007-banana-4671645_1920.jpg"
                alt={t("Vùng trồng nông sản ứng dụng công nghệ cao")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 68vw, 32vw"
              />
            </div>
          </motion.div>

          {/* Badge nhỏ bên dưới */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] },
            }}
            viewport={VIEWPORT}
            className="absolute bottom-[-12px] left-4 z-30 hidden items-center gap-2 bg-white/95 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#006400] shadow-lg backdrop-blur sm:flex"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#006400]" />
            {t("Hệ sinh thái liên kết")}
          </motion.div>
        </div>

        {/* ============ BÊN PHẢI: NỘI DUNG ============ */}
        <div className="relative">
          {/* Badge — dạng pill, mờ dần trồi lên */}
          <motion.span
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="inline-flex items-center rounded-full border border-[#006400]/25 bg-[#f2f9ee] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#006400]"
          >
            {t("nông nghiệp công nghệ cao Unifarm")}
          </motion.span>

          {/* Tiêu đề 2 dòng — mờ dần trồi lên */}
          <motion.h2
            custom={0.15}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="uppercase mt-5 text-3xl font-extrabold leading-[1.15] text-[#053d05] sm:text-4xl lg:text-[2.75rem]"
          >
            {t("Từ một trang trại")}
            <br />
            {t("Đến một hệ sinh thái")}
          </motion.h2>

          {/* Thẻ số liệu + 2 mục nổi bật */}
          <motion.div
            custom={0.3}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-stretch"
          >
            <div className="flex min-w-[180px] flex-col items-center justify-center rounded-2xl bg-white px-6 py-6 text-center shadow-[0_18px_40px_-16px_rgba(0,100,0,0.25)]">
              <span className="text-sm font-semibold text-neutral-500">
                Since
              </span>
              <span className="mt-1 text-4xl font-extrabold text-[#006400] sm:text-[2.75rem]">
                2009
              </span>
            </div>

            <div className="flex flex-1 flex-col divide-y divide-[#006400]/10 rounded-2xl bg-white/60 px-5 sm:px-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#006400]">
                    <f.icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="font-bold text-[#053d05]">{t(f.title)}</p>
                    <p className="mt-0.5 text-sm leading-snug text-neutral-500">
                      {t(f.desc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Đoạn văn giới thiệu — mờ dần */}
          <motion.p
            custom={0.45}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg"
          >
            {t("Câu trả lời không nằm ở riêng một cánh đồng hay một công nghệ, mà nằm trong khả năng kết nối khép kín: Nghiên cứu → Giống → Sản xuất → Liên kết → Sau thu hoạch & Chế biến → Thị trường.")}
          </motion.p>

          {/* Checklist + Nút CTA */}
          <motion.div
            custom={0.6}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <ul className="flex flex-col gap-2.5">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-[#053d05] sm:text-base"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#006400]" strokeWidth={3} />
                  {t(item)}
                </li>
              ))}
            </ul>

            <span className="hidden h-12 w-px bg-[#006400]/15 sm:block" />

            <button
              type="button"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-[#006400] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#006400] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-[0_14px_30px_-10px_rgba(0,100,0,0.5)]"
            >
              <span className="absolute inset-0 -z-10 scale-x-0 bg-gradient-to-r from-[#006400] to-[#2E7DC2] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              {t("Câu chuyện Unifarm")}
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes athZoom {
          0%, 100% { transform: scale(1.04); }
          50% { transform: scale(1.16); }
        }
        .ath-zoom {
          animation: athZoom 11s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ath-zoom { animation: none; }
        }
      `}</style>
    </section>
  );
}