"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * SanPhamHero — banner đầu trang Sản phẩm.
 * Header (logo · menu · liên hệ) đồng bộ với AgricultureHero ở trang chủ.
 * Nền là video thay vì ảnh, tiêu đề chính/phụ ở giữa tự động đổi mỗi ~4.5s.
 */

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Dự án", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Góc chia sẻ", href: "/" },
  { label: "Tuyển dụng", href: "/" },
];

const SLIDES = [
  {
    title: "SẢN PHẨM TƯƠI SẠCH MỖI NGÀY",
    subtitle: "Nông sản Unifarm — từ nông trại đến bàn ăn",
  },
  {
    title: "CHUỐI GIÀ NAM MỸ CHUẨN XUẤT KHẨU",
    subtitle: "Đạt chuẩn VietGAP và GlobalG.A.P",
  },
  {
    title: "NÔNG NGHIỆP CÔNG NGHỆ CAO",
    subtitle: "Kiểm soát chất lượng xuyên suốt chuỗi cung ứng",
  },
  {
    title: "GIÁ TRỊ BỀN VỮNG CHO NÔNG SẢN VIỆT",
    subtitle: "Đồng hành cùng nông dân trên mọi vùng trồng",
  },
];
const SLIDE_MS = 4500;

export default function SanPhamHero() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Sản phẩm");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [stickyMenuOpen, setStickyMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

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

  const slide = SLIDES[slideIndex];

  return (
    <div className="w-full">
      <style>{`
        @keyframes sanpham-hero-fade {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ================= STICKY NAV ================= */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          showStickyNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="w-full bg-[#fffde7]/95 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-unifarm.png"
                alt="Unifarm"
                width={829}
                height={400}
                className="h-8 w-auto sm:h-9"
              />
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (!link.href.startsWith("/") || link.href === "/") return;
                    e.preventDefault();
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

            <Link
              href="/#contact"
              className="hidden rounded-full bg-[#006400] px-6 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-[#004d00] hover:shadow-md md:inline-flex"
            >
              Liên hệ
            </Link>

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
          <div className="h-[3px] w-full bg-gradient-to-r from-[#006400] via-[#87cefa] to-[#fffacd]" />
        </div>

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
                onClick={() => setStickyMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  active === link.label
                    ? "bg-[#87cefa]/20 text-[#006400]"
                    : "text-gray-600 hover:bg-[#f2f9ee] hover:text-[#006400]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#contact"
              onClick={() => setStickyMenuOpen(false)}
              className="mt-1 rounded-xl bg-[#006400] px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      {/* ================= HERO (video) ================= */}
      <section
        ref={heroSectionRef}
        className="relative isolate w-full overflow-hidden bg-[#006400]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src="/videos/lemons-limes-splash.mp4" type="video/mp4" />
        </video>

        {/* ================= HEADER ================= */}
        <header className="relative z-50 h-[76px] sm:h-[92px] md:h-[104px]">
          <div
            className={`absolute left-0 top-0 z-0 h-[68px] w-[194px] transition-all duration-[3000ms] ease-out sm:h-[84px] sm:w-[238px] md:w-[258px] ${
              mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <Link href="/" className="absolute left-4 top-[8px] z-10 flex items-center sm:left-15 sm:top-2">
              <Image
                src="/images/logo-unifarm.png"
                alt="Unifarm"
                width={829}
                height={400}
                priority
                className="h-11 w-auto animate-bob sm:h-14"
              />
            </Link>

            <Image
              src="/images/mascot/banana-mascot.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={200}
              className="pointer-events-none absolute -bottom-2 -right-2 z-20 h-9 w-9 rotate-[-10deg] drop-shadow-md sm:h-11 sm:w-11"
            />
          </div>

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
                  if (link.href !== "/") e.preventDefault();
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

          <div
            className={`absolute right-0 top-0 z-0 h-[68px] w-[170px] transition-all duration-[3000ms] ease-out sm:h-[84px] sm:w-[208px] md:w-[226px] ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <Image
              src="/images/mascot/banana-mascot.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={200}
              className="pointer-events-none absolute -bottom-2 -left-2 z-20 h-9 w-9 rotate-[10deg] scale-x-[-1] drop-shadow-md sm:h-11 sm:w-11"
            />

            <Link
              href="/#contact"
              className="absolute right-4 top-[13px] z-10 hidden rounded-full bg-[#87cefa] px-7 py-3.5 text-[12px] font-bold uppercase tracking-wide text-[#006400] shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#a9ddfb] md:inline-flex sm:right-15 sm:top-4 sm:px-8 sm:py-4 sm:text-[13px]"
            >
              Liên hệ
            </Link>

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
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  active === link.label
                    ? "bg-[#87cefa] text-[#006400]"
                    : "text-white/85 hover:bg-[#87cefa]/90 hover:text-[#006400]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-xl bg-[#87cefa] px-4 py-2.5 text-center text-sm font-bold text-[#006400]"
            >
              Liên hệ
            </Link>
          </div>
        </div>

        {/* ================= HERO TEXT (auto-cycling) ================= */}
        <div className="relative flex h-[640px] flex-col items-center justify-center px-6 text-center sm:h-[760px] md:h-[860px]">
          <span
            className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/85 backdrop-blur-sm transition-all duration-700 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Sản phẩm Unifarm
          </span>

          <div key={slideIndex} style={{ animation: "sanpham-hero-fade 700ms ease-out" }}>
            <h1 className="font-display max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">
              {slide.subtitle}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
