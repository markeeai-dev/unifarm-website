'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

/* ------------------------------------------------------------------ */
/*  Logo set — stylised text-marks standing in for real client logos  */
/*  Swap the SVG/text inside each <li> for real <Image> logos later.  */
/* ------------------------------------------------------------------ */
const LOGOS = [
  {
    name: 'Ohms',
    node: (
      <span className="flex items-center gap-1.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3a9 9 0 1 0 6.36 2.64"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M12 3v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <span className="text-xl font-semibold tracking-tight">Ohms</span>
      </span>
    ),
  },
  {
    name: 'Nrok',
    node: (
      <span className="flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 2c5 0 9 4.5 9 10s-4 10-9 10V2z" />
          <path d="M13 2c5 0 9 4.5 9 10s-4 10-9 10" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="text-lg font-bold tracking-widest">NROK</span>
      </span>
    ),
  },
  {
    name: 'Leader',
    node: (
      <span className="flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 4h18L9 20H3l14-16" />
        </svg>
        <span className="font-serif text-xl italic">Leader&apos;</span>
      </span>
    ),
  },
  {
    name: 'Kubota',
    node: <span className="text-2xl font-medium" style={{ fontFamily: 'cursive' }}>Kubota</span>,
  },
  {
    name: 'Gleaner',
    node: <span className="text-lg font-black tracking-[0.12em]">GLEANER</span>,
  },
  {
    name: 'Vertex',
    node: (
      <span className="flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l9 18H3L12 2z" />
        </svg>
        <span className="text-lg font-bold">Vertex</span>
      </span>
    ),
  },
  {
    name: 'Nimbus',
    node: <span className="text-xl font-semibold tracking-tight">Nimbus</span>,
  },
  {
    name: 'Cornerstone',
    node: (
      <span className="flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="10" width="18" height="10" rx="1.5" />
          <path d="M6 10V6a6 6 0 0 1 12 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-lg font-bold tracking-tight">Cornerstone</span>
      </span>
    ),
  },
];

/* Render twice so a 50% translateX loop is perfectly seamless */
const LOOP = [...LOGOS, ...LOGOS];

export default function TrustedBy() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

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
      { threshold: 0.25, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full overflow-hidden border-y border-ink/[0.06] bg-cream"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-5 py-14 sm:px-10 sm:py-16 md:flex-row md:items-center md:gap-12 lg:py-20">
        {/* -------- LEFT: text, ~20% on desktop -------- */}
        <div
          className="flex flex-shrink-0 items-center gap-4 transition-all duration-700 ease-out md:w-1/5 md:border-r md:border-ink/10 md:pr-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <p className="text-[1.05rem] leading-snug text-ink/70">
            {t('Được')} <span className="font-bold text-ink">{t('hàng nghìn')}</span> {t('doanh nghiệp trên khắp thế giới tin dùng')}
          </p>
        </div>

        {/* -------- RIGHT: infinite logo marquee -------- */}
        <div
          className="relative min-w-0 flex-1 transition-all delay-150 duration-700 ease-out [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <ul className="group flex w-max animate-marquee items-center gap-16 will-change-transform hover:[animation-play-state:paused] sm:gap-20">
            {LOOP.map((logo, i) => (
              <li
                key={`${logo.name}-${i}`}
                aria-hidden={i >= LOGOS.length}
                className="flex flex-shrink-0 items-center text-ink/40 grayscale transition-all duration-300 hover:text-ink hover:grayscale-0"
              >
                {logo.node}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
