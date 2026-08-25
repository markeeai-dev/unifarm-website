"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

/** Số đếm chạy dần khi vào trang, tạo cảm giác dashboard "sống". */
export function Counter({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    const steps = 30;
    let tick = 0;
    const timer = setInterval(() => {
      tick++;
      setVal(Math.min(Math.round((to / steps) * tick), to));
      if (tick >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <>{val.toLocaleString("vi-VN")}</>;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  color,
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: ReactNode;
  color: string;
  href?: string;
}) {
  const content = (
    <div
      className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_var(--tw-shadow-color)]"
      style={{ borderColor: `${color}20`, ["--tw-shadow-color" as string]: `${color}40` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.06] transition-opacity group-hover:opacity-[0.1]"
        style={{ background: color }}
      />
      <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="mt-4 text-[28px] font-extrabold leading-none tracking-tight text-[#0f172a]">
        <Counter to={value} />
      </div>
      <div className="mt-1.5 text-sm font-semibold text-gray-500">{label}</div>
      {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: color }}
      />
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(max ? (value / max) * 100 : 0), 120);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#06301B]">{label}</span>
        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: `${color}15`, color }}>
          {value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function DonutChart({
  segments,
  size = 128,
  thickness = 20,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const arcs = segments.reduce<Array<(typeof segments)[number] & { dash: number; gap: number; offset: number }>>(
    (acc, seg) => {
      const pctVal = seg.value / total;
      const dash = pctVal * circ;
      const prev = acc[acc.length - 1];
      const offset = prev ? prev.offset + prev.dash : 0;
      return [...acc, { ...seg, dash, gap: circ - dash, offset }];
    },
    [],
  );
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }}
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-extrabold text-[#0f172a]">{total}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Tổng</div>
      </div>
    </div>
  );
}

export function SectionCard({ title, sub, action, children }: { title: string; sub?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-extrabold text-[#0f172a]">{title}</h2>
          {sub && <p className="mt-0.5 text-xs font-medium text-gray-400">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function QuickAction({ href, icon, label, desc, color }: { href: string; icon: ReactNode; label: string; desc: string; color: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl border border-black/5 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
      style={{ ["--tw-shadow-color" as string]: `${color}25` }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
        style={{ background: `${color}12`, color }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[#0f172a] transition-colors group-hover:opacity-80">{label}</span>
        <span className="block truncate text-xs text-gray-400">{desc}</span>
      </span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5" style={{ color }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
