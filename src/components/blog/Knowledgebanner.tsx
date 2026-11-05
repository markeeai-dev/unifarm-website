"use client";

import Image from "next/image";
import Link from "next/link";
import { Sprout, Apple, Newspaper } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const menuItems = [
  {
    title: "KỸ THUẬT CANH TÁC",
    description: "Kiến thức từ thực tiễn",
    href: "/kien-thuc/ky-thuat-canh-tac",
    icon: Sprout,
  },
  {
    title: "CÂU CHUYỆN NÔNG SẢN",
    description: "Hành trình nông sản xanh",
    href: "/kien-thuc/cau-chuyen-nong-san",
    icon: Apple,
  },
  {
    title: "TIN TỨC",
    description: "Tin mới từ Unifarm",
    href: "/tin-tuc",
    icon: Newspaper,
  },
];

export default function KnowledgeBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative isolate flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#eaf7ff]">
      {/* Background — nông sản xanh */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/UNIFARM/bgr.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Lớp phủ tối để chữ luôn rõ trên nền ảnh — tối hơn ở vùng chữ/nav, nhạt dần ra ngoài */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(3,15,9,0.85) 0%, rgba(3,15,9,0.55) 28%, rgba(3,15,9,0.3) 50%, rgba(3,15,9,0.12) 70%, transparent 88%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 65% 60% at 50% 42%, rgba(3,15,9,0.35) 0%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1800px] flex-1 flex-col justify-center gap-10 sm:gap-14 lg:gap-20">
        {/* Nội dung chính */}
        <div>
          <div className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center gap-5 px-6 text-center sm:gap-6">
            {/* Logo */}
            <Link
              href="/"
              aria-label={t("Unifarm - Trang chủ")}
              className="inline-flex items-center gap-3"
            >
              <div className="relative h-20 w-20 shrink-0 sm:h-36 sm:w-36">
                <Image
                  src="/images/logo-unifarm.png"
                  alt="Unifarm"
                  fill
                  sizes="(min-width: 640px) 144px, 80px"
                  quality={90}
                  className="object-contain"
                />
              </div>

              <div className="text-left">
                <div
                  className="text-[27px] font-extrabold leading-none tracking-[-1.5px] text-white sm:text-4xl"
                  style={{ textShadow: "0 2px 12px rgba(0,20,10,0.7)" }}
                >
                  UNI<span className="text-[#9bdc6a]">FARM</span>
                </div>

                <p
                  className="mt-1 text-[8px] font-semibold tracking-[1px] text-white/85 sm:text-[10px] sm:tracking-[1.5px]"
                  style={{ textShadow: "0 1px 8px rgba(0,20,10,0.7)" }}
                >
                  {t("KIẾN TẠO NÔNG NGHIỆP BỀN VỮNG")}
                </p>
              </div>
            </Link>

            {/* Tiêu đề */}
            <div className="relative">
              <div className="relative inline-block">
                <div
                  className="absolute -inset-x-4 -inset-y-2 -rotate-2 bg-[#18813e]"
                  style={{
                    clipPath:
                      "polygon(1% 18%, 12% 2%, 30% 10%, 50% 0%, 72% 9%, 94% 1%, 100% 28%, 96% 55%, 100% 82%, 90% 100%, 68% 90%, 48% 100%, 25% 92%, 6% 100%, 2% 70%)",
                  }}
                  aria-hidden="true"
                />

                <span className="relative inline-block px-3 py-1 text-3xl font-black italic tracking-[1px] text-white sm:px-5 sm:py-1.5 sm:text-5xl lg:text-6xl">
                  {t("TRI THỨC")}
                </span>
              </div>

              <h1
                className="mt-1 text-[clamp(2.7rem,6.4vw,6.2rem)] font-black leading-[0.94] tracking-[-2px] text-[#87CEFA] sm:tracking-[-4px]"
                style={{ textShadow: "0 3px 24px rgba(0,20,10,0.75)" }}
              >
                UNIFARM
              </h1>
            </div>

            {/* Slogan */}
            <h2
              className="max-w-[900px] text-lg font-extrabold italic leading-snug text-white sm:text-2xl lg:whitespace-nowrap lg:text-[26px]"
              style={{ textShadow: "0 2px 16px rgba(0,20,10,0.75)" }}
            >
              {t("TRI THỨC CHỈ THỰC SỰ LỚN LÊN KHI ĐƯỢC CHIA SẺ")}
            </h2>

            <div className="h-1 w-20 rounded-full bg-[#9bdc6a] sm:w-24" />

            <p
              className="max-w-[640px] text-[15px] font-medium leading-6 text-white/90 sm:text-base sm:leading-7 lg:text-lg lg:leading-8"
              style={{ textShadow: "0 1px 10px rgba(0,20,10,0.65)" }}
            >
              {t(
                "Mỗi ngày ngoài cánh đồng đều đặt ra những bài toán mới. Đây là nơi Unifarm chia sẻ những gì chúng tôi học được từ nghiên cứu, thử nghiệm và thực tế sản xuất."
              )}
            </p>
          </div>
        </div>

        {/* Thanh điều hướng 3 mục: căn giữa, thấp hơn, gần đáy */}
        <div className="flex justify-center px-4 pb-3 pt-1 sm:px-6 sm:pb-4 sm:pt-2 lg:px-10 lg:pb-5 lg:pt-2">
          <nav
            aria-label={t("Danh mục tri thức Unifarm")}
            className="relative z-20 grid w-full max-w-[1050px] grid-cols-3 overflow-hidden rounded-xl border border-[#8acb5a]/70 bg-[#00613e]/95 shadow-[0_12px_35px_rgba(0,69,39,0.18)] backdrop-blur-md sm:inline-grid sm:w-auto sm:grid-flow-col sm:auto-cols-max sm:rounded-full"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group flex min-w-0 items-center justify-center gap-1 px-1.5 py-1.5 text-white transition-colors duration-300 hover:bg-[#08774b] sm:gap-2 sm:px-5 sm:py-2 lg:gap-3 lg:px-7 lg:py-2 ${
                    index !== 2 ? "border-r border-white/25" : ""
                  }`}
                >
                  {/* Icon */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#a5db66] bg-[#69ae3e] transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className="sm:h-5 sm:w-5 lg:h-5 lg:w-5"
                    />
                  </span>

                  {/* Nội dung */}
                  <span className="min-w-0 text-center sm:text-left">
                    <span className="block text-[8px] font-extrabold leading-tight sm:whitespace-nowrap sm:text-[11px] lg:text-sm">
                      {t(item.title)}
                    </span>

                    <span className="mt-0.5 hidden text-[10px] leading-tight text-white/70 lg:block">
                      {t(item.description)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}