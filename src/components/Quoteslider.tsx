"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * QuoteSlider — "Những câu nói về nông nghiệp công nghệ cao"
 * -----------------------------------------------------------------
 * - Ảnh nền full-bleed, hiệu ứng Ken Burns (zoom chậm dần lớn ra) chạy
 *   suốt thời lượng mỗi slide rồi reset khi slide kế tiếp lên hình.
 * - Tự động chuyển slide theo vòng lặp vô hạn (slide cuối quay lại slide
 *   đầu), có thanh tiến trình (progress bar) thay cho chấm tròn thường —
 *   cho thấy rõ thời điểm chuyển slide tiếp theo, giống Instagram Story.
 * - Palette: nền phủ gradient xanh lá đậm (#006400) → đen để chữ luôn
 *   rõ trên mọi ảnh, dấu ngoặc kép & thanh tiến trình dùng xanh dương
 *   nhạt (#87cefa) làm điểm nhấn "công nghệ", eyebrow + tên dùng vàng
 *   nhạt (#fffacd) làm điểm nhấn ấm.
 * -----------------------------------------------------------------
 * THAY ẢNH THẬT: các URL trong mảng SLIDES bên dưới đang dùng ảnh
 * placeholder (picsum.photos) — thay bằng ảnh nông trại công nghệ cao
 * thật của bạn trước khi lên production.
 */

type Slide = {
  image: string;
  quote: string;
  author: string;
  articleTitle: string;
  link: string;
};

// LƯU Ý: slide 1, 3, 6 dùng link bài viết thật (tìm thấy trên
// nongnghiepmoitruong.vn, trùng khớp tiêu đề). Slide 2, 4, 5 vẫn tạm trỏ về
// "#" — cần đường link bài viết thật cho 3 bài còn lại để thay vào.
const SLIDES: Slide[] = [
  {
    image: "/images/UNIFARM/2.jpg",
    quote:
      "Nếu có thể góp sức để nâng tầm nông nghiệp và đem lại cuộc sống tốt đẹp hơn cho người nông dân Việt Nam, tôi sẽ không bao giờ ngần ngại.",
    author: "Phạm Quốc Liêm",
    articleTitle: "Ước mơ thuở thiếu thời đến trăn trở nông nghiệp, nông dân",
    link: "https://nongnghiepmoitruong.vn/tri-thuc-nong-dan/doanh-nhan-pham-quoc-liem-uoc-mo-thuo-thieu-thoi-den-tran-tro-nong-nghiep-nong-dan-d375269.html",
  },
  {
    image: "/images/UNIFARM/1787218973806_1582751505492234802_4935324150679931320_d6fbae39f7d85301ab39d1b72b8fdb82.jpg",
    quote:
      "Cùng nhau, chúng ta phải định hướng sản xuất hàng hóa có chất lượng tốt nhất trong ngành của mình, đồng thời cam kết hợp tác lâu dài, ổn định, chân thành với đối tác và khách hàng.",
    author: "Phạm Quốc Liêm",
    articleTitle: "Chuẩn duy nhất, chuẩn cao nhất",
    link: "#",
  },
  {
    image: "/images/banana-leaf-drops.jpg",
    quote:
      "Khi người nông dân có thu nhập tốt hơn, doanh nghiệp có năng lực cạnh tranh cao hơn, người tiêu dùng được sử dụng những sản phẩm an toàn hơn và môi trường được bảo vệ tốt hơn, đó mới là thành công thực sự của nông nghiệp.",
    author: "Phạm Quốc Liêm",
    articleTitle: "Từ câu chuyện ngành chuối, nghĩ về tương lai nông nghiệp Việt Nam",
    link: "https://nongnghiepmoitruong.vn/tri-thuc-nong-dan/tu-cau-chuyen-nganh-chuoi-nghi-ve-tuong-lai-nong-nghiep-viet-nam-d817450.html",
  },
  {
    image: "/images/banana/banana-plantation-aerial.jpg",
    quote:
      "Ở đâu có thách thức, ở đó có cơ hội. Chìa khóa trong trường hợp này có tên 'liên kết'. Việt Nam cần xây dựng cho bằng được những liên kết bền vững giữa các doanh nghiệp có vùng trồng và thị trường lớn với hàng trăm nghìn nông hộ có diện tích nhỏ.",
    author: "Phạm Quốc Liêm",
    articleTitle: "Chuyện chất lượng sầu riêng – Lo gần nhưng phải liệu xa",
    link: "#",
  },
  {
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/vuon1.jpg",
    quote:
      "Sự cải tiến, sáng tạo, thay đổi phải không được có điểm dừng, đồng thời, phải luôn nhìn nhận bằng thái độ tỉnh thức. Chúng ta luôn sẵn sàng 'bước qua mùa đông để đón nắng xuân'.",
    author: "Phạm Quốc Liêm",
    articleTitle: "Bước qua mùa đông để đón nắng xuân",
    link: "#",
  },
  {
    image: "/images/UNIFARM/nha-kinh.jpg",
    quote:
      "Làm nông nghiệp là yêu Đất - Nước, như để nhắc nhở cho từng con người của chúng tôi về việc phải giữ Đất, Nước như tài nguyên và mạch sống, giữ niềm tự hào Việt Nam, cũng như phải giữ được tinh thần sẻ chia và phụng sự, vì con người và môi trường sống.",
    author: "Phạm Quốc Liêm",
    articleTitle: "Làm nông nghiệp là yêu Đất Nước",
    link: "https://nongnghiepmoitruong.vn/lam-nong-nghiep-la-yeu-dat-nuoc-d798204.html",
  },
];

const SLIDE_DURATION = 6000; // ms mỗi slide hiển thị

export default function QuoteSlider() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  return (
<section className="relative isolate min-h-[460px] w-full overflow-hidden bg-black sm:min-h-[540px] lg:min-h-[590px]">
        <style>{`
        @keyframes qs-kenburns {
          0%   { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes qs-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes qs-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background layers — one per slide, cross-fade via opacity */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <div
            key={i === index ? `active-${index}` : `idle-${i}`}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url(${s.image})`,
              animation:
                i === index
                  ? `qs-kenburns ${SLIDE_DURATION + 1400}ms ease-out forwards`
                  : "none",
            }}
          />
          {/* Brand-toned overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00230f]/90 via-[#00230f]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 mx-auto flex h-full max-w-[1500px] flex-col justify-center px-5 py-14 sm:px-8 sm:py-16 lg:px-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#87cefa] sm:text-sm">
          {t("Nghĩ Về Nghề Nông")}
        </p>

        {/* Quote mark */}
        <svg
          viewBox="0 0 48 32"
          className="mb-5 h-10 w-10 text-[#87cefa]/70 sm:h-12 sm:w-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="M2 20c0-8 5-13 12-15M2 20c0 6 3 10 9 10M20 20c0-8 5-13 12-15M20 20c0 6 3 10 9 10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div key={index} style={{ animation: "qs-fadeup 700ms ease-out both" }}>
          <blockquote className="max-w-3xl text-3xl font-extrabold leading-snug text-white sm:text-2xl sm:leading-tight lg:text-[32px] lg:leading-tight">
            {t(SLIDES[index].quote)}
          </blockquote>

          <div className="max-w-3xl flex justify-end">
            <svg
              viewBox="0 0 48 32"
              className="mt-2 h-8 w-8 rotate-180 text-[#87cefa]/70 sm:h-10 sm:w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M2 20c0-8 5-13 12-15M2 20c0 6 3 10 9 10M20 20c0-8 5-13 12-15M20 20c0 6 3 10 9 10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-[#87cefa]" />
            <p className="text-sm font-bold uppercase tracking-wider text-[#fffacd] sm:text-base">
              {t(SLIDES[index].author)}
            </p>
          </div>

          <a
            href={SLIDES[index].link}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2.5 inline-flex max-w-3xl items-center gap-1.5 pl-[22px] text-sm text-white/70 transition-colors hover:text-white"
          >
            <span className="italic">{t(SLIDES[index].articleTitle)}</span>
            <span className="font-semibold text-[#87cefa] transition-transform group-hover:translate-x-1">
              {t("Đọc bài viết →")}
            </span>
          </a>
        </div>

        {/* Progress dots */}
        <div className="mt-10 flex items-center gap-2.5 sm:mt-14">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${t("Đi tới slide")} ${i + 1}`}
              aria-current={i === index}
              className="relative h-1.5 w-9 overflow-hidden rounded-full bg-white/25 transition-colors hover:bg-white/40 sm:w-12"
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[#87cefa]"
                style={
                  i === index
                    ? {
                        animation: `qs-progress ${SLIDE_DURATION}ms linear forwards`,
                      }
                    : i < index
                    ? { width: "100%" }
                    : { width: "0%" }
                }
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}