'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Inline chips — small icon / photo bubbles sitting mid-sentence     */
/* ------------------------------------------------------------------ */
function IconChip() {
  return (
    <span className="relative inline-flex h-[22px] w-[22px] -translate-y-[1px] items-center justify-center rounded-full bg-ink align-middle text-lime sm:h-[26px] sm:w-[26px] md:h-[30px] md:w-[30px]">
      <svg viewBox="0 0 24 24" fill="none" className="h-[11px] w-[11px] sm:h-[13px] sm:w-[13px] md:h-[15px] md:w-[15px]">
        <path d="M12 21c0-6.5 3.5-10 8-11-1 5-3 9-8 11z" fill="currentColor" />
        <path d="M12 21c0-7-4-11.5-9-13 1 6 3 11 9 13z" fill="currentColor" opacity="0.6" />
      </svg>
    </span>
  );
}

function PhotoChip() {
  return (
    <span className="relative inline-flex h-[22px] w-[22px] -translate-y-[1px] items-center justify-center overflow-hidden rounded-full align-middle ring-2 ring-lime/70 sm:h-[26px] sm:w-[26px] md:h-[30px] md:w-[30px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1745239853358-5ab62bc08af2?fm=jpg&q=70&w=160&h=160&fit=crop&auto=format"
        alt="Nông dân Việt Nam canh tác lúa xanh"
        className="h-full w-full object-cover"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Content — each row is an ordered list of tokens (word or chip).    */
/*  Rows animate one at a time; inside a row, tokens cascade word by   */
/*  word; the next row only starts once the current row has finished. */
/* ------------------------------------------------------------------ */
type Token = { type: 'word'; text: string } | { type: 'chip'; chip: 'icon' | 'photo' };

const w = (text: string): Token => ({ type: 'word', text });
const mkChip = (c: 'icon' | 'photo'): Token => ({ type: 'chip', chip: c });

const ROWS: Token[][] = [
  [w('Nền'), w('tảng'), w('của'), w('chúng'), w('tôi'), w('được'), w('xây'), w('dựng'), w('để'), w('hỗ'), w('trợ')],
  [w('nông'), w('dân,'), w('doanh'), w('nghiệp'), w('nông'), w('nghiệp'), mkChip('icon'), w('và'), w('các'), w('nhà')],
  [w('đổi'), w('mới,'), w('mang'), w('đến'), mkChip('photo'), w('nông'), w('sản'), w('xanh'), w('Việt'), w('Nam')],
  [w('cùng'), w('những'), w('công'), w('cụ'), w('thực'), w('tiễn'), w('cho'), w('một'), w('tương'), w('lai'), w('bền'), w('vững.')],
];

const WORD_STAGGER = 16; // ms between each word inside the same row
const WORD_DURATION = 280; // ms — each word's own rise-up time
const ROW_GAP = 50; // ms pause after a row fully lands, before next row starts

/** Precompute each token's start delay so row N+1 only begins once row N is fully risen. */
function buildSchedule(rows: Token[][]) {
  let cursor = 0;
  return rows.map((row) => {
    const delays = row.map((_, i) => cursor + i * WORD_STAGGER);
    const rowSpan = (row.length - 1) * WORD_STAGGER + WORD_DURATION;
    cursor += rowSpan + ROW_GAP;
    return delays;
  });
}

const SCHEDULE = buildSchedule(ROWS);

/* ------------------------------------------------------------------ */
/*  Single reveal token                                                */
/* ------------------------------------------------------------------ */
function RevealToken({
  visible,
  delay,
  children,
}: {
  visible: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-block overflow-hidden py-[2px] align-bottom">
      <span
        className="inline-block transition-all ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{
          transitionDuration: `${WORD_DURATION}ms`,
          transitionDelay: `${delay}ms`,
          transform: visible ? 'translateY(0%)' : 'translateY(120%)',
          opacity: visible ? 1 : 0,
        }}
      >
        {children}
      </span>
    </span>
  );
}

export default function GreenPlatformIntro() {
  const [visible, setVisible] = useState(false);
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
      { threshold: 0.3, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-cream">
      {/* Fixed pixel container — same true width on every device, no rem drift */}
      <div className="mx-auto w-full max-w-[1500px] px-[20px] py-[34px] sm:px-[40px] sm:py-[80px] lg:py-[60px]">
        {/* Badge */}
        <div
          className="mb-[20px] inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-[14px] py-[6px] text-[12px] font-semibold text-ink/70 transition-all duration-500 ease-out sm:mb-[28px]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <span className="h-[6px] w-[6px] rounded-full bg-lime-dark" />
          Nông Sản Xanh Việt Nam
        </div>

        {/* Word-by-word, row-by-row reveal heading */}
        <h2 className="font-display max-w-[1500px] text-[22px] font-medium leading-[1.4] tracking-tight text-ink sm:text-[28px] sm:leading-[1.35] md:text-[34px] md:leading-[1.3] lg:text-[38px] lg:leading-[1.28]">
          {ROWS.map((row, rowIndex) => (
            <span key={rowIndex} className="flex flex-wrap items-center gap-x-[0.32em] gap-y-[4px]">
              {row.map((token, tokenIndex) => {
                const delay = SCHEDULE[rowIndex][tokenIndex];
                return (
                  <RevealToken key={tokenIndex} visible={visible} delay={delay}>
                    {token.type === 'word' ? token.text : token.chip === 'icon' ? <IconChip /> : <PhotoChip />}
                  </RevealToken>
                );
              })}
            </span>
          ))}
        </h2>

        {/* Faded continuation line — hints there's more, no animation */}
        <p className="mt-[16px] max-w-[560px] text-[15px] leading-relaxed text-ink/35 sm:mt-[20px] sm:text-[16px]">
          Từ cánh đồng đến bàn ăn, mọi giá trị đều được lan tỏa mỗi ngày.
        </p>
      </div>
    </section>
  );
}
