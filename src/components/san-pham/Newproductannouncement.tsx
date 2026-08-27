'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

/**
 * NewProductAnnouncement — banner "thông báo sản phẩm mới" cho trang sản phẩm.
 * Bố cục: trái là ảnh trái cây PNG to, phải là nội dung + đếm ngược đến ngày ra mắt.
 */

const LAUNCH_DATE = new Date('2026-10-01T00:00:00+07:00').getTime();

type TimeLeft = { days: number; hours: number; mins: number; secs: number };

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, LAUNCH_DATE - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

function ArrowIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COUNTDOWN_UNITS: { label: string; key: keyof TimeLeft }[] = [
  { label: 'Ngày', key: 'days' },
  { label: 'Giờ', key: 'hours' },
  { label: 'Phút', key: 'mins' },
  { label: 'Giây', key: 'secs' },
];

export default function NewProductAnnouncement() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    const kickoff = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(id);
    };
  }, []);

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
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_trang.png')] bg-repeat">
      <style>{`
        @keyframes decor-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1.5deg); }
        }
      `}</style>

      <Image
        src="/images/san-pham/la-dep.png"
        alt=""
        aria-hidden="true"
        width={200}
        height={200}
        className="pointer-events-none select-none absolute -right-4 -top-4 z-20 h-28 w-28 object-contain drop-shadow-[0_18px_25px_rgba(0,0,0,0.18)] sm:h-40 sm:w-40 lg:h-52 lg:w-52"
        style={{ animation: 'decor-float 6s ease-in-out infinite' }}
      />

      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        {/* Trái: ảnh chuối PNG lớn */}
        <div
          className="flex justify-center transition-all duration-[900ms] ease-out lg:order-1 lg:justify-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <Image
            src="/images/products/dua-vip.png"
            alt={t('Chuối Unifarm')}
            width={1280}
            height={961}
            className="h-auto w-[240px] drop-shadow-[0_30px_40px_rgba(0,60,20,0.18)] sm:w-[360px] lg:w-[460px]"
          />
        </div>

        {/* Phải: nội dung thông báo sản phẩm mới */}
        <div
          className="text-center transition-all duration-[900ms] ease-out lg:order-2 lg:text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: visible ? '180ms' : '0ms',
          }}
        >
          <p className="font-serif text-base italic text-[#006400] sm:text-lg">
            {t('Sản phẩm mới')}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-[42px]">
            {t('Thông Báo Sản Phẩm Mới')}
          </h2>

          <div className="mt-5">
            <p className="text-base font-semibold text-neutral-800 sm:text-lg">
              {t('Dứa MD2 Unifarm')}
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-[#006400] sm:text-base">
              <span className="h-2 w-2 rounded-full bg-[#87cefa]" />
              {t('Sắp ra mắt · Vụ mùa mới')}
            </p>
          </div>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base lg:mx-0">
            {t('Sản phẩm nông nghiệp mới nhất của Unifarm sắp được giới thiệu đến người tiêu dùng — canh tác theo quy trình khép kín, đạt chuẩn VietGAP và GlobalG.A.P, đảm bảo độ tươi ngon khi đến tay khách hàng.')}
          </p>

          {/* Đếm ngược đến ngày ra mắt */}
          <div className="mt-7 flex items-center justify-center gap-3 sm:gap-4 lg:justify-start">
            {COUNTDOWN_UNITS.map((unit) => (
              <div
                key={unit.key}
                className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-[#006400]/20 bg-white/70 sm:h-[72px] sm:w-[72px]"
              >
                <span className="text-lg font-extrabold text-neutral-900 sm:text-xl">
                  {String(timeLeft[unit.key]).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-neutral-500">
                  {t(unit.label)}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="group mt-8 inline-flex items-center gap-2 border-b-2 border-neutral-900 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 transition-colors duration-300 hover:border-[#006400] hover:text-[#006400]"
          >
            {t('Tìm hiểu thêm')}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
