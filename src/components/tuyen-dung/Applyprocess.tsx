/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Handshake, MessageCircle, Rocket, Target } from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: FileText,
    title: "Nộp hồ sơ",
    desc: "Gửi CV qua email hoặc bấm Ứng tuyển ngay tại vị trí bạn quan tâm.",
    color: "#006400",
    glow: "rgba(0,100,0,0.25)",
  },
  {
    icon: MessageCircle,
    title: "Sàng lọc & phỏng vấn sơ bộ",
    desc: "Trao đổi nhanh 15-20 phút để hiểu mong muốn và định hướng của bạn.",
    color: "#006400",
    glow: "rgba(0,100,0,0.25)",
  },
  {
    icon: Target,
    title: "Thử thách thực tế",
    desc: "Trải nghiệm 3-5 ngày cùng đội ngũ tại nhà máy hoặc vùng nguyên liệu.",
    color: "#0B7A0B",
    glow: "rgba(11,122,11,0.25)",
  },
  {
    icon: Handshake,
    title: "Phỏng vấn chuyên sâu & Offer",
    desc: "Trao đổi cùng quản lý trực tiếp, nhận đề nghị làm việc rõ ràng.",
    color: "#006400",
    glow: "rgba(0,100,0,0.25)",
  },
  {
    icon: Rocket,
    title: "Onboarding & hội nhập",
    desc: "Được mentor đồng hành trong tuần đầu tiên để bắt nhịp công việc.",
    color: "#0B7A0B",
    glow: "rgba(11,122,11,0.25)",
  },
];

/* ------------------------------------------------------------------ */
/*  A line that "draws" itself (scaleX 0 → 1) once scrolled into view  */
/* ------------------------------------------------------------------ */

function DrawLine({
  className = "",
  axis = "x",
}: {
  className?: string;
  axis?: "x" | "y";
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hiddenScale = axis === "x" ? "scale-x-0" : "scale-y-0";
  const shownScale = axis === "x" ? "scale-x-100" : "scale-y-100";
  const origin = axis === "x" ? "origin-left" : "origin-top";

  return (
    <span
      ref={ref}
      aria-hidden
      className={`${origin} transition-transform duration-[1200ms] ease-out ${
        inView ? shownScale : hiddenScale
      } ${className}`}
    />
  );
}

export default function ApplyProcess() {
  return (
    <section className="relative overflow-hidden bg-[#06301B] py-16 md:py-20">
      {/* Background photo — tinted green via multiply overlay so it reads as on-brand */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/UNIFARM/bgr.jpg"
          alt=""
          fill
          className="scale-105 object-cover"
          style={{ filter: "grayscale(25%)" }}
        />
        {/* Green tint — multiply blend keeps photo detail while pushing hue to forest green */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#006400", mixBlendMode: "multiply", opacity: 0.45 }}
        />
        {/* Darken further for text contrast */}
        <div className="absolute inset-0 bg-[#06301B]/55" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#F5E98A]">
            Minh bạch từng bước
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Image
              src="/images/mascot/mascot-planting.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={200}
              className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16"
            />

            <h2 className="uppercase text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
              Quy trình tuyển dụng
            </h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-white sm:text-base">
            5 bước rõ ràng, minh bạch — từ lúc bạn nộp hồ sơ đến ngày đầu tiên
            đi làm cùng chúng tôi.
          </p>
        </Reveal>

        {/* Mobile / tablet — vertical timeline of cards */}
        <div className="relative mt-12 space-y-6 lg:hidden">
          <DrawLine
            axis="y"
            className="absolute bottom-8 left-7 top-8 w-px bg-gradient-to-b from-[#006400] via-[#0B7A0B] to-[#06301B] opacity-30"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} duration={1}>
              <div className="group relative flex gap-5 rounded-2xl border border-black/5 bg-white/95 p-5 shadow-[0_8px_24px_rgba(15,40,20,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_30px_rgba(15,40,20,0.14)]">
                <span
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                  style={{ backgroundColor: step.color, boxShadow: `0 12px 24px -8px ${step.glow}` }}
                >
                  <step.icon size={20} strokeWidth={1.8} />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#06301B] text-[10px] font-bold text-white ring-2 ring-white transition-transform duration-300 group-hover:scale-125">
                    {i + 1}
                  </span>
                </span>
                <div className="pt-0.5">
                  <h3 className="uppercase text-[15px] font-bold text-[#06301B]">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#06301B]/60">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Desktop — uniform row of connected step cards */}
        <div className="relative mt-20 hidden lg:block">
          <DrawLine className="pointer-events-none absolute left-[9%] right-[9%] top-0 h-px bg-gradient-to-r from-[#006400] via-[#0B7A0B] to-[#06301B] opacity-30" />
          <div className="grid grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} duration={1} className="h-full">
                <div className="group relative flex h-full flex-col items-center rounded-2xl border border-black/5 bg-white/95 px-5 pb-7 pt-8 text-center shadow-[0_10px_28px_rgba(15,40,20,0.08)] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgba(15,40,20,0.14)]">
                  <span
                    className="relative z-10 -mt-14 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: step.color, boxShadow: `0 12px 24px -8px ${step.glow}` }}
                  >
                    <step.icon size={22} strokeWidth={1.8} className="transition-transform duration-300 group-hover:rotate-6" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#06301B] text-[10px] font-bold text-white ring-2 ring-white transition-transform duration-300 group-hover:scale-125">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="uppercase mt-4 text-[15px] font-bold leading-snug text-[#06301B]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#06301B]/60">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
