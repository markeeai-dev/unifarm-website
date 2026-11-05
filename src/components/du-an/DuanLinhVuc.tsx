"use client";

/**
 * DuanLinhVuc — Section xen giữa DuanTruCot và DuanNguyenTac của trang
 * "Dự Án & Hợp Tác": 2 lối rẽ vào các dự án chế biến sâu cụ thể.
 * - "Nhà máy chế biến" → landing page riêng (/du-an-hop-tac/nha-may-che-bien).
 * - "Tinh bột kháng" → dự án đang hoàn thiện, sau này trỏ sang website
 *   riêng của TBK; tạm thời hiện badge "Sắp ra mắt", không có link.
 */

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.25 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  cream: "#FFFACD",
};

type Option = {
  id: string;
  title: string;
  desc: string;
  image: string;
  tag: string;
  cta: string;
  href: string;
  external?: boolean;
};

const OPTIONS: Option[] = [
  {
    id: "nha-may",
    title: "Nhà máy chế biến",
    desc: "Tổ hợp chế biến sâu chuối và dưa hấu theo dây chuyền cấp đông IQF khép kín — từ nguyên liệu vùng trồng đến thành phẩm xuất khẩu.",
    image: "/images/nha-may-che-bien/nha-may-cong.jpg",
    tag: "Dự án đang vận hành",
    cta: "Khám phá nhà máy",
    href: "/du-an-hop-tac/nha-may-che-bien",
  },
  {
    id: "tinh-bot-khang",
    title: "Tinh bột kháng",
    desc: "Dòng sản phẩm chế biến sâu từ chuối xanh, hướng đến thực phẩm tốt cho sức khoẻ — đang trong giai đoạn hoàn thiện mô hình.",
    image: "/images/UNIFARM/buong-chuoi.jpg",
    tag: "Website chính thức",
    cta: "Khám phá Tinh bột kháng",
    href: "https://tinh-bot-khang.vercel.app/",
    external: true,
  },
];

export default function DuanLinhVuc() {
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
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
            {t("- LĨNH VỰC CHẾ BIẾN SÂU -")}
          </p>
          <h2
            className="mt-3 text-xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:whitespace-nowrap lg:text-4xl"
            style={{ color: C.forest }}
          >
            {t("Hai hướng đi gia tăng giá trị nông sản")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: C.fresh }}>
            {t("Từ vùng trồng tập trung, Unifarm phát triển song song hai dự án chế biến sâu để khai thác trọn giá trị nông sản.")}
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-2">
          {OPTIONS.map((opt, i) => {
            return (
              <motion.div
                key={opt.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              >
                <Link
                  href={opt.href}
                  {...(opt.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group relative block overflow-hidden rounded-3xl shadow-[0_25px_60px_-30px_rgba(6,59,36,0.4)]"
                >
                  <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                    <Image
                      src={opt.image}
                      alt={t(opt.title)}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                    <span
                      className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white sm:left-5 sm:top-5"
                      style={{ background: C.green }}
                    >
                      {t(opt.tag)}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <h3 className="max-w-md text-xl font-extrabold uppercase leading-snug text-white sm:text-2xl">
                        {t(opt.title)}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
                        {t(opt.desc)}
                      </p>

                      <span
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-all group-hover:gap-3"
                        style={{ color: C.cream }}
                      >
                        {t(opt.cta)}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
