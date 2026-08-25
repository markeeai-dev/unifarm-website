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
    title: "Doanh Nhân Phạm Quốc Liêm: Ước Mơ Thuở Thiếu Thời Đến Trăn Trở Nông Nghiệp, Nông Dân",
    excerpt:
      "Hành trình từ ước mơ thuở thiếu thời đến khát vọng xây dựng nền nông nghiệp công nghệ cao vì lợi ích thiết thực của người nông dân Việt Nam...",
    link: "https://nongnghiepmoitruong.vn/tri-thuc-nong-dan/doanh-nhan-pham-quoc-liem-uoc-mo-thuo-thieu-thoi-den-tran-tro-nong-nghiep-nong-dan-d375269.html",
  },
  {
    image:
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&w=800&q=80",
    day: "27",
    monthYear: "02, 2026",
    title: "Doanh Nhân Phạm Quốc Liêm, Chủ Tịch Unifarm: Chọn Sự Hài Lòng Của Nông Dân, Người Tiêu Dùng",
    excerpt:
      "16 năm hành trình Unifarm, từ dưa lưới công nghệ Israel đến vùng chuyên canh chuối xuất khẩu — luôn đặt chất lượng lên hàng đầu...",
    link: "https://baodautu.vn/doanh-nhan-pham-quoc-liem-chu-tich-unifarm-chon-su-hai-long-cua-nong-dan-nguoi-tieu-dung-d242739.html",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80",
    day: "27",
    monthYear: "02, 2026",
    title: "Hợp Tác Chiến Lược Giữa Trường Đại Học Thủ Dầu Một Và Unifarm Hướng Tới Nông Nghiệp Công Nghệ Cao",
    excerpt:
      "Hai bên ký kết hợp tác chiến lược về đào tạo nhân lực, nghiên cứu phát triển sản phẩm và bảo quản sau thu hoạch đạt chuẩn an toàn thực phẩm...",
    link: "https://tdmu.edu.vn/tin-tuc/hop-tac-doi-ngoai-1/hop-tac-chien-luoc-giua-truong-dai-hoc-thu-dau-mot-va-unifarm-huong-toi-nong-nghiep-cong-nghe-cao",
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
      setInView(entry.isIntersecting);
    },
    {
      threshold: 0.15,
    }
  );

  observer.observe(el);

  return () => observer.disconnect();
}, []);

  return (
  <section
    ref={sectionRef}
    className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
  >
    <style>{FONT_IMPORT}</style>

    <div className="mx-auto w-full max-w-[1500px]">

      {/* ================= HEADING ================= */}
      <h2
        className="uppercase 
          text-3xl
          font-extrabold
          leading-[1.15]
          tracking-[-0.03em]
          text-[#006400]
          sm:text-4xl
          lg:text-[42px]
        "
        style={{
          transition:
            "transform 4500ms cubic-bezier(0.16,1,0.3,1), opacity 4500ms ease-out",
          transform: inView
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.96)",
          opacity: inView ? 1 : 0,
        }}
      >
        Unifarm – Tri Thức Từ Đồng Ruộng
      </h2>

      {/* ================= CARDS ================= */}
      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {ARTICLES.map((a, i) => {
          /*
           * CARD 1: 108% -> 100%, đi xuống
           * CARD 2: 72%  -> 100%, đi lên
           * CARD 3: 108% -> 100%, đi xuống
           */
          const initialScale = i === 1 ? 0.72 : 1.08;
          const initialY = i === 1 ? -70 : 70;

          return (
            <article
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateY(0) scale(1)"
                  : `translateY(${initialY}px) scale(${initialScale})`,
                transition: inView
                  ? `
                    transform 4500ms cubic-bezier(0.16,1,0.3,1),
                    opacity 4500ms ease-out
                  `
                  : `
                    transform 0ms,
                    opacity 0ms
                  `,
                transitionDelay: inView
                  ? `${i * 180}ms`
                  : "0ms",
                willChange: "transform, opacity",
              }}
            >

              {/* ================= ẢNH ================= */}
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden shadow-lg"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? "scale(1)"
                    : `scale(${initialScale})`,
                  transition: inView
                    ? `
                      transform 4500ms cubic-bezier(0.16,1,0.3,1),
                      opacity 4500ms ease-out
                    `
                    : "none",
                  transitionDelay: inView
                    ? `${i * 180}ms`
                    : "0ms",
                }}
              >
                <img
                  src={a.image}
                  alt={a.title}
                  className="kb-zoom-alt h-[240px] w-full object-cover sm:h-[300px]"
                />
              </a>

              {/* =====================================================
                  TOÀN BỘ PHẦN DATE + TITLE + EXCERPT + BUTTON
                  ===================================================== */}
              <div
                className="mt-12 flex gap-1.5 sm:mt-10"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? "translateY(0)"
                    : "translateY(70px)",
                  transition:
                    "opacity 4500ms ease-out, transform 4500ms cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: inView
                    ? `${900 + i * 250}ms`
                    : "0ms",
                }}
              >

                {/* ================= DATE ================= */}
                <div className="w-[20%] shrink-0 translate-x-7">
                  <p className="text-5xl font-extrabold leading-none text-gray-900">
                    {a.day}
                  </p>

                  <p className="mt-1 text-xs font-medium text-gray-500">
                    {a.monthYear}
                  </p>
                </div>

                {/* ================= DIVIDER ================= */}
                <div className="w-px shrink-0 bg-black" />

                {/* ================= CONTENT ================= */}
                <div className="min-w-0 flex-1 gap-1.5 sm:ml-5">

                  {/* TITLE */}
                  <h3
                    className="uppercase
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
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-300 hover:text-[#006400]"
                    >
                      {a.title}
                    </a>
                  </h3>

                  {/* EXCERPT */}
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

                  {/* BUTTON */}
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-3"
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-white
                        shadow-md
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                      style={{
                        backgroundColor: ACCENT,
                      }}
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

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-gray-800
                        transition-colors
                        duration-300
                        group-hover:text-[#006400]
                      "
                    >
                      Xem thêm
                    </span>
                  </a>

                </div>
              </div>

            </article>
          );
        })}
      </div>
    </div>
  </section>
);
}