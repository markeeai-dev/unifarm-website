/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * ClientsMarquee — "Our client's"
 * --------------------------------
 * - Dải logo khách hàng chạy ngang vô hạn (CSS keyframes, không dùng JS timer
 *   nên rất mượt và nhẹ CPU).
 * - Toàn bộ khối xuất hiện trượt lên + mờ dần khi cuộn tới (IntersectionObserver).
 * - Tông màu: Vàng kem #fffacd · Xanh lá đậm #006400 · Xanh dương nhạt #87cefa
 * - Mobile: card logo tự co nhỏ, khoảng cách giảm, tốc độ chạy giữ nguyên cảm
 *   giác vì dùng % thay vì px.
 *
 * LOGO KHÁCH HÀNG:
 *  - Mảng CLIENTS bên dưới dùng logo thật (PNG) của các chuỗi siêu thị/nhà
 *    phân phối, đặt trong `public/images/clients/`.
 */

const CLIENTS = [
  { name: "Co.opmart", logo: "/images/clients/coopmart.png" },
  { name: "WinMart", logo: "/images/clients/winmart.png" },
  { name: "Big C / GO!", logo: "/images/clients/bigc-go.png" },
  { name: "AEON", logo: "/images/clients/aeon.png" },
  { name: "Bách Hoá Xanh", logo: "/images/clients/bach-hoa-xanh.png" },
  { name: "MM Mega Market", logo: "/images/clients/mm-mega-market.png" },
  { name: "DOLE", logo: "/images/clients/dole.png" },
];

// Nhân đôi mảng để tạo vòng lặp liền mạch (seamless loop)
const LOOP_CLIENTS = [...CLIENTS, ...CLIENTS];

export default function ClientsMarquee() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-14 sm:py-20"
    >
      {/* Điểm nhấn nền nhẹ theo tông thương hiệu */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div
        className="relative mx-auto max-w-[1500px] px-4 motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100"
        style={{
          transitionProperty: "transform, opacity",
          transitionDuration: "800ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transform: visible ? "translateY(0)" : "translateY(48px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Tiêu đề */}
        <div className="mb-9 flex flex-col items-center gap-2 text-center sm:mb-12">
          <span className="h-1 w-10 rounded-full bg-[#87cefa]" aria-hidden="true" />
          <h2 className="uppercase text-3xl font-extrabold text-[#006400] sm:text-4xl lg:text-[42px]">
            {t("Khách hàng & Đối tác đồng hành")}
          </h2>
        </div>

        {/* Marquee — chạy vô hạn */}
        <div
          className="group relative w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="marquee-track flex w-max items-center gap-3 sm:gap-4">
            {LOOP_CLIENTS.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="flex h-16 w-32 shrink-0 items-center justify-center px-4 transition-transform duration-300 hover:-translate-y-0.5 sm:h-20 sm:w-44"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  draggable={false}
                  className="h-10 w-full object-contain sm:h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 22s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}