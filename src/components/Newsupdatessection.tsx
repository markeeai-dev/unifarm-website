/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/use-is-mobile";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
    image: "/images/UNIFARM/1787197933802_1582751505492234802_4935324150679931320_5e69f078e10587e5c3411b75ace4006b.jpg",
    day: "21",
    monthYear: "05, 2026",
    title: "Góc Nhìn của Tổng giám đốc Unifarm: Ngành Chuối Việt Nam Và Giấc Mơ Chuỗi Giá Trị Tỷ Đô",
    excerpt:
      "Cạnh tranh nông nghiệp hiện đại không chỉ nằm ở diện tích lớn hơn, mà phải đến từ năng lực quản trị dữ liệu, giống tốt hơn và một tiêu chuẩn chất lượng cao nhất cho mọi thị trường.",
    link: "https://nongnghiepmoitruong.vn/tri-thuc-nong-dan/doanh-nhan-pham-quoc-liem-uoc-mo-thuo-thieu-thoi-den-tran-tro-nong-nghiep-nong-dan-d375269.html",
  },
  {
    image:
      "/images/UNIFARM/UNIFARM/hinh-chinh/736A9959.jpg",
    day: "02",
    monthYear: "06, 2026",
    title: "Kiểm Soát Sức Khỏe Bộ Rễ Và Giải Pháp Giảm Phụ Thuộc Hóa Chất",
    excerpt:
      "Quan sát và thử nghiệm đối chứng quy trình sinh học IPM tại nông trường: Nuôi dưỡng thổ nhưỡng, phục hồi hệ vi sinh bản địa để phòng ngừa dịch hại từ gốc rễ.",
    link: "https://baodautu.vn/doanh-nhan-pham-quoc-liem-chu-tich-unifarm-chon-su-hai-long-cua-nong-dan-nguoi-tieu-dung-d242739.html",
  },
  {
    image:
      "/images/UNIFARM/UNIFARM/hinh-chinh/images3.jpg",
    day: "17",
    monthYear: "08, 2026",
    title: "Người Hạnh Phúc Và Cây Hạnh Phúc: Triết Lý Vun Bồi Từ Gốc Rễ Con Người",
    excerpt:
      "Cây chỉ thực sự khỏe mạnh và cho trái ngọt khi người làm nông hiểu đất, yêu nghề và tìm thấy niềm hạnh phúc từ việc chăm sóc từng mầm sống; muốn nâng tầm nông nghiệp, trước hết phải vun bồi hạnh phúc và tri thức cho người gieo trồng.",
    link: "https://nongnghiepmoitruong.vn/thay-toi-voi-cau-chuyen-nguoi-hanh-phuc-va-cay-hanh-phuc-d342254.html",
  },
];

export default function NewsUpdatesSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const isMobile = useIsMobile();
  // 4500ms là hiệu ứng chậm rãi cho desktop; trên mobile người dùng lướt
  // nhanh nên rút ngắn để nội dung hiện trọn vẹn sớm hơn, tránh cảm giác
  // "mờ, chưa hiện hẳn" khi vừa cuộn tới.
  const revealMs = isMobile ? 700 : 4500;

useEffect(() => {
  const el = sectionRef.current;
  if (!el) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        // Trên mobile, ngắt quan sát ngay khi vào khung hình lần đầu —
        // tránh observer bắn lại "false" giữa lúc transition 4.5s đang
        // chạy (do thay đổi chiều cao viewport khi thanh địa chỉ ẩn/hiện
        // lúc cuộn), gây hiệu ứng kẹt ở opacity thấp không bao giờ hiện
        // trọn vẹn. Desktop giữ nguyên hành vi lặp lại khi cuộn qua lại.
        if (isMobile) observer.disconnect();
      } else if (!isMobile) {
        setInView(false);
      }
    },
    {
      threshold: 0.15,
    }
  );

  observer.observe(el);

  return () => observer.disconnect();
}, [isMobile]);

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
          text-4xl
          font-extrabold
          leading-[1.15]
          tracking-[-0.03em]
          text-[#006400]
          sm:text-5xl
          lg:text-[48px]
        "
        style={{
          transition: `transform ${revealMs}ms cubic-bezier(0.16,1,0.3,1), opacity ${revealMs}ms ease-out`,
          transform: inView
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.96)",
          opacity: inView ? 1 : 0,
        }}
      >
        {t("Unifarm – Tri Thức Từ Đồng Ruộng")}
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
                    transform ${revealMs}ms cubic-bezier(0.16,1,0.3,1),
                    opacity ${revealMs}ms ease-out
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
                      transform ${revealMs}ms cubic-bezier(0.16,1,0.3,1),
                      opacity ${revealMs}ms ease-out
                    `
                    : "none",
                  transitionDelay: inView
                    ? `${i * 180}ms`
                    : "0ms",
                }}
              >
                <img
                  src={a.image}
                  alt={t(a.title)}
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
                  transition: `opacity ${revealMs}ms ease-out, transform ${revealMs}ms cubic-bezier(0.16,1,0.3,1)`,
                  transitionDelay: inView
                    ? `${isMobile ? 150 + i * 80 : 900 + i * 250}ms`
                    : "0ms",
                }}
              >

                {/* ================= DATE ================= */}
                <div className="w-[20%] shrink-0 lg:translate-x-7">
                  <p className="text-5xl font-extrabold leading-none text-gray-900">
                    {a.day}
                  </p>

                  <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
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
                      text-[19px]
                      font-semibold
                      leading-[1.45]
                      tracking-normal
                      text-gray-900
                      sm:text-[21px]
                    "
                  >
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-300 hover:text-[#006400]"
                    >
                      {t(a.title)}
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
                      sm:text-[18px]
                    "
                  >
                    {t(a.excerpt)}
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
                      {t("Xem thêm")}
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