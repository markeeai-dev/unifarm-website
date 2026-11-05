"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Snowflake, PackageCheck, MapPin, Phone, Ship } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.25 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  cream: "#FFFACD",
};

const PRODUCTS = [
  {
    name: "Chuối đông lạnh IQF",
    desc: "Chuối chín được cắt lát, cấp đông rời ngay sau thu hoạch — giữ nguyên vị ngọt tự nhiên, tiện dùng cho chế biến công nghiệp.",
    image:
      "https://5txzbkkzzhionimo.public.blob.vercel-storage.com/migrated/d451b266-2b9b-4a2e-bece-33676aa81fe0-Untitled%20design%2835%29-7o1x1fHwElv8yRCscnnWxJ87DU6iKB.png",
    temp: "-18°C",
    pack: "10kg / thùng carton",
    origin: "Vùng nguyên liệu Tây Ninh",
  },
  {
    name: "Dưa hấu đông lạnh IQF",
    desc: "Dưa hấu tươi cắt miếng, cấp đông nhanh để giữ trọn độ giòn ngọt và màu sắc tự nhiên của trái chín.",
    image:
      "https://5txzbkkzzhionimo.public.blob.vercel-storage.com/migrated/afd8436a-f52c-407b-9baa-76156fb52a59-1-zddg7iVYt2KhHgzyRFBvDuO1RkQn9G.png",
    temp: "-18°C",
    pack: "10kg / thùng carton",
    origin: "Vùng nguyên liệu Tây Ninh",
  },
];

export default function NhaMaySanPham() {
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
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
            {t("- THÀNH PHẨM -")}
          </p>
          <h2
            className="mt-3 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: C.forest }}
          >
            {t("Hai dòng sản phẩm chủ lực")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: C.fresh }}>
            {t("Ra đời từ chính dây chuyền của nhà máy, sẵn sàng cho cả thị trường nội địa và xuất khẩu.")}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-7 sm:mt-14 lg:grid-cols-2 lg:gap-9">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.75, delay: i * 0.12, ease: EASE }}
              className="group relative overflow-hidden rounded-[28px] bg-white shadow-[0_30px_70px_-35px_rgba(6,59,36,0.4)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_85px_-30px_rgba(6,59,36,0.5)]"
            >
              {/* Khối ảnh — nền trắng trùng với nền trắng sẵn có của ảnh sản phẩm
                  để không lộ viền lệch tông như khi đặt trên nền vàng/gradient */}
              <div className="relative flex h-60 items-center justify-center overflow-hidden bg-white sm:h-72">
                <div className="relative h-48 w-48 transition-transform duration-500 group-hover:scale-105 sm:h-60 sm:w-60">
                  <Image src={p.image} alt={t(p.name)} fill sizes="240px" className="object-contain" />
                </div>

                <span
                  className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
                  style={{ background: C.green }}
                >
                  <Snowflake className="h-3 w-3" strokeWidth={2.5} />
                  IQF
                </span>
                <span
                  className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm"
                  style={{ borderColor: `${C.forest}22`, color: C.forest }}
                >
                  <Ship className="h-3 w-3" strokeWidth={2.5} />
                  {t("Sẵn sàng xuất khẩu")}
                </span>
              </div>

              {/* Nội dung */}
              <div className="relative p-6 sm:p-8">
                <div className="h-[3px] w-10 rounded-full" style={{ background: C.green }} aria-hidden="true" />
                <h3 className="mt-3 text-xl font-extrabold leading-snug sm:text-2xl" style={{ color: C.forest }}>
                  {t(p.name)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">{t(p.desc)}</p>

                <div className="mt-6 grid grid-cols-3 divide-x rounded-2xl py-1" style={{ borderColor: `${C.green}14` }}>
                  <div className="flex flex-col items-center gap-1.5 px-2 text-center" style={{ borderColor: `${C.green}14` }}>
                    <Snowflake className="h-4 w-4" style={{ color: C.green }} strokeWidth={2.2} />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 sm:text-[10px]">
                      {t("Bảo quản")}
                    </p>
                    <p className="text-sm font-extrabold" style={{ color: C.forest }}>
                      {p.temp}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 px-2 text-center" style={{ borderColor: `${C.green}14` }}>
                    <PackageCheck className="h-4 w-4" style={{ color: C.green }} strokeWidth={2.2} />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 sm:text-[10px]">
                      {t("Quy cách")}
                    </p>
                    <p className="text-sm font-extrabold leading-snug" style={{ color: C.forest }}>
                      {t(p.pack)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 px-2 text-center" style={{ borderColor: `${C.green}14` }}>
                    <MapPin className="h-4 w-4" style={{ color: C.green }} strokeWidth={2.2} />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 sm:text-[10px]">
                      {t("Nguồn gốc")}
                    </p>
                    <p className="text-sm font-extrabold leading-snug" style={{ color: C.forest }}>
                      {t("Tây Ninh")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href="/san-pham?category=processed#products"
                    className="group/btn relative isolate flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300"
                    style={{ background: C.forest }}
                  >
                    <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
                    {t("Xem trong danh mục sản phẩm")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" strokeWidth={2.5} />
                  </Link>
                  <a
                    href="tel:02743889887"
                    aria-label={t("Gọi hotline Unifarm")}
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 hover:bg-[#f2f9ee]"
                    style={{ borderColor: `${C.forest}26`, color: C.forest }}
                  >
                    <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
