'use client';

import { useEffect, useRef, useState } from 'react';
import { Salad, Cherry, GlassWater, Wheat, ArrowRight } from 'lucide-react';

/**
 * CategoryShowcase
 * -----------------
 * 4 full-width category cards (Vegetable / Fruit / Fruit Juice / Dried).
 * - Ambient "ken burns" zoom loop on every card (slow, staggered, never stops).
 * - On hover: an *additional* layer of motion kicks in — deeper zoom,
 *   icon lifts & rotates, a "Xem sản phẩm" link slides up, overlay darkens.
 * - Each card shows a small item-count line under the title, like the ref image.
 * - Whole row reveals with a slow (3.5s) staggered fade/rise as it scrolls
 *   into view — done once, via IntersectionObserver.
 *
 * Drop this file in e.g. components/CategoryShowcase.jsx and use:
 *   <CategoryShowcase />
 * Requires: tailwindcss, lucide-react (npm i lucide-react)
 */

type Category = {
  id: string;
  title: string;
  count: string;
  image: string;
  Icon: typeof Salad;
};

const CATEGORIES: Category[] = [
  {
    id: 'fresh-fruit',
    title: 'Trái cây tươi',
    count: '24 sản phẩm',
    image:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=85',
    Icon: Cherry,
  },
  {
    id: 'tissue-culture',
    title: 'Cây giống nuôi cấy mô',
    count: '8 sản phẩm',
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85',
    Icon: Salad,
  },
  {
    id: 'processed',
    title: 'Sản phẩm chế biến',
    count: '16 sản phẩm',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85',
    Icon: GlassWater,
  },
  {
    id: 'other',
    title: 'Khác',
    count: '10 sản phẩm',
    image:
      'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=85',
    Icon: Wheat,
  },
];

/** Reveal-on-scroll: fires once, ~3.5s ease-out fade + rise, staggered per card. */
function useRevealOnScroll(count: number) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { containerRef, visible };
}

export default function CategoryShowcase() {
  const { containerRef, visible } = useRevealOnScroll(CATEGORIES.length);

  return (
    <section ref={containerRef} className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-10 sm:py-14">
      <style>{`
        @keyframes sanpham-card-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>

      <div className="grid w-full grid-cols-2 md:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  index,
  visible,
}: {
  category: Category;
  index: number;
  visible: boolean;
}) {
  const { title, count, image, Icon } = category;

  return (
    <a
      href={`#${category.id}`}
      className="
        group relative block overflow-hidden
        h-[220px] sm:h-[320px] md:h-[420px]
        rounded-sm
        outline-none focus-visible:ring-2 focus-visible:ring-white/80
      "
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '3500ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${index * 220}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(56px)',
      }}
    >
      {/* Ambient zoom layer — always breathing slowly, never stops */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute inset-0 bg-cover bg-center
            transition-transform duration-700 ease-out
            group-hover:scale-[1.22]
          "
          style={{
            backgroundImage: `url(${image})`,
            animation: `sanpham-card-breathe 9s ease-in-out infinite`,
            animationDelay: `${index * 0.6}s`,
          }}
        />
      </div>

      {/* Overlay — darkens further and warms slightly on hover */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t from-black/75 via-black/25 to-black/10
          transition-all duration-500
          group-hover:from-black/85 group-hover:via-black/35
        "
      />

      {/* Subtle ring that appears on hover, like the card is being picked up */}
      <div
        className="
          absolute inset-0 ring-1 ring-inset ring-white/0
          transition-all duration-500
          group-hover:ring-white/25
        "
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2.5 px-4 text-center text-white">
        <span
          className="
            flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full
            border border-white/80
            transition-transform duration-500 ease-out
            group-hover:-translate-y-1.5 group-hover:rotate-[8deg] group-hover:scale-110
          "
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
        </span>

        <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-wide">
          {title}
        </h3>

        {/* Count + CTA — hidden by default, revealed only on hover */}
        <span
          className="
            text-[11px] sm:text-xs tracking-[0.15em] text-white/85
            max-h-0 opacity-0 -translate-y-1
            transition-all duration-500 delay-75
            group-hover:max-h-6 group-hover:opacity-100 group-hover:translate-y-0
          "
        >
          - {count} -
        </span>

        <span
          className="
            flex items-center gap-1 text-[11px] sm:text-xs font-medium
            uppercase tracking-wider text-white
            max-h-0 opacity-0 translate-y-2
            transition-all duration-500 delay-150
            group-hover:max-h-6 group-hover:opacity-100 group-hover:translate-y-0
            group-hover:mt-1
          "
        >
          Xem sản phẩm
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
}