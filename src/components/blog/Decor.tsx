"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/use-is-mobile";

/* ─── Border Trace — glowing dash traveling around section perimeter ─── */
export function BorderTrace({
  color = "rgba(0,100,0,0.35)",
  glow,
  duration = 10,
}: {
  color?: string;
  glow?: string;
  duration?: number;
}) {
  return (
    <svg
      className="absolute inset-0 z-2 h-full w-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        fill="none"
        stroke={color.replace(/[\d.]+\)$/, "0.08)")}
        strokeWidth="1"
      />
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="120 380"
        style={{
          animation: `borderTrace ${duration}s linear infinite`,
          filter: glow ? `drop-shadow(0 0 6px ${glow})` : undefined,
        }}
      />
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        fill="none"
        stroke={color.replace(/[\d.]+\)$/, "0.15)")}
        strokeWidth="1"
        strokeDasharray="60 440"
        style={{ animation: `borderTraceReverse ${duration * 1.4}s linear infinite` }}
      />
    </svg>
  );
}

/* ─── Particles — deterministic pseudo-random so SSR/client markup matches ─── */
type Particle = {
  w: number;
  h: number;
  l: number;
  t: number;
  dy: number;
  dx: number;
  dur: number;
  del: number;
};

function seeded(seed: number, i: number, salt: number) {
  const x = Math.sin(seed * salt + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function createParticles(count: number, seed: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seeded(seed, i, 999);
    const r2 = seeded(seed, i, 777);
    const r3 = seeded(seed, i, 555);
    const r4 = seeded(seed, i, 333);
    return {
      w: r1 * 5 + 2,
      h: r2 * 5 + 2,
      l: r3 * 100,
      t: r4 * 100,
      dy: -(r1 * 40 + 20),
      dx: (r2 - 0.5) * 20,
      dur: r3 * 4 + 4,
      del: r4 * 6,
    };
  });
}

export function Particles({
  count = 22,
  light = false,
  seed = 1,
}: {
  count?: number;
  light?: boolean;
  seed?: number;
}) {
  // Mobile: this decorative layer is one of the biggest contributors to
  // simultaneous inline (infinite-repeat) animations on /blog (~92 dots
  // across the page's 5 Particles instances) and was implicated in the
  // page's worst long scroll task. Cap the count on mobile only — purely
  // decorative dots, so a lower density has no functional effect.
  // `isMobile` is null until the client media query resolves, so it
  // defaults to the original (desktop) count until then, matching the
  // pattern used elsewhere (see ExportCard in Statssectionpreview.tsx).
  const isMobile = useIsMobile();
  const effectiveCount = isMobile ? Math.max(4, Math.round(count / 3)) : count;
  const particles = createParticles(effectiveCount, seed);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${light ? "bg-[#006400]/20" : "bg-white/15"}`}
          style={{ width: p.w, height: p.h, left: `${p.l}%`, top: `${p.t}%` }}
          animate={{
            y: [0, p.dy, 0],
            x: [0, p.dx, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Corner brackets ─── */
export function CornerBrackets({ color = "rgba(0,100,0,0.15)" }: { color?: string }) {
  return (
    <>
      <svg className="absolute top-5 left-5 z-2 h-[50px] w-[50px] pointer-events-none" viewBox="0 0 60 60" fill="none">
        <path d="M0 60 L0 0 L60 0" stroke={color} strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill={color.replace(/[\d.]+\)$/, "0.5)")} />
      </svg>
      <svg
        className="absolute bottom-5 right-5 z-2 h-[50px] w-[50px] rotate-180 pointer-events-none"
        viewBox="0 0 60 60"
        fill="none"
      >
        <path d="M0 60 L0 0 L60 0" stroke={color} strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill={color.replace(/[\d.]+\)$/, "0.5)")} />
      </svg>
    </>
  );
}

export const BLOG_DECOR_KEYFRAMES = `
  @keyframes borderTrace {
    0%   { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -2000; }
  }
  @keyframes borderTraceReverse {
    0%   { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 2000; }
  }
  @keyframes blog-shine {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }
`;
