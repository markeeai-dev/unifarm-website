"use client";

import Image from "next/image";
import Link from "next/link";
import { Sprout, Apple, Newspaper } from "lucide-react";

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
  return (
    <section className="relative isolate flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#eaf7ff]">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/blog/banner-blog.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Trang trí phía dưới */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#075d39]/25 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1800px] flex-1 flex-col justify-between">
        {/* Nội dung chính */}
        <div className="grid items-center gap-6 pt-7 sm:pt-10 md:grid-cols-[0.62fr_0.78fr] lg:gap-10 lg:pt-12">
          {/* Cột trái */}
          <div className="relative z-10 order-1 max-w-[560px] pl-6 sm:pl-8 lg:pl-24">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Unifarm - Trang chủ"
              className="mb-6 inline-flex items-center gap-2 sm:mb-8"
            >
              <div className="relative h-10 w-10 shrink-0 sm:h-25 sm:w-25">
                <Image
                  src="/images/logo-unifarm.png"
                  alt="Unifarm"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>

              <div>
                <div className="text-[27px] font-extrabold leading-none tracking-[-1.5px] text-[#07583b] sm:text-4xl">
                  UNI<span className="text-[#76b83f]">FARM</span>
                </div>

                <p className="mt-1 text-[8px] font-semibold tracking-[1px] text-[#285c49] sm:text-[10px] sm:tracking-[1.5px]">
                  KIẾN TẠO NÔNG NGHIỆP BỀN VỮNG
                </p>
              </div>
            </Link>

            {/* Tiêu đề */}
            <div className="relative mb-4 sm:mb-5">
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
                  TRI THỨC
                </span>
              </div>

              <h1 className="mt-1 text-[clamp(2.7rem,6.4vw,6.2rem)] font-black leading-[0.94] tracking-[-2px] text-[#075c3d] sm:tracking-[-4px]">
                UNIFARM
              </h1>
            </div>

            {/* Slogan */}
            <h2 className="max-w-[480px] text-lg font-extrabold italic leading-snug text-[#176342] sm:text-2xl lg:text-[27px]">
              TRI THỨC CHỈ THỰC SỰ LỚN LÊN
              <br />
              KHI ĐƯỢC CHIA SẺ
            </h2>

            <div className="my-3 h-1 w-20 rounded-full bg-[#75b843] sm:my-4 sm:w-24" />

            <p className="max-w-[480px] text-[15px] font-medium leading-6 text-[#174b35] sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Mỗi ngày ngoài cánh đồng đều đặt ra những bài toán mới.
              Đây là nơi Unifarm chia sẻ những gì chúng tôi học được
              từ nghiên cứu, thử nghiệm và thực tế sản xuất.
            </p>
          </div>

          {/* Cột phải: ảnh đội ngũ hạ xuống nhẹ */}
          <div className="relative order-2 h-[300px] w-full translate-y-1 sm:h-[420px] sm:translate-y-5 md:h-[460px] md:translate-y-5 lg:h-[580px] lg:translate-y-20">
            {/* Vùng sáng sau ảnh */}
            <div className="absolute inset-x-[10%] bottom-3 top-[12%] rounded-full bg-sky-300/20 blur-3xl" />

            <Image
              src="/images/blog/anh-nguoi.png"
              alt="Đội ngũ Unifarm cùng chia sẻ tri thức nông nghiệp"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain object-right-bottom drop-shadow-[0_12px_18px_rgba(13,65,42,0.12)]"
            />
          </div>
        </div>

        {/* Thanh điều hướng 3 mục: căn giữa, thấp hơn, gần đáy */}
        <div className="flex justify-center px-4 pb-3 pt-1 sm:px-6 sm:pb-4 sm:pt-2 lg:px-10 lg:pb-5 lg:pt-2">
          <nav
            aria-label="Danh mục tri thức Unifarm"
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
                      {item.title}
                    </span>

                    <span className="mt-0.5 hidden text-[10px] leading-tight text-white/70 lg:block">
                      {item.description}
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