"use client";

import { useEffect, useRef, useState } from "react";

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
 * THAY LOGO THẬT:
 *  - Sửa mảng CLIENTS bên dưới. Mỗi item có thể dùng `logo` (đường dẫn ảnh,
 *    nên là .svg/.png nền trong suốt) hoặc chỉ để `name` + `accent` để hiện
 *    dạng chữ (placeholder) như demo này.
 *  - Nếu dùng next/image, thay thẻ <img> bằng <Image> (nhớ đặt fill hoặc
 *    width/height cố định).
 */

const CLIENTS = [
  { name: "Vườn Xanh", bg: "#d9f2d9", text: "#1c6b1c" },
  { name: "Chợ Quê", bg: "#ffd9d9", text: "#8a1f1f" },
  { name: "Trà Việt", bg: "#ffd9ec", text: "#a3186f" },
  { name: "Nông Sản A", bg: "#ffe9c2", text: "#8a5a00" },
  { name: "Mùa Vụ", bg: "#fff3b0", text: "#7a5c00" },
  { name: "Đồi Chè", bg: "#d7f5d7", text: "#0a5c0a" },
];

// Nhân đôi mảng để tạo vòng lặp liền mạch (seamless loop)
const LOOP_CLIENTS = [...CLIENTS, ...CLIENTS];

export default function ClientsMarquee() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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
          <h2 className="font-display text-3xl font-extrabold text-[#006400] sm:text-4xl lg:text-[42px]">
            Khách hàng của chúng tôi
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
                className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl border border-black/5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 sm:h-20 sm:w-44"
                style={{ backgroundColor: client.bg }}
              >
                <span
                  className="px-2 text-center text-xs font-semibold tracking-wide sm:text-sm"
                  style={{ color: client.text }}
                >
                  {client.name}
                </span>
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