"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Dna,
  Factory,
  FlaskConical,
  PackageCheck,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const C = {
  green: "#006400",
  greenDeep: "#053d05",
  yellow: "#FFFACD",
  blue: "#87CEFA",
};

const STAGES: {
  key: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  image: string;
}[] = [
  {
    key: "giong",
    title: "Giống & Khoa học cây trồng",
    desc: "Nghiên cứu, tuyển chọn và phát triển giống phù hợp với thực tế sản xuất.",
    icon: Dna,
    image: "/images/UNIFARM/buong-chuoi.jpg",
  },
  {
    key: "san-xuat",
    title: "Sản xuất",
    desc: "Tổ chức sản xuất trên quy mô thực tế để kiểm chứng, hoàn thiện và chuẩn hóa giống, công nghệ và quy trình.",
    icon: Factory,
    image: "/images/banana/banana-plantation-aerial.jpg",
  },
  {
    key: "giai-phap",
    title: "Giải pháp nông nghiệp",
    desc: "Phát triển và ứng dụng công nghệ, giải pháp sinh học, quy trình canh tác, tự động hóa và dữ liệu nhằm nâng cao hiệu quả sản xuất.",
    icon: FlaskConical,
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/IMG_2455.JPG",
  },
  {
    key: "che-bien",
    title: "Sau thu hoạch & Chế biến",
    desc: "Hoàn thiện giá trị nông sản thông qua sơ chế, bảo quản, chế biến và phát triển sản phẩm.",
    icon: PackageCheck,
    image: "/images/UNIFARM/DJI_20260805085036_0330_D.JPG",
  },
  {
    key: "thi-truong",
    title: "Phát triển thị trường",
    desc: "Kết nối sản phẩm với khách hàng và thị trường, đồng thời đưa yêu cầu của thị trường trở lại quá trình nghiên cứu, phát triển sản phẩm và sản xuất.",
    icon: TrendingUp,
    image: "/images/UNIFARM/nha-kinh.jpg",
  },
];

const TAGS = [
  "Chất lượng",
  "Tiêu chuẩn",
  "Truy xuất nguồn gốc",
  "Định hướng nông nghiệp sinh học và bền vững",
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function CompetitiveCapability() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const [activeStage, setActiveStage] = useState(2);

  // Tự chuyển tab sau mỗi 3,5 giây; rê chuột vào tab sẽ ưu tiên tab đó.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % STAGES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const animV: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.7, delay: i * 0.1, ease: easeOut },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 sm:py-16 lg:py-20"
    >
      {/* Hiệu ứng ánh sáng nền trang trí */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#87cefa]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#ffb08a]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-12">
        {/* HEADER */}
        <motion.div
          custom={0}
          variants={animV}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mx-auto max-w-6xl text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em]"
            style={{
              color: C.green,
              borderColor: `${C.green}33`,
              background: "#f2f9ee",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: C.green }}
            />
            {t("Năng lực cạnh tranh")}
          </span>

          <h2
            className="mt-4 text-2xl font-extrabold uppercase leading-tight tracking-tight sm:mt-5 sm:text-3xl lg:text-[2.75rem]"
            style={{ color: C.greenDeep }}
          >
            {t("Năng lực cạnh tranh từ giải pháp tổng thể")}
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">
            {t(
              "Unifarm kết nối các năng lực từ giống, sản xuất, giải pháp nông nghiệp, chế biến đến thị trường thành một hệ thống hoàn chỉnh, được kiểm chứng trong thực tế và có khả năng nhân rộng."
            )}
          </p>
        </motion.div>
        {/* TAGLINE XUYÊN SUỐT */}
        <motion.div
          custom={7}
          variants={animV}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-2xl border border-emerald-900/10 bg-white/50 px-4 py-5 text-center shadow-sm backdrop-blur-sm sm:mt-10 sm:px-6 lg:mt-12"
        >
          <span
            className="text-xs font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.2em]"
            style={{ color: C.green }}
          >
            {t("Xuyên suốt vận hành")}:
          </span>

          {TAGS.map((tag, i) => (
            <span
              key={tag}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-bold text-slate-700 sm:text-sm">
                {t(tag)}
              </span>
              {i < TAGS.length - 1 && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600/40" />
              )}
            </span>
          ))}
        </motion.div>

        {/* IMAGE TABS — hover to expand, auto-advance every 3.5 seconds */}
        <div className="relative mt-8 sm:mt-9 lg:mt-10">
          <div className="flex h-[360px] flex-col gap-3 sm:h-[380px] sm:flex-row sm:gap-3 lg:h-[360px] lg:gap-4">
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              const active = activeStage === i;

              return (
                <motion.article
                  key={s.key}
                  custom={i + 1}
                  variants={animV}
                  initial="hidden"
                  animate={inView ? "show" : "hidden"}
                  onMouseEnter={() => setActiveStage(i)}
                  onFocus={() => setActiveStage(i)}
                  onClick={() => setActiveStage(i)}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(3,35,18,0.08) 0%, rgba(3,35,18,0.25) 35%, rgba(3,35,18,0.88) 100%), url("${s.image}")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    flex: active ? "4.6 1 0%" : "1.6 1 0%",
                  }}
                  className={`group relative isolate flex min-w-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/40 shadow-[0_18px_45px_-24px_rgba(0,40,10,0.45)] transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-emerald-700 sm:h-full ${active ? "basis-[42%]" : "basis-0"}`}
                  aria-expanded={active}
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 -z-10 bg-emerald-950/10 transition-colors duration-500 group-hover:bg-emerald-950/0" />

                  <div className="flex items-start justify-between gap-3 p-4 sm:p-5 lg:p-6">
                    <span className={`flex shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-500 ${active ? "h-12 w-12 sm:h-14 sm:w-14" : "h-10 w-10"}`}>
                      <Icon className={active ? "h-6 w-6 sm:h-7 sm:w-7" : "h-5 w-5"} strokeWidth={1.8} />
                    </span>
                    <span className="rounded-full border border-white/25 bg-black/15 px-3 py-1 font-mono text-xs font-bold tracking-widest text-white/90 backdrop-blur-sm">
                      0{i + 1}
                    </span>
                  </div>

                  <div className={`p-4 text-white transition-all duration-500 sm:p-5 lg:p-7 ${active ? "opacity-100" : "sm:pb-6"}`}>
                    <div className={`mb-3 h-1 rounded-full bg-[#FFFACD] transition-all duration-500 ${active ? "w-12" : "w-7"}`} />
                    <h3 className={`font-extrabold uppercase leading-snug drop-shadow-md transition-all duration-500 ${active ? "text-lg sm:text-2xl lg:text-[1.7rem]" : "text-sm sm:text-base lg:[writing-mode:vertical-rl] lg:rotate-180 lg:whitespace-nowrap"}`}>
                      {t(s.title)}
                    </h3>
                    <div className={`grid transition-all duration-500 ${active ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0 sm:hidden"}`}>
                      <div className="overflow-hidden">
                        <p className="max-w-xl text-sm leading-relaxed text-white/90 sm:text-[15px]">
                          {t(s.desc)}
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFFACD]">
                          <span>{t("Giai đoạn")} {i + 1} / 05</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    {!active && (
                      <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 sm:hidden">
                        {t("Giai đoạn")} {i + 1} / 05
                      </span>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {STAGES.map((stage, i) => (
              <button
                key={stage.key}
                type="button"
                aria-label={`${t("Chọn giai đoạn")} ${i + 1}`}
                onClick={() => setActiveStage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeStage === i ? "w-8 bg-[#006400]" : "w-3 bg-[#006400]/25 hover:bg-[#006400]/55"}`}
              />
            ))}
          </div>
        </div>

        {/* ECOSYSTEM FLOW BANNER */}
        <motion.div
          custom={6}
          variants={animV}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mt-7 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white/80 p-5 shadow-[0_20px_50px_-20px_rgba(0,100,0,0.15)] backdrop-blur-md sm:mt-8 sm:rounded-3xl sm:p-8 lg:p-9"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#006400] sm:h-12 sm:w-12 sm:rounded-2xl">
                <Layers className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div>
                <h4
                  className="text-sm font-extrabold uppercase leading-snug sm:text-base"
                  style={{ color: C.greenDeep }}
                >
                  {t("Hệ thống khép kín & Vòng lặp giá trị")}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {t(
                    "Tương tác hai chiều giữa Sản xuất ⇄ Giải pháp và phản hồi thị trường quay lại nghiên cứu giống."
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-900/5 bg-emerald-50/50 px-3 py-3 sm:rounded-2xl sm:px-4">
                <ArrowRight className="h-4 w-4 shrink-0 text-[#2E7DC2]" />
                <span className="text-xs font-bold uppercase text-slate-700">
                  {t("Sản xuất ⇄ Giải pháp")}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-emerald-900/5 bg-emerald-50/50 px-3 py-3 sm:rounded-2xl sm:px-4">
                <RefreshCw className="h-4 w-4 shrink-0 text-[#006400]" />
                <span className="text-xs font-bold uppercase text-slate-700">
                  {t("Phản hồi thị trường")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        
      </div>
    </section>
  );
}
