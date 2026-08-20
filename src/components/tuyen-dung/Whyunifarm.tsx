/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { Sprout, BookOpen, Users, Rocket } from "lucide-react";

const FEATURES = [
  {
    icon: Sprout,
    title: "Môi trường thực tế",
    desc: "Được trực tiếp tham gia vào công việc và các dự án thực tế của doanh nghiệp.",
  },
  {
    icon: BookOpen,
    title: "Học hỏi & phát triển",
    desc: "Cơ hội học hỏi từ đồng nghiệp, quản lý và thực tiễn công việc.",
  },
  {
    icon: Users,
    title: "Cùng làm – cùng phát triển",
    desc: "Làm việc cùng đội ngũ ở nhiều lĩnh vực để tạo ra kết quả chung.",
  },
  {
    icon: Rocket,
    title: "Cơ hội thăng tiến",
    desc: "Lộ trình phát triển rõ ràng theo năng lực và định hướng nghề nghiệp.",
  },
];

/* ------------------------------------------------------------------ */
/*  Hook — fires once the element scrolls into view                    */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
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
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  Reveal wrapper — slides in from the right, slowly, as it scrolls   */
/*  into view.                                                         */
/* ------------------------------------------------------------------ */

function RevealFromRight({
  children,
  delayMs = 0,
  className = "",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-24 sm:translate-x-32"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export default function WhyUnifarm() {
  return (
    <section id="gioi-thieu-unifarm" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#006400]">
            <span aria-hidden>🍃</span>
            Tại sao chọn Unifarm?
          </p>

          <h2 className="mt-2 text-2xl font-extrabold uppercase leading-snug text-[#06301B] sm:text-3xl lg:text-4xl">
            Điều gì chờ đón bạn tại Unifarm?
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#06301B]/65 sm:text-[15px]">
            Không chỉ là một nơi làm việc, Unifarm hướng đến xây dựng môi trường nơi mỗi người
            có thể làm việc tốt hơn, học hỏi nhiều hơn và phát triển lâu dài hơn.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 gap-y-8 sm:grid-cols-2 sm:gap-10 lg:mt-14 lg:grid-cols-4 lg:divide-x lg:divide-black/10">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <RevealFromRight
              delayMs={i * 250}
              key={title}
              className="group relative py-2 lg:px-8 lg:py-4 lg:first:pl-0"
            >
              <Icon size={26} className="text-[#006400]" />
              <h3 className="mt-4 text-lg font-bold text-[#06301B]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#06301B]/60">{desc}</p>
              <span
                aria-hidden="true"
                className="mt-4 block h-[2px] w-0 bg-[#006400] transition-all duration-500 ease-out group-hover:w-full"
              />
            </RevealFromRight>
          ))}
        </div>
      </div>
    </section>
  );
}
