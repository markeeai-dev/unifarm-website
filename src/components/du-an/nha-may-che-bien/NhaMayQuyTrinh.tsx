"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import {
  Truck,
  ScissorsLineDashed,
  Snowflake,
  PackageCheck,
  Warehouse,
  Ship,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const EASE = [0.22, 1, 0.36, 1] as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  cream: "#FFFACD",
  ink: "#12210F",
};

type Step = {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  focus: string;
  image: string;
};

const STEPS: Step[] = [
  {
    id: "qt-01",
    icon: Truck,
    title: "Tiếp nhận nguyên liệu",
    desc: "Chuối và dưa hấu được vận chuyển nhanh từ vùng trồng tập trung về nhà máy, kiểm tra độ chín và chất lượng đầu vào.",
    focus: "Kiểm tra đầu vào",
    image: "/images/nha-may-che-bien/nha-may-hero.jpg",
  },
  {
    id: "qt-02",
    icon: ScissorsLineDashed,
    title: "Sơ chế & định hình",
    desc: "Phân loại, tách vỏ, cắt gọt theo quy cách thành phẩm dưới điều kiện vệ sinh được kiểm soát chặt chẽ.",
    focus: "Kiểm soát vệ sinh",
    image: "/images/nha-may-che-bien/nha-may-gioi-thieu.jpg",
  },
  {
    id: "qt-03",
    icon: Snowflake,
    title: "Cấp đông nhanh IQF",
    desc: "Băng chuyền cấp đông rời (IQF) giữ nguyên màu sắc, kết cấu và hương vị tự nhiên của từng miếng nông sản.",
    focus: "Kiểm soát nhiệt độ",
    image: "/images/nha-may-che-bien/day-chuyen-chuoi-1.jpg",
  },
  {
    id: "qt-04",
    icon: PackageCheck,
    title: "Đóng gói thành phẩm",
    desc: "Đóng gói theo quy cách và nhãn mác phù hợp với yêu cầu của từng thị trường, từng đối tác.",
    focus: "Kiểm tra quy cách",
    image: "/images/nha-may-che-bien/day-chuyen-chuoi-2.jpg",
  },
  {
    id: "qt-05",
    icon: Warehouse,
    title: "Lưu kho lạnh",
    desc: "Thành phẩm được bảo quản trong kho lạnh đạt chuẩn, duy trì nhiệt độ ổn định đến khi xuất hàng.",
    focus: "Giám sát kho lạnh",
    image: "/images/nha-may-che-bien/day-chuyen-dua-hau-1.jpg",
  },
  {
    id: "qt-06",
    icon: Ship,
    title: "Xuất hàng",
    desc: "Đóng container lạnh và vận chuyển đến khách hàng trong nước cũng như các thị trường xuất khẩu.",
    focus: "Kiểm tra trước xuất",
    image: "/images/nha-may-che-bien/day-chuyen-dua-hau-2.jpg",
  },
];

function MobileJourney({ t, anchorId }: { t: (s: string) => string; anchorId?: string }) {
  const reduce = useReducedMotion();

  return (
    <section
      id={anchorId}
      className="relative w-full bg-white bg-[url('/images/nen_trang.png')] bg-repeat py-16 sm:py-20 lg:hidden"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
          {t("- QUY TRÌNH SẢN XUẤT -")}
        </p>
        <h2
          className="mt-3 max-w-2xl text-2xl font-extrabold uppercase leading-[1.15] tracking-tight sm:text-3xl"
          style={{ color: C.forest }}
        >
          {t("6 bước khép kín, từ nguyên liệu đến xuất hàng")}
        </h2>
      </div>

      <div className="relative mx-auto mt-10 max-w-xl space-y-8 px-5 sm:px-8">
        <div className="absolute left-[27px] top-2 bottom-2 w-[2px]" style={{ background: `${C.forest}18` }} />
        {STEPS.map((step, i) => (
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
            className="relative flex gap-5"
          >
            <span
              className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md"
              style={{ background: C.green }}
            >
              <step.icon className="h-6 w-6" strokeWidth={2} />
            </span>
            <div className="flex-1 overflow-hidden rounded-2xl border" style={{ borderColor: `${C.green}18` }}>
              <div className="relative h-36 w-full">
                <Image src={step.image} alt={t(step.title)} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="bg-white p-4">
                <p className="text-sm font-extrabold leading-snug" style={{ color: C.ink }}>
                  {String(i + 1).padStart(2, "0")}. {t(step.title)}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600">{t(step.desc)}</p>
                <p
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ background: C.forest }}
                >
                  <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                  {t(step.focus)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function NhaMayQuyTrinh() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduce) return;
      if (!viewportRef.current || !trackRef.current) return;

      const viewport = viewportRef.current;
      const track = trackRef.current;
      const total = STEPS.length;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (document.readyState === "complete") {
          ScrollTrigger.refresh();
        } else {
          window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        }

        // Pin just below the sticky site header (instead of the viewport's very
        // top) so the header never overlaps the pinned panel while scrubbing.
        // The header is measured here while still unscrolled (full padding +
        // un-scaled logo); by the time a user has scrolled this far down the
        // page it has already shrunk to its compact "scrolled" state (~28px
        // less, from py-4/py-5 → py-1.5), so that delta is subtracted to match
        // the header's real height at pin time instead of leaving a gap.
        const headerOffset = Math.max(0, (document.getElementById("site-header")?.offsetHeight ?? 0) - 28);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: viewport,
            start: `top top+=${headerOffset}`,
            end: () => `+=${window.innerWidth * (total - 1)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { xPercent: (-100 * (total - 1)) / total, ease: "none", duration: 1 }, 0);

        STEPS.forEach((step, i) => {
          const stepDuration = 1 / (total - 1);
          const stepStartTime = (i - 1) * stepDuration;
          const stepEndTime = i * stepDuration;

          if (i > 0) {
            tl.to(
              ".qt-progress-fill",
              { width: `${(i / (total - 1)) * 100}%`, ease: "none", duration: stepDuration },
              stepStartTime
            );

            const prev = STEPS[i - 1];
            tl.to(`.qt-node-inactive-${prev.id}`, { opacity: 1, duration: 0.02 }, stepEndTime - 0.02);
            tl.to(`.qt-node-active-${prev.id}`, { opacity: 0, duration: 0.02 }, stepEndTime - 0.02);
            // Colors/shadow snap instantly (tl.set, no interpolation) — tweening
            // them under scrub's lag smears cream and dark into a muddy gray
            // mid-scroll. Only opacity/scale fade, and only briefly.
            tl.to(`.qt-node-text-${prev.id}`, { opacity: 0.6, scale: 1, duration: 0.03 }, stepEndTime - 0.02);
            tl.set(
              `.qt-node-text-${prev.id}`,
              {
                backgroundColor: "rgba(0,0,0,0.45)",
                color: "#ffffff",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
              },
              stepEndTime - 0.02
            );
          }

          tl.to(`.qt-node-inactive-${step.id}`, { opacity: 0, duration: 0.02 }, stepEndTime);
          tl.to(`.qt-node-active-${step.id}`, { opacity: 1, duration: 0.02 }, stepEndTime);
          tl.to(`.qt-node-text-${step.id}`, { opacity: 1, scale: 1.1, duration: 0.03 }, stepEndTime);
          tl.set(
            `.qt-node-text-${step.id}`,
            {
              backgroundColor: "rgba(0,0,0,0.55)",
              color: "#ffffff",
              boxShadow: `0 0 0 1.5px ${C.cream}, 0 0 16px ${C.cream}80`,
            },
            stepEndTime
          );

          if (i > 0) {
            tl.fromTo(
              `.qt-panel-header-${step.id}`,
              { opacity: 0, x: 50 },
              { opacity: 1, x: 0, duration: 0.05, ease: "power2.out" },
              stepEndTime - 0.05
            );
            tl.fromTo(
              `.qt-panel-desc-${step.id}`,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
              stepEndTime - 0.04
            );
            tl.fromTo(
              `.qt-panel-stats-${step.id}`,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
              stepEndTime - 0.03
            );
          }

          tl.call(
            () => {
              document.querySelectorAll("[data-qt-node]").forEach((node) => node.removeAttribute("aria-current"));
              document.querySelector(`[data-qt-node="${step.id}"]`)?.setAttribute("aria-current", "step");
            },
            [],
            stepEndTime
          );
        });
      });
    },
    { scope: viewportRef, dependencies: [reduce] }
  );

  if (reduce) {
    return <MobileJourney t={t} anchorId="quy-trinh-san-xuat" />;
  }

  return (
    <section id="quy-trinh-san-xuat" className="relative w-full">
      <div
        ref={viewportRef}
        className="relative hidden h-[100dvh] w-full overflow-hidden bg-[#063B24] lg:block"
        aria-label={t("Quy trình sản xuất của Unifarm")}
      >
        <h2 className="sr-only">{t("6 bước khép kín, từ nguyên liệu đến xuất hàng")}</h2>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${C.fresh} 1px, transparent 1px), linear-gradient(90deg, ${C.fresh} 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
        />

        <div className="pointer-events-none absolute left-6 top-8 z-20 md:left-12 md:top-10">
          <span className="inline-flex items-center gap-3 rounded-lg bg-black/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md md:text-sm">
            <span className="h-px w-8" style={{ background: C.cream }} />
            {t("Quy trình sản xuất")}
          </span>
        </div>

        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-full will-change-transform"
            style={{ width: `${STEPS.length * 100}vw` }}
          >
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={step.id}
                  className="relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden p-6 md:p-12 xl:p-24"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={step.image}
                      alt={`${t(step.title)} — ${t("công đoạn sản xuất của Unifarm")}`}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                      sizes="100vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: isEven
                          ? `linear-gradient(to right, ${C.forest}E6, ${C.forest}55 55%, transparent 88%)`
                          : `linear-gradient(to left, ${C.forest}E6, ${C.forest}55 55%, transparent 88%)`,
                      }}
                    />
                    {/* Edge blends so consecutive panels read as one connected scene while sliding */}
                    <div
                      className="absolute inset-y-0 left-0 w-[14vw]"
                      style={{ backgroundImage: `linear-gradient(to right, ${C.forest}F2, transparent)` }}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-y-0 right-0 w-[14vw]"
                      style={{ backgroundImage: `linear-gradient(to left, ${C.forest}F2, transparent)` }}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    className={`relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center ${
                      isEven ? "items-start text-left" : "items-end text-right"
                    }`}
                  >
                    <div className={`qt-panel-header-${step.id} mb-6 flex items-center gap-4`}>
                      {!isEven && (
                        <h3 className="text-4xl font-extrabold uppercase leading-tight text-white md:text-5xl lg:text-6xl">
                          {t(step.title)}
                        </h3>
                      )}
                      <span
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 font-mono text-3xl font-bold text-white backdrop-blur-md md:h-20 md:w-20 md:text-4xl"
                        style={{ background: "rgba(0,0,0,0.45)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {isEven && (
                        <h3 className="text-4xl font-extrabold uppercase leading-tight text-white md:text-5xl lg:text-6xl">
                          {t(step.title)}
                        </h3>
                      )}
                    </div>

                    <p
                      className={`qt-panel-desc-${step.id} mb-10 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl lg:text-2xl`}
                    >
                      {t(step.desc)}
                    </p>

                    <div className={`qt-panel-stats-${step.id} grid max-w-xl grid-cols-2 gap-4`}>
                      <div
                        className="flex flex-col rounded-xl border border-white/10 p-5 text-left backdrop-blur-md"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <span className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50 md:text-xs">
                          {t("Giai đoạn quy trình")}
                        </span>
                        <span className="flex items-center gap-3 text-sm font-medium text-white md:text-lg">
                          <step.icon className="h-5 w-5 text-white/80" strokeWidth={2} />
                          {t("Giai đoạn")} {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div
                        className="flex flex-col rounded-xl border border-white/10 p-5 text-left backdrop-blur-md"
                        style={{ background: "rgba(0,0,0,0.5)" }}
                      >
                        <span className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50 md:text-xs">
                          {t("Trọng tâm chất lượng")}
                        </span>
                        <span className="flex items-center gap-3 text-sm font-medium text-white md:text-lg">
                          <ShieldCheck className="h-5 w-5 text-white/80" strokeWidth={2} />
                          {t(step.focus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-28 left-0 z-20 w-full px-6 md:bottom-32 md:px-12">
          <nav aria-label={t("Tiến độ các công đoạn sản xuất")} className="mx-auto w-full max-w-7xl">
            <ol className="relative flex h-[5px] w-full items-center justify-between rounded-full bg-white/15 md:h-[6px]">
              <div
                className="qt-progress-fill absolute left-0 top-0 h-full origin-left rounded-full"
                style={{ width: "0%", background: C.cream, boxShadow: `0 0 10px ${C.cream}99` }}
                aria-hidden="true"
              />

              {STEPS.map((step, i) => (
                <li
                  key={step.id}
                  data-qt-node={step.id}
                  aria-current={i === 0 ? "step" : undefined}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`qt-node-inactive-${step.id} absolute h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white/40 bg-[#063B24] md:h-5 md:w-5`}
                    style={{ opacity: i === 0 ? 0 : 1 }}
                    aria-hidden="true"
                  />
                  <div
                    className={`qt-node-active-${step.id} absolute h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 md:h-5 md:w-5`}
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      background: C.cream,
                      borderColor: C.cream,
                      boxShadow: `0 0 15px ${C.cream}99`,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className={`qt-node-text-${step.id} absolute top-6 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-sm md:top-8 md:px-3 md:text-sm`}
                    style={
                      i === 0
                        ? {
                            opacity: 1,
                            background: "rgba(0,0,0,0.55)",
                            color: "#ffffff",
                            boxShadow: `0 0 0 1.5px ${C.cream}, 0 0 16px ${C.cream}80`,
                          }
                        : {
                            opacity: 0.6,
                            background: "rgba(0,0,0,0.45)",
                            color: "#ffffff",
                            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                          }
                    }
                  >
                    <span className="hidden md:inline">{t(step.title)}</span>
                    <span className="md:hidden">{t(step.title).split(" ")[0]}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <MobileJourney t={t} />
    </section>
  );
}
