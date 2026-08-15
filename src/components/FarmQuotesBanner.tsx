/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * FarmQuotesBanner
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * Layout matches the reference banner: a dark-green rounded card with a
 * photo bleeding in from the right (fixed, does NOT slide) and, on the
 * left, an auto-playing / drag-to-swipe TEXT slider of famous quotes
 * about high-tech farming. Only the left text block animates between
 * slides — the photo stays put.
 *
 * Palette:
 *   Yellow      #FFFACD
 *   Dark green  #006400
 *   Light blue  #87CEFA
 */

const QUOTES = [
  {
    quote:
      "Nông nghiệp công nghệ cao không thay thế người nông dân, mà trao cho họ đôi mắt nhìn xa hơn và đôi tay chăm sóc chính xác hơn.",
    author: "Kỹ sư Nông nghiệp Thông minh",
  },
  {
    quote:
      "Mỗi cảm biến trên cánh đồng là một lời thì thầm của đất, giúp chúng ta trồng trọt bằng dữ liệu thay vì phỏng đoán.",
    author: "Chuyên gia Canh tác Chính xác",
  },
  {
    quote:
      "Công nghệ chỉ thực sự có giá trị khi nó giúp một hạt giống nảy mầm tốt hơn và một gia đình nông dân sống khỏe hơn.",
    author: "Nhà nghiên cứu Nông nghiệp Bền vững",
  },
  {
    quote:
      "Tương lai của lương thực không nằm ở việc canh tác nhiều hơn, mà ở việc canh tác thông minh hơn với ít tài nguyên hơn.",
    author: "Chuyên gia Nông nghiệp Đô thị",
  },
];

const AUTOPLAY_MS = 4500;

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');`;

export default function FarmQuotesBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); // % of slide width

  const dragState = useRef({ startX: 0, width: 1 });

  // reveal banner on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // autoplay (paused while dragging)
  useEffect(() => {
    if (!inView || isDragging) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [inView, isDragging]);

  const goTo = useCallback((i: number) => {
    setIndex(((i % QUOTES.length) + QUOTES.length) % QUOTES.length);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragState.current.startX = e.clientX;
    dragState.current.width = trackRef.current?.offsetWidth || 1;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragState.current.startX;
    setDragOffset((delta / dragState.current.width) * 100);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -12) goTo(index + 1);
    else if (dragOffset > 12) goTo(index - 1);
    setDragOffset(0);
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#006400]">
      <style>{FONT_IMPORT}</style>
      <div className="relative min-h-[560px] w-full overflow-hidden bg-[#006400] sm:min-h-[680px] lg:min-h-[820px]">
        {/* full-bleed background photo */}
        <img
          src="https://images.unsplash.com/photo-1595855709940-2fb8fe661e0e?auto=format&fit=crop&w=1600&q=80"
          alt="Người nông dân cầm giỏ rau củ và trái cây tươi"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* dark-green wash so the text stays readable, fades out toward the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#006400] via-[#006400]/85 to-[#006400]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#006400]/70 via-transparent to-transparent lg:hidden" />
        {/* decorative yellow blob, top-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#FFFACD]/90"
        />

        {/* decorative dot grid, top-right */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-8 hidden opacity-40 sm:block"
          width="84"
          height="56"
        >
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 12 + 4} cy={r * 12 + 4} r="2" fill="#FFFACD" />
            ))
          )}
        </svg>

        {/* decorative dot grid, bottom-left */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-10 hidden opacity-30 sm:block"
          width="72"
          height="48"
        >
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 6 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 12 + 4} cy={r * 12 + 4} r="2" fill="#87CEFA" />
            ))
          )}
        </svg>

        {/* thin leaf line-art accents */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-1/3 hidden h-24 w-24 opacity-10 lg:block"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path d="M50 90C20 90 10 50 10 10C50 10 90 40 90 70C90 82 70 90 50 90Z" stroke="#FFFACD" strokeWidth="2" />
        </svg>

        <div className="relative grid grid-cols-1 lg:h-full lg:min-h-[820px]">
          {/* text block sits on top of the background photo (left-aligned) */}
          <div className="relative z-10 flex max-w-xl flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:py-0 lg:pl-20 lg:pr-4">
            <div
              className="relative select-none overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
            >
              <span
                className={`mb-4 inline-block rounded-full bg-[#87CEFA]/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#87CEFA] transition-all duration-700 ease-out [font-family:'Inter',sans-serif] ${
                  inView ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
              >
                CÂU NÓI TRUYỀN CẢM HỨNG
              </span>

              <div
                ref={trackRef}
                className="flex cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translateX(calc(${-index * 100}% + ${dragOffset}%))`,
                  transition: isDragging
                    ? "none"
                    : "transform 700ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {QUOTES.map((q, i) => {
                  const isActive = i === index;
                  return (
                    <div key={i} className="w-full shrink-0 pr-2 sm:pr-8">
                      <h2
                        className={`min-h-[112px] text-[26px] font-semibold leading-[1.35] tracking-[-0.01em] text-[#FFFACD] transition-all duration-700 ease-out [font-family:'Poppins',sans-serif] sm:min-h-[96px] sm:text-[32px] ${
                          isActive
                            ? "translate-x-0 opacity-100 delay-300"
                            : "-translate-x-10 opacity-0"
                        }`}
                      >
                        “{q.quote}”
                      </h2>
                      <p
                        className={`mt-4 text-sm font-medium italic tracking-wide text-white/75 transition-all duration-700 ease-out [font-family:'Inter',sans-serif] sm:text-base ${
                          isActive
                            ? "translate-x-0 opacity-100 delay-500"
                            : "-translate-x-10 opacity-0"
                        }`}
                      >
                        — {q.author}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* static button — does not slide */}
            <div
              className={`mt-8 flex items-center gap-5 transition-all delay-700 duration-700 ease-out ${
                inView ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              }`}
            >
              <button
                className="rounded-full bg-[#FFFACD] px-8 py-3 text-sm font-semibold tracking-wide text-[#006400]
                           shadow-md transition-colors duration-300 ease-in-out [font-family:'Poppins',sans-serif]
                           hover:bg-[#87CEFA] hover:text-[#006400]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFACD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#006400]"
              >
                Khám phá thêm
              </button>

              {/* dot indicators */}
              <div className="flex items-center gap-2">
                {QUOTES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Xem câu nói ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-[#FFFACD]" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}