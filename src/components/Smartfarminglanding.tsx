'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CalendarCheck,
  LayoutGrid,
  ClipboardList,
  Sprout,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Fires `true` once the element scrolls into view, then stays true. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/** Animates a number from 0 -> target once `start` becomes true. */
function useCountUp(target: number, start: boolean, duration = 1500, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString('vi-VN');
}

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const FEATURE_CARDS = [
  {
    icon: CalendarCheck,
    title: 'Tổng quan',
    subtitle: 'Thông tin thời gian thực',
  },
  {
    icon: LayoutGrid,
    title: 'Lập kế hoạch',
    subtitle: 'Quy hoạch chính xác',
  },
  {
    icon: ClipboardList,
    title: 'Kiểm soát trang trại',
    subtitle: 'Quản lý toàn diện',
  },
  {
    icon: Sprout,
    title: 'Giám sát cánh đồng',
    subtitle: 'Theo dõi tăng trưởng',
  },
];

const STATS = [
  { target: 1.5, decimals: 1, suffix: ' triệu+', label: 'Mẫu ảnh được giám sát' },
  { target: 200, decimals: 0, suffix: '+', label: 'Nông dân được trao quyền' },
  { target: 2, decimals: 0, suffix: 'M+', label: 'Quyết định trang trại được tối ưu hóa' },
  { target: 750, decimals: 0, suffix: 'K+', label: 'Thu hoạch thành công' },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SmartFarmingLanding() {
  const [titleRef, titleInView] = useInView<HTMLDivElement>(0.3);
  const [subRef, subInView] = useInView<HTMLDivElement>(0.3);
  const [cardsRef, cardsInView] = useInView<HTMLDivElement>(0.15);
  const [videoRef, videoInView] = useInView<HTMLDivElement>(0.2);
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.2);

  return (
    <main className="bg-cream text-ink">
      {/* ============================================================ */}
      {/* SECTION 1 — Title / subtitle                                  */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-[1500px] px-6 pt-16 pb-10 md:px-10 md:pt-24">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
          {/* Left: heading, slides in from the left */}
          <div
            ref={titleRef}
            className={`transition-all duration-[1500ms] ease-out ${
              titleInView ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
            }`}
          >
            <span className="mb-[16px] inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-[14px] py-[6px] text-[12px] font-semibold text-ink/70">
              <span className="h-[6px] w-[6px] rounded-full bg-lime-dark" />
              Cách hoạt động
            </span>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              Canh Tác Thông Minh
              <br />
              <span className="font-display italic font-normal text-lime-dark">
                Đơn Giản và Hiệu Quả
              </span>
            </h1>
          </div>

          {/* Right: supporting copy, slides in from the right */}
          <div
            ref={subRef}
            className={`mt-3 self-center transition-all duration-[1500ms] ease-out md:mt-25 md:justify-self-end md:text-right ${
              subInView ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
            }`}
          >
            <p className="max-w-md text-justify text-base leading-relaxed text-ink/55 md:ml-auto">
              Một nền tảng canh tác thông minh kết nối đất, cây trồng và vận hành
              để giúp nông dân canh tác hiệu quả và an toàn hơn.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — 4 feature cards                                   */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-[1500px] px-6 pb-16 md:px-10">
        <div ref={cardsRef} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURE_CARDS.map(({ icon: Icon, title, subtitle }, i) => (
            <div
              key={title}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`group cursor-pointer rounded-2xl border border-ink/10 bg-white p-5 transition-all duration-[1500ms] ease-out hover:-translate-y-1 hover:border-lime/40 hover:bg-lime/5 hover:shadow-xl ${
                cardsInView ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
              }`}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-lime/15 text-ink/70 transition-colors group-hover:bg-lime-dark group-hover:text-ink">
                <Icon size={18} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-semibold text-ink">{title}</h3>
              <p className="text-xs text-ink/45">{subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — Autoplaying video with overlay widgets            */}
      {/* ============================================================ */}
      <section
        ref={videoRef}
        className="relative mx-auto max-w-[1500px] overflow-hidden px-6 md:px-10"
      >
        <div className="relative overflow-hidden rounded-3xl">
          {/* Video: rises up from below */}
          <div
            className={`transition-all duration-[1500ms] ease-out ${
              videoInView ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
            }`}
          >
            <video
              className="h-[460px] w-full object-cover md:h-[600px]"
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/10" />
          </div>

          {/* Overlay widgets: slide in from the right */}
          <div
            className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
              videoInView ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
            }`}
          >
            {/* Location tag, bottom-left */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-deep backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-dark" />
              Đồng Nai, Việt Nam
            </div>

            {/* Weather card, top-right */}
            <div className="absolute right-5 top-5 w-40 rounded-2xl bg-white/95 p-4 text-center shadow-lg backdrop-blur-sm sm:w-44">
              <div className="text-2xl">⛅</div>
              <div className="mt-1 text-xl font-bold text-ink">24°C</div>
              <div className="text-[10px] text-ink/40">Nhiệt độ TB hôm nay</div>
              <div className="mt-3 grid grid-cols-3 gap-1 border-t border-ink/10 pt-2 text-[10px] text-ink/55">
                <div>
                  <div className="font-semibold text-ink">68%</div>
                  Độ ẩm
                </div>
                <div>
                  <div className="font-semibold text-ink">20%</div>
                  Mưa
                </div>
                <div>
                  <div className="font-semibold text-ink">12km/h</div>
                  Gió
                </div>
              </div>
            </div>

            {/* AI prediction card, below weather card */}
            <div className="absolute right-5 top-[9.5rem] w-40 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur-sm sm:w-44 sm:top-40">
              <p className="mb-2 text-[10px] font-medium text-ink/55">
                Mô hình AI dự đoán khu vực
              </p>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-400 via-gold to-emerald-500" />
              <div className="mt-2 flex items-center justify-between rounded-lg bg-lime/10 px-2 py-1.5">
                <span className="flex items-center gap-1 text-[10px] font-medium text-ink-deep">
                  <span className="grid h-4 w-4 place-items-center rounded bg-lime-dark text-[8px] text-ink">
                    AI
                  </span>
                  Phù hợp gieo trồng
                </span>
                <span className="text-ink-deep">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — Stats with count-up                               */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-[1500px] px-6 py-16 md:px-10">
        <div ref={statsRef} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} start={statsInView} />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card (isolated so each has its own count-up instance)         */
/* ------------------------------------------------------------------ */

function StatCard({
  target,
  decimals,
  suffix,
  label,
  index,
  start,
}: {
  target: number;
  decimals: number;
  suffix: string;
  label: string;
  index: number;
  start: boolean;
}) {
  const value = useCountUp(target, start, 1500, decimals);

  return (
    <div
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`rounded-2xl border border-ink/10 bg-white p-5 transition-all duration-[1500ms] ease-out ${
        start ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
      }`}
    >
      <div className="text-3xl font-extrabold text-ink sm:text-4xl">
        {value}
        <span className="text-gold-dark">{suffix}</span>
      </div>
      <p className="mt-1 text-xs leading-snug text-ink/45 sm:text-sm">{label}</p>
    </div>
  );
}