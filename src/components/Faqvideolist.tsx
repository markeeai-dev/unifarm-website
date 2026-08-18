'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
type FaqItem = {
  question: string;
  thumb: string;
  video: string;
};

const ITEMS: FaqItem[] = [
  {
    question: 'Unifarm hoạt động như thế nào với nông dân mới bắt đầu?',
    thumb:
      'https://images.unsplash.com/photo-1745239853358-5ab62bc08af2?fm=jpg&q=70&w=480&h=320&fit=crop&auto=format',
    video: 'https://assets.mixkit.co/videos/8582/8582-720.mp4',
  },
  {
    question: 'Điều gì khiến dữ liệu cây trồng của Unifarm khác biệt?',
    thumb:
      'https://images.unsplash.com/photo-1692369584496-3216a88f94c1?fm=jpg&q=70&w=480&h=320&fit=crop&auto=format',
    video: 'https://assets.mixkit.co/videos/8582/8582-720.mp4',
  },
  {
    question: 'Tôi có thể tích hợp thiết bị nông trại hiện có của mình không?',
    thumb:
      'https://images.unsplash.com/photo-1720071702672-d18c69cb475c?fm=jpg&q=70&w=480&h=320&fit=crop&auto=format',
    video: 'https://assets.mixkit.co/videos/8582/8582-720.mp4',
  },
  {
    question: 'Dữ liệu và thông tin thanh toán của tôi được bảo mật ra sao?',
    thumb:
      'https://images.unsplash.com/photo-1758927837398-248358bfda13?fm=jpg&q=70&w=480&h=320&fit=crop&auto=format',
    video: 'https://assets.mixkit.co/videos/8582/8582-720.mp4',
  },
  {
    question: 'Unifarm cung cấp những hình thức hỗ trợ nào cho khách hàng?',
    thumb:
      'https://images.unsplash.com/photo-1745239853358-5ab62bc08af2?fm=jpg&q=70&w=480&h=320&fit=crop&auto=format',
    video: 'https://assets.mixkit.co/videos/8582/8582-720.mp4',
  },
];

/* ------------------------------------------------------------------ */
/*  Small icons                                                        */
/* ------------------------------------------------------------------ */
function ArrowUpRight({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export default function FaqVideoList() {
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex]);

  return (
    <section ref={sectionRef} className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat">
      <div className="mx-auto w-full max-w-[1000px] px-[20px] py-[64px] sm:px-[40px] sm:py-[88px] lg:py-[104px]">
        {/* Badge — rises from below on scroll-in */}
        <div
          className="mb-[16px] inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white px-[14px] py-[6px] text-[12px] font-semibold text-neutral-900/70 transition-all duration-500 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <span className="h-[6px] w-[6px] rounded-full bg-[#006400]" />
          Câu Hỏi Thường Gặp
        </div>

        {/* Heading — rises from below on scroll-in */}
        <h2
          className="font-display max-w-[720px] text-3xl font-extrabold leading-[1.18] tracking-tight text-neutral-900 transition-all duration-[900ms] ease-out sm:text-4xl lg:text-[42px]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(34px)',
          }}
        >
          Bạn Có Thắc Mắc? Chúng Tôi Có <em className="font-normal italic text-[#006400]">Câu Trả Lời Thực Tế</em> Cho Bạn
        </h2>

        {/* Rows */}
        <div className="mt-[36px] sm:mt-[44px]">
          {ITEMS.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const num = String(i + 1).padStart(2, '0');

            return (
              <div
                key={item.question}
                className="relative border-b border-black transition-all duration-500 ease-out first:border-t"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(36px)',
                  transitionDelay: `${140 + i * 110}ms`,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex((h) => (h === i ? null : h))}
              >
                {/* highlight layer */}
                <div
                  className="pointer-events-none absolute inset-y-[3px] inset-x-[-10px] rounded-[18px] bg-white transition-all duration-400 ease-out sm:inset-x-[-16px]"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scale(1)' : 'scale(0.97)',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="relative z-10 flex w-full items-center gap-[16px] py-[20px] pl-[6px] pr-[6px] text-left sm:gap-[22px] sm:py-[24px]"
                >
                  <span className="w-[26px] flex-shrink-0 text-[11px] font-semibold text-neutral-900/40">({num})</span>
                  <span className="flex-1 text-[16px] font-semibold text-neutral-900 transition-colors duration-300 sm:text-[19px] md:text-[21px]">
                    {item.question}
                  </span>

                  {/* Mobile-only compact play affordance (no hover on touch) */}
                  <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-[#006400]/10 text-[#006400] transition-colors duration-300 md:hidden">
                    <PlayIcon className="h-4 w-4 translate-x-[1px]" />
                  </span>

                  {/* Desktop arrow, shows on hover */}
                  <span
                    className="hidden h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-[#006400] text-[#fffacd] transition-all duration-300 ease-out md:flex"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'scale(1) rotate(0deg)' : 'scale(0.6) rotate(-45deg)',
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>

                {/* Floating video-preview thumbnail (desktop only) */}
                <div
                  className="pointer-events-none absolute right-[26px] top-1/2 z-20 hidden md:block"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? 'translateY(calc(-50% + 10px)) scale(1) rotate(0deg)'
                      : 'translateY(calc(-50% - 18px)) scale(0.82) rotate(-2deg)',
                    transition: 'opacity 420ms ease-out, transform 420ms cubic-bezier(0.22,0.9,0.28,1)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="pointer-events-auto relative block h-[112px] w-[168px] overflow-hidden rounded-[20px] shadow-[0_18px_36px_rgba(0,60,20,0.28)] lg:h-[128px] lg:w-[192px]"
                    aria-label={`Xem video: ${item.question}`}
                    tabIndex={isHovered ? 0 : -1}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.thumb} alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-[#003300]/10" />
                    <span className="absolute left-1/2 top-1/2 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#87cefa] text-[#006400] shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- VIDEO MODAL ---------------- */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#001b0b]/90 px-[20px] backdrop-blur-sm animate-[fadeBackdrop_300ms_ease-out]"
          onClick={() => setOpenIndex(null)}
        >
          <div
            key={openIndex}
            className="relative w-full max-w-[880px] animate-[modalIn_380ms_cubic-bezier(0.19,1,0.22,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Đóng video"
              className="absolute -top-[46px] right-0 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="overflow-hidden rounded-[20px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <video
                src={ITEMS[openIndex].video}
                poster={ITEMS[openIndex].thumb}
                controls
                autoPlay
                className="aspect-video w-full"
              />
            </div>
            <p className="mt-[14px] text-center text-[14px] font-medium text-white/70">
              {ITEMS[openIndex].question}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}