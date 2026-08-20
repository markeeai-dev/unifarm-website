"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Clock } from "lucide-react";

/**
 * HomeTopHeader — thanh tiện ích mỏng phía trên + thanh điều hướng chính.
 * Bố cục gồm 2 tầng: (1) thanh xanh đậm mỏng phía trên chứa thông tin liên hệ,
 * (2) thanh điều hướng chính nền trắng — logo, menu, nút liên hệ.
 *
 * Hiệu ứng khi tải trang:
 *  - Logo + nút "Liên hệ ngay" mờ/trượt vào trước.
 *  - Từng mục điều hướng trượt từ dưới lên, xuất hiện nối tiếp nhau
 *    trong khoảng 4-5s (không đồng loạt).
 *  - Sau khi xuất hiện xong, cứ mỗi ~6s các mục điều hướng lại "nhảy"
 *    lên nhẹ lần lượt theo thứ tự — hiệu ứng lặp vô hạn để tạo điểm nhấn.
 *  - Logo có hiệu ứng rung lắc nhẹ, lặp định kỳ.
 */

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Góc chia sẻ", href: "/blog" },
  { label: "Tuyển dụng", href: "/tuyen-dung" },
];

const NAV_ENTRANCE_BASE_MS = 200;
const NAV_ENTRANCE_STAGGER_MS = 320;
const NAV_ENTRANCE_DURATION_MS = 450;
const NAV_IDLE_CYCLE_MS = 6000;
const NAV_IDLE_STAGGER_MS = NAV_IDLE_CYCLE_MS / NAV_LINKS.length;
// Hiệu ứng "nhảy lần lượt" chỉ bắt đầu sau khi mục cuối cùng đã xuất hiện xong.
const NAV_IDLE_START_MS =
  NAV_ENTRANCE_BASE_MS + (NAV_LINKS.length - 1) * NAV_ENTRANCE_STAGGER_MS + NAV_ENTRANCE_DURATION_MS;

export default function HomeTopHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* ===== Thanh tiện ích mỏng — thu gọn dần khi cuộn xuống ===== */}
      <div
        className="w-full overflow-hidden bg-[#06301B] text-[12px] text-white/85 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          maxHeight: scrolled ? "0px" : "44px",
          opacity: scrolled ? 0 : 1,
        }}
      >
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <p>
            Nông sản sạch, an toàn mỗi ngày —{" "}
            <Link href="/gioi-thieu" className="font-semibold text-[#FFFACD] underline underline-offset-2">
              Tìm hiểu thêm
            </Link>
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#87CEFA]" /> lienhe@unifarm.vn
            </span>
            <span className="h-3 w-px bg-white/20" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#87CEFA]" /> T2 – T7: 8:00 – 18:00
            </span>
          </div>
        </div>
      </div>

      {/* ===== Thanh điều hướng chính — thấp gọn lại + vẫn nổi bật khi cuộn xuống ===== */}
      <div
        className={`relative w-full border-b transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "border-transparent bg-white/85 shadow-[0_20px_45px_-12px_rgba(0,48,27,0.35)] backdrop-blur-xl"
            : "border-black/5 bg-white shadow-sm"
        }`}
      >
        {/* vạch màu gradient nổi bật, chỉ hiện khi đã cuộn */}
        <div
          className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#006400] via-[#87CEFA] to-[#FFFACD] transition-opacity duration-700 ease-out"
          style={{ opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />

        <div
          className={`mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:px-8 ${
            scrolled ? "py-2" : "py-5"
          }`}
        >
          <Link
            href="/"
            className={`flex items-center transition-all duration-700 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
          >
            <Image
              src="/images/logo-unifarm.png"
              alt="Unifarm"
              width={829}
              height={400}
              priority
              className={`logo-wiggle w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                scrolled ? "h-8 sm:h-9" : "h-12 sm:h-14"
              }`}
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-idle-bounce rounded-full px-4 py-2 text-sm font-semibold text-[#06301B]/80 transition-all ease-out hover:bg-[#f2f9ee] hover:text-[#006400] ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDuration: `${NAV_ENTRANCE_DURATION_MS}ms`,
                  transitionDelay: mounted ? `${NAV_ENTRANCE_BASE_MS + i * NAV_ENTRANCE_STAGGER_MS}ms` : "0ms",
                  animationDelay: `${NAV_IDLE_START_MS + i * NAV_IDLE_STAGGER_MS}ms`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#contact"
              className={`hidden rounded-full bg-[#006400] text-sm font-bold text-white shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#004d00] hover:shadow-md sm:inline-flex ${
                scrolled ? "px-5 py-1.5 shadow-[0_10px_24px_-6px_rgba(0,100,0,0.5)]" : "px-6 py-2.5"
              } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
              style={{ transitionDelay: mounted ? "150ms" : "0ms" }}
            >
              Liên hệ ngay
            </Link>

            <button
              aria-label="Mở menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f9ee] text-[#006400] transition-transform active:scale-90 lg:hidden"
            >
              {menuOpen ? (
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
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden border-t border-black/5 transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-96 py-2" : "max-h-0"
          }`}
        >
          <div className="mx-auto flex max-w-[1500px] flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#06301B]/80 transition-colors hover:bg-[#f2f9ee] hover:text-[#006400]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-xl bg-[#006400] px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes logo-wiggle {
          0%, 88%, 100% { transform: rotate(0deg); }
          90%  { transform: rotate(-7deg); }
          92.5% { transform: rotate(6deg); }
          95%  { transform: rotate(-4deg); }
          97.5% { transform: rotate(2deg); }
        }
        .logo-wiggle {
          animation: logo-wiggle 4.5s ease-in-out infinite;
        }
        @keyframes nav-idle-bounce {
          0%, 8%, 100% { transform: translateY(0) scale(1); color: rgba(6,48,27,0.8); }
          2.5% { transform: translateY(-11px) scale(1.1); color: #006400; }
          5%   { transform: translateY(0) scale(1.02); }
          6.5% { transform: translateY(-3px) scale(1); }
        }
        .nav-idle-bounce {
          animation: nav-idle-bounce ${NAV_IDLE_CYCLE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-wiggle, .nav-idle-bounce { animation: none; }
        }
      `}</style>
    </div>
  );
}
