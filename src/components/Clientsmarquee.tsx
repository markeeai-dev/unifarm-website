/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Đối tác chiến lược — chỉ 3 đơn vị thực tế.
const PARTNERS = [
  { name: "DOLE", logo: "/images/clients/dole.png" },
  { name: "Vietnam Rubber Group", logo: "/images/clients/doi-tac/logo-blip-vn.png" },
  { name: "DRC", logo: "/images/clients/doi-tac/DRC-Logo.png" },
];

// Khách hàng chủ chốt.
const CLIENTS = [
  { name: "Co.opmart", logo: "/images/clients/coopmart.png" },
  { name: "Coop Sapporo", logo: "/images/clients/logo-white.svg" },
  { name: "AEON", logo: "/images/clients/aeon.png" },
  { name: "GO!", logo: "/images/clients/logo-sieu-thi-go-compressed.jpg" },
  { name: "Lotte Mart", logo: "/images/clients/lotte-mart.jpg" },
  { name: "Shinsegae", logo: "/images/clients/Shinsegae_logo.svg.webp" },
  { name: "FamilyMart", logo: "/images/clients/FamilyMart_Logo_(2016-).svg.webp" },
  { name: "GS25", logo: "/images/clients/GS25_bi_(2019).svg" },
  { name: "7-Eleven", logo: "/images/clients/7-Eleven-Logo.png" },
];

type Logo = {
  name: string;
  logo: string;
};

function LogoMarquee({
  items,
  direction = "left",
  duration = 30,
  size = "md",
}: {
  items: Logo[];
  direction?: "left" | "right";
  duration?: number;
  size?: "md" | "lg";
}) {
  if (items.length === 0) return null;

  const boxClass =
    size === "lg"
      ? "flex h-28 w-32 shrink-0 items-center justify-center px-2 transition-transform duration-300 hover:-translate-y-1 sm:h-40 sm:w-40 sm:px-3"
      : "flex h-16 w-32 shrink-0 items-center justify-center px-4 transition-transform duration-300 hover:-translate-y-1 sm:h-20 sm:w-44 sm:px-5";
  const imgClass =
    size === "lg" ? "h-24 w-full object-contain sm:h-32" : "h-10 w-full object-contain sm:h-12";

  return (
    <div
      className="logo-marquee group relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className={`marquee-track flex w-max items-center ${
          direction === "right" ? "marquee-right" : "marquee-left"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={`${item.name}-${i}`} className={boxClass}>
            <img
              src={item.logo}
              alt={item.name}
              draggable={false}
              loading="lazy"
              className={imgClass}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsMarquee() {
  const sectionRef = useRef<HTMLElement | null>(null);
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
      {/* Nền trang trí giữ phong cách ban đầu */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full bg-[#87cefa]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="relative mx-auto max-w-[1500px] px-4 motion-reduce:transition-none sm:px-8"
        style={{
          transitionProperty: "transform, opacity",
          transitionDuration: "800ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transform: visible ? "translateY(0)" : "translateY(48px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Tiêu đề chính */}
        <div className="mb-10 flex flex-col items-center gap-2 text-center sm:mb-14">
          <span
            className="h-1 w-10 rounded-full bg-[#87cefa]"
            aria-hidden="true"
          />
          <h2 className="text-3xl font-extrabold uppercase text-[#006400] sm:text-4xl lg:text-[42px]">
            {t("Đối tác & Khách hàng")}
          </h2>
        </div>

        <div className="flex flex-col gap-10 sm:gap-14">
          {/* KHÁCH HÀNG */}
          <div className="w-full">
            {CLIENTS.length > 0 && (
              <div className="mb-5 flex items-center justify-center gap-3 sm:mb-7">
                <span className="h-px w-8 bg-[#2582b8]/40 sm:w-12" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-[#2582b8] sm:text-xl">
                  {t("Khách hàng chủ chốt")}
                </h3>
                <span className="h-px w-8 bg-[#2582b8]/40 sm:w-12" />
              </div>
            )}

            <LogoMarquee
              items={CLIENTS}
              direction="right"
              duration={42}
            />
          </div>

          {/* Đường phân cách */}
          {PARTNERS.length > 0 && (
            <div
              className="mx-auto h-px w-full max-w-5xl"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(135,206,250,0.5), transparent)",
              }}
            />
          )}

          {/* ĐỐI TÁC — chỉ 3 logo nên thu hẹp track lại cho gọn, không kéo full width */}
          {PARTNERS.length > 0 && (
            <div className="w-full">
              <div className="mb-5 flex items-center justify-center gap-3 sm:mb-7">
                <span className="h-px w-8 bg-[#006400]/40 sm:w-12" />
                <h3 className="text-lg font-bold uppercase tracking-wider text-[#006400] sm:text-xl">
                  {t("Đối tác chiến lược")}
                </h3>
                <span className="h-px w-8 bg-[#006400]/40 sm:w-12" />
              </div>

              <div className="mx-auto max-w-md sm:max-w-xl">
                <LogoMarquee
                  items={PARTNERS}
                  direction="left"
                  duration={18}
                  size="lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          will-change: transform;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .marquee-left {
          animation-name: marquee-scroll-left;
        }

        .marquee-right {
          animation-name: marquee-scroll-right;
        }

        .logo-marquee:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
