"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  Microscope,
  Sprout,
  Users2,
  Factory,
  Settings2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Nội dung 5 mảng hoạt động — thay ảnh bằng ảnh thật của bạn ở đây   */
/* ------------------------------------------------------------------ */

type Project = {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
};

const projects: Project[] = [
  {
    title: "Nghiên Cứu Và Cung Ứng Giống",
    description:
      "Từ nghiên cứu, tuyển chọn và nhân giống nuôi cấy mô đến sản xuất quy mô lớn đến đóng gói xuất khẩu và phân phối thị trường quốc tế.",
    image: "/images/UNIFARM/ptn.jpg",
    icon: Microscope,
  },
  {
    title: "Phát triển Vùng Trồng",
    description:
      "Phát triển theo định hướng sản xuất chuyên nghiệp, chất lượng đồng đều và phù hợp yêu cầu khắt khe của thị trường.",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/vuon1.jpg",
    icon: Sprout,
  },
  {
    title: "Hợp Tác Cùng Nhà Nông",
    description:
      "Kết nối, hỗ trợ kỹ thuật và chuẩn hóa những vùng sản xuất tốt của Việt Nam ra thị trường.",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/DSC_9897.jpg",
    icon: Users2,
  },
  {
    title: "Chế Biến Sâu & Xuất Khẩu",
    description:
      "Tối ưu giá trị nông sản bằng công nghệ chế biến sâu, đưa sản phẩm Việt vươn ra quốc tế.",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/chuoi-tuoi.jpg",
    icon: Factory,
  },
  {
    title: "Giải Pháp Công Nghệ Trong Nông Nghiệp",
    description:
      "Ứng dụng tự động hóa và giải pháp sinh học thúc đẩy mô hình nông nghiệp tuần hoàn, bền vững.",
    image: "/images/UNIFARM/nha-kinh.jpg",
    icon: Settings2,
  },
];

/* ------------------------------------------------------------------ */
/*  Hook: phát hiện phần tử xuất hiện trong khung nhìn khi cuộn        */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.05) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  Card component                                                    */
/* ------------------------------------------------------------------ */


function ProjectCard({
  project,
  index,
  size,
  inView,
}: {
  project: Project;
  index: number;
  size: "lg" | "sm";
  inView: boolean;
}) {
  const { t } = useLanguage();
  const Icon = project.icon;

  // Card 1, 2: nhỏ → lớn
  // Card 3, 5: lớn → nhỏ
  // Card 4: nhỏ → lớn
  const initialScale =
    index <= 1
      ? 0.72
      : index === 3
        ? 0.72
        : 1.08;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-xl",
        "shadow-[0_10px_30px_-15px_rgba(0,100,0,0.35)]",
        "will-change-transform",
        "transition-[opacity,transform]",
        "ease-[cubic-bezier(0.22,1,0.36,1)]",
        size === "lg"
          ? "h-[360px] sm:h-[400px] md:h-[440px]"
          : "h-[300px] sm:h-[340px] md:h-[380px]",
      ].join(" ")}
      style={{
        opacity: inView ? 1 : 0,
        transform: `
          translateY(${inView ? 0 : 35}px)
          scale(${inView ? 1 : initialScale})
        `,
        transitionDuration: "4000ms",
      }}
    >
      {/* Ảnh nền */}
      <div
        className="card-image absolute inset-0"
        style={{
          backgroundImage: `url(${project.image})`,
        }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

      {/* Vệt sáng */}
      <div className="light-sweep pointer-events-none absolute inset-0 overflow-hidden">
        <span className="sweep-bar" />
      </div>

      {/* Icon */}
      <div className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-[#fffacd]/95 text-[#006400] shadow-sm ring-1 ring-black/5 md:left-5 md:top-5">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>

      {/* Nội dung */}
      <div className="absolute inset-x-4 bottom-4 z-10 rounded-xl bg-white/95 p-5 shadow-lg backdrop-blur-sm md:inset-x-5 md:bottom-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="uppercase text-lg font-bold leading-snug text-[#006400] md:text-xl">
            {t(project.title)}
          </h3>

          <Link
            href="/du-an-hop-tac#hop-tac"
            aria-label={t("Liên hệ hợp tác cùng Unifarm")}
            className="arrow-badge relative z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#87cefa]/40 text-[#006400] transition-transform duration-500 ease-out group-hover:rotate-[135deg] group-hover:bg-[#fffacd] md:h-10 md:w-10"
          >
            <ArrowUpRight
              className="h-5 w-5"
              strokeWidth={2.5}
            />
          </Link>
        </div>

        <div className="reveal grid overflow-hidden transition-all duration-500 ease-out">
          <p className="reveal-inner text-sm leading-relaxed text-[#006400]/75">
            {t(project.description)}
          </p>

          <Link
            href="/du-an-hop-tac#hop-tac"
            className="relative z-20 mt-3 inline-flex w-fit items-center gap-1 text-sm font-semibold text-[#006400] opacity-0 transition-opacity duration-500 [transition-delay:150ms] group-hover:opacity-100"
          >
            {t("Khám phá")}
            <ArrowUpRight
              className="h-4 w-4"
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .card-image {
          background-size: cover;
          background-position: center;
          animation: breathe 9s ease-in-out infinite;
          transition: transform 1.1s ease;
          transform-origin: center;
        }

        .group:hover .card-image {
          animation-play-state: paused;
          transform: scale(1.14);
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.06);
          }
        }

        .sweep-bar {
          position: absolute;
          top: 0;
          left: -35%;
          width: 25%;
          height: 100%;
          transform: skewX(-15deg) translateX(-120%);

          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );

          transition: transform 0.9s ease;
        }

        .group:hover .sweep-bar {
          transform: skewX(-15deg) translateX(560%);
        }

        .reveal {
          grid-template-rows: 0fr;
          margin-top: 0;
        }

        .group:hover .reveal {
          grid-template-rows: 1fr;
          margin-top: 0.75rem;
        }

        .reveal-inner {
          min-height: 0;
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .card-image {
            animation: none;
          }

          .group:hover .card-image {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section chính                                                     */
/* ------------------------------------------------------------------ */

export default function AgricultureProjects() {
     const { t } = useLanguage();
     const backgroundImage = "/images/nen_vang.jpg";
    const { ref: headerRef, inView: headerInView } =
  useInView<HTMLDivElement>(0.05);
const { ref: topRef, inView: topInView } =
  useInView<HTMLDivElement>(0.05);

const { ref: bottomRef, inView: bottomInView } =
  useInView<HTMLDivElement>(0.05);
  return (
    <section
        className="relative overflow-hidden py-16 sm:py-20 md:py-28"
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "scroll",
        }}
        >
      {/* điểm nhấn màu nền mềm mại phía sau */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 bg-[#87cefa]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 bg-[#fffacd]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div
            ref={headerRef}
            className={[
                "mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between",
                "transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                headerInView
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0",
            ].join(" ")}
            >
          <div>
            <span
                className={[
                    "mb-4 inline-flex items-center border border-[#006400]/15 bg-[#fffacd] px-4 py-1.5 text-sm font-medium text-[#006400]",
                    "transition-all duration-700 ease-out",
                    headerInView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0",
                ].join(" ")}
                >
                {t("Lĩnh Vực Hoạt Động")}
                </span>
            <h2
                className={[
                    "uppercase max-w-xl text-3xl font-extrabold leading-[1.15] text-[#006400] sm:text-4xl md:text-4xl",
                    "transition-all duration-[1100ms] delay-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    headerInView
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-8 opacity-0 scale-[0.96]",
                ].join(" ")}
                >
                {t("Hệ Sinh Thái Nông Nghiệp")}
                <br className="hidden sm:block" /> {t("Công Nghệ Cao")}
                </h2>
          </div>
          <p
            className={[
                "max-w-sm text-sm leading-relaxed text-[#006400]/70 md:text-right md:text-[18px]",
                "transition-all duration-[1200ms] delay-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                headerInView
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0",
            ].join(" ")}
            >
            {t("Chúng tôi kiến tạo chuỗi giá trị nông nghiệp khép kín — từ nghiên cứu giống, phát triển vùng trồng, đến chế biến sâu và số hóa toàn diện, đưa nông sản Việt vươn tầm quốc tế.")}
            </p>
        </div>

        {/* hàng trên: 2 card lớn */}
        <div
            ref={topRef}
            className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mb-6 md:gap-6"
            >
            {projects.slice(0, 2).map((project, i) => (
                <ProjectCard
                key={project.title}
                project={project}
                index={i}
                size="lg"
                inView={topInView}
                />
            ))}
            </div>

        {/* hàng dưới: 3 card đều nhau */}
        <div
            ref={bottomRef}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
            >
            {projects.slice(2).map((project, i) => (
                <ProjectCard
                key={project.title}
                project={project}
                index={i + 2}
                size="sm"
                inView={bottomInView}
                />
            ))}
            </div>
      </div>
    </section>
  );
}