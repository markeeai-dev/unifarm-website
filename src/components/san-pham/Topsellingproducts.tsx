"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * TopSellingProducts — dùng riêng cho trang /san-pham
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * - Infinite-loop carousel (7 real cards, cloned edges) showing ~4 full
 *   cards at a time on desktop, autoplaying every 3.5s.
 * - Dragging glides across as many cards as the drag distance implies
 *   (not a rigid "one drag = one slide" snap) for a smooth, continuous feel.
 * - Hover on a card: crossfades to a second photo, a soft white light
 *   sweeps across once, and the name / description / "+ Xem thêm" button
 *   fade in centered over a dark scrim. On touch devices, tapping a card
 *   toggles the same reveal (a tap that was actually a drag is ignored).
 * - Whole section eases in over ~4.5s on first scroll-into-view.
 *
 * Palette:
 *   Yellow      #FFFACD
 *   Dark green  #006400
 *   Light blue  #87CEFA (also used for the "+ Xem thêm" button accent)
 */

const ACCENT = "#87cefa";

const PRODUCTS = [
  {
    id: "papaya",
    name: "Đu Đủ",
    desc: "Ngọt thanh, giàu vitamin C, hỗ trợ tiêu hóa tự nhiên.",
    image: "/images/products/papaya-a.jpg",
    hoverImage: "/images/products/papaya-b.jpg",
  },
  {
    id: "broccoli",
    name: "Bông Cải Xanh",
    desc: "Giàu chất xơ và chất chống oxy hoá, rất tốt cho tim mạch.",
    image: "/images/products/broccoli-a.jpg",
    hoverImage: "/images/products/broccoli-b.jpg",
  },
  {
    id: "watermelon",
    name: "Dưa Hấu",
    desc: "Mọng nước, giải nhiệt tức thì cho những ngày hè oi ả.",
    image: "/images/products/watermelon-a.jpg",
    hoverImage: "/images/products/watermelon-b.jpg",
  },
  {
    id: "carrot",
    name: "Cà Rốt",
    desc: "Giàu beta-carotene, tốt cho mắt và làn da khoẻ mạnh.",
    image: "/images/products/carrot-a.jpg",
    hoverImage: "/images/products/carrot-b.jpg",
  },
  {
    id: "strawberry",
    name: "Dâu Tây",
    desc: "Vị chua ngọt hài hoà, giàu vitamin và chất chống oxy hoá.",
    image: "/images/products/strawberry-a.jpg",
    hoverImage: "/images/products/strawberry-b.jpg",
  },
  {
    id: "cabbage",
    name: "Bắp Cải",
    desc: "Giòn ngọt tự nhiên, giàu vitamin K và chất xơ.",
    image: "/images/products/cabbage-a.jpg",
    hoverImage: "/images/products/cabbage-b.jpg",
  },
  {
    id: "mango",
    name: "Xoài",
    desc: "Thơm ngọt đậm đà, giàu vitamin A và C.",
    image: "/images/products/mango-a.jpg",
    hoverImage: "/images/products/mango-b.jpg",
  },
];

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 650;
const CLONE_COUNT = 4;

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook                                                  */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
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
/*  Card                                                                */
/* ------------------------------------------------------------------ */
type Product = (typeof PRODUCTS)[number];

function ProductCard({
  product,
  dragMovedRef,
}: {
  product: Product;
  dragMovedRef: React.RefObject<boolean>;
}) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const revealed = hovered || tapped;

  return (
    <div
      className="group relative aspect-[4/5.2] w-full cursor-pointer select-none overflow-hidden bg-[#fffde7] shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (dragMovedRef.current) {
          dragMovedRef.current = false;
          return;
        }
        setTapped((t) => !t);
      }}
    >
      {/* Base photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
        style={{ opacity: revealed ? 0 : 1 }}
      />
      {/* Hover photo — crossfades in */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.hoverImage}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-500 ease-out"
        style={{ opacity: revealed ? 1 : 0 }}
      />

      {/* Soft light sweep — plays once as the card is revealed */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/45 to-transparent"
        style={{
          width: "60%",
          transform: revealed ? "translateX(220%) skewX(-12deg)" : "translateX(-160%) skewX(-12deg)",
          transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Bottom name label — default state */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300"
        style={{ opacity: revealed ? 0 : 1 }}
      >
        <p className="text-base font-bold text-white sm:text-lg">{product.name}</p>
      </div>

      {/* Center reveal panel — name / description / + Xem thêm */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-5 text-center transition-all duration-400 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.92)",
        }}
      >
        <p className="text-lg font-bold text-white sm:text-xl">{product.name}</p>
        <p className="mt-2 text-xs leading-relaxed text-white/85 sm:text-sm">{product.desc}</p>

        <button
          type="button"
          className="pointer-events-auto group/btn mt-4 inline-flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-md ring-4 ring-[#87cefa]/20 transition-all duration-300 group-hover/btn:ring-[#87cefa]/40 sm:h-9 sm:w-9"
            style={{ backgroundColor: ACCENT }}
          >
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="text-xs font-semibold tracking-wide text-white sm:text-sm">Xem thêm</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */
export default function TopSellingProducts() {
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.12);

  const [perView, setPerView] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1.25);
      else if (window.innerWidth < 1024) setPerView(2.3);
      else setPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const realCount = PRODUCTS.length;
  const slides = [
    ...PRODUCTS.slice(-CLONE_COUNT),
    ...PRODUCTS,
    ...PRODUCTS.slice(0, CLONE_COUNT),
  ];

  const [index, setIndex] = useState(CLONE_COUNT);
  const [withTransition, setWithTransition] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dragX, setDragX] = useState(0);
  const [dragBaseWidth, setDragBaseWidth] = useState(0);
  const dragging = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartX = useRef(0);
  const [isHovering, setIsHovering] = useState(false);

  /* ---- autoplay (paused while hovering or dragging) ---- */
  useEffect(() => {
    if (isHovering || dragging.current) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isHovering, index]);

  /* ---- seamless jump when hitting a cloned edge ---- */
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

  /* ---- pointer drag — glides across as many cards as the distance implies ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragMovedRef.current = false;
    dragStartX.current = e.clientX;
    setDragX(0);
    setDragBaseWidth(containerRef.current ? containerRef.current.offsetWidth : 0);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 6) dragMovedRef.current = true;
    setDragX(delta);
  };

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;

    const cardWidthPx = dragBaseWidth / perView || 1;
    const rawDelta = dragX / cardWidthPx;
    let deltaCards = Math.round(rawDelta);
    if (deltaCards === 0 && Math.abs(rawDelta) > 0.15) {
      deltaCards = rawDelta > 0 ? 1 : -1;
    }
    const clamped = Math.max(-CLONE_COUNT, Math.min(CLONE_COUNT, deltaCards));

    if (clamped !== 0) setIndex((i) => i - clamped);
    setDragX(0);
  }, [dragBaseWidth, dragX, perView]);

  const slidePercent = 100 / perView;
  const baseOffset = -(index * slidePercent);
  const dragOffsetPercent = dragBaseWidth ? (dragX / dragBaseWidth) * 100 : 0;

  return (
    <section className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 sm:py-20 lg:py-15">
      <div
        ref={sectionRef}
        className="mx-auto w-full max-w-none transition-all ease-out"
        style={{
          transitionDuration: "6500ms",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(48px)",
        }}
      >
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#87CEFA]">
            Tươi mỗi ngày
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold leading-tight tracking-[-0.01em] text-[#006400] sm:text-4xl lg:text-[42px]">
            Sản Phẩm Bán Chạy
          </h2>
        </div>

        <div
          className="relative mt-10 sm:mt-14"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={containerRef}
            className="overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <div
              className="flex cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(${baseOffset + dragOffsetPercent}%)`,
                transition: withTransition
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((product, i) => (
                <div key={i} className="shrink-0 px-1.5 sm:px-2" style={{ width: `${slidePercent}%` }}>
                  <ProductCard product={product} dragMovedRef={dragMovedRef} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
