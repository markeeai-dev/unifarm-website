/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

/* ------------------------------------------------------------------ */
/*  Data — one entry per accordion item                                */
/* ------------------------------------------------------------------ */
type Item = {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    title: 'Năng Suất Canh Tác Đã Được Chứng Minh',
    description:
      'Theo dõi năng suất, chi phí và xu hướng sản lượng trên từng thửa đất theo thời gian thực, để bạn luôn biết chính xác tình trạng nông trại của mình.',
    image:
      'https://images.unsplash.com/photo-1745239853358-5ab62bc08af2?fm=jpg&q=75&w=1400&h=1000&fit=crop&auto=format',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
        <path d="M12 22V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M12 10C12 10 6 9 6 4C11 4 12 10 12 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 14C12 14 18 13 18 8C13 8 12 14 12 14Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Tối Ưu Cây Trồng Thông Minh',
    description:
      'Hệ thống AI của chúng tôi phân tích độ phì đất, thời tiết, chu kỳ tưới tiêu và dữ liệu sinh trưởng cây trồng để tự động đề xuất hành động hiệu quả nhất, giúp tăng năng suất và giảm thiểu rủi ro.',
    image:
      'https://images.unsplash.com/photo-1692369584496-3216a88f94c1?fm=jpg&q=75&w=1400&h=1000&fit=crop&auto=format',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
        <path
          d="M12 3C8 3 6 6 6 9c0 2.5 1.5 3.8 2.5 4.8.7.7 1.2 1.4 1.2 2.7V20h4.6v-3.5c0-1.3.5-2 1.2-2.7C16.5 12.8 18 11.5 18 9c0-3-2-6-6-6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M10 20h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Tích Hợp Hệ Thống Nông Trại Liền Mạch',
    description:
      'Kết nối cảm biến, máy móc và công cụ ghi chép vào một bảng điều khiển duy nhất, giúp mọi thiết bị trong nông trại của bạn hoạt động đồng bộ.',
    image:
      'https://images.unsplash.com/photo-1720071702672-d18c69cb475c?fm=jpg&q=75&w=1400&h=1000&fit=crop&auto=format',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
        <rect x="3" y="11" width="7" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="6" width="7" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 14.5h4.5V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Quản Lý Nước & Tài Nguyên Thông Minh',
    description:
      'Lập lịch tưới tiêu tự động và theo dõi tài nguyên giúp giảm lãng phí, tiết kiệm nước trong khi vẫn giữ cho từng loại cây trồng luôn khỏe mạnh nhất.',
    image:
      'https://images.unsplash.com/photo-1758927837398-248358bfda13?fm=jpg&q=75&w=1400&h=1000&fit=crop&auto=format',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
        <path
          d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Small word-cascade reveal helper (self-contained, no external deps)*/
/*  Row N only starts after row N-1 has fully risen.                   */
/* ------------------------------------------------------------------ */
function useWordSchedule(rows: string[][], wordStagger: number, wordDuration: number, rowGap: number) {
  let cursor = 0;
  return rows.map((row) => {
    const delays = row.map((_, i) => cursor + i * wordStagger);
    const span = (row.length - 1) * wordStagger + wordDuration;
    cursor += span + rowGap;
    return delays;
  });
}

function RevealWord({
  visible,
  delay,
  duration,
  children,
}: {
  visible: boolean;
  delay: number;
  duration: number;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-block overflow-hidden py-[2px] align-bottom">
      <span
        className="inline-block transition-all ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
          transform: visible ? 'translateY(0%)' : 'translateY(115%)',
          opacity: visible ? 1 : 0,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* Heading: 2 rows, different styles per row */
const HEADING_ROW_1_VI = 'Giải Pháp Canh Tác Thông Minh';
const HEADING_ROW_2_VI = 'Mang Lại Kết Quả Thực Tế';
const HEADING_WORD_STAGGER = 55;
const HEADING_WORD_DURATION = 560;
const HEADING_ROW_GAP = 120;

/* Right-side small sub-heading — long enough to fill the space above the image.
   Rendered as 7 short rows for a clean cascade; when translated, the sentence
   is re-split evenly across the same number of rows so the reveal animation
   below is unaffected. */
const SUBHEAD_TEXT_VI =
  'Các giải pháp nông nghiệp thông minh của chúng tôi giúp nông dân canh tác hiệu quả hơn, tiết kiệm chi phí vận hành và nâng cao chất lượng nông sản mỗi ngày. Từ theo dõi mùa vụ đến quản lý tài nguyên, mọi dữ liệu đều được kết nối liền mạch trên một nền tảng duy nhất và dễ sử dụng.';
const SUBHEAD_ROW_COUNT = 7;
const SUBHEAD_WORD_STAGGER = 22;
const SUBHEAD_WORD_DURATION = 380;
const SUBHEAD_ROW_GAP = 70;

/** Splits `text` into `rows` word-groups of near-equal size (keeps the
 * word-cascade reveal working the same way regardless of sentence length). */
function splitIntoRows(text: string, rows: number): string[][] {
  const words = text.split(' ').filter(Boolean);
  const base = Math.floor(words.length / rows);
  const extra = words.length % rows;
  const result: string[][] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const count = base + (r < extra ? 1 : 0);
    result.push(words.slice(idx, idx + count));
    idx += count;
  }
  return result;
}

export default function SmartFarmingSolutions() {
  const { t } = useLanguage();
  const HEADING_ROW_1 = t(HEADING_ROW_1_VI).split(' ');
  const HEADING_ROW_2 = t(HEADING_ROW_2_VI).split(' ');
  const SUBHEAD_ROWS = splitIntoRows(t(SUBHEAD_TEXT_VI), SUBHEAD_ROW_COUNT);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1); // item open by default
  const [displayIndex, setDisplayIndex] = useState(1); // last opened item — keeps the image showing while closed
  // Stacking order per image: the most recently opened image always paints on top,
  // so it pops in over whichever image was showing before it.
  const [stackOrder, setStackOrder] = useState<number[]>(() => ITEMS.map((_, i) => (i === 1 ? 1 : 0)));
  const stackCounterRef = useRef(1);
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
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const headingSchedule = useWordSchedule(
    [HEADING_ROW_1, HEADING_ROW_2],
    HEADING_WORD_STAGGER,
    HEADING_WORD_DURATION,
    HEADING_ROW_GAP
  );
  const subheadSchedule = useWordSchedule(
    SUBHEAD_ROWS,
    SUBHEAD_WORD_STAGGER,
    SUBHEAD_WORD_DURATION,
    SUBHEAD_ROW_GAP
  );

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-cream">
      <div className="mx-auto w-full max-w-[1500px] px-[20px] py-[64px] sm:px-[40px] sm:py-[88px] lg:py-[70px]">
        {/* Top block: heading (left) and sub-heading (right) flow independently — no forced height match */}
        <div className="grid grid-cols-1 gap-x-[40px] items-start lg:grid-cols-2">
          <div>
            {/* Badge */}
            <div
              className="mb-[14px] inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-[14px] py-[6px] text-[12px] font-semibold text-ink/70 transition-all duration-500 ease-out sm:mb-[16px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
              }}
            >
              <span className="h-[6px] w-[6px] rounded-full bg-lime-dark" />
              {t('Về Agrovia')}
            </div>

            {/* Word-by-word, row-by-row heading */}
            <h2 className="uppercase max-w-[480px]">
              <span className="block text-[28px] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[34px] md:text-[40px]">
                {HEADING_ROW_1.map((word, i) => (
                  <RevealWord
                    key={i}
                    visible={visible}
                    delay={headingSchedule[0][i]}
                    duration={HEADING_WORD_DURATION}
                  >
                    {word}
                    {i < HEADING_ROW_1.length - 1 ? ' ' : ''}
                  </RevealWord>
                ))}
              </span>
              <span className="block text-[28px] italic leading-[1.15] tracking-tight text-ink-deep/80 sm:text-[34px] md:text-[40px]">
                {HEADING_ROW_2.map((word, i) => (
                  <RevealWord
                    key={i}
                    visible={visible}
                    delay={headingSchedule[1][i]}
                    duration={HEADING_WORD_DURATION}
                  >
                    {word}
                    {i < HEADING_ROW_2.length - 1 ? ' ' : ''}
                  </RevealWord>
                ))}
              </span>
            </h2>
          </div>

          {/* Small subheading — nudged down a bit so it doesn't sit flush with the top */}
          <p className="mt-[20px] w-full max-w-none text-[14px] font-medium leading-relaxed text-ink/55 lg:mt-[110px]">
            {SUBHEAD_ROWS.map((row, rowIndex) => (
              <span key={rowIndex} className="mr-[0.32em] inline">
                {row.map((word, wordIndex) => (
                  <RevealWord
                    key={wordIndex}
                    visible={visible}
                    delay={subheadSchedule[rowIndex][wordIndex]}
                    duration={SUBHEAD_WORD_DURATION}
                  >
                    {word}
                    {wordIndex < row.length - 1 ? ' ' : ''}
                  </RevealWord>
                ))}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom block: accordion (left) and image panel (right) — heights matched evenly */}
        <div className="mt-[24px] grid grid-cols-1 items-stretch gap-x-[40px] gap-y-[24px] sm:mt-[28px] lg:mt-[36px] lg:grid-cols-2">
          {/* Accordion */}
          <div className="flex w-full flex-col justify-between gap-[10px]">
            {ITEMS.map((item, i) => {
              const isOpen = activeIndex === i;
              return (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-[16px] bg-white/70 transition-all duration-[950ms] ease-out"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(70px)',
                    transitionDelay: `${400 + i * 520}ms`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isOpen) {
                        // Closing the current item: collapse it, keep showing its image.
                        setActiveIndex(-1);
                      } else {
                        // Opening a (possibly different) item: expand it and pop its image on top.
                        setActiveIndex(i);
                        setDisplayIndex(i);
                        stackCounterRef.current += 1;
                        const nextZ = stackCounterRef.current;
                        setStackOrder((prev) => prev.map((z, idx) => (idx === i ? nextZ : z)));
                      }
                    }}
                    className="flex w-full items-center gap-[12px] px-[16px] py-[15px] text-left"
                  >
                    <span
                      className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300 ${
                        isOpen ? 'bg-lime text-ink' : 'bg-ink/5 text-ink/70'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`flex-1 text-[15px] font-semibold transition-colors duration-300 ${
                        isOpen ? 'text-ink' : 'text-ink/80'
                      }`}
                    >
                      {t(item.title)}
                    </span>
                    <span className="relative flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center">
                      <span className="absolute h-[1.6px] w-[11px] rounded-full bg-ink/60" />
                      <span
                        className="absolute h-[1.6px] w-[11px] rounded-full bg-ink/60 transition-transform duration-300 ease-out"
                        style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(90deg)' }}
                      />
                    </span>
                  </button>

                  <div
                    className="grid transition-all duration-400 ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-[16px] pb-[16px] pl-[62px] text-[13.5px] leading-relaxed text-ink/60">
                        {t(item.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image panel — matched in height to the accordion; each pick pops in suddenly over the last one */}
          <div
            className="relative aspect-[4/3] min-h-[320px] w-full overflow-hidden rounded-[22px] bg-ink/5 transition-all duration-[7000ms] ease-out lg:aspect-auto lg:min-h-[420px] lg:self-stretch"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(90px)',
            }}
          >
            {ITEMS.map((item, i) => (
              <img
                key={item.title + (displayIndex === i ? '-in' : '-out')}
                src={item.image}
                alt={t(item.title)}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  zIndex: stackOrder[i],
                  animation: displayIndex === i ? 'imagePop 480ms cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
