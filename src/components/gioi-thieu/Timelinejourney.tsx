"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Sprout,
  Ship,
  Handshake,
  Network,
  Cpu,
  Leaf,
  Rocket,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import type { TimelineMilestone } from "@/lib/db";

/* ------------------------------------------------------------------ */
/*  Map tên icon (string, lưu trong DB) -> component lucide-react      */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, LucideIcon> = {
  Sprout,
  Ship,
  Handshake,
  Network,
  Cpu,
  Leaf,
  Rocket,
};

/* ------------------------------------------------------------------ */
/*  Thẻ media minh hoạ (không phụ thuộc ảnh ngoài)                     */
/* ------------------------------------------------------------------ */

function MediaCard({ label, video }: { label: string; video: string }) {
  return (
    <div className="group relative flex h-full min-h-[130px] w-full items-end overflow-hidden rounded-2xl p-3 sm:min-h-[150px]">
      {/* video nền */}
      <video
        src={video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(6,48,27,0) 45%,rgba(6,48,27,0.75) 100%)",
        }}
      />
      <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-transform duration-300 group-hover:scale-110">
        <PlayCircle className="h-4 w-4 text-[#006400]" />
      </div>
      <span className="atx-body relative z-10 text-xs font-semibold leading-snug text-white">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook: cuộn dòng thời gian để mốc đang chọn luôn hiện trong khung    */
/* ------------------------------------------------------------------ */

function useScrollIntoView(active: number, count: number): React.RefObject<HTMLDivElement | null> {
  const trackRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const buttons = track.querySelectorAll("button");
    const item = buttons[active];
    if (!item) return;
    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.left < trackRect.left || itemRect.right > trackRect.right) {
      item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [active, count]);
  return trackRef;
}

/* ------------------------------------------------------------------ */
/*  Component chính                                                    */
/* ------------------------------------------------------------------ */

export default function TimelineJourney({ milestones }: { milestones: TimelineMilestone[] }) {
  const [active, setActive] = useState(4);
  const [inView, setInView] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);

  const trackRef = useScrollIntoView(active, milestones.length);

  const n = milestones.length;
  const progressPct = ((active + 0.5) / n) * 100;
  const current = milestones[active];
  const CurrentIcon = ICON_MAP[current.icon] ?? Sprout;

  /* -------------------------------------------------------------- */
  /* Intersection Observer                                          */
  /* Mỗi lần rời section rồi quay lại -> animation chạy lại         */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0.18,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-28"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap');

        .atx-display {
          font-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif;
        }

        .atx-body {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        .atx-mono {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
        }

        .atx-tl-track::-webkit-scrollbar {
          display: none;
        }

        .atx-tl-track {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* ========================================================== */
        /* TIMELINE - xuất hiện từng mốc                              */
        /* ========================================================== */

        @keyframes timelineItemIn {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.78);
            filter: blur(4px);
          }

          60% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .timeline-item-in {
          animation: timelineItemIn
            850ms
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        /* ========================================================== */
        /* CARD - xen kẽ phóng to / thu nhỏ                          */
        /* ========================================================== */

        @keyframes cardSmallIn {
          0% {
            opacity: 0;
            transform: translateY(55px) scale(0.78);
            filter: blur(5px);
          }

          55% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes cardLargeIn {
          0% {
            opacity: 0;
            transform: translateY(55px) scale(1.14);
            filter: blur(5px);
          }

          55% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .card-small-in {
          animation:
            cardSmallIn
            1100ms
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        .card-large-in {
          animation:
            cardLargeIn
            1100ms
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        /* ========================================================== */
        /* Nội dung khi click mốc                                     */
        /* ========================================================== */

        @keyframes contentSwitch {
          0% {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .content-switch {
          animation:
            contentSwitch
            850ms
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        /* ========================================================== */
        /* Pulse mốc đang active                                     */
        /* ========================================================== */

        @keyframes atxTlPulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 100, 0, 0.35);
          }

          70% {
            box-shadow: 0 0 0 9px rgba(0, 100, 0, 0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(0, 100, 0, 0);
          }
        }

        .atx-tl-pulse {
          animation: atxTlPulseRing 2.2s ease-out infinite;
        }

        /* ========================================================== */
        /* Ảnh nền tự động zoom to nhỏ (Ken Burns)                    */
        /* ========================================================== */

        @keyframes tlBgZoom {
          0%, 100% { transform: scale(1.06); }
          50% { transform: scale(1.22); }
        }

        .tl-bg-zoom {
          animation: tlBgZoom 12s ease-in-out infinite;
        }

        /* ========================================================== */
        /* Reduced motion                                             */
        /* ========================================================== */

        @media (prefers-reduced-motion: reduce) {
          .timeline-item-in,
          .card-small-in,
          .card-large-in,
          .content-switch,
          .atx-tl-pulse,
          .tl-bg-zoom {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">

        {/* ======================================================== */}
        {/* TIÊU ĐỀ                                                  */}
        {/* ======================================================== */}

        <div className="mx-auto max-w-2xl text-center">
          <span
            className="atx-mono inline-block rounded-full border border-[#006400]/20 bg-[#fffacd] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0a3d0a]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.9)",
              transition:
                "opacity 900ms ease-out, transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            Hành trình phát triển
          </span>

          <h2
            className="uppercase atx-display mt-4 text-3xl font-extrabold leading-tight text-[#0a3d0a] sm:text-4xl"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateY(0)"
                : "translateY(35px)",
              transition:
                "opacity 1000ms ease-out 120ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 120ms",
            }}
          >
            Hành trình kiến tạo Unifarm
          </h2>

          <p
            className="atx-body mt-3 text-base leading-relaxed text-[#3a4a33]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateY(0)"
                : "translateY(25px)",
              transition:
                "opacity 1000ms ease-out 220ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 220ms",
            }}
          >
            Nhấn vào một cột mốc để xem những gì Unifarm đã và đang kiến tạo.
          </p>
        </div>

        {/* ======================================================== */}
        {/* DÒNG THỜI GIAN                                           */}
        {/* ======================================================== */}

        <div className="relative mt-12 sm:mt-14">

          {/* mobile fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#fffde7] to-transparent sm:hidden" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#fffde7] to-transparent sm:hidden" />

          <div
            ref={trackRef}
            className="atx-tl-track relative flex gap-0 overflow-x-auto scroll-smooth sm:grid sm:overflow-visible"
            style={{
              gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
            }}
          >

            {/* đường nền */}
            <div
              className="absolute left-0 top-[27px] h-[3px] rounded-full bg-[#e6e0c9]"
              style={{
                width: "100%",
              }}
            />

            {/* đường tiến độ */}
            <div
              className="absolute left-0 top-[27px] h-[3px] rounded-full bg-[#006400] transition-[width] duration-700 ease-out"
              style={{
                width: inView ? `${progressPct}%` : "0%",
              }}
            />

            {milestones.map((m, i) => {

              const isActive = i === active;
              const isPast = i < active;

              return (
                <button
                  key={m.year + i}
                  onClick={() => setActive(i)}
                  className={`
                    relative flex w-[104px] shrink-0
                    flex-col items-center gap-2 py-1
                    sm:w-auto sm:shrink
                    ${inView ? "timeline-item-in" : ""}
                  `}
                  style={{
                    animationDelay: inView
                      ? `${350 + i * 180}ms`
                      : "0ms",
                    opacity: inView ? undefined : 0,
                  }}
                >

                  {/* năm */}
                  <span
                    className={`atx-mono text-[15px] font-bold transition-colors sm:text-[16px] ${
                      isActive
                        ? "text-[#006400]"
                        : isPast
                        ? "text-[#0a3d0a]/70"
                        : "text-[#0a3d0a]/40"
                    }`}
                  >
                    {m.year}
                  </span>

                  {/* dot */}
                  <span
                    className={`relative z-10 flex items-center justify-center rounded-full border-2 bg-[#fffdf3] transition-all duration-300 ${
                      isActive
                        ? "atx-tl-pulse h-6 w-6 border-[#006400] bg-[#006400]"
                        : isPast
                        ? "h-3.5 w-3.5 border-[#006400] bg-[#006400]"
                        : "h-3.5 w-3.5 border-[#c8c2a3] bg-[#fffdf3]"
                    }`}
                  >
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-[#fffacd]" />
                    )}
                  </span>

                  {/* caption */}
                  <span
                    className={`atx-body max-w-[104px] text-center text-[14px] leading-snug transition-colors ${
                      isActive
                        ? "font-semibold text-[#0a3d0a]"
                        : "text-[#5c6a55]"
                    }`}
                  >
                    {m.caption}
                  </span>

                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARDS                                                     */}
        {/* ======================================================== */}

        <div
          key={`${active}-${inView}`}
          className="mt-12 flex flex-col gap-4 sm:mt-14 md:grid md:gap-5 lg:gap-6"
          style={{
            gridTemplateColumns:
              "300px minmax(280px,1fr) 300px",

            gridTemplateAreas:
              `"stat spot media1" "partner spot media2" "bottom bottom bottom"`,
          }}
        >

          {/* ====================================================== */}
          {/* STAT CARD                                              */}
          {/* ====================================================== */}

          <div
            className={`
              order-2 rounded-2xl
              border border-[#e6e0c9]
              bg-white p-5
              md:order-none
              ${inView ? "card-small-in" : ""}
            `}
            style={{
              gridArea: "stat",
              animationDelay: "250ms",
              opacity: inView ? undefined : 0,
            }}
          >
            {current.stat.map((s, idx) => (
              <div key={s.label} className={idx > 0 ? "mt-4" : ""}>
                <p className="atx-body text-xs font-medium uppercase tracking-wide text-[#4a90c4]">
                  {s.label}
                </p>

                <p className="atx-display mt-0.5 text-xl font-extrabold text-[#0a3d0a]">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* ====================================================== */}
          {/* CENTER CARD                                             */}
          {/* ====================================================== */}

          <div
            className={`
              relative order-1 flex min-h-[280px]
              flex-col items-center justify-center
              gap-4 overflow-hidden rounded-3xl
              border border-[#006400]/15
              p-6 text-center
              md:order-none
              ${inView ? "card-large-in" : ""}
            `}
            style={{
              gridArea: "spot",
              animationDelay: "400ms",
              opacity: inView ? undefined : 0,
            }}
          >
            {/* ảnh nền mờ phía sau */}
            <Image
              src={current.image}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="tl-bg-zoom object-cover blur-[2px]"
            />
            <div
              className="absolute inset-0"
            //   style={{
            //     background:
            //       "linear-gradient(160deg,rgba(234,247,255,0.88) 0%,rgba(243,247,236,0.85) 55%,rgba(255,250,205,0.9) 100%)",
            //   }}
            />

            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#006400] shadow-[0_12px_26px_-10px_rgba(0,100,0,0.55)]">
              <CurrentIcon className="h-7 w-7 text-[#fffacd]" />
            </div>

            <div className="relative z-10">
              <p className="atx-display text-2xl font-extrabold text-[#fff] sm:text-3xl">
                {current.year}
              </p>

              <p className="atx-body mt-1 text-sm font-medium text-[#fff]">
                {current.caption}
              </p>
            </div>
          </div>

          {/* ====================================================== */}
          {/* MEDIA 1                                                 */}
          {/* ====================================================== */}

          <div
            className={`
              order-3 md:order-none
              ${inView ? "card-small-in" : ""}
            `}
            style={{
              gridArea: "media1",
              animationDelay: "550ms",
              opacity: inView ? undefined : 0,
            }}
          >
            <MediaCard
              label={current.media[0].label}
              video={current.media[0].video}
            />
          </div>

          {/* ====================================================== */}
          {/* MEDIA 2                                                 */}
          {/* ====================================================== */}

          <div
            className={`
              order-4 md:order-none
              ${inView ? "card-large-in" : ""}
            `}
            style={{
              gridArea: "media2",
              animationDelay: "700ms",
              opacity: inView ? undefined : 0,
            }}
          >
            <MediaCard
              label={current.media[1].label}
              video={current.media[1].video}
            />
          </div>

          {/* ====================================================== */}
          {/* PARTNER CARD                                            */}
          {/* ====================================================== */}

          <div
            className={`
              order-5 rounded-2xl
              border border-[#e6e0c9]
              bg-white p-5
              md:order-none
              ${inView ? "card-small-in" : ""}
            `}
            style={{
              gridArea: "partner",
              animationDelay: "850ms",
              opacity: inView ? undefined : 0,
            }}
          >
            <div className="mb-3 flex items-center gap-2">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fffacd]">
                <CurrentIcon className="h-4 w-4 text-[#006400]" />
              </span>

              <p className="atx-body text-sm font-semibold text-[#0a3d0a]">
                {current.partner_title}
              </p>

            </div>

            <ul className="space-y-2">
              {current.partner_bullets.map((b) => (
                <li
                  key={b}
                  className="atx-body flex items-start gap-2 text-sm leading-snug text-[#3a4a33]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#87cefa]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ====================================================== */}
          {/* BOTTOM CARD                                             */}
          {/* ====================================================== */}

          <div
            className={`
              order-6 rounded-2xl
              bg-[#006400] p-5 sm:p-6
              md:order-none
              ${inView ? "card-large-in" : ""}
            `}
            style={{
              gridArea: "bottom",
              animationDelay: "1000ms",
              opacity: inView ? undefined : 0,
            }}
          >
            <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {current.bottom.map((b) => (
                <li
                  key={b}
                  className="atx-body flex items-start gap-2 text-sm leading-snug text-[#eaf7d8]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fffacd]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}