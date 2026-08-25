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

export default function ApplyBenefits() {
  return (
    <section className="bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <div className="flex items-center justify-center gap-1.5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
              Vì sao chọn Unifarm
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
            Quyền lợi khi bạn gia nhập đội ngũ
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) =>
            b.featured ? (
              <Reveal
                key={b.title}
                delay={i * 0.08}
                duration={1}
                className="sm:col-span-2"
              >
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#006400] to-[#06301B] p-7 shadow-[0_10px_30px_rgba(15,40,20,0.18)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,40,20,0.28)] sm:p-8">
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
                        {b.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/65">
                        {b.desc}
                      </p>
                    </div>
                    {b.stat && (
                      <div className="hidden shrink-0 text-right sm:block">
                        <div className="text-3xl font-black text-[#FFFACD]">
                          {b.stat.value}
                        </div>
                        <div className="mt-1 max-w-[6rem] text-[11px] font-medium uppercase tracking-wide text-white/45">
                          {b.stat.label}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ) : (
              <Reveal key={b.title} delay={i * 0.08} duration={1}>
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

                  <h3 className="uppercase relative mt-5 text-[15px] font-bold text-[#06301B]">{b.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-[#06301B]/60">{b.desc}</p>
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}
