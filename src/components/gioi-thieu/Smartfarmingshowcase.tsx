/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SmartFarmingShowcase — dùng riêng cho trang /gioi-thieu
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * - LEFT: photo with two rows of pill "tag" buttons overlaid at the
 *   bottom, each row auto-scrolling as an infinite marquee (opposite
 *   directions) for a lively, modern feel. The photo itself has a slow,
 *   continuous Ken-Burns zoom. On first scroll-into-view the whole image
 *   block eases in from the LEFT over 5s.
 * - RIGHT: eyebrow label, two-line heading (second line highlighted),
 *   subheading, a two-column checklist, and a CTA button. The text block
 *   eases in from the RIGHT over 5s; the button then rises up from
 *   below shortly after.
 *
 * Palette:
 *   Yellow      #FFFACD
 *   Dark green  #006400
 *   Light blue  #87CEFA
 */

const FONT_IMPORT = `
@keyframes kbZoom {
  0%   { transform: scale(1); }
  100% { transform: scale(1.12); }
}
@keyframes marqueeLeft {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marqueeRight {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
.kb-zoom { animation: kbZoom 16s ease-in-out infinite alternate; }
.marquee-left { animation: marqueeLeft 22s linear infinite; }
.marquee-right { animation: marqueeRight 26s linear infinite; }
`;

const ACCENT = "#87cefa";

const TAGS_ROW_1 = ["GPS", "PHÂN TÍCH DỮ LIỆU", "CẢM BIẾN", "IOT", "CÔNG NGHỆ"];
const TAGS_ROW_2 = ["THU HOẠCH", "ĐỘ ẨM ĐẤT", "ROBOT & TỰ ĐỘNG HÓA", "GIÁM SÁT MÙA VỤ"];

const CHECKLIST = [
  ["Giải pháp canh tác thông minh", "Công cụ dự báo thời tiết"],
  ["Nông nghiệp chính xác", "Tăng lợi nhuận canh tác"],
  ["Hướng đến bền vững", "Giảm phát thải carbon"],
  ["Giám sát sức khỏe cây trồng", "Tư vấn chuyên gia 1:1"],
];

export default function SmartFarmingShowcase() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <style>{FONT_IMPORT}</style>

      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-5">
        {/* LEFT: image with Ken-Burns zoom + marquee tag pills, eases in from the left over 5s */}
        <div
          className="mx-auto w-full max-w-[650px]"
          style={{
            transition: inView
              ? "transform 5000ms cubic-bezier(0.16,1,0.3,1), opacity 5000ms ease-out"
              : "none",
            transform: inView ? "translateX(0)" : "translateX(-160px)",
            opacity: inView ? 1 : 0,
          }}
        >
          <div className="relative w-full overflow-hidden">
            <img
              src="/images/UNIFARM/1787218973789_1582751505492234802_4935324150679931320_ae20e008b6b700cead007d04eae29597.jpg"
              alt="Ứng dụng công nghệ cao trong nông nghiệp"
              className="kb-zoom h-[360px] w-full object-cover sm:h-[460px] lg:h-[620px]"
            />
            {/* soft bottom gradient so pills stay legible */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

            {/* tag pills — two auto-scrolling marquee rows, opposite directions */}
            <div className="absolute inset-x-4 bottom-4 space-y-2 overflow-hidden sm:inset-x-5 sm:bottom-5">
              <div className="overflow-hidden">
                <div className="marquee-left flex w-max gap-2.5">
                  {[...TAGS_ROW_1, ...TAGS_ROW_1].map((tag, i) => (
                    <span
                      key={i}
                      className="shrink-0 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-xs font-semibold tracking-wide text-gray-800 shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="marquee-right flex w-max gap-2.5">
                  {[...TAGS_ROW_2, ...TAGS_ROW_2].map((tag, i) => (
                    <span
                      key={i}
                      className="shrink-0 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-xs font-semibold tracking-wide text-[#006400] shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: heading / subheading / checklist ease in from the right over 5s;
            the button rises up from below shortly after */}
        <div
          className="lg:max-w-[660px] lg:justify-self-center"
          style={{
            transition: inView
              ? "transform 5000ms cubic-bezier(0.16,1,0.3,1), opacity 5000ms ease-out"
              : "none",
            transform: inView ? "translateX(0)" : "translateX(160px)",
            opacity: inView ? 1 : 0,
          }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#87CEFA]">
            Vì sao chọn chúng tôi
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.01em] text-gray-900 font-display sm:text-4xl lg:text-[42px]">
            Giải Pháp Thông Minh
            <br />
            Cho <span className="text-[#006400]">Nông Nghiệp Hiện Đại</span>
          </h2>

          <p className="mt-5 text-justify text-[15px] leading-relaxed text-gray-500">
            Chúng tôi kết hợp công nghệ tiên tiến với kinh nghiệm nông nghiệp
            chuyên sâu để giúp nông dân tối ưu năng suất và giảm chi phí. Các
            công cụ thân thiện, dễ dùng mang lại dữ liệu chính xác, hỗ trợ ra
            quyết định thông minh cho một tương lai bền vững.
          </p>

          <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {CHECKLIST.map((pair, row) =>
              pair.map((item, col) => (
                <li key={`${row}-${col}`} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006400]">
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </li>
              ))
            )}
          </ul>

          <div
            className="mt-9"
            style={{
              transition: inView
                ? "transform 900ms cubic-bezier(0.16,1,0.3,1) 600ms, opacity 900ms ease-out 600ms"
                : "none",
              transform: inView ? "translateY(0)" : "translateY(40px)",
              opacity: inView ? 1 : 0,
            }}
          >
            <button className="group inline-flex items-center gap-4">
              <span
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md ring-4 ring-[#87cefa]/15 transition-all duration-300 group-hover:ring-[#87cefa]/30"
                style={{ backgroundColor: ACCENT }}
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="text-sm font-semibold tracking-wide text-gray-800 font-display transition-colors duration-300 group-hover:text-[#006400]">
                Khám Phá Sứ Mệnh
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
