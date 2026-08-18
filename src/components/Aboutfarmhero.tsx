"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Real fruit photo cutouts (transparent PNG, no frame/crop) cycled across the
// floating positions below (i % FRUITS.length)
const FRUITS = [
  { name: "Chuối", src: "/images/fruits/chuoi.png" },
  { name: "Chanh leo", src: "/images/fruits/chanh-leo.png" },
  { name: "Dứa", src: "/images/fruits/dua.png" },
  { name: "Nhãn", src: "/images/fruits/nhan.png" },
  { name: "Ổi", src: "/images/fruits/oi.png" },
];

/**
 * AboutFarmHero
 * Next.js + Tailwind CSS component.
 * Drop this file into e.g. components/AboutFarmHero.jsx and import it
 * into any page/section. Requires no extra dependencies.
 *
 * Palette:
 *   Yellow      #FFFACD
 *   Dark green  #006400
 *   Light blue  #87CEFA
 */

// Final resting spot (spread across the WHOLE hero, spilling onto the
// text column on the left) + starting offset (bunched up near the photo
// on the right) + rotation/scale so they "toss" outward on scroll.
const FLOATING_ITEMS = [
  { icon: "🍅", top: "-10%", left: "-10%", finalSize: 92, startX: 260, startRot: 50, delay: 0 },
  { icon: "🍅", top: "20%", left: "40%", finalSize: 122, startX: 260, startRot: 50, delay: 0 },
  { icon: "🌶️", top: "-5%", left: "10%", finalSize: 104, startX: 220, startRot: -40, delay: 70 },
  { icon: "🫑", top: "84%", left: "32%", finalSize: 88, startX: 160, startRot: 45, delay: 140 },
  { icon: "🍅", top: "75%", left: "20%", finalSize: 130, startX: 210, startRot: -50, delay: 210 },
  { icon: "🫑", top: "85%", left: "0%", finalSize: 100, startX: 270, startRot: -60, delay: 280 },
  { icon: "🍅", top: "5%", left: "90%", finalSize: 100, startX: 100, startRot: -35, delay: 350 },
  { icon: "🫐", top: "42%", left: "97%", finalSize: 104, startX: 90, startRot: 40, delay: 420 },
  { icon: "🍅", top: "90%", left: "68%", finalSize: 102, startX: 130, startRot: 55, delay: 490 },
  { icon: "🫐", top: "55%", left: "48%", finalSize: 130, startX: 200, startRot: -40, delay: 560 },
];

export default function AboutFarmHero() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-35"
    >
      {/* soft light-blue ambient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full  blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#87CEFA]/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* scattered fruit / veg icons — span the FULL hero width so they
            can spill from the photo over onto the text column, fly out
            and grow bigger on scroll. No white plate behind them. */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block">
          {FLOATING_ITEMS.map((item, i) => {
            const fruit = FRUITS[i % FRUITS.length];
            return (
              <span
                key={i}
                style={{
                  top: item.top,
                  left: item.left,
                  width: `${item.finalSize}px`,
                  height: `${item.finalSize}px`,
                  filter: "drop-shadow(0 10px 12px rgba(0,60,0,0.18))",
                  transitionDelay: `${item.delay}ms`,
                  transform: inView
                    ? "translate(0, 0) rotate(0deg) scale(1)"
                    : `translate(${item.startX}px, -10px) rotate(${item.startRot}deg) scale(0.35)`,
                }}
                className={`absolute select-none transition-all duration-[1500ms] ease-out ${
                  inView ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={fruit.src}
                  alt={fruit.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </span>
            );
          })}
        </div>

        {/* LEFT: text content */}
        <div
          className={`relative z-10 text-center transition-all duration-700 ease-out lg:text-left ${
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="mb-3 inline-block rounded-full bg-[#87CEFA]/25 px-4 py-1 text-xs font-semibold tracking-wide text-[#006400]">
            NÔNG NGHIỆP CÔNG NGHỆ CAO
          </p>

          <h2 className="font-display text-3xl font-extrabold leading-tight text-[#006400] sm:text-4xl lg:text-[42px]">
            Tiên phong phát triển{" "}
            <span className="relative inline-block">
              nông nghiệp công nghệ cao
              <span className="absolute -bottom-1 left-0 h-3 w-full -z-10 bg-white" />
            </span>
          </h2>

          <p className="mx-auto mt-5 text-justify max-w-xl text-sm leading-relaxed text-gray-500 lg:mx-0">
            Unifarm phát triển hệ sinh thái nông nghiệp khép kín, từ nghiên cứu
            và sản xuất giống, phát triển vùng trồng, canh tác bền vững đến chế
            biến, thị trường và giải pháp nông nghiệp số.
          </p>

          <p className="mx-auto mt-4 text-justify max-w-xl text-sm leading-relaxed text-gray-500 lg:mx-0">
            Chúng tôi ứng dụng công nghệ và tự động hóa để nâng cao năng suất,
            chất lượng và giá trị nông sản Việt Nam.
          </p>

          <button
            className="mt-8 rounded-full bg-[#006400] px-8 py-3 text-sm font-semibold text-white
                       shadow-md transition-colors duration-300 ease-in-out
                       hover:bg-[#87CEFA] hover:text-[#006400]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006400] focus-visible:ring-offset-2"
          >
            Tìm hiểu thêm
          </button>
        </div>

        {/* RIGHT: image + scattered fruit icons */}
        <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] lg:ml-auto lg:mr-0 lg:max-w-[480px] lg:translate-x-4">
          {/* offset green frame */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-4 border-[#006400] transition-all duration-700 ease-out sm:translate-x-6 sm:translate-y-6 ${
              inView ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* yellow panel behind the photo — no overflow-hidden here on purpose,
              so the fruit-box image below can spill slightly past its left edge */}
          <div
            className={`relative rounded-2xl bg-[#FFFACD] shadow-xl transition-all duration-700 ease-out ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* fruit-box cutout — bigger still (scaled up, minimal padding), shifted
                further left and slightly rotated so it leans out well past the panel's
                edge for a strong layered/3D feel. It's a PNG cutout so spilling outside
                the panel is safe — no overflow-hidden anywhere in this stack. */}
            <div className="relative h-[480px] w-full sm:h-[540px] lg:h-[600px]">
              <Image
                src="/images/Gio-trai-cay.png"
                alt="Giỏ trái cây tươi Unifarm"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom p-1 scale-150 -translate-x-16 -translate-y-4 rotate-[-6deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)] sm:-translate-x-20 lg:-translate-x-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}