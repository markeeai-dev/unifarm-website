"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * AgricultureHero — v3 (bám sát ảnh mẫu "Focofirm")
 * -----------------------------------------------------------------------
 * Cấu trúc:
 *  1. Toàn bộ khối hero nằm trong 1 khung bo góc rất lớn, có viền/khoảng
 *     trắng xung quanh giống ảnh mẫu.
 *  2. Nền phía sau là chính ảnh cánh đồng — làm mờ, phủ tối và ngả xanh —
 *     tạo chiều sâu thay vì một khối gradient phẳng.
 *  3. Header dạng 3 "viên thuốc" nổi trên banner: logo (trái) — menu (giữa)
 *     — Contact us (phải), kích thước lớn, rõ ràng. Trên mobile menu giữa
 *     thu gọn thành nút hamburger.
 *  4. Ảnh cánh đồng chiếm ~45-60% phần dưới, bo góc trên rất lớn, tự động
 *     zoom chậm liên tục (Ken Burns effect) để banner luôn "sống".
 *  5. Khối chữ tiêu đề nằm giữa, phần dưới bị ảnh che. Khi trang vừa mở,
 *     chữ trồi từ dưới lên (ẩn sau ảnh -> hiện dần).
 *  6. Ngay dưới ảnh là 2 card trắng, đè lên mép ảnh, ảnh đại diện trong
 *     card được cắt theo hình lá (leaf clip-path). Card trái chạy vào từ
 *     bên trái, card phải chạy vào từ bên phải, dòng chữ giữa chạy từ
 *     dưới lên — tất cả kích hoạt khi mở trang.
 * -----------------------------------------------------------------------
 * Yêu cầu: TailwindCSS đã cấu hình trong dự án Next.js (App Router).
 * Thay các URL trong `IMAGES` bằng ảnh thật, đặt trong /public để tối ưu.
 */

// Rotating hero backdrop — 4 bright, harmonious green-agriculture photos,
// auto-advancing with a smooth crossfade (see HERO_ROTATE_MS below).
const HERO_IMAGES = [
  "/images/hero/green-field-blue-sky.jpg",
  "/images/hero/green-lettuce-rows.jpg",
  "/images/hero/green-leaves-sunburst.jpg",
  "/images/hero/green-hills-mountains.jpg",
];
const HERO_ROTATE_MS = 5500;

const IMAGES = {
  soil:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&auto=format&fit=crop",
  windmill:
    "https://images.unsplash.com/photo-1720071702672-d18c69cb475c?q=80&w=400&auto=format&fit=crop",
};

const NAV_LINKS = [
  { label: "Trang chủ", href: "#" },
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Dự án", href: "#projects" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Góc chia sẻ", href: "#blog" },
  { label: "Tuyển dụng", href: "#careers" },
];

export default function AgricultureHero() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Trang chủ");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [stickyMenuOpen, setStickyMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Auto-advance the hero backdrop through HERO_IMAGES, looping forever.
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Sticky nav shows once the hero itself has scrolled out of view, and
  // hides again as soon as the user scrolls back up to it.
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyNav(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-3 pt-3 sm:px-6 sm:pt-6">
      {/* ================= STICKY NAV — appears once the hero scrolls out of
          view, stays fixed to the top over every other component, and
          disappears again on scrolling back up to the hero. ================= */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          showStickyNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="w-full bg-[#fffde7]/95 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <Image
              src="/images/logo-unifarm.png"
              alt="Unifarm"
              width={829}
              height={400}
              className="h-8 w-auto sm:h-9"
            />
          </a>

          {/* Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith("/")) e.preventDefault();
                  setActive(link.label);
                }}
                className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-wide transition-all duration-300 ease-out ${
                  active === link.label
                    ? "bg-[#87cefa]/25 text-[#006400]"
                    : "text-gray-500 hover:bg-[#f2f9ee] hover:text-[#006400]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <a
            href="#contact"
            className="hidden rounded-full bg-[#006400] px-6 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-[#004d00] hover:shadow-md md:inline-flex"
          >
            Liên hệ
          </a>

          {/* Mobile hamburger — own dropdown, independent from the hero header's */}
          <button
            aria-label="Mở menu"
            onClick={() => setStickyMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f9ee] text-[#006400] transition-transform duration-300 active:scale-90 md:hidden"
          >
            {stickyMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
          </div>
          {/* Thin brand-gradient accent stripe — a bit more visual pop/prominence */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#006400] via-[#87cefa] to-[#fffacd]" />
        </div>

        {/* Mobile dropdown panel for the sticky nav */}
        <div
          className={`overflow-hidden bg-[#fffde7]/95 shadow-lg backdrop-blur-md transition-all duration-300 md:hidden ${
            stickyMenuOpen ? "max-h-96 border-b border-black/5 py-2" : "max-h-0"
          }`}
        >
          <div className="mx-auto flex max-w-[1500px] flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith("/")) e.preventDefault();
                  setActive(link.label);
                  setStickyMenuOpen(false);
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  active === link.label
                    ? "bg-[#87cefa]/20 text-[#006400]"
                    : "text-gray-600 hover:bg-[#f2f9ee] hover:text-[#006400]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setStickyMenuOpen(false)}
              className="mt-1 rounded-xl bg-[#006400] px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              Liên hệ
            </a>
          </div>
        </div>
      </div>

      {/* Leaf clip */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="leaf-clip" clipPathUnits="objectBoundingBox">
            <path d="M1,0.42 C1,0.75 0.78,1 0.46,1 C0.2,1 0,0.8 0,0.55 C0,0.28 0.22,0.06 0.5,0.02 C0.78,-0.02 1,0.12 1,0.42 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ================= HERO ================= */}
      {/* NOTE: this outer section is NOT overflow-hidden. The header/pills sit directly on it and
          own their own corner radius, so nothing ever relies on a parent clip to "cut" them —
          that removes any chance of a green sliver showing at the top corners. */}
      <section
        ref={heroSectionRef}
        className="relative isolate rounded-[36px] bg-[#006400] sm:rounded-[48px] lg:rounded-[64px]"
      >
        {/* Everything that needs to be clipped to the card shape (photo backdrop, light streaks,
            banner image) lives in this inner layer — clipped separately from the header. */}
        <div className="absolute inset-0 overflow-hidden rounded-[36px] sm:rounded-[48px] lg:rounded-[64px]">
          {/* Blurred, greened-out photo backdrop — depth instead of a flat gradient.
              Crossfades through HERO_IMAGES in lockstep with the sharp banner below. */}
          <div className="absolute inset-0 -z-20 overflow-hidden">
            {HERO_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                  i === heroIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="scale-110 object-cover object-center blur-lg saturate-[1.35] brightness-105"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-[#006400]/50 via-[#006400]/35 to-[#006400]/60" />
          </div>

          {/* Background light streaks */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-20 top-0 h-[130%] w-40 rotate-[18deg] bg-gradient-to-b from-[#87cefa]/25 to-transparent blur-3xl" />
            <div className="absolute left-[38%] top-0 h-[130%] w-48 rotate-[18deg] bg-gradient-to-b from-[#87cefa]/12 to-transparent blur-3xl" />
            <div className="absolute right-[-50px] top-0 h-[130%] w-40 rotate-[-18deg] bg-gradient-to-b from-[#87cefa]/18 to-transparent blur-3xl" />
          </div>
        </div>

        {/* ================= HEADER ================= */}
        <header className="relative z-50 h-[76px] sm:h-[92px] md:h-[104px]">
          {/* LEFT GROUP — white backplate + logo slide in together from the left over 3s.
              Outer top-left corner stays square on purpose: it just blends into the white
              page margin around the whole card, so nothing ever shows through. */}
          <div
            className={`absolute left-0 top-0 z-0 h-[68px] w-[194px] transition-all duration-[3000ms] ease-out sm:h-[84px] sm:w-[238px] md:w-[258px] ${
              mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-br-[28px] bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat sm:rounded-br-[36px]" />

            {/* LOGO — bigger than before, with a slow, gentle bob for a livelier feel */}
            <a
              href="#"
              className="absolute left-4 top-[8px] z-10 flex items-center sm:left-15 sm:top-2"
            >
              <Image
                src="/images/logo-unifarm.png"
                alt="Unifarm"
                width={829}
                height={400}
                priority
                className="h-11 w-auto animate-bob sm:h-14"
              />
            </a>

            {/* Cute banana mascot peeking out of the corner */}
            <Image
              src="/images/mascot/banana-mascot.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={200}
              className="pointer-events-none absolute -bottom-2 -right-2 z-20 h-9 w-9 rotate-[-10deg] drop-shadow-md sm:h-11 sm:w-11"
            />
          </div>

          {/* MENU — glassy pill nav, eases in with a quick fade + rise so it doesn't feel
              frozen while the two side groups glide in over 3s */}
          <nav
            className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/15 bg-white/10 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-[900ms] ease-out md:flex ${
              mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith("/")) e.preventDefault();
                  setActive(link.label);
                }}
                className={`rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition-all duration-[420ms] ease-out ${
                  active === link.label
                    ? "bg-[#87cefa] text-[#006400] shadow-[0_6px_16px_rgba(135,206,250,0.45)]"
                    : "text-white/80 hover:-translate-y-0.5 hover:bg-[#87cefa] hover:text-[#006400]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT GROUP — white backplate + contact/hamburger slide in together from the
              right over 3s. Outer top-right corner stays square for the same reason as above. */}
          <div
            className={`absolute right-0 top-0 z-0 h-[68px] w-[170px] transition-all duration-[3000ms] ease-out sm:h-[84px] sm:w-[208px] md:w-[226px] ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-bl-[28px] bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat sm:rounded-bl-[36px]" />

            {/* Cute banana mascot peeking out of the corner, mirroring the logo side */}
            <Image
              src="/images/mascot/banana-mascot.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={200}
              className="pointer-events-none absolute -bottom-2 -left-2 z-20 h-9 w-9 rotate-[10deg] scale-x-[-1] drop-shadow-md sm:h-11 sm:w-11"
            />

            {/* CONTACT */}
            <a
              href="#contact"
              className="absolute right-4 top-[13px] z-10 hidden rounded-full bg-[#87cefa] px-7 py-3.5 text-[12px] font-bold uppercase tracking-wide text-[#006400] shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#a9ddfb] md:inline-flex sm:right-15 sm:top-4 sm:px-8 sm:py-4 sm:text-[13px]"
            >
              Liên hệ
            </a>

            {/* MOBILE */}
            <button
              aria-label="Mở menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="absolute right-4 top-[13px] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#87cefa] text-[#006400] shadow-md transition-transform duration-300 active:scale-90 md:hidden sm:right-6 sm:top-4"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* MOBILE MENU */}
        <div
          className={`relative z-40 overflow-hidden px-4 transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 rounded-2xl bg-black/30 p-3 backdrop-blur-sm">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith("/")) e.preventDefault();
                  setActive(link.label);
                  setMenuOpen(false);
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  active === link.label
                    ? "bg-[#87cefa] text-[#006400]"
                    : "text-white/85 hover:bg-[#87cefa]/90 hover:text-[#006400]"
                }`}
              >
                {link.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-xl bg-[#87cefa] px-4 py-2.5 text-center text-sm font-bold text-[#006400]"
            >
              Liên hệ
            </a>
          </div>
        </div>

        {/* ================= HERO CONTENT ================= */}
        <div className="relative h-[560px] sm:h-[640px] md:h-[680px]">
          {/* CENTER TEXT — tagline then headline rise in one after another over ~3s.
              Sits a bit higher (top-[9%] instead of 13%) so the headline has more
              breathing room above the banner image below. */}
          <div className="absolute inset-x-0 top-[9%] z-10 mx-auto max-w-4xl px-6 text-center">
            <h2
              className={`font-display text-sm font-semibold uppercase tracking-[0.35em] text-white/80 transition-all duration-[1100ms] ease-out sm:text-base md:text-lg ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              UNIFARM
            </h2>

            {/* GRADIENT TEXT CHẠY LIÊN TỤC */}
            <h1
              className={`animate-gradient font-display mt-3 bg-[linear-gradient(90deg,#87cefa,#d9ff83,#ffffff,#87cefa,#b5f36a)] bg-[length:300%_100%] bg-clip-text text-[8vw] font-extrabold leading-[1.15] tracking-tight text-transparent transition-all duration-[2200ms] ease-out sm:text-[5.2vw] md:text-[3.1rem] lg:text-[3.75rem] ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
              style={{ transitionDelay: mounted ? "500ms" : "0ms" }}
            >
              SAFE FOOD FOR LIFE
            </h1>
          </div>

          {/* BANNER IMAGE — crossfades through HERO_IMAGES every few seconds; whichever
              photo is active gets its own fresh Ken-Burns zoom (remounted via `key` so the
              animation restarts each time, exactly like the crossfade in QuoteSlider).
              rounded-b matches the section's own bottom corners exactly, since the section
              itself is no longer overflow-hidden. */}
          <div className="absolute inset-x-0 bottom-0 z-20 h-[46%] overflow-hidden rounded-t-[48px] rounded-b-[36px] sm:h-[63%] sm:rounded-t-[64px] sm:rounded-b-[48px] md:rounded-t-[80px] lg:rounded-b-[64px]">
            {HERO_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                  i === heroIndex ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              >
                <Image
                  key={i === heroIndex ? `active-${i}` : `idle-${i}`}
                  src={src}
                  alt="Cánh đồng nông nghiệp bền vững"
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={`object-cover ${i === heroIndex ? "animate-[hero-zoom_16s_ease-in-out_infinite]" : ""}`}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />
          </div>
        </div>
      </section>

      {/* ================= CARDS ================= */}
      <div className="relative z-30 mx-auto mt-[-55px] grid max-w-[2000px] grid-cols-1 gap-8 px-4 sm:mt-[-75px] sm:px-0 md:grid-cols-[minmax(260px,1fr)_minmax(320px,1.3fr)_minmax(260px,1fr)] md:items-end md:gap-4 lg:grid-cols-[minmax(300px,1fr)_minmax(380px,1.3fr)_minmax(300px,1fr)] lg:gap-6">
        {/* CARD LEFT */}
        <Card
          side="left"
          image={IMAGES.soil}
          title="Cải Thiện Sức Khỏe Đất"
          desc="Đất khỏe mạnh giúp cây trồng phát triển vững chắc nhờ canh tác bền vững."
          visible={mounted}
          delay={300}
        />

        {/* CENTER TEXT — no longer forced first on mobile: sitting between the two
            opaque cards (instead of alone over the photo's bottom edge) keeps this
            gradient text fully legible on small screens. */}
        <div
          className={`relative z-10 pb-2 text-center transition-all duration-700 ease-out md:self-end md:pb-8 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "550ms" }}
        >
          <p className="animate-gradient bg-[linear-gradient(90deg,#006400,#87cefa,#d5f99b,#006400)] bg-[length:300%_100%] bg-clip-text text-2xl font-extrabold leading-snug text-transparent sm:text-3xl lg:text-4xl">
            Chuyển Đổi Nông Nghiệp
            <br />
            Cùng Giải Pháp Thông Minh
          </p>
        </div>

        {/* CARD RIGHT */}
        <Card
          side="right"
          image={IMAGES.windmill}
          title="Nông Nghiệp Tích Hợp Công Nghệ"
          desc="Nông nghiệp tích hợp công nghệ đang thay đổi cách canh tác trên toàn cầu."
          visible={mounted}
          delay={550}
        />
      </div>

      <div className="h-10 sm:h-16" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card thông tin, ảnh đại diện cắt theo hình lá, nút Learn more       */
/* ------------------------------------------------------------------ */
function Card({
  side,
  image,
  title,
  desc,
  visible,
  delay,
}: {
  side: "left" | "right";
  image: string;
  title: string;
  desc: string;
  visible: boolean;
  delay: number;
}) {
  const isLeft = side === "left";

  return (
    <div
      className={`group relative z-10 min-h-[196px] overflow-visible rounded-[36px] rounded-tr-[72px] border border-black/[0.03] bg-[#fffde7] p-7 pt-10 shadow-[0_25px_70px_-10px_rgba(0,60,0,0.22)] ring-1 ring-[#87cefa]/10 transition-all duration-[3000ms] ease-out hover:-translate-y-1.5 hover:shadow-[0_35px_90px_-10px_rgba(0,60,0,0.28)] sm:min-h-[212px] sm:p-8 sm:pt-11 ${
        visible
          ? isLeft
            ? "translate-x-6 opacity-100 sm:translate-x-10"
            : "-translate-x-6 opacity-100 sm:-translate-x-10"
          : isLeft
            ? "-translate-x-32 opacity-0 sm:-translate-x-40"
            : "translate-x-32 opacity-0 sm:translate-x-40"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Soft brand-toned glow behind the leaf image, for a bit of depth/premium feel */}
      <div className="pointer-events-none absolute -top-14 right-2 h-32 w-32 rounded-full bg-[#87cefa]/20 blur-2xl" />

      {/* LEAF IMAGE — always top-right, same as text-left, for a consistent look on both cards */}
      <div
        className="absolute -top-10 right-6 h-24 w-24 shadow-[0_10px_30px_rgba(0,60,0,0.2)] transition-transform duration-700 ease-out group-hover:scale-105 sm:-top-12 sm:right-8 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
        style={{ clipPath: "url(#leaf-clip)" }}
      >
        <Image src={image} alt={title} fill sizes="128px" className="object-cover" />
      </div>

      <div className="pr-24 sm:pr-32">
        <h3 className="font-display text-lg font-extrabold text-[#006400] sm:text-xl">{title}</h3>

        <p className="mt-2 max-w-[420px] text-xs leading-relaxed text-gray-500 sm:text-sm">
          {desc}
        </p>

        <a
          href="#"
          className="group/link relative mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#006400]"
        >
          Xem thêm
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 transition group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute -bottom-1.5 left-0 h-1 w-8 rounded-full bg-[#87cefa]" />
        </a>
      </div>
    </div>
  );
}
