"use client";

import {
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  FlaskConical,
} from "lucide-react";
import Image from "next/image";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type Benefit = {
  icon: typeof Wallet;
  title: string;
  desc: string;
  color?: string;
  glow?: string;
  featured?: boolean;
  stat?: { value: string; label: string };
};

const BENEFITS: Benefit[] = [
  {
    icon: Wallet,
    title: "Lương thưởng cạnh tranh",
    desc: "Thu nhập rõ ràng theo năng lực, thưởng KPI minh bạch mỗi quý.",
    color: "#006400",
    glow: "rgba(0,100,0,0.22)",
  },
  {
    icon: TrendingUp,
    title: "Lộ trình thăng tiến rõ ràng",
    desc: "Từ Intern lên Senior theo đúng năng lực — không giới hạn thời gian cứng nhắc, trung bình 18-24 tháng để bước lên một cấp bậc mới.",
    stat: { value: "18-24", label: "tháng / cấp bậc" },
    featured: true,
  },
  {
    icon: GraduationCap,
    title: "Đào tạo 1-1 cùng chuyên gia",
    desc: "Mentor đồng hành xuyên suốt, hướng dẫn sát từng đầu việc thực tế.",
    color: "#0B7A0B",
    glow: "rgba(11,122,11,0.22)",
  },
  {
    icon: FlaskConical,
    title: "Trải nghiệm thực chiến",
    desc: "Tham gia trực tiếp vào sản xuất, R&D và vùng nguyên liệu.",
    color: "#006400",
    glow: "rgba(0,100,0,0.22)",
  },
  {
    icon: Users,
    title: "Môi trường trẻ, cởi mở",
    desc: "Văn hoá phẳng, ý tưởng của bạn được lắng nghe ngay từ ngày đầu.",
    color: "#0B7A0B",
    glow: "rgba(11,122,11,0.22)",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hiểm & phúc lợi đầy đủ",
    desc: "BHXH đầy đủ, khám sức khoẻ định kỳ, du lịch công ty hằng năm.",
    stat: { value: "100%", label: "BHXH & khám sức khoẻ" },
    featured: true,
  },
];

/** Nội dung 1 thẻ quyền lợi — dùng chung cho cả carousel vuốt ngang trên
 * mobile lẫn lưới grid trên tablet/desktop, để 2 nơi luôn giống hệt nhau. */
function BenefitCard({ b, i, t }: { b: Benefit; i: number; t: (s: string) => string }) {
  if (b.featured) {
    return (
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#006400] to-[#06301B] p-6 shadow-[0_10px_30px_rgba(15,40,20,0.18)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,40,20,0.28)] sm:p-7 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FFFACD]/10 blur-2xl transition-transform duration-500 group-hover:scale-125"
        />
        <div className="relative flex items-start justify-between gap-6">
          <div className="max-w-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#FFFACD] ring-1 ring-white/15">
              <b.icon size={22} strokeWidth={1.8} />
            </span>
            <h3 className="uppercase mt-5 text-lg font-bold text-white sm:text-xl">
              {t(b.title)}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-white/65">
              {t(b.desc)}
            </p>
          </div>
          {b.stat && (
            <div className="hidden shrink-0 text-right sm:block">
              <div className="text-3xl font-black text-[#FFFACD]">
                {b.stat.value}
              </div>
              <div className="mt-1 max-w-[6rem] text-[11px] font-medium uppercase tracking-wide text-white/45">
                {t(b.stat.label)}
              </div>
            </div>
          )}
        </div>
        {b.stat && (
          <div className="relative mt-5 flex items-baseline gap-2 sm:hidden">
            <span className="text-2xl font-black text-[#FFFACD]">{b.stat.value}</span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-white/45">
              {t(b.stat.label)}
            </span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(15,40,20,0.06)] ring-1 ring-[#06301B]/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,40,20,0.14)] hover:ring-transparent">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none text-7xl font-black leading-none text-[#06301B]/[0.04] transition-colors duration-400 group-hover:text-[#06301B]/[0.06]"
      >
        {String(i + 1).padStart(2, "0")}
      </span>

      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ backgroundColor: b.color }}
      />

      <span
        className="relative flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-400 group-hover:-translate-y-1 group-hover:scale-105"
        style={{ backgroundColor: b.color, boxShadow: `0 12px 24px -8px ${b.glow}` }}
      >
        <b.icon size={20} strokeWidth={1.8} />
      </span>

      <h3 className="uppercase relative mt-5 text-[15px] font-bold text-[#06301B]">{t(b.title)}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-[#06301B]/60">{t(b.desc)}</p>
    </div>
  );
}

export default function ApplyBenefits() {
  const { t } = useLanguage();
  return (
    <section className="bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 md:py-20">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl px-4 text-center sm:px-0" duration={1}>
          <div className="flex items-center justify-center gap-1.5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
              {t("Vì sao chọn Unifarm")}
            </p>

            <Image
              src="/images/mascot/mascot-digging.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={200}
              className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
            />
          </div>
          <h2 className="uppercase mt-3 text-2xl font-extrabold text-[#06301B] sm:text-3xl md:text-4xl">
            {t("Quyền lợi khi bạn gia nhập đội ngũ")}
          </h2>
        </Reveal>

        {/* Mobile — carousel vuốt ngang, mỗi thẻ hé lộ 1 phần thẻ kế tiếp để
            gợi ý còn nội dung bên phải; feedback bằng snap để dừng gọn từng
            thẻ. Thay cho việc dồn 6 thẻ cao đầy màn hình xếp chồng dọc như
            trước — vốn chỉ là lưới desktop bị bóp về 1 cột. */}
        <div
          className="[scrollbar-width:none] mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:hidden [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: "1rem" }}
        >
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="w-[78%] max-w-[280px] shrink-0 snap-start">
              <BenefitCard b={b} i={i} t={t} />
            </div>
          ))}
          {/* spacer để thẻ cuối cùng cũng vuốt ra giữa được, không dính mép */}
          <div className="w-px shrink-0" aria-hidden />
        </div>

        {/* Tablet/desktop — lưới như cũ, không đổi gì. */}
        <div className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 0.08}
              duration={1}
              className={b.featured ? "sm:col-span-2" : undefined}
            >
              <BenefitCard b={b} i={i} t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
