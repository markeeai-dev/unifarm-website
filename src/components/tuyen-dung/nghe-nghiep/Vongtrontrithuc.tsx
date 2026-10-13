"use client";

import { GraduationCap, Sprout, Users } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const MODELS = [
  {
    icon: GraduationCap,
    title: "Đưa Học Viên Đến Nông Trại",
    desc: "Học từ thực tế tại nông trại.",
    color: "#006400",
    glow: "rgba(0,100,0,0.22)",
    image: "/images/UNIFARM/DJI_20260805085036_0330_D.JPG",
  },
  {
    icon: Sprout,
    title: "Đưa Nông Trại Vào Giảng Đường",
    desc: "Đưa những bài toán thực tế vào nhà trường.",
    color: "#0B7A0B",
    glow: "rgba(11,122,11,0.22)",
    image: "/images/UNIFARM/16.JPG",
  },
  {
    icon: Users,
    title: "Đưa Tri Thức Về Cộng Đồng",
    desc: "Đưa tri thức trở lại với người nông dân.",
    color: "#006400",
    glow: "rgba(0,100,0,0.22)",
    image: "/images/UNIFARM/2.jpg",
  },
];

/* Vị trí 3 thẻ dạng tam giác + vòng tròn liên kết ở giữa (chỉ desktop ≥ lg).
   Toạ độ trừu tượng 0-1000, map sang % khi render — xem cách làm tương tự ở
   Competitivecapability.tsx (trang Sản phẩm). */
const TRIANGLE_POS = [
  { left: 50, top: 27 }, // trên
  { left: 20, top: 76 }, // dưới trái
  { left: 80, top: 76 }, // dưới phải
] as const;
const CIRCLE_CENTER = { left: 50, top: 60 };
const CIRCLE_R = 32; // % của chiều rộng container

export default function VongTronTriThuc() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 lg:py-24">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#FFFACD]/50 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#87CEFA]/15 blur-[110px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="text-center" duration={1}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#006400]/20 bg-white/70 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#006400] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006400]" />
            {t("Học từ thực tế")}
          </span>
          <h2
            className="uppercase mt-5 whitespace-nowrap font-extrabold leading-snug tracking-tight text-[#06301B]"
            style={{ fontSize: "clamp(0.68rem, 2.55vw, 2.25rem)" }}
          >
            {t("Trường Trong Nông Trại – Nông Trại Trong Trường")}
          </h2>
        </Reveal>

        {(() => {
          const modelCard = (m: (typeof MODELS)[number], i: number) => (
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(15,40,20,0.06)] ring-1 ring-[#06301B]/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,40,20,0.16)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={m.image}
                  alt={t(m.title)}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -top-4 select-none text-6xl font-black leading-none text-white/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                  style={{ backgroundColor: m.color, boxShadow: `0 12px 24px -8px ${m.glow}` }}
                >
                  <m.icon size={19} strokeWidth={1.8} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="uppercase text-[15px] font-bold text-[#06301B]">{t(m.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#06301B]/60">{t(m.desc)}</p>
              </div>
            </div>
          );
          return (
            <>
              {/* Mobile — carousel vuốt ngang thay vì 3 thẻ ảnh xếp chồng dọc. */}
              <div className="[scrollbar-width:none] -mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 sm:hidden [&::-webkit-scrollbar]:hidden">
                {MODELS.map((m, i) => (
                  <div key={m.title} className="w-[82%] max-w-[300px] shrink-0 snap-start">
                    {modelCard(m, i)}
                  </div>
                ))}
                <div className="w-px shrink-0" aria-hidden />
              </div>

              {/* Tablet — lưới 3 cột như trước. */}
              <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-3 lg:hidden">
                {MODELS.map((m, i) => (
                  <Reveal key={m.title} delay={i * 0.1} duration={1}>
                    {modelCard(m, i)}
                  </Reveal>
                ))}
              </div>

              {/* Desktop — 3 thẻ xếp tam giác, vòng tròn tri thức nối giữa. */}
              <div className="relative mt-16 hidden lg:block" style={{ height: 760 }}>
                {/* Vòng tròn + đường nối — vẽ trong hệ toạ độ 0-1000, khớp % vị trí thẻ */}
                <svg viewBox="0 0 1000 1000" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                  <circle
                    cx={CIRCLE_CENTER.left * 10}
                    cy={CIRCLE_CENTER.top * 10}
                    r={CIRCLE_R * 10}
                    fill="none"
                    stroke="#006400"
                    strokeOpacity={0.18}
                    strokeWidth={3}
                    strokeDasharray="10 10"
                  />
                  {TRIANGLE_POS.map((p, i) => {
                    const next = TRIANGLE_POS[(i + 1) % TRIANGLE_POS.length];
                    return (
                      <line
                        key={i}
                        x1={p.left * 10}
                        y1={p.top * 10}
                        x2={next.left * 10}
                        y2={next.top * 10}
                        stroke="#0B7A0B"
                        strokeOpacity={0.22}
                        strokeWidth={2.5}
                        strokeDasharray="3 9"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {/* Icon vòng tròn ở tâm — biểu tượng "vòng tròn tri thức" */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${CIRCLE_CENTER.left}%`, top: `${CIRCLE_CENTER.top}%` }}
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#006400]/20 blur-2xl" style={{ width: 90, height: 90, left: -13, top: -13 }} />
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_14px_30px_-10px_rgba(0,60,20,0.3)] ring-4 ring-[#fffde7]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006400] text-white">
                      <GraduationCap size={18} strokeWidth={1.8} />
                    </span>
                  </div>
                </div>

                {MODELS.map((m, i) => (
                  <div
                    key={m.title}
                    className="absolute w-[320px] -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${TRIANGLE_POS[i].left}%`, top: `${TRIANGLE_POS[i].top}%` }}
                  >
                    <Reveal delay={i * 0.12} duration={1}>
                      {modelCard(m, i)}
                    </Reveal>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}
