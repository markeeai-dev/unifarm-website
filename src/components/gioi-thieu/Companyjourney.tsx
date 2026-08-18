'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CompanyJourney — "Hành trình kiến tạo F1genz-Farm"
 * -----------------------------------------------------------------
 * - Nền ảnh nông trại full-bleed, phủ gradient xanh lá đậm để chữ
 *   luôn rõ trên mọi ảnh.
 * - Cả section mờ dần + trượt lên khi cuộn tới (IntersectionObserver,
 *   chạy 1 lần, kéo dài 4.8s theo yêu cầu).
 * - Hàng mốc thời gian phía trên: click vào mốc nào, thẻ tương ứng
 *   phía dưới nổi lên ngay, đồng thời thanh chỉ báo tiến trình dịch
 *   chuyển tới đúng vị trí mốc đó.
 * - Tự động chạy: cứ 4.5s lại chuyển sang mốc kế tiếp, hết mốc cuối
 *   quay lại mốc đầu — vòng lặp vô hạn. Rê chuột vào cả khối thì tạm
 *   dừng để đọc, rê ra chạy tiếp.
 * - Thẻ đang active: phóng to, sáng lên, hiện đủ tiêu đề — nội dung —
 *   nút "Xem thêm". Các thẻ còn lại thu nhỏ, tối/mờ đi. Hàng thẻ tự
 *   cuộn ngang để đưa thẻ active vào giữa khung nhìn (giống ảnh mẫu).
 * - Tông màu: vàng nhạt #fffacd, xanh lá đậm #006400, xanh dương nhạt
 *   #87cefa.
 * -----------------------------------------------------------------
 */

type Milestone = {
  year: string;
  title: string;
  icon: 'seed' | 'globe' | 'leaf' | 'medal' | 'flag' | 'chart' | 'star';
  bullets: string[];
};

const MILESTONES: Milestone[] = [
  {
    year: '2016',
    title: 'Khởi đầu',
    icon: 'seed',
    bullets: [
      'Thành lập nông trại đầu tiên tại Tân Bình, TPHCM',
      'Trồng thử nghiệm 3 giống rau củ chủ lực',
      'Xây dựng quy trình canh tác an toàn ban đầu',
    ],
  },
  {
    year: '2017-2018',
    title: 'Xây nền móng',
    icon: 'globe',
    bullets: [
      'Mở rộng vùng trồng lên 12 hecta',
      'Đạt chứng nhận VietGAP cho toàn bộ nông trại',
      'Ký hợp tác cùng 5 chuỗi siêu thị đầu tiên',
    ],
  },
  {
    year: '2019-2020',
    title: 'Bứt phá công nghệ',
    icon: 'leaf',
    bullets: [
      'Đưa nhà kính cảm biến IoT vào vận hành',
      'Hợp tác độc quyền với đối tác nông nghiệp Nhật Bản',
      'Thành lập trung tâm nghiên cứu giống cây trồng',
    ],
  },
  {
    year: '2021-2022',
    title: 'Được vinh danh',
    icon: 'medal',
    bullets: [
      'Nhận giải thưởng Nông nghiệp công nghệ cao quốc gia',
      'Đạt chứng nhận Global GAP xuất khẩu',
      'Sản phẩm phủ sóng 20 tỉnh thành',
    ],
  },
  {
    year: '2023-2024',
    title: 'Tiên phong công nghệ',
    icon: 'flag',
    bullets: [
      'Triển khai canh tác thẳng đứng quy mô lớn',
      'Ứng dụng AI dự báo mùa vụ cho toàn hệ thống',
      'Mở rộng nhà máy sơ chế đạt chuẩn quốc tế',
    ],
  },
  {
    year: '2025',
    title: 'Vươn ra khu vực',
    icon: 'chart',
    bullets: [
      'Xuất khẩu chính ngạch sang 4 thị trường mới',
      'Hợp tác cùng 50+ nông hộ vệ tinh',
      'Ra mắt dòng sản phẩm chế biến sâu',
    ],
  },
  {
    year: 'Hiện nay',
    title: 'Tiếp tục hành trình',
    icon: 'star',
    bullets: [
      'Không ngừng đầu tư R&D giống cây bản địa',
      'Mở rộng vùng nguyên liệu hữu cơ',
      'Đồng hành cùng triệu bữa cơm gia đình Việt',
    ],
  },
];

const SLIDE_DURATION = 4500;

function MilestoneIcon({ type, className }: { type: Milestone['icon']; className?: string }) {
  const common = { viewBox: '0 0 24 24', className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 } as const;
  switch (type) {
    case 'seed':
      return (
        <svg {...common}>
          <path d="M12 21c-5-1-7-5-7-9 4 0 7 2 8 6 1-4 4-6 8-6 0 4-2 8-7 9Z" strokeLinejoin="round" />
          <path d="M12 21V9" strokeLinecap="round" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.4-3.8-8.5S9.5 5.9 12 3.5Z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M20 4c-9 0-16 5-16 14 9 0 14-5 14-14Z" strokeLinejoin="round" />
          <path d="M6 18c3-4 6-7 12-12" strokeLinecap="round" />
        </svg>
      );
    case 'medal':
      return (
        <svg {...common}>
          <circle cx="12" cy="14.5" r="6" />
          <path d="M9 3l2.2 5M15 3l-2.2 5" strokeLinecap="round" />
          <path d="M12 11v7M9.2 14.5h5.6" strokeLinecap="round" />
        </svg>
      );
    case 'flag':
      return (
        <svg {...common}>
          <path d="M5 21V4" strokeLinecap="round" />
          <path d="M5 5c2-1.3 4-1.3 6 0s4 1.3 6 0v9c-2 1.3-4 1.3-6 0s-4-1.3-6 0Z" strokeLinejoin="round" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 20V4M4 20h16" strokeLinecap="round" />
          <path d="M7 16l4-5 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8-6-3.4-6 3.4 1.3-6.8-5-4.7 6.8-.8Z" />
        </svg>
      );
  }
}

export default function CompanyJourney() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal whole section on scroll-in
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
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = (next: number) => {
    setIndex(((next % MILESTONES.length) + MILESTONES.length) % MILESTONES.length);
  };

  // Autoplay — only once the section has appeared, pauses on hover
  useEffect(() => {
    if (!visible || paused) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, visible, paused]);

  // Scroll the active card into the center of the row
  useEffect(() => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [index]);

  const count = MILESTONES.length;
  const segmentWidth = 100 / count;

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full overflow-hidden bg-[#001b0b]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: 'opacity 4800ms ease-out, transform 4800ms ease-out',
      }}
    >
      {/* Background photo + brand wash */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?fm=jpg&q=70&w=1920&fit=crop&auto=format')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00230f]/92 via-[#001b0b]/88 to-[#00230f]/95" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <h2 className="mb-10 text-center text-2xl font-extrabold text-white sm:mb-14 sm:text-3xl lg:text-4xl">
          Hành trình kiến tạo <span className="text-[#fffacd]">F1genz-Farm</span>
        </h2>

        {/* ---- Timeline pills ---- */}
        <div className="mb-3 overflow-x-auto pb-1">
          <div className="relative mx-auto flex min-w-max items-center justify-between gap-2 sm:gap-3">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
            {MILESTONES.map((m, i) => {
              const state = i < index ? 'done' : i === index ? 'active' : 'upcoming';
              return (
                <button
                  key={m.year + i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`relative z-10 shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-all duration-300 sm:px-4 sm:py-2 sm:text-xs ${
                    state === 'active'
                      ? 'scale-110 border-white bg-[#87cefa] text-[#00230f] shadow-[0_0_0_5px_rgba(135,206,250,0.28)]'
                      : state === 'done'
                      ? 'border-[#87cefa]/50 bg-[#87cefa]/15 text-[#87cefa]'
                      : 'border-white/20 bg-white/5 text-white/45'
                  }`}
                >
                  {m.year}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Progress track ---- */}
        <div className="relative mb-12 h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:mb-16">
          <div
            className="absolute inset-y-0 rounded-full bg-white transition-all duration-500 ease-out"
            style={{ left: `${index * segmentWidth}%`, width: `${segmentWidth}%` }}
          />
        </div>

        {/* ---- Cards row ---- */}
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-6 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {MILESTONES.map((m, i) => {
            const isActive = i === index;
            return (
              <div
                key={m.title + i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`flex shrink-0 snap-center flex-col rounded-2xl border transition-all duration-500 ease-out ${
                  isActive
                    ? 'z-10 w-[78%] scale-100 border-[#fffacd]/70 bg-white p-6 opacity-100 shadow-[0_0_45px_rgba(135,206,250,0.45)] sm:w-[300px] sm:p-7'
                    : 'w-[62%] scale-95 border-white/10 bg-white/10 p-5 opacity-55 backdrop-blur-sm sm:w-[220px] sm:p-6'
                }`}
              >
                <span
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-500 ${
                    isActive ? 'bg-[#fffacd] text-[#006400]' : 'bg-white/10 text-white/50'
                  }`}
                >
                  <MilestoneIcon type={m.icon} className="h-6 w-6" />
                </span>

                <p
                  className={`mb-1 text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
                    isActive ? 'text-[#87cefa]' : 'text-white/40'
                  }`}
                >
                  {m.year}
                </p>
                <h3
                  className={`mb-3 font-extrabold transition-colors duration-500 ${
                    isActive ? 'text-xl text-[#006400]' : 'text-base text-white/70'
                  }`}
                >
                  {m.title}
                </h3>

                <ul className={`mb-5 space-y-1.5 ${isActive ? 'text-sm text-neutral-600' : 'text-xs text-white/45'}`}>
                  {m.bullets.map((b, bi) => (
                    <li key={bi} className={isActive ? 'line-clamp-none' : 'line-clamp-1'}>
                      <span className={isActive ? 'text-[#006400]' : 'text-white/30'}>• </span>
                      {b}
                    </li>
                  ))}
                </ul>

                {isActive && (
                  <button
                    type="button"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 self-center rounded-full bg-[#006400] px-5 py-2 text-sm font-bold text-[#fffacd] transition-colors hover:bg-[#00520a]"
                  >
                    Xem thêm
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ---- Pagination dots ---- */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {MILESTONES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Đi tới mốc ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-[#fffacd]' : 'w-1.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}