/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NewsUpdatesSection
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * - "Tin tức & Cập nhật" heading fades in gently on scroll.
 * - 3 article cards: image on top with a slow, continuous zoom
 *   in/out loop; below, a left date column (~20% width), a vertical
 *   divider rule, then title / excerpt / "+ Xem thêm" button.
 * - Cards rise up from below and fade in, staggered one after another,
 *   each over ~4.5s, triggered once when scrolled into view.
 *
 * Palette:
 *   Yellow      #FFFACD
 *   Dark green  #006400
 *   Light blue  #87CEFA (also used for the round "+" button accent)
 */

const ACCENT = "#87cefa";

const FONT_IMPORT = `
@keyframes kbZoomAlt {
  0%   { transform: scale(1); }
  100% { transform: scale(1.14); }
}
.kb-zoom-alt { animation: kbZoomAlt 9s ease-in-out infinite alternate; }
`;

const ARTICLES = [
  {
    image: "/images/banana/banana-shrub-3289749.jpg",
    day: "27",
    monthYear: "02, 2026",
    title: "5 Lợi ích của chuối xanh có thể bạn chưa biết",
    excerpt:
      "Chuối xanh không chỉ là một thực phẩm dân dã quen thuộc mà còn mang lại...",
  },
  {
    image:
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&w=800&q=80",
    day: "27",
    monthYear: "02, 2026",
    title: "Lợi ích sức khoẻ của việc sử dụng nông sản sạch mỗi ngày",
    excerpt:
      "Khám phá những lợi ích nông sản sạch đối với sức khỏe như tăng đề kháng,...",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80",
    day: "27",
    monthYear: "02, 2026",
    title: "Xu hướng trái cây nhiệt đới giàu dinh dưỡng đang lên ngôi",
    excerpt:
      "Vì sao trái cây nhiệt đới như chuối xanh, xoài, đu đủ đang trở thành...",
  },
];

export default function NewsUpdatesSection() {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <style>{FONT_IMPORT}</style>

      <div className="mx-auto w-full max-w-[1500px]">
        {/* heading — gentle fade-in on scroll */}
        <h2
            className="
                font-display
                text-3xl
                font-extrabold
                leading-[1.15]
                tracking-[-0.03em]
                text-[#006400]
                sm:text-4xl
                lg:text-[42px]
            "
            style={{
                transition: "transform 900ms ease-out, opacity 900ms ease-out",
                transform: inView ? "translateY(0)" : "translateY(24px)",
                opacity: inView ? 1 : 0,
            }}
            >
            Tin tức &amp; Cập nhật
            </h2>

        {/* cards — rise up + fade in, staggered, ~4.5s each */}
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {ARTICLES.map((a, i) => (
            <article
              key={i}
              style={{
                transition: inView
                  ? `transform 4500ms cubic-bezier(0.16,1,0.3,1) ${i * 250}ms, opacity 4500ms ease-out ${
                      i * 250
                    }ms`
                  : "none",
                transform: inView ? "translateY(0)" : "translateY(70px)",
                opacity: inView ? 1 : 0,
              }}
            >
              {/* image with slow continuous zoom loop */}
              <div className="overflow-hidden shadow-lg">
                <img
                  src={a.image}
                  alt={a.title}
                  className="kb-zoom-alt h-[240px] w-full object-cover sm:h-[300px]"
                />
              </div>

              {/* content row: date (~20%) | divider | title / excerpt / button */}
              <div className="mt-12 flex gap-1.5 sm:mt-10">
                <div className="w-[20%] shrink-0 translate-x-7">
                  <p className="text-5xl font-extrabold leading-none text-gray-900 font-display">
                    {a.day}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    {a.monthYear}
                  </p>
                </div>

                <div className="w-px shrink-0 bg-black" />

                <div className="min-w-0 flex-1 gap-1.5 sm:ml-5">
                  <h3
                    className="
                        min-h-[50px]
                        line-clamp-2
                        text-[17px]
                        font-semibold
                        leading-[1.45]
                        tracking-normal
                        text-gray-900
                        sm:text-[18px]
                    "
                    >
                    {a.title}
                    </h3>
                  <p
                    className="
                        mt-3
                        line-clamp-2
                        text-[15px]
                        font-normal
                        leading-[1.6]
                        text-gray-500
                        sm:text-[16px]
                    "
                    >
                    {a.excerpt}
                    </p>

                  <button className="group mt-4 inline-flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-gray-800 transition-colors duration-300 group-hover:text-[#006400]">
                      Xem thêm
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}