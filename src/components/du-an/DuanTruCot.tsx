"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: false, amount: 0.2 } as const;
const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  soft: "#8FBF72",
  cream: "#F7F4E8",
  warm: "#FCFAF2",
  blue: "#87CEFA",
  yellow: "#FFFACD",
  ink: "#12210F",
};

type Card = {
  title: string;
  meta?: { label: string; value: string };
  bullets?: string[];
  steps?: { title: string; desc: string }[];
};

type TabData = {
  id: string;
  label: string;
  description: string;
  cards: Card[];
};

const TABS: TabData[] = [
  {
    id: "giong",
    label: "Nghiên cứu & Sản xuất giống",
    description:
      "Nghiên cứu, tuyển chọn, phát triển và nhân giống để tạo ra nguồn cây giống phù hợp với điều kiện sản xuất, yêu cầu thị trường và thực tế canh tác.",
    cards: [
      {
        title: "BẮT ĐẦU TỪ MỘT GIỐNG PHÙ HỢP",
        bullets: [
          "Nghiên cứu và tuyển chọn giống phù hợp với điều kiện tự nhiên, mục tiêu canh tác và nhu cầu thị trường.",
          "Phát triển và nhân giống nhằm tạo nguồn cây giống phục vụ sản xuất ổn định và phát triển vùng nguyên liệu.",
        ],
      },
    ],
  },
  {
    id: "canh-tac",
    label: "Canh tác bền vững trên quy mô lớn",
    description:
      "Các vùng sản xuất là nơi giống, công nghệ và quy trình được triển khai trên quy mô thực tế để đánh giá, hoàn thiện và chuẩn hóa.",
    cards: [
      {
        title: "KIỂM CHỨNG TRONG THỰC TẾ SẢN XUẤT",
        bullets: [
          "Triển khai giống, công nghệ và quy trình canh tác trong điều kiện sản xuất thực tế.",
          "Theo dõi, đánh giá và hoàn thiện quy trình để hướng đến hiệu quả, tính ổn định và khả năng nhân rộng.",
        ],
      },
    ],
  },
  {
    id: "che-bien",
    label: "Chế biến",
    description:
      "Phát triển các giải pháp sau thu hoạch và chế biến nhằm duy trì chất lượng, mở rộng khả năng sử dụng và tạo thêm giá trị từ nông sản.",
    cards: [
      {
        title: "GIỮ VÀ GIA TĂNG GIÁ TRỊ NÔNG SẢN",
        bullets: [
          "Phát triển các giải pháp sau thu hoạch và chế biến phù hợp với đặc tính từng loại nông sản.",
          "Hướng đến duy trì chất lượng, đa dạng hóa ứng dụng và nâng cao giá trị nông sản trong chuỗi cung ứng.",
        ],
      },
    ],
  },
  {
    id: "chuyen-giao",
    label: "Chuyển giao công nghệ",
    description:
      "Những giống, công nghệ, quy trình và mô hình đã được kiểm chứng được chuẩn hóa để chuyển giao và cùng nông dân, hợp tác xã, doanh nghiệp áp dụng trong thực tế.",
    cards: [
      {
        title:
          "BIẾN KINH NGHIỆM THỰC TẾ THÀNH GIẢI PHÁP CÓ THỂ NHÂN RỘNG",
        bullets: [
          "Chuẩn hóa giống, công nghệ, quy trình và mô hình dựa trên kinh nghiệm triển khai thực tế.",
          "Đồng hành cùng nông dân, hợp tác xã và doanh nghiệp trong quá trình tiếp nhận, ứng dụng và phát triển mô hình.",
        ],
      },
    ],
  },
  {
    id: "thi-truong",
    label: "Phát triển thị trường",
    description:
      "Unifarm kết nối nhu cầu thị trường với sản xuất để cùng đối tác phát triển sản phẩm, tiêu chuẩn và kế hoạch cung ứng phù hợp.",
    cards: [
      {
        title: "ĐƯA SẢN PHẨM ĐẾN ĐÚNG THỊ TRƯỜNG",
        bullets: [
          "Kết nối nhu cầu thị trường với năng lực sản xuất và nguồn cung nông sản.",
          "Cùng đối tác định hướng sản phẩm, tiêu chuẩn chất lượng và kế hoạch cung ứng phù hợp với thị trường mục tiêu.",
        ],
      },
    ],
  },
];

const TAB_IMAGES: Record<string, { src: string; alt: string; tag: string }> = {
  giong: {
    src: "/images/UNIFARM/16.JPG",
    alt: "Khu nông nghiệp công nghệ cao Unifarm",
    tag: "Nghiên cứu và sản xuất giống",
  },
  "canh-tac": {
    src: "/images/UNIFARM/16.JPG",
    alt: "Vùng sản xuất nông nghiệp công nghệ cao Unifarm",
    tag: "Canh tác bền vững trên quy mô lớn",
  },
  "che-bien": {
    src: "/images/UNIFARM/buong-chuoi.jpg",
    alt: "Nông sản chuối tại vùng sản xuất Unifarm",
    tag: "Chế biến và gia tăng giá trị",
  },
  "chuyen-giao": {
    src: "/images/UNIFARM/UNIFARM/hinh-chinh/1787655032405_1582751505492234802_4935324150679931320_4d390c1e5cd8777f2674a00dd1340dc7.jpg",
    alt: "Đội ngũ kỹ thuật Unifarm đồng hành tại vùng sản xuất",
    tag: "Chuyển giao công nghệ",
  },
  "thi-truong": {
    src: "/images/UNIFARM/buong-chuoi.jpg",
    alt: "Nông sản chuối từ vùng sản xuất Unifarm",
    tag: "Phát triển thị trường",
  },
};

export default function DuanTruCot() {
  const [activeTab, setActiveTab] = useState(0);
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const tab = TABS[activeTab];
  const image = TAB_IMAGES[tab.id];

  return (
    <section
      id="tru-cot"
      className="relative w-full overflow-visible bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 sm:overflow-hidden sm:py-28"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-xs font-bold uppercase tracking-[0.32em]"
          style={{ color: C.green }}
        >
          {t("Năng lực hợp tác")}
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mt-4 max-w-5xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: C.forest }}
        >
          {t("Kết nối năng lực trong toàn chuỗi")}
        </motion.h2>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="mt-6 h-px w-full max-w-[220px] origin-left"
          style={{ background: C.green }}
        />

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-6 max-w-4xl text-sm leading-7 text-neutral-600 sm:text-base"
        >
          {t(
            "Unifarm kết nối các năng lực từ nghiên cứu và sản xuất giống, canh tác bền vững trên quy mô lớn, chế biến, chuyển giao công nghệ đến phát triển thị trường để cùng đối tác xây dựng những dự án có hiệu quả và có khả năng nhân rộng."
          )}
        </motion.p>

        {/* Một khối năng lực duy nhất: ảnh bên trái, 5 mục lựa chọn bên phải */}
        <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Ảnh bên trái */}
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl shadow-[0_30px_70px_-25px_rgba(6,59,36,0.35)] sm:min-h-[360px] lg:min-h-0 lg:h-full lg:self-stretch">
            <div
              className="relative h-[280px] w-full sm:h-[360px] lg:h-full lg:min-h-[500px]"
              style={{ background: C.forest }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={image.src + tab.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={image.src}
                    alt={t(image.alt)}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority={activeTab === 0}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

              <motion.div
                key={image.tag}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute inset-x-0 bottom-0 p-4 sm:p-6"
              >
                <span
                  className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ background: C.green }}
                >
                  {String(activeTab + 1).padStart(2, "0")} / 05
                </span>

                <h3 className="mt-2.5 max-w-xl text-lg font-extrabold uppercase leading-snug text-white sm:text-xl">
                  {t(tab.cards[0].title)}
                </h3>
              </motion.div>
            </div>
          </div>

          {/* 5 mục có chiều cao đồng đều */}
          <div className="grid grid-rows-5 gap-2.5 lg:min-h-[500px]">
            {TABS.map((tabItem, i) => {
              const isActive = i === activeTab;

              return (
                <motion.button
                  key={tabItem.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(i)}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative flex min-h-[88px] w-full items-center gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 sm:min-h-[96px] sm:p-4 lg:min-h-0 ${
                    isActive
                      ? "border-[#006400]/40 bg-[#063B24] text-white shadow-[0_16px_35px_-18px_rgba(6,59,36,0.6)]"
                      : "border-[#063B24]/10 bg-white/85 text-[#12210F] hover:border-[#006400]/30 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      isActive
                        ? "bg-white/15 text-[#FFFACD]"
                        : "bg-[#006400]/[0.08] text-[#006400]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-extrabold uppercase leading-snug sm:text-sm">
                      {t(tabItem.label)}
                    </span>

                    <span
                      className={`mt-1 block line-clamp-2 text-[11px] leading-relaxed sm:text-xs ${
                        isActive ? "text-white/80" : "text-neutral-500"
                      }`}
                    >
                      {t(tabItem.description)}
                    </span>
                  </span>

                  <span
                    className={`ml-auto shrink-0 text-lg transition-transform ${
                      isActive
                        ? "translate-x-0 text-[#FFFACD]"
                        : "-translate-x-1 text-[#006400]/55 group-hover:translate-x-0"
                    }`}
                    aria-hidden="true"
                  >
                    →
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="truCotActiveItem"
                      className="absolute inset-y-2.5 left-0 w-1 rounded-r-full"
                      style={{ background: C.soft }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chuỗi năng lực liên kết xuyên suốt */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-10 rounded-2xl border p-5 sm:mt-14 sm:p-7"
          style={{ borderColor: `${C.green}25`, background: "rgba(255,255,255,0.7)" }}
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.green }}>
            {t("Một chuỗi năng lực xuyên suốt")}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {[
              "Nghiên cứu & sản xuất giống",
              "Canh tác bền vững trên quy mô lớn",
              "Chế biến",
              "Chuyển giao công nghệ",
              "Phát triển thị trường",
            ].map((item, index, items) => (
              <div key={item} className="flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-2 text-xs font-bold leading-relaxed sm:px-4 sm:text-sm"
                  style={{ color: C.forest, background: `${C.green}0D`, border: `1px solid ${C.green}25` }}
                >
                  {t(item)}
                </span>
                {index < items.length - 1 && (
                  <span aria-hidden="true" className="text-lg font-semibold" style={{ color: C.fresh }}>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
        </div>
    </section>
  );
}
