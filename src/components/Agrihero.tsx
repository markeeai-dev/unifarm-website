'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

type SlotImage = {
  id: string;
  src: string;
  alt: string;
};

// Thay các src bên dưới bằng ảnh thật của bạn (đặt trong /public/images/...)
const INITIAL_SLOTS: SlotImage[] = [
  {
    id: 'main',
    src: '/images/UNIFARM/UNIFARM/hinh-chinh/nong-dan.jpg',
    alt: 'Nhà kính công nghệ cao trồng rau thủy canh',
  },
  {
    id: 'sprout',
    src: '/images/UNIFARM/UNIFARM/peggy_marco-banana-2058196_1920.jpg',
    alt: 'Drone ứng dụng công nghệ cao trong canh tác',
  },
  {
    id: 'harvest',
    src: '/images/UNIFARM/UNIFARM/hinh-chinh/vuon3.jpg',
    alt: 'Vùng trồng nông nghiệp công nghệ cao nhìn từ trên cao',
  },
];

/** Kích hoạt hiệu ứng khi phần tử cuộn vào khung nhìn (chỉ 1 lần). */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Ngắt quan sát ngay khi bắt được lần "đã vào khung hình" đầu tiên —
    // trước đây observer vẫn tiếp tục sống và có thể bắn lại "false" giữa
    // lúc chính hiệu ứng scale/opacity của phần tử đang chạy (kích thước
    // đổi liên tục trong 1-3s), tạo vòng lặp phản hồi khiến nội dung vừa
    // hiện ra lại bị ẩn đi trên một số màn hình hẹp. Chỉ nghe 1 lần đúng
    // như tên hàm mô tả loại bỏ hẳn vòng lặp đó.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

export default function AgricultureHero() {
  const [slots, setSlots] = useState<SlotImage[]>(INITIAL_SLOTS);
  const [mediaRef, mediaInView] = useInView<HTMLDivElement>(0.2);
  const [contentRef, contentInView] = useInView<HTMLDivElement>(0.2);
  const { t } = useLanguage();

  const handleSwap = useCallback((index: number) => {
    if (index === 0) return;
    setSlots((prev) => {
      const next = [...prev];
      [next[0], next[index]] = [next[index], next[0]];
      return next;
    });
  }, []);

  return (
    <section className="agrihero-section">
      <div className="agrihero-blob-yellow" aria-hidden="true" />
      <div className="agrihero-blob-blue" aria-hidden="true" />

      <div className="agrihero-grid">
        {/* CỘT TRÁI — cụm ảnh tròn */}
        <div ref={mediaRef} className="agrihero-media-col" data-inview={mediaInView}>
          <div className="agrihero-media-cluster">
            <div className="agrihero-ring-decor" aria-hidden="true" />

            <div className="agrihero-main-circle">
              <div className="agrihero-main-img-wrap">
                <Image
                  key={slots[0].id}
                  src={slots[0].src}
                  alt={t(slots[0].alt)}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 460px"
                  className="agrihero-main-img"
                  priority
                />
              </div>
            </div>

            <button
              type="button"
              className="agrihero-small-circle-top"
              data-inview={mediaInView}
              onClick={() => handleSwap(1)}
              aria-label={`Xem ảnh lớn: ${t(slots[1].alt)}`}
            >
              <Image
                key={slots[1].id}
                src={slots[1].src}
                alt={t(slots[1].alt)}
                fill
                sizes="140px"
                className="agrihero-small-img"
              />
            </button>

            <button
              type="button"
              className="agrihero-small-circle-bottom"
              data-inview={mediaInView}
              onClick={() => handleSwap(2)}
              aria-label={`Xem ảnh lớn: ${t(slots[2].alt)}`}
            >
              <Image
                key={slots[2].id}
                src={slots[2].src}
                alt={t(slots[2].alt)}
                fill
                sizes="140px"
                className="agrihero-small-img"
              />
            </button>
          </div>
        </div>

        {/* CỘT PHẢI — nội dung */}
        <div ref={contentRef} className="agrihero-content-col" data-inview={contentInView}>
          <span className="agrihero-eyebrow">{t("Triết lý Unifarm")}</span>

          <h2 className="agrihero-heading uppercase">{t("Làm nông nghiệp là yêu Đất – Nước")}</h2>

          <p className="agrihero-paragraph agrihero-quote">
            {t("“Nhiều năm qua, trước lối vào văn phòng của Unifarm luôn có một câu phương châm: ‘Làm nông nghiệp là yêu Đất - Nước’, như để nhắc nhở cho từng con người của chúng tôi về việc phải giữ Đất, Nước như tài nguyên và mạch sống, giữ niềm tự hào Việt Nam, cũng như phải giữ được tinh thần sẻ chia và phụng sự, vì con người và môi trường sống. Với tôi, đó chính là yêu Đất Nước.”")}
          </p>

          <div className="agrihero-attribution">
            <span className="agrihero-attribution-name">{t("Phạm Quốc Liêm")}</span>
            <a
              href="https://nongnghiepmoitruong.vn/lam-nong-nghiep-la-yeu-dat-nuoc-d798204.html"
              target="_blank"
              rel="noopener noreferrer"
              className="agrihero-article-btn"
            >
              {t("Đọc bài “Làm nông nghiệp là yêu Đất Nước”")}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Style thường (không dùng styled-jsx) — Turbopack ở bản Next.js hiện tại không luôn
          server-render đúng CSS của styled-jsx (kể cả bản scoped), khiến hiệu ứng xuất hiện
          lúc cuộn không hoạt động cho tới khi JS tải xong. Style thuần đảm bảo CSS luôn có
          mặt ngay trong HTML đầu tiên. Toàn bộ class được đặt tiền tố agrihero- để không
          trùng với các component khác trên cùng trang. */}
      <style>{`
        .agrihero-section {
          /* ---- Design tokens (theo yêu cầu) ---- */
          --agrihero-yellow-pale: #fffacd;
          --agrihero-yellow-deep: #87cefa;
          --agrihero-green-deep: #006400;
          --agrihero-green-ink: #123318;
          --agrihero-blue-light: #87cefa;
          --agrihero-cream: #fcfaf2;

          position: relative;
          overflow: hidden;
          padding: 96px 40px;
          font-family: var(--font-sans), system-ui, sans-serif;
          color: var(--agrihero-green-ink);
        }

        /* ---------- Khối trang trí nền ---------- */
        .agrihero-blob-yellow,
        .agrihero-blob-blue {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          z-index: 0;
          pointer-events: none;
        }
        .agrihero-blob-yellow {
          width: 520px;
          height: 520px;
          opacity: 0.75;
          top: -140px;
          left: -180px;
        }
        .agrihero-blob-blue {
          width: 380px;
          height: 380px;
          opacity: 0.3;
          bottom: -120px;
          right: -140px;
        }

        /* ---------- Bố cục (kích thước theo px, có breakpoint riêng) ---------- */
        .agrihero-grid {
          position: relative;
          z-index: 1;
          width: 1500px;
          max-width: 100%;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .agrihero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
            justify-items: center;
            text-align: center;
          }
        }

        /* ================= CỘT TRÁI: cụm ảnh tròn — trượt vào từ bên trái ================= */
        .agrihero-media-col {
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: scale(0.2);
          transform-origin: center center;
          transition:
            opacity 4s cubic-bezier(0.16, 0.8, 0.24, 1),
            transform 4s cubic-bezier(0.16, 0.8, 0.24, 1);
        }
        .agrihero-media-col[data-inview='true'] {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .agrihero-media-cluster {
          position: relative;
          width: 540px;
          height: 540px;
        }

        @media (max-width: 1024px) {
          .agrihero-media-cluster {
            width: 380px;
            height: 380px;
          }
        }
        @media (max-width: 640px) {
          .agrihero-media-cluster {
            width: 300px;
            height: 300px;
          }
        }
        @media (max-width: 400px) {
          .agrihero-media-cluster {
            width: 250px;
            height: 250px;
          }
        }

        /* vòng chấm gạch xoay chậm phía sau ảnh chính */
        .agrihero-ring-decor {
          position: absolute;
          top: -12px;
          left: -13px;
          width: calc(90% + 36px);
          height: calc(90% + 36px);
          border-radius: 50%;
          border: 2px dashed var(--agrihero-yellow-deep);
          opacity: 0.85;
          animation: agrihero-slow-spin 60s linear infinite;
        }
        @keyframes agrihero-slow-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .agrihero-main-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 92%;
          height: 92%;
          border-radius: 50%;
          overflow: hidden;
          background: var(--agrihero-yellow-pale);
          box-shadow: 0 34px 60px -22px rgba(0, 60, 20, 0.4);
        }

        /* wrapper này đảm nhiệm hiệu ứng "zoom từ từ" khi cuộn tới — kéo dài ~3s */
        .agrihero-main-img-wrap {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.15);
          transition:
            opacity 2s ease 0.6s,
            transform 3s cubic-bezier(0.16, 0.8, 0.24, 1) 0.6s;
        }
        .agrihero-media-col[data-inview='true'] .agrihero-main-img-wrap {
          opacity: 1;
          transform: scale(1);
        }

        /* img thật đảm nhiệm hiệu ứng zoom khi hover + hiệu ứng "bật vào thay thế" mỗi khi
           swap ảnh (key thay đổi -> element remount -> animation chạy lại từ đầu) */
        .agrihero-main-img {
          object-fit: cover;
          transform: scale(1);
          transition: transform 0.7s cubic-bezier(0.22, 0.9, 0.3, 1);
          animation: agrihero-main-pop-in 0.6s cubic-bezier(0.2, 0.8, 0.3, 1) both;
        }
        .agrihero-main-circle:hover .agrihero-main-img {
          transform: scale(1.1);
        }
        @keyframes agrihero-main-pop-in {
          from {
            opacity: 0;
            transform: scale(1.16);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* 2 ảnh tròn nhỏ: 1 ở trên-trái, 1 ở bên phải ảnh tròn to */
        .agrihero-small-circle-top,
        .agrihero-small-circle-bottom {
          position: absolute;
          width: 32%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #fff;
          padding: 0;
          background: none;
          cursor: pointer;
          box-shadow: 0 16px 32px -12px rgba(0, 40, 10, 0.4);

          opacity: 0;
          transform: scale(0.2);

          transition:
            opacity 2s cubic-bezier(0.16, 0.8, 0.24, 1),
            transform 3s cubic-bezier(0.16, 0.8, 0.24, 1),
            box-shadow 0.35s ease,
            filter 0.35s ease;
        }
        .agrihero-small-circle-top {
          --agrihero-enter-delay: 1.2s;
          top: -6%;
          left: -8%;
        }
        .agrihero-small-circle-bottom {
          --agrihero-enter-delay: 1.6s;
          top: 66%;
          right: 0%;
        }
        .agrihero-small-circle-top[data-inview='true'],
        .agrihero-small-circle-bottom[data-inview='true'] {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .agrihero-small-circle-top:hover,
        .agrihero-small-circle-top:focus-visible,
        .agrihero-small-circle-bottom:hover,
        .agrihero-small-circle-bottom:focus-visible {
          transform: scale(1.08) translateY(0);
          box-shadow: 0 20px 40px -10px rgba(0, 60, 20, 0.5);
        }
        .agrihero-small-circle-top:focus-visible,
        .agrihero-small-circle-bottom:focus-visible {
          outline: 3px solid var(--agrihero-blue-light);
          outline-offset: 3px;
        }

        .agrihero-small-img {
          object-fit: cover;
          transform: scale(1);
          transition: transform 0.5s ease;
          animation: agrihero-pop-in 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) both;
        }
        .agrihero-small-circle-top:hover .agrihero-small-img,
        .agrihero-small-circle-bottom:hover .agrihero-small-img {
          transform: scale(1.14);
        }

        @keyframes agrihero-pop-in {
          from {
            opacity: 0;
            transform: scale(0.86);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ================= CỘT PHẢI: nội dung — trượt vào từ bên phải, ~4.5s ================= */
        .agrihero-content-col {
          width: 100%;
          max-width: 560px;
          container-type: inline-size;
          opacity: 0;
          transform: translateX(60px);
          transition:
            opacity 3.5s cubic-bezier(0.16, 0.8, 0.24, 1),
            transform 3.5s cubic-bezier(0.16, 0.8, 0.24, 1);
        }
        .agrihero-content-col[data-inview='true'] {
          opacity: 1;
          transform: translateX(0);
        }

        .agrihero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--agrihero-green-deep);
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 1.5s ease, transform 1.5s ease;
        }
        .agrihero-content-col[data-inview='true'] .agrihero-eyebrow {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 2s;
        }
        .agrihero-eyebrow::before {
          content: '';
          width: 30px;
          height: 2px;
          background: var(--agrihero-yellow-deep);
          display: inline-block;
        }

        .agrihero-heading {
          font-weight: 800;
          font-size: clamp(0.95rem, 5.3cqw, 44px);
          white-space: nowrap;
          line-height: 1.18;
          margin: 0 0 20px;
          color: var(--agrihero-green-ink);
          opacity: 0;
          transform: translateY(16px);
          transition:
          opacity 1.3s ease,
          transform 1.3s cubic-bezier(0.16, 0.8, 0.24, 1);
        }
        .agrihero-content-col[data-inview='true'] .agrihero-heading {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 1.2s;
        }

        .agrihero-paragraph {
          font-size: 18px;
          line-height: 1.75;
          color: #3c4a3d;
          max-width: 48ch;
          text-align: justify;
          text-align-last: left;
          margin: 0 0 30px;
          opacity: 0;
          transform: translateY(16px);
          transition:
          opacity 1.2s ease,
          transform 1.2s cubic-bezier(0.16, 0.8, 0.24, 1);
        }
        .agrihero-content-col[data-inview='true'] .agrihero-paragraph {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 1.8s;
        }

        .agrihero-quote {
          font-style: italic;
        }

        .agrihero-attribution {
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transform: translateY(16px);
          transition:
          opacity 1s ease,
          transform 1s cubic-bezier(0.16, 0.8, 0.24, 1);
          transition-delay: 2.2s;
        }
        .agrihero-content-col[data-inview='true'] .agrihero-attribution {
          opacity: 1;
          transform: translateY(0);
        }
        .agrihero-attribution-name {
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.04em;
          color: var(--agrihero-green-deep);
        }
        .agrihero-article-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          padding: 12px 22px;
          border-radius: 999px;
          border: 2px solid var(--agrihero-green-deep);
          font-weight: 700;
          font-size: 14px;
          color: var(--agrihero-green-deep);
          width: fit-content;
          transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .agrihero-article-btn:hover {
          background: var(--agrihero-green-deep);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -12px rgba(0,100,0,0.5);
        }
        .agrihero-article-btn svg {
          transition: transform 0.3s ease;
        }
        .agrihero-article-btn:hover svg {
          transform: translateX(3px);
        }

        /* ---------- Responsive theo mốc px cố định ---------- */
        @media (max-width: 1024px) {
          .agrihero-content-col {
            max-width: 640px;
          }
          .agrihero-eyebrow {
            justify-content: center;
          }
          .agrihero-paragraph {
            text-align: left;
          }
          .agrihero-attribution {
            align-items: center;
          }
        }

        @media (max-width: 640px) {
          .agrihero-section {
            padding: 64px 20px;
          }
        }

        /* ---------- Tôn trọng người dùng giảm hiệu ứng chuyển động ---------- */
        @media (prefers-reduced-motion: reduce) {
          .agrihero-media-col,
          .agrihero-content-col,
          .agrihero-main-img-wrap,
          .agrihero-main-img,
          .agrihero-small-img,
          .agrihero-small-circle-top,
          .agrihero-small-circle-bottom,
          .agrihero-ring-decor,
          .agrihero-eyebrow,
          .agrihero-heading,
          .agrihero-paragraph,
          .agrihero-attribution {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
