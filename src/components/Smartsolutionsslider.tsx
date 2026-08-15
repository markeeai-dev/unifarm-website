'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook (same pattern as the hero section)              */
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
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

const SLIDES = [
  {
    image: 'https://picsum.photos/seed/nongtrai1/800/900',
    title: 'Quản Lý Cây Trồng Chính Xác',
    subtitle:
      'Theo dõi đất, cây trồng và thời tiết theo thời gian thực để đưa ra quyết định tốt hơn và năng suất cao hơn.',
  },
  {
    image: 'https://picsum.photos/seed/nongtrai2/800/900',
    title: 'Tự Động Hóa Nông Trại Thông Minh',
    subtitle:
      'Tự động tưới tiêu và vận hành để tiết kiệm thời gian, cắt giảm chi phí và tăng hiệu quả.',
  },
  {
    image: 'https://picsum.photos/seed/nongtrai3/800/900',
    title: 'Nông Nghiệp Bền Vững',
    subtitle: 'Bảo vệ đất, bảo tồn tài nguyên và phát triển lâu dài.',
  },
  {
    image: 'https://picsum.photos/seed/nongtrai4/800/900',
    title: 'Giám Sát Sức Khỏe Cây Trồng',
    subtitle:
      'Phát hiện sớm sâu bệnh và thiếu dinh dưỡng nhờ cảm biến thông minh gắn trên đồng ruộng.',
  },
  {
    image: 'https://picsum.photos/seed/nongtrai5/800/900',
    title: 'Phân Tích Dữ Liệu Nông Trại',
    subtitle:
      'Chuyển đổi dữ liệu cánh đồng thành thông tin hữu ích, dễ hành động cho từng vụ mùa.',
  },
];

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 700;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SmartSolutionsSlider() {
  const [titleRef, titleInView] = useInView<HTMLDivElement>(0.3);
  const [subRef, subInView] = useInView<HTMLDivElement>(0.3);
  const [sliderRef, sliderInView] = useInView<HTMLDivElement>(0.15);

  /* ---- responsive: how many cards are visible at once ---- */
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1.15);
      else if (window.innerWidth < 1024) setPerView(2.15);
      else setPerView(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ---- infinite loop via cloned edge slides ---- */
  const CLONE_COUNT = 3;
  const slides = [
    ...SLIDES.slice(-CLONE_COUNT),
    ...SLIDES,
    ...SLIDES.slice(0, CLONE_COUNT),
  ];
  const realCount = SLIDES.length;

  const [index, setIndex] = useState(CLONE_COUNT); // start on first real slide
  const [withTransition, setWithTransition] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dragX, setDragX] = useState(0);
  const [dragBaseWidth, setDragBaseWidth] = useState(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const [isHovering, setIsHovering] = useState(false);

  const goTo = useCallback((next: number, animate = true) => {
    setWithTransition(animate);
    setIndex(next);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  /* ---- autoplay ---- */
  useEffect(() => {
    if (isHovering || dragging.current) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isHovering, index]);

  /* ---- seamless jump when hitting a cloned slide ---- */
  const handleTransitionEnd = () => {
    if (index >= realCount + CLONE_COUNT) {
      setWithTransition(false);
      setIndex(index - realCount);
    } else if (index < CLONE_COUNT) {
      setWithTransition(false);
      setIndex(index + realCount);
    }
  };

  // re-enable transition on next tick after a silent jump
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
              Canh tác thông minh
            </span>
            <h2 className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              Giải Pháp Thông Minh Cho
              <br />
              <span className="font-display italic font-normal text-lime-dark">
                Nông Nghiệp Hiện Đại
              </span>
            </h2>
          </div>

          <div
            ref={subRef}
            className={`mt-3 self-center transition-all duration-[1500ms] ease-out md:mt-30 md:justify-self-end md:text-right ${
              subInView ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
            }`}
          >
            <p className="max-w-md text-justify text-base leading-relaxed text-ink/55 md:ml-auto">
              Chúng tôi trao quyền cho nông dân với các công cụ thông minh và
              thông tin dựa trên dữ liệu để tăng năng suất, giảm chi phí và
              xây dựng một tương lai nông nghiệp bền vững hơn.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Slider                                                        */}
        {/* ============================================================ */}
        <div
          ref={sliderRef}
          className="relative"
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
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              className="flex cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(${baseOffset + dragOffsetPercent}%)`,
                transition: withTransition
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                  : 'none',
              }}
            >
              {slides.map((slide, i) => {
                // Only the cards visible in the very first frame get a staggered
                // rise-in; everything else just sits ready (it enters view via the
                // carousel's own slide motion, so it never needs its own fade-in —
                // that avoids cards you drag/autoplay to looking blank for a beat).
                const isInitialBatch = i >= CLONE_COUNT && i < CLONE_COUNT + Math.ceil(perView);
                const shown = !isInitialBatch || sliderInView;
                return (
                  <div
                    key={i}
                    className="shrink-0 px-3 transition-all duration-[450ms] ease-out"
                    style={{
                      width: `${slidePercent}%`,
                      opacity: shown ? 1 : 0,
                      transform: shown ? 'translateY(0)' : 'translateY(56px)',
                      transitionDelay: isInitialBatch ? `${(i - CLONE_COUNT) * 350}ms` : '0ms',
                    }}
                  >
                  <div className="group">
                    <div className="aspect-[4/4.3] w-full overflow-hidden rounded-2xl bg-ink/5">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-ink">
                      {slide.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/45">
                      {slide.subtitle}
                    </p>
                  </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrows — fade in once the cards have finished landing */}
          <div
            className="mt-6 flex justify-end gap-3 transition-opacity duration-700 ease-out"
            style={{
              opacity: sliderInView ? 1 : 0,
              transitionDelay: sliderInView ? `${Math.ceil(perView) * 350 + 150}ms` : '0ms',
            }}
          >
            <button
              type="button"
              aria-label="Slide trước"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-ink-deep hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Slide tiếp theo"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-ink-deep hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}