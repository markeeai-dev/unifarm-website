"use client";

import { Award, Briefcase, GraduationCap, Sparkles, Split, Sprout, UserCheck, Users2 } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const MANAGEMENT_PATH = [
  { icon: Users2, label: "Làm tốt công việc" },
  { icon: UserCheck, label: "Dẫn dắt đội nhóm" },
  { icon: Briefcase, label: "Quản lý" },
  { icon: Award, label: "Lãnh đạo" },
];

const EXPERT_PATH = [
  { icon: GraduationCap, label: "Học nghề" },
  { icon: Sparkles, label: "Thành thạo" },
  { icon: Award, label: "Chuyên gia" },
  { icon: Users2, label: "Đào tạo người khác" },
];

function PathColumn({
  title,
  color,
  steps,
  delayBase,
}: {
  title: string;
  color: string;
  steps: { icon: typeof Users2; label: string }[];
  delayBase: number;
}) {
  const { t } = useLanguage();
  return (
    <Reveal delay={delayBase} duration={1} className="h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-[0_25px_60px_-30px_rgba(15,40,20,0.35)] ring-1 ring-[#06301B]/[0.06] sm:p-8">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: `${color}14` }}
        />

        <h3
          className="relative text-center text-base font-extrabold uppercase tracking-wide"
          style={{ color }}
        >
          {t(title)}
        </h3>

        <div className="relative mt-8 flex-1 pl-12">
          {/* đường nối dọc */}
          <div
            className="absolute left-[19px] top-1 h-[calc(100%-1.25rem)] w-[2px] rounded-full"
            style={{ background: `${color}25` }}
          />

          <div className="space-y-7">
            {steps.map((step, i) => (
              <div key={step.label} className="relative">
                <span
                  className="absolute -left-12 top-0 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md"
                  style={{ backgroundColor: color }}
                >
                  <step.icon size={17} strokeWidth={1.8} />
                </span>
                <div
                  className="flex min-h-10 items-center rounded-xl px-4 py-2.5"
                  style={{ backgroundColor: `${color}0F` }}
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: `${color}99` }}>
                      {t("Bước")} {i + 1}
                    </p>
                    <p className="text-sm font-semibold text-[#06301B]">{t(step.label)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function LoTrinh() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 md:py-24">
      <div className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-[#87CEFA]/15 blur-[110px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFFACD]/50 blur-[110px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#006400]/20 bg-white/70 text-[#006400] backdrop-blur-sm">
            <Sprout size={18} strokeWidth={1.8} />
          </span>
          <h2 className="uppercase text-2xl font-extrabold tracking-tight text-[#06301B] sm:text-3xl md:text-4xl">
            {t("Hai Lựa Chọn Phát Triển Tại Unifarm")}
          </h2>
        </Reveal>

        <Reveal duration={1} delay={0.1}>
          <div className="relative mx-auto mt-10 max-w-4xl">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#006400]/10 via-transparent to-[#87CEFA]/15 blur-xl" />
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] shadow-[0_35px_80px_-30px_rgba(15,40,20,0.5)]">
              <Image
                src="/images/UNIFARM/DJI_20260805085036_0330_D.JPG"
                alt={t("Đội ngũ Unifarm cùng nhau trưởng thành trong nghề nông nghiệp")}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06301B]/70 via-transparent to-transparent" />
            </div>
          </div>
        </Reveal>

        <div className="relative mt-10 lg:mt-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-10">
            <PathColumn
              title={"Chuyên môn"}
              color="#006400"
              steps={EXPERT_PATH}
              delayBase={0}
            />
            <PathColumn
              title={"Quản lý"}
              color="#0B7A0B"
              steps={MANAGEMENT_PATH}
              delayBase={0.15}
            />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#fffde7] bg-white text-[#006400] shadow-[0_14px_30px_-10px_rgba(0,60,20,0.3)] lg:flex">
            <Split size={20} strokeWidth={1.8} />
          </div>
        </div>

        <Reveal duration={1} delay={0.2}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-[#06301B]/65 sm:text-[15px]">
            {t(
              "Dù lựa chọn con đường nào, giỏi nghề và tạo ra giá trị vẫn là nền tảng để phát triển."
            )}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
