'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook (same pattern as previous sections)             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      'Nền tảng dễ triển khai và mang lại giá trị nhanh chóng. Chỉ trong tháng đầu, chúng tôi đã cải thiện kế hoạch tưới tiêu và giảm đáng kể chi phí đầu vào.',
    name: 'Nguyễn Minh Thông',
    company: 'AgroField, Đồng Nai',
    image: 'https://picsum.photos/seed/khachhang1/500/500',
  },
  {
    quote:
      'Dữ liệu đồng ruộng theo thời gian thực đã thay đổi hoàn toàn cách chúng tôi quản lý cây trồng. Chúng tôi ra quyết định thông minh hơn và năng suất tốt hơn qua từng vụ mùa.',
    name: 'Trần Thị Lan',
    company: 'CropSense, Lâm Đồng',
    image: 'https://picsum.photos/seed/khachhang2/500/500',
  },
  {
    quote:
      'Hệ thống cảnh báo sâu bệnh sớm giúp chúng tôi tiết kiệm cả vụ mùa. Đội ngũ hỗ trợ cũng rất tận tâm, phản hồi nhanh mỗi khi cần.',
    name: 'Lê Văn Hòa',
    company: 'TerraGrow, Đắk Lắk',
    image: 'https://picsum.photos/seed/khachhang3/500/500',
  },
  {
    quote:
      'Từ khi dùng nền tảng, việc lập kế hoạch mùa vụ trở nên đơn giản hơn nhiều. Chi phí phân bón giảm rõ rệt mà năng suất vẫn tăng đều.',
    name: 'Phạm Thu Hà',
    company: 'FieldLogic, Gia Lai',
    image: 'https://picsum.photos/seed/khachhang4/500/500',
  },
  {
    quote:
      'Báo cáo trực quan, dễ hiểu giúp cả gia đình tôi cùng theo dõi và ra quyết định canh tác. Đây là công cụ không thể thiếu mỗi vụ mùa.',
    name: 'Đặng Quốc Bảo',
    company: 'FarmSync, Bình Thuận',
    image: 'https://picsum.photos/seed/khachhang5/500/500',
  },
];

const BRANDS = ['AgroField', 'CropSense', 'TerraGrow', 'FieldLogic', 'FarmSync'];

const AUTOPLAY_MS = 3800;
const TRANSITION_MS = 700;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TestimonialsSlider() {
  const [titleRef, titleInView] = useInView<HTMLDivElement>(0.3);
  const [subRef, subInView] = useInView<HTMLDivElement>(0.3);
  const [sectionRef, sectionInView] = useInView<HTMLDivElement>(0.15);

  /* ---- responsive: cards visible at once ---- */
  const [perView, setPerView] = useState(2);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setPerView(1);
      else setPerView(2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ---- infinite loop via cloned edge slides ---- */
  const CLONE_COUNT = 2;
  const slides = [
    ...TESTIMONIALS.slice(-CLONE_COUNT),
    ...TESTIMONIALS,
    ...TESTIMONIALS.slice(0, CLONE_COUNT),
  ];
  const realCount = TESTIMONIALS.length;

  const [index, setIndex] = useState(CLONE_COUNT);
  const [withTransition, setWithTransition] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dragX, setDragX] = useState(0);
  const [dragBaseWidth, setDragBaseWidth] = useState(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const [isHovering, setIsHovering] = useState(false);

  const goTo = useCallback((next: number) => setIndex(next), []);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  /* ---- autoplay ---- */
  useEffect(() => {
    if (isHovering || dragging.current) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isHovering, index]);

  /* ---- seamless jump on cloned edges ---- */
  const handleTransitionEnd = () => {
    if (index >= realCount + CLONE_COUNT) {
      setWithTransition(false);
      setIndex(index - realCount);
    } else if (index < CLONE_COUNT) {
      setWithTransition(false);
      setIndex(index + realCount);
    }
  };

  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

  /* ---- pointer drag ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
    setDragX(0);
    setDragBaseWidth(containerRef.current ? containerRef.current.offsetWidth : 0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDragX(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;

    const container = containerRef.current;
    const cardWidth = container ? container.offsetWidth / perView : 0;
    const threshold = cardWidth * 0.18;

    if (dragX < -threshold) setIndex((i) => i + 1);
    else if (dragX > threshold) setIndex((i) => i - 1);

    setDragX(0);
  };

  const slidePercent = 100 / perView;
  const baseOffset = -(index * slidePercent);
  const dragOffsetPercent = dragBaseWidth ? (dragX / dragBaseWidth) * 100 : 0;

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
        {/* ============================================================ */}
        {/* Title / subtitle row                                         */}
        {/* ============================================================ */}
        <div className="mb-10 grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
          <div
            ref={titleRef}
            className={`transition-all duration-[1500ms] ease-out ${
              titleInView ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
            }`}
          >
            <span className="mb-[16px] inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-[14px] py-[6px] text-[12px] font-semibold text-ink/70">
              <span className="h-[6px] w-[6px] rounded-full bg-lime-dark" />
              Cảm nhận khách hàng
            </span>
            <h2 className="uppercase text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              Câu Chuyện Thật
              <br />
              <span className="italic font-normal text-lime-dark">
                Từ Nông Dân Của Chúng Tôi
              </span>
            </h2>
          </div>

          <div
            ref={subRef}
            className={`self-center transition-all duration-[1500ms] ease-out md:justify-self-end md:text-right lg:mt-[120px] ${
              subInView ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
            }`}
          >
            <p className="max-w-md text-base leading-relaxed text-justify text-ink/55 md:ml-auto">
              Lắng nghe trực tiếp từ những nông dân sử dụng giải pháp của
              chúng tôi mỗi ngày và chứng kiến tác động thực tế trên cánh
              đồng, mùa vụ của họ.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Slider                                                        */}
        {/* ============================================================ */}
        <div
          ref={sectionRef}
          className={`transition-all duration-[1500ms] ease-out ${
            sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={containerRef}
            className="overflow-hidden select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <div
              onTransitionEnd={handleTransitionEnd}
              className="flex cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(${baseOffset + dragOffsetPercent}%)`,
                transition: withTransition
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                  : 'none',
              }}
            >
              {slides.map((t, i) => (
                <div key={i} className="shrink-0 px-3" style={{ width: `${slidePercent}%` }}>
                  <div className="flex h-full min-h-[280px] overflow-hidden rounded-2xl border border-ink/10 bg-white sm:min-h-[300px]">
                    {/* Left: quote content */}
                    <div className="flex w-3/5 flex-col justify-between p-6 sm:p-7">
                      <div>
                        <Quote
                          className="mb-4 text-lime-dark/40"
                          size={28}
                          fill="currentColor"
                          strokeWidth={0}
                        />
                        <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                          {t.quote}
                        </p>
                      </div>
                      <div className="mt-6 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">{t.name}</p>
                          <p className="text-xs text-ink/40">{t.company}</p>
                        </div>
                        <button
                          type="button"
                          className="hidden shrink-0 items-center gap-1 text-xs font-medium text-ink/55 hover:text-ink sm:flex"
                        >
                          Xem thêm
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Right: portrait image */}
                    <div className="w-2/5 shrink-0">
                      <img
                        src={t.image}
                        alt={t.name}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brands row + arrows */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {BRANDS.map((b, i) => (
                <span
                  key={b}
                  className={`text-xs font-medium sm:text-sm ${
                    i === 0 ? 'text-ink' : 'text-ink/25'
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Slide trước"
                onClick={prev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-ink-deep hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Slide tiếp theo"
                onClick={next}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-deep text-white transition-colors hover:bg-ink"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}