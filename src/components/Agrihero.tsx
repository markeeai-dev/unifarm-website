'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type SlotImage = {
  id: string;
  src: string;
  alt: string;
};

// Thay các src bên dưới bằng ảnh thật của bạn (đặt trong /public/images/...)
const INITIAL_SLOTS: SlotImage[] = [
  {
    id: 'main',
    src: '/images/agrihero/farmer-tending-vegetables.jpg',
    alt: 'Người làm vườn đang chăm sóc luống rau hữu cơ',
  },
  {
    id: 'sprout',
    src: '/images/agrihero/seedling-sprout.jpg',
    alt: 'Mầm cây non nhú lên từ lớp đất tơi xốp',
  },
  {
    id: 'harvest',
    src: '/images/agrihero/harvest-hands.jpg',
    alt: 'Đôi tay đang thu hoạch rau củ hữu cơ',
  },
];

const CHECKLIST_ITEMS = [
  'Thực phẩm hữu cơ giàu vitamin tự nhiên',
  'Đáp ứng nhu cầu ăn sạch mỗi ngày',
  'Không chiếu xạ, không hoá chất bảo quản',
];

/** Kích hoạt hiệu ứng khi phần tử cuộn vào khung nhìn (chỉ 1 lần). */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" className="agrihero-check-bg" />
      <path
        d="M5 9.2l2.4 2.4L13 6"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StatRingProps = {
  percent: number;
  label: string;
  delay: number;
  inView: boolean;
  tone: 'green' | 'blue';
};

function StatRing({ percent, label, delay, inView, tone }: StatRingProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const timeout = window.setTimeout(() => {
      const duration = 1300;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * percent));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [inView, percent, delay]);

  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="agrihero-stat-ring"
      data-inview={inView}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="agrihero-stat-circle-wrap">
        <svg viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r={radius} className="agrihero-stat-track" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`agrihero-stat-progress ${tone === 'blue' ? 'agrihero-stat-progress-blue' : ''}`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="agrihero-stat-percent">{value}%</span>
      </div>
      <p className="agrihero-stat-label">{label}</p>
    </div>
  );
}

export default function AgricultureHero() {
  const [slots, setSlots] = useState<SlotImage[]>(INITIAL_SLOTS);
  const [mediaRef, mediaInView] = useInView<HTMLDivElement>(0.2);
  const [contentRef, contentInView] = useInView<HTMLDivElement>(0.2);

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
                  alt={slots[0].alt}
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
              aria-label={`Xem ảnh lớn: ${slots[1].alt}`}
            >
              <Image
                key={slots[1].id}
                src={slots[1].src}
                alt={slots[1].alt}
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
              aria-label={`Xem ảnh lớn: ${slots[2].alt}`}
            >
              <Image
                key={slots[2].id}
                src={slots[2].src}
                alt={slots[2].alt}
                fill
                sizes="140px"
                className="agrihero-small-img"
              />
            </button>
          </div>
        </div>

        {/* CỘT PHẢI — nội dung */}
        <div ref={contentRef} className="agrihero-content-col" data-inview={contentInView}>
          <span className="agrihero-eyebrow">Giới thiệu về chúng tôi</span>

          <h2 className="agrihero-heading">
            <span className="agrihero-accent-gold">Nông nghiệp &amp;</span> Sản phẩm hữu cơ
          </h2>

          <p className="agrihero-paragraph">
            Chúng tôi đồng hành cùng những người nông dân canh tác thuận tự nhiên, mang đến
            nguồn thực phẩm sạch, an toàn và giàu dinh dưỡng cho mọi gia đình, từ luống rau
            trong vườn đến bàn ăn của bạn.
          </p>

          {/* Danh sách check-mark và 2 vòng thống kê nằm cùng một hàng */}
          <div className="agrihero-bottom-row">
            <ul className="agrihero-checklist">
              {CHECKLIST_ITEMS.map((item, i) => (
                <li key={item} style={{ transitionDelay: `${450 + i * 120}ms` }}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="agrihero-stats">
              <StatRing
                percent={80}
                label={'Giải pháp\nhữu cơ'}
                delay={500}
                inView={contentInView}
                tone="green"
              />
              <StatRing
                percent={60}
                label={'Chất lượng\nnông sản'}
                delay={650}
                inView={contentInView}
                tone="blue"
              />
            </div>
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
          transform: translateX(-90px) scale(0.94);
          transition: opacity 4.5s cubic-bezier(0.16, 0.8, 0.24, 1),
            transform 4.5s cubic-bezier(0.16, 0.8, 0.24, 1);
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
          transform: scale(1.28);
          transition: opacity 1.4s ease 0.1s,
            transform 3s cubic-bezier(0.16, 0.8, 0.24, 1) 0.1s;
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
          transform: scale(0.7) translateY(14px);
          transition: opacity 0.9s ease var(--agrihero-enter-delay, 0.4s),
            transform 0.9s cubic-bezier(0.34, 1.4, 0.4, 1) var(--agrihero-enter-delay, 0.4s),
            box-shadow 0.35s ease, filter 0.35s ease;
        }
        .agrihero-small-circle-top {
          --agrihero-enter-delay: 0.4s;
          top: -6%;
          left: -8%;
        }
        .agrihero-small-circle-bottom {
          --agrihero-enter-delay: 0.65s;
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
          opacity: 0;
          transform: translateX(90px);
          transition: opacity 4.5s cubic-bezier(0.16, 0.8, 0.24, 1),
            transform 4.5s cubic-bezier(0.16, 0.8, 0.24, 1);
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
          transition: opacity 3s ease, transform 3s ease;
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
          font-family: var(--font-display), serif;
          font-weight: 600;
          font-size: 42px;
          line-height: 1.18;
          margin: 0 0 20px;
          color: var(--agrihero-green-ink);
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .agrihero-content-col[data-inview='true'] .agrihero-heading {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.18s;
        }
        .agrihero-accent-gold {
          color: var(--agrihero-yellow-deep);
          font-style: italic;
        }

        .agrihero-paragraph {
          font-size: 16px;
          line-height: 1.75;
          color: #3c4a3d;
          max-width: 48ch;
          text-align: justify;
          text-align-last: left;
          margin: 0 0 30px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .agrihero-content-col[data-inview='true'] .agrihero-paragraph {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.32s;
        }

        .agrihero-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 36px;
        }

        .agrihero-checklist {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1 1 260px;
        }
        .agrihero-checklist li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 15px;
          color: var(--agrihero-green-ink);
          opacity: 0;
          transform: translateX(-18px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 0.8, 0.24, 1);
        }
        .agrihero-content-col[data-inview='true'] .agrihero-checklist li {
          opacity: 1;
          transform: translateX(0);
        }
        .agrihero-check-bg {
          fill: var(--agrihero-yellow-deep);
        }

        .agrihero-stats {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          flex: 0 0 auto;
        }

        .agrihero-stat-ring {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .agrihero-stat-ring[data-inview='true'] {
          opacity: 1;
          transform: translateY(0);
        }

        .agrihero-stat-circle-wrap {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .agrihero-stat-track {
          fill: none;
          stroke: rgba(0, 100, 0, 0.12);
          stroke-width: 6;
        }
        .agrihero-stat-progress {
          fill: none;
          stroke: var(--agrihero-green-deep);
          stroke-width: 6;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.1s linear;
        }
        .agrihero-stat-progress-blue {
          stroke: var(--agrihero-blue-light);
        }
        .agrihero-stat-percent {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display), serif;
          font-weight: 600;
          font-size: 16px;
          color: var(--agrihero-green-ink);
        }
        .agrihero-stat-label {
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.35;
          color: #4a5a4b;
          white-space: pre-line;
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
          .agrihero-bottom-row {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .agrihero-section {
            padding: 64px 20px;
          }
          .agrihero-heading {
            font-size: 30px;
          }
          .agrihero-bottom-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 28px;
          }
          .agrihero-stats {
            align-self: flex-start;
          }
        }

        @media (max-width: 400px) {
          .agrihero-heading {
            font-size: 26px;
          }
          .agrihero-stats {
            gap: 20px;
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
          .agrihero-stat-ring,
          .agrihero-ring-decor,
          .agrihero-eyebrow,
          .agrihero-heading,
          .agrihero-paragraph,
          .agrihero-checklist li {
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
