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
  { icon: "🍅", top: "-10%", left: "-10%", finalSize: 80, startX: 260, startRot: 50, delay: 0 },
  { icon: "🌶️", top: "-5%", left: "10%", finalSize: 72, startX: 220, startRot: -40, delay: 70 },
//   { icon: "🫐", top: "3%", left: "25%", finalSize: 34, startX: 200, startRot: 60, delay: 140 },
//   { icon: "🥬", top: "20%", left: "30%", finalSize: 54, startX: 180, startRot: -55, delay: 210 },
  { icon: "🫐", top: "8%", left: "35%", finalSize: 50, startX: 180, startRot: -55, delay: 210 },
  { icon: "🫑", top: "0%", left: "0%", finalSize: 46, startX: 240, startRot: 35, delay: 280 },
  { icon: "🫑", top: "84%", left: "32%", finalSize: 76, startX: 160, startRot: 45, delay: 350 },
  { icon: "🍅", top: "38%", left: "45%", finalSize: 56, startX: 90, startRot: -30, delay: 420 },
  { icon: "🍅", top: "75%", left: "20%", finalSize: 68, startX: 210, startRot: -50, delay: 490 },
  { icon: "🫐", top: "93%", left: "5%", finalSize: 58, startX: 260, startRot: 40, delay: 560 },
  { icon: "🫑", top: "95%", left: "-10%", finalSize: 80, startX: 270, startRot: -60, delay: 630 },
//   { icon: "🍅", top: "58%", left: "42%", finalSize: 38, startX: 90, startRot: -30, delay: 420 },
  { icon: "🍅", top: "8%", left: "20%", finalSize: 56, startX: 90, startRot: -30, delay: 420 },

  // extra scatter, including several over the RIGHT (photo) side
  { icon: "🫑", top: "-8%", left: "60%", finalSize: 54, startX: 120, startRot: 45, delay: 700 },
  { icon: "🍅", top: "5%", left: "90%", finalSize: 46, startX: 100, startRot: -35, delay: 770 },
  { icon: "🫐", top: "42%", left: "97%", finalSize: 62, startX: 90, startRot: 40, delay: 840 },
  { icon: "🫑", top: "68%", left: "88%", finalSize: 50, startX: 110, startRot: -45, delay: 910 },
  { icon: "🍅", top: "90%", left: "68%", finalSize: 70, startX: 130, startRot: 55, delay: 980 },
  { icon: "🫐", top: "55%", left: "8%", finalSize: 48, startX: 200, startRot: -40, delay: 1050 },
  { icon: "🫑", top: "22%", left: "-8%", finalSize: 44, startX: 230, startRot: 35, delay: 1120 },
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
      className="relative overflow-hidden py-16 sm:py-20 lg:py-25"
    >
      {/* soft light-blue ambient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full  blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#FFFACD] blur-3xl"
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
            NÔNG TRẠI HỮU CƠ
          </p>

          <h2 className="font-display text-3xl font-extrabold leading-tight text-[#006400] sm:text-4xl lg:text-[42px]">
            Trang trại{" "}
            <span className="relative inline-block">
              chúng tôi
              <span className="absolute -bottom-1 left-0 h-3 w-full -z-10 bg-[#FFFACD]" />
            </span>
          </h2>

          <p className="mt-4 text-lg font-medium text-gray-700">
            Thực phẩm tự nhiên cho một tương lai tốt đẹp hơn
          </p>

          <p className="mx-auto mt-5 text-justify max-w-xl text-sm leading-relaxed text-gray-500 lg:mx-0">
            Chúng tôi canh tác theo phương pháp hữu cơ, không hóa chất, thu
            hoạch mỗi ngày để mang đến rau củ tươi sạch nhất cho bàn ăn gia
            đình bạn. Mỗi sản phẩm đều được chăm sóc bằng tâm huyết của những
            người nông dân gắn bó với đất từ nhiều thế hệ.Mỗi sản phẩm đều được chăm sóc bằng tâm huyết của những
            người nông dân gắn bó với đất từ nhiều thế hệ.Mỗi sản phẩm đều được chăm sóc bằng tâm huyết của những
            người nông dân gắn bó với đất từ nhiều thế hệ.
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
        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]">
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
            {/* fruit-box cutout — bigger (scaled up, minimal padding), shifted further
                left and slightly rotated so it leans out well past the panel's edge for
                a strong layered/3D feel. It's a PNG cutout so spilling outside the panel
                is safe — no overflow-hidden anywhere in this stack. */}
            <div className="relative h-[440px] w-full sm:h-[500px] lg:h-[560px]">
              <Image
                src="/images/Gio-trai-cay.png"
                alt="Giỏ trái cây tươi Unifarm"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom p-1 scale-125 -translate-x-16 -translate-y-2 rotate-[-3deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)] sm:-translate-x-20 lg:-translate-x-24"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}