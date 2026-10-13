"use client";

import { Sprout, Droplets, PackageCheck, LineChart } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const DEFINITIONS = [
  {
    icon: Sprout,
    text: "Người chăm sóc cây hiểu cây, đất và nước.",
  },
  {
    icon: Droplets,
    text: "Người bán hàng hiểu sản phẩm và tiêu chuẩn.",
  },
  {
    icon: PackageCheck,
    text: "Người quản lý hiểu công việc, con người và hiệu quả.",
  },
  {
    icon: LineChart,
    text: "Dù làm công việc gì, điều quan trọng là hiểu nghề, giỏi nghề và tạo ra giá trị từ công việc mình làm.",
  },
];

export default function NgheChuyenNghiep() {
  const { t } = useLanguage();

  return (
    <section
      id="nghe-chuyen-nghiep"
      className="relative isolate overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 sm:py-20 lg:py-24"
    >
      {/* Background effects - giữ nguyên màu sắc */}
      <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#87CEFA]/15 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#FFFACD]/50 blur-[110px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        {/* SECTION HEADING */}
        <Reveal
          className="mx-auto max-w-3xl text-center"
          duration={1}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#006400]/20 bg-white/70 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#006400] backdrop-blur-sm sm:text-[11px] sm:tracking-[0.24em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006400]" />
            {t("Giá trị nghề nông")}
          </span>

          <h2 className="mt-5 text-2xl font-extrabold uppercase leading-tight tracking-tight text-[#06301B] sm:text-3xl lg:text-[2.8rem]">
            {t("Giỏi nghề nông là giúp ích cho cuộc sống")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#06301B]/65 sm:text-[15px]">
            {t(
              "Nông nghiệp hiện đại được tạo nên từ rất nhiều nghề. Mỗi người làm tốt công việc của mình sẽ góp phần tạo nên cây trồng khỏe hơn, sản phẩm tốt hơn và một nền nông nghiệp tốt hơn."
            )}
          </p>
        </Reveal>

        {/* MAIN LAYOUT */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:mt-14 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-14">
          {/* LEFT: IMAGE FEATURE */}
          <Reveal
            className="flex min-w-0 flex-col"
            duration={0.9}
          >
            <div className="group relative min-h-[360px] flex-1 overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#06301B]/5 shadow-[0_24px_65px_-28px_rgba(15,40,20,0.35)] sm:min-h-[460px] lg:min-h-0 lg:rounded-[2rem]">
              <Image
                src="/images/UNIFARM/20260805_083315.jpg"
                alt={t(
                  "Người lao động Unifarm với sản phẩm chuối vừa thu hoạch"
                )}
                fill
                priority={false}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />

              {/* Overlay giữ nguyên tông xanh */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06301B]/80 via-[#06301B]/10 to-transparent" />

              {/* Image label */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                <div className="max-w-md rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFFACD]" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFFACD] sm:text-xs">
                      {t("Giá trị nghề nông")}
                    </span>
                  </div>

                  <p className="text-base font-extrabold leading-relaxed text-white sm:text-lg lg:text-xl">
                    {t(
                      "Mỗi vị trí một chuyên môn — cùng tạo nên một nông trường vận hành trơn tru"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: FOUR EQUAL CONTENT CARDS */}
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
            {DEFINITIONS.map(({ icon: Icon, text }, i) => (
              <Reveal
                key={text}
                delay={i * 0.1}
                duration={0.8}
                className="h-full min-w-0"
              >
                <article className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-[1.5rem] border border-[#06301B]/10 bg-white/80 p-5 shadow-[0_12px_35px_-24px_rgba(15,40,20,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#006400]/25 hover:bg-white hover:shadow-[0_22px_45px_-25px_rgba(15,40,20,0.35)] sm:min-h-[220px] sm:p-6 lg:min-h-[235px] lg:p-7">
                  {/* Number + decorative line */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-[0.18em] text-[#006400]/45">
                      0{i + 1}
                    </span>

                    <span className="h-px w-10 bg-[#006400]/20 transition-all duration-300 group-hover:w-16 group-hover:bg-[#006400]/50" />
                  </div>

                  {/* Icon */}
                  <div className="mt-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#006400]/10 text-[#006400] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#006400] group-hover:text-[#FFFACD] sm:h-14 sm:w-14">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  {/* Content */}
                  <p className="mt-5 flex-1 text-sm font-medium leading-7 text-[#06301B]/80 sm:text-[15px] sm:leading-7">
                    {t(text)}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-5 h-1 w-10 rounded-full bg-[#006400]/20 transition-all duration-300 group-hover:w-16 group-hover:bg-[#006400]" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}