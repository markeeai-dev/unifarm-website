/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { User, Recycle, Factory, PackageOpen, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    icon: User,
    title: "Hỗ trợ nông dân",
    desc: "Nông dân có thể cải thiện sức khỏe đất trong khi tăng năng suất cây trồng.",
  },
  {
    icon: Recycle,
    title: "Sức mạnh phục hồi",
    desc: "Chuyển đổi nông nghiệp từ việc phát thải cacbon thành một bể chứa cacbon hiệu quả.",
  },
  {
    icon: Factory,
    title: "Phát triển sự xuất sắc",
    desc: "cung cấp cây giống rau và quả mềm chất lượng cao từ hạt giống tốt của chúng tôi.",
  },
  {
    icon: PackageOpen,
    title: "Hạt giống xuất sắc",
    desc: "Chúng tôi giúp thúc đẩy sự phát triển cho tất cả khách hàng của mình nhằm đóng góp vào sự tiến bộ của ngành.",
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
/*  Reveal wrapper — slides in from the right as it enters view        */
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
      className={`transition-all duration-[2000ms] ease-linear ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-24 sm:translate-x-36"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  const Icon = service.icon;
  return (
    <div className="group flex h-full flex-col items-center px-3 py-5 text-center sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf9e0] transition-colors duration-300 group-hover:bg-[#fbf3c4] sm:mb-5 sm:h-24 sm:w-24">
        <Icon
          className="h-7 w-7 text-[#006400] transition-transform duration-300 group-hover:animate-bounce sm:h-9 sm:w-9"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="uppercase mb-1 text-sm font-bold text-[#006400] sm:mb-2 sm:text-lg">{service.title}</h3>
      <p className="mb-3 max-w-[160px] text-xs leading-relaxed text-gray-500 sm:mb-4 sm:max-w-[230px] sm:text-sm">
        {service.desc}
      </p>
      <a
        href="#"
        className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#006400] transition-colors hover:text-[#004d00] sm:text-sm"
      >
        Khám phá
        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export default function ServicesSection() {
  return (
    <section className="bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat pb-20 pt-81 lg:pb-28 lg:pt-[60px]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <RevealFromRight className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          {/* <Image
            src="/images/mascot/mascot2.png"
            alt=""
            aria-hidden="true"
            width={100}
            height={100}
            className="h-12 w-12 shrink-0 object-contain sm:h-28 sm:w-28"
          /> */}
          <h2 className="uppercase text-3xl font-extrabold leading-tight text-[#006400] [text-wrap:balance] sm:[text-wrap:auto] sm:text-4xl lg:text-[42px]">
            Chúng tôi cung cấp dịch vụ
            <span className="hidden sm:inline"><br /></span>
            {" "}nhà máy &amp; công nghiệp tốt nhất
          </h2>
        </RevealFromRight>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-14 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-black">
          {SERVICES.map((service, i) => (
            <RevealFromRight key={service.title} delayMs={i * 130} className="h-full">
              <ServiceCard service={service} />
            </RevealFromRight>
          ))}
        </div>
      </div>
    </section>
  );
}