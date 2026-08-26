/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useIntroReady } from "@/lib/use-intro-ready";

/**
 * TuyenDungHero — banner đầu trang Tuyển dụng.
 * Nav/logo dùng chung HomeTopHeader (render toàn site trong layout.tsx).
 * Bên dưới là phần giới thiệu chương trình tuyển dụng + lộ trình cấp bậc.
 */

const PATH_STEPS = ["Intern", "Fresher", "Junior", "Middle", "Senior"];

const STATS = [
  { value: "5", label: "Đội ngũ" },
  { value: "7", label: "Cấp bậc" },
  { value: "100%", label: "KPI minh bạch" },
  { value: "∞", label: "Cơ hội phát triển" },
];

export default function TuyenDungHero() {
  const [mounted, setMounted] = useState(false);
  const introReady = useIntroReady();

  useEffect(() => {
    if (introReady) setMounted(true);
  }, [introReady]);

  return (
    <div className="w-full">
      {/* ================= HERO ================= */}
      <section className="relative isolate w-full overflow-hidden">
        {/* ================= NỘI DUNG HERO ================= */}
        <div
          className="relative flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,48,27,0.82), rgba(6,48,27,0.9)), url('/images/banana/banana-plantation-aerial.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span
            className={`mb-9 inline-flex items-center gap-2 rounded-full border border-[#FFFACD]/40 bg-[#FFFACD]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFFACD] transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <span className="hero-badge-dot h-1.5 w-1.5 rounded-full bg-[#FFFACD]" />
            🌱 Gia nhập Unifarm
          </span>

          <h1
            className={`max-w-3xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Cùng nhau tạo giá trị -{" "}
            <span className="text-[#FFFACD]">cùng nhau phát triển</span>
          </h1>

          <p
            className={`mx-auto mt-5 max-w-2xl text-sm font-light text-white/60 transition-all delay-150 duration-700 sm:text-lg ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Unifarm là nơi bạn không chỉ tìm một công việc, mà tìm một môi trường để phát
            triển năng lực, tạo ra giá trị và xây dựng hành trình sự nghiệp của riêng mình.
          </p>

          <div
            className={`mt-9 w-full max-w-full overflow-x-auto transition-all delay-200 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <div className="mx-auto flex w-fit items-center gap-1 rounded-[20px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
              {PATH_STEPS.map((label, i) => (
                <span
                  key={label}
                  className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-white transition-all duration-300 first:rounded-l-[14px] last:rounded-r-[14px] hover:-translate-y-1 hover:scale-105"
                  style={{
                    background:
                      i === 0
                        ? "#06301B"
                        : i === 1
                          ? "#006400"
                          : i === 2
                            ? "#8fae3e"
                            : i === 3
                              ? "#F5E98A"
                              : "#FFFACD",
                    color: i >= 2 ? "#06301B" : "#fff",
                    fontWeight: i === 0 ? 800 : 600,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <p
            className={`mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-white/60 transition-all delay-[250ms] duration-700 sm:text-base ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            Từ sản xuất, kỹ thuật, kinh doanh đến các bộ phận hỗ trợ – mỗi vị trí đều góp
            phần tạo nên một Unifarm phát triển bền vững.
          </p>

          <div
            className={`mt-8 flex flex-col items-center gap-3 transition-all delay-300 duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <a
              href="mailto:tuyendung@unifarm.com?subject=%E1%BB%A8ng%20tuy%E1%BB%83n%20t%E1%BA%A1i%20Unifarm"
              className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#006400] to-[#FFFACD] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_35px_rgba(0,100,0,0.45)] transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
              style={{ textShadow: "0 1px 3px rgba(6,48,27,0.5)" }}
            >
              Khám phá cơ hội nghề nghiệp
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20">
                <ArrowRight size={14} />
              </span>
            </a>

            <a
              href="#gioi-thieu-unifarm"
              className="inline-flex items-center gap-2.5 rounded-[10px] border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#FFFACD]/60 hover:bg-[#FFFACD]/10"
            >
              <PlayCircle size={17} />
              Tìm hiểu về Unifarm
            </a>
          </div>

          {/* <div
            className={`mt-10 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 transition-all delay-[350ms] duration-700 sm:grid-cols-4 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/[0.03] px-4 py-4 text-center transition-colors hover:bg-[#FFFACD]/10"
              >
                <div className="text-3xl font-black leading-none text-[#FFFACD]">
                  {s.value}
                </div>
                <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      <style>{`
        @keyframes hero-badge-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .hero-badge-dot {
          animation: hero-badge-blink 2s infinite;
        }
      `}</style>
    </div>
  );
}
