"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setProgress(max > 0 ? Math.min(scrollTop / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Về đầu trang"
      // Hidden below its resting position by default (translate-y-4) and
      // slides up into place (translate-y-0) once the user has scrolled
      // past the threshold — i.e. it rises up from below as you scroll down.
      className={`fixed bottom-6 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white shadow-lg ring-1 ring-black/5 transition-all duration-500 ease-out hover:bg-gold hover:text-ink sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Scroll-progress ring, in gold to pop against the green button */}
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={2.5}
        />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="var(--color-gold, #f2c230)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-150 ease-linear"
        />
      </svg>
      <ArrowUp size={18} strokeWidth={2.2} className="relative" />
    </button>
  );
}