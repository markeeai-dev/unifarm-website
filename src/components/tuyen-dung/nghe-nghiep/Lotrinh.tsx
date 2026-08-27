"use client";

import { Award, Briefcase, GraduationCap, Sparkles, UserCheck, Users2 } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const MANAGEMENT_PATH = [
  { icon: Users2, label: "Người lao động" },
  { icon: UserCheck, label: "Tổ trưởng" },
  { icon: Briefcase, label: "Giám sát" },
  { icon: Award, label: "Quản lý nông trường" },
];

const EXPERT_PATH = [
  { icon: GraduationCap, label: "Học nghề" },
  { icon: Sparkles, label: "Thành thạo" },
  { icon: Award, label: "Chuyên gia kỹ thuật" },
  { icon: Users2, label: "Hướng dẫn, đào tạo người khác" },
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
      <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_10px_28px_rgba(15,40,20,0.08)] ring-1 ring-[#06301B]/[0.06] sm:p-8">
        <h3
          className="text-center text-base font-extrabold uppercase tracking-wide"
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
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
            {t("Hai con đường phát triển sự nghiệp")}
          </p>
          <h2 className="uppercase mt-3 text-2xl font-extrabold text-[#06301B] sm:text-3xl md:text-4xl">
            {t("2 Lộ Trình Phát Triển Bình Đẳng")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#06301B]/65 sm:text-[15px]">
            {t(
              "Không phải ai giỏi cũng cần làm quản lý. Một tổ chức mạnh cần rất nhiều người giỏi nghề."
            )}
          </p>
        </Reveal>

        <Reveal duration={1} delay={0.1}>
          <div className="relative mx-auto mt-10 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-3xl shadow-[0_25px_60px_-22px_rgba(15,40,20,0.35)]">
            <Image
              src="/images/UNIFARM/DJI_20260805085036_0330_D.JPG"
              alt={t("Đội ngũ Unifarm cùng nhau trưởng thành trong nghề nông nghiệp")}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06301B]/70 via-transparent to-transparent" />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12">
          <PathColumn
            title={"Con đường quản lý"}
            color="#006400"
            steps={MANAGEMENT_PATH}
            delayBase={0}
          />
          <PathColumn
            title={"Con đường chuyên môn"}
            color="#0B7A0B"
            steps={EXPERT_PATH}
            delayBase={0.15}
          />
        </div>
      </div>
    </section>
  );
}
