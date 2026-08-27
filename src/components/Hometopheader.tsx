"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntroReady } from "@/lib/use-intro-ready";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * HomeTopHeader — thanh điều hướng chính, dính trên cùng khi cuộn.
 * Chỉ còn 1 tầng (đã bỏ thanh tiện ích mỏng phía trên — animate max-height
 * của nó gây reflow mỗi khung hình khi cuộn, là nguyên nhân chính gây giật).
 * Hiệu ứng "gọn lại khi cuộn" dùng transform: scale thay vì đổi padding/
 * height thật — chỉ chạy trên compositor (GPU), không gây reflow nên mượt.
 *

 * Hiệu ứng khi tải trang:
 *  - Logo + nút "Liên hệ ngay" mờ/trượt vào trước.
 *  - Từng mục điều hướng trượt từ dưới lên, xuất hiện nối tiếp nhau
 *    trong khoảng 4-5s (không đồng loạt).
 *  - Sau khi xuất hiện xong, cứ mỗi ~6s các mục điều hướng lại "nhảy"
 *    lên nhẹ lần lượt theo thứ tự — hiệu ứng lặp vô hạn để tạo điểm nhấn.
 *  - Logo có hiệu ứng rung lắc nhẹ, lặp định kỳ.
 */

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

const NAV_LINKS: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  
  // {
  //   label: "Dịch Vụ",
  //   href: "/dich-vu",
  //   children: [
  //     { label: "Tư vấn mô hình nông nghiệp công nghệ cao", href: "/dich-vu#hanh-trinh" },
  //     { label: "Cung ứng đầu vào nông nghiệp", href: "/#contact" },
  //     { label: "Chuyển giao công nghệ trồng trọt", href: "/dich-vu#hanh-trinh" },
  //     { label: "Du lịch trải nghiệm nông nghiệp", href: "/#contact" },
  //   ],
  // },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Hệ thống phân phối", href: "/he-thong-phan-phoi" },
  { label: "Dự Án & Hợp Tác", href: "/du-an-hop-tac" },
  // {
  //   label: "Khác",
  //   href: "#",
  //   children: [
  //     { label: "Chế biến Tinh bột kháng", href: "/san-pham" },
  //     { label: "Công nghệ cấp đông IQF", href: "/san-pham" },
  //     { label: "Dự án phát triển & Chuyển giao", href: "/dich-vu#hanh-trinh" },
  //   ],
  // },
  { label: "Góc cộng đồng", href: "/blog" },
  {
    label: "Tuyển dụng",
    href: "/tuyen-dung",
    children: [
      { label: "Vị trí đang tuyển", href: "/tuyen-dung" },
      { label: "Văn hoá & Con đường nghề nghiệp", href: "/tuyen-dung/nghe-nghiep" },
    ],
  },
];

const NAV_ENTRANCE_BASE_MS = 200;
const NAV_ENTRANCE_STAGGER_MS = 320;
const NAV_ENTRANCE_DURATION_MS = 450;

/** Trang chủ chỉ khớp tuyệt đối (tránh mọi route đều "khớp" với "/"); các
 * trang khác cũng tính khớp khi đang ở trang con (vd: /tuyen-dung/nghe-nghiep
 * vẫn highlight mục "Tuyển dụng"). */
function isLinkActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HomeTopHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const introReady = useIntroReady();
  const { t } = useLanguage();

  useEffect(() => {
    if (!introReady) return;
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [introReady]);

  // Khoá cuộn trang nền khi drawer mobile đang mở.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    // Gộp các sự kiện scroll liên tiếp lại theo khung hình (rAF) thay vì
    // xử lý từng sự kiện ngay lập tức — tránh dồn việc tính toán lại giữa
    // các frame khi cuộn nhanh, đỡ giật hơn.
    let ticking = false;
    let idleTimer: number | undefined;
    const onScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIsScrolling(false), 200);

      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* ===== Thanh điều hướng chính — nổi bật hơn khi cuộn xuống =====
          Không dùng backdrop-blur khi cuộn: filter chạy cùng lúc với scroll trên
          phần tử sticky buộc trình duyệt vẽ lại lớp mờ mỗi khung hình, chính là
          nguyên nhân giật — thay bằng nền trắng đặc, vẫn giữ bóng đổ cho cảm
          giác nổi khối. Padding giữ cố định (không animate) để tránh reflow;
          logo tự "gọn lại" bằng transform: scale — chỉ chạy trên compositor,
          không đụng tới layout nên mượt hơn hẳn so với animate height/padding. */}
      <div
        className={`relative w-full border-b bg-white transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
          scrolled
            ? "border-transparent shadow-[0_20px_45px_-12px_rgba(0,48,27,0.35)]"
            : "border-black/5 shadow-sm"
        }`}
      >
        {/* vạch màu gradient nổi bật, chỉ hiện khi đã cuộn */}
        <div
          className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#006400] via-[#87CEFA] to-[#FFFACD] transition-opacity duration-300 ease-out"
          style={{ opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />

        <div
          className={`mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 transition-[padding] duration-300 ease-out sm:px-6 lg:px-8 ${
            scrolled ? "py-1.5" : "py-4 sm:py-5"
          }`}
        >
          <Link
            href="/"
            className={`flex origin-left items-center transition-[transform,opacity] duration-300 ease-out ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `translateY(${mounted ? 0 : -12}px) scale(${scrolled ? 0.62 : 1})`,
              transitionDuration: mounted ? "300ms" : "700ms",
            }}
          >
            <Image
              src="/images/logo-unifarm.png"
              alt="Unifarm"
              width={829}
              height={400}
              priority
              className="logo-wiggle h-12 w-auto sm:h-14"
              style={{ animationPlayState: isScrolling ? "paused" : "running" }}
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link, i) => (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ease-out hover:bg-[#f2f9ee] hover:text-[#006400] ${
                    isLinkActive(pathname, link.href) ? "bg-[#f2f9ee] text-[#006400]" : "text-[#06301B]/80"
                  } ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{
                    transitionDuration: `${NAV_ENTRANCE_DURATION_MS}ms`,
                    transitionDelay: mounted ? `${NAV_ENTRANCE_BASE_MS + i * NAV_ENTRANCE_STAGGER_MS}ms` : "0ms",
                  }}
                >
                  {t(link.label)}
                  {link.children && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 shrink-0 transition-transform duration-300 group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>

                {/* Menu con — kính mờ + gradient viền trên, đổ xuống mượt kèm hiệu ứng
                    so le từng dòng, không có khoảng trống gây mất hover */}
                {link.children && (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-300 ease-out group-hover:visible group-hover:opacity-100">
                    <div className="nav-dropdown relative min-w-[300px] overflow-hidden border border-white/60 bg-white/90 p-2 shadow-[0_28px_60px_-16px_rgba(0,48,27,0.35)] backdrop-blur-xl">
                      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#006400] via-[#87CEFA] to-[#FFFACD]" />
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="nav-dropdown-item group/item relative flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium leading-snug text-[#06301B]/80 transition-colors duration-200 hover:bg-[#f2f9ee] hover:text-[#006400]"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#87CEFA] transition-all duration-300 group-hover/item:scale-125 group-hover/item:bg-[#006400]" />
                          <span className="flex-1">{t(child.label)}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                          >
                            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div
              className={`origin-right transition-[transform,opacity] duration-300 ease-out ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transform: `translateY(${mounted ? 0 : -12}px) scale(${scrolled ? 0.8 : 1})`,
                transitionDelay: mounted ? "150ms" : "0ms",
                transitionDuration: mounted ? "300ms" : "700ms",
              }}
            >
              <LanguageSwitcher />
            </div>

            <Link
              href="/#contact"
              className={`hidden origin-right rounded-full bg-[#006400] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-[box-shadow,transform,opacity] duration-300 ease-out hover:bg-[#004d00] hover:shadow-md sm:inline-flex ${
                scrolled ? "shadow-[0_10px_24px_-6px_rgba(0,100,0,0.5)]" : ""
              } ${mounted ? "opacity-100" : "opacity-0"}`}
              style={{
                transform: `translateY(${mounted ? 0 : -12}px) scale(${scrolled ? 0.8 : 1})`,
                transitionDelay: mounted ? "150ms" : "0ms",
                transitionDuration: mounted ? "300ms" : "700ms",
              }}
            >
              {t("Liên hệ ngay")}
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? t("Đóng menu") : t("Mở menu")}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f9ee] text-[#006400] transition-transform active:scale-90 lg:hidden"
            >
              {/* Icon hamburger "biến hình" mượt sang dấu X bằng cách xoay/co
                  3 vạch — thay vì đổi hẳn 2 icon SVG khác nhau như trước
                  (đổi tức thì, không có chuyển động), cảm giác cao cấp hơn. */}
              <span className="relative flex h-4 w-[18px] flex-col items-center justify-center">
                <span
                  className={`absolute h-[2px] w-[18px] rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute h-[2px] w-[18px] rounded-full bg-current transition-all duration-200 ease-out ${
                    menuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                  }`}
                />
                <span
                  className={`absolute h-[2px] w-[18px] rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu — "sóng vỗ" loang ra phủ TOÀN MÀN HÌNH từ góc
            trên-phải (đúng vị trí nút hamburger) bằng clip-path hình tròn
            giãn dần, chậm và mượt hơn hẳn kiểu trượt ngang cũ. 145% vừa đủ
            để hình tròn từ góc phủ hết đường chéo màn hình (căn theo công
            thức resolve % của clip-path: 100% ≈ 0.707×đường chéo, nên cần
            ~141.4% mới chạm hết góc xa nhất — làm tròn lên 145%). Vài vòng
            "vân sóng" lan toả phía sau (RippleRings) chỉ mount khi mở để
            hiệu ứng lặp lại từ đầu mỗi lần bấm mở. */}
        <div
          className={`fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-white via-white to-[#f2f9ee] transition-[clip-path] duration-[850ms] ease-in-out lg:hidden ${
            menuOpen ? "" : "pointer-events-none"
          }`}
          style={{
            clipPath: menuOpen ? "circle(145% at 100% 0%)" : "circle(0% at 100% 0%)",
            willChange: "clip-path",
          }}
        >
          {menuOpen && (
            <div
              className="wave-rings-wrap pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden="true"
            >
              <span className="wave-ring" style={{ animationDelay: "0ms" }} />
              <span className="wave-ring" style={{ animationDelay: "160ms" }} />
              <span className="wave-ring" style={{ animationDelay: "320ms" }} />
              <span className="wave-ring" style={{ animationDelay: "480ms" }} />
            </div>
          )}

          <div className="relative flex items-center justify-between border-b border-black/5 px-5 py-4">
            <Image
              src="/images/logo-unifarm.png"
              alt="Unifarm"
              width={829}
              height={400}
              className="h-8 w-auto"
            />
            <button
              type="button"
              aria-label={t("Đóng menu")}
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f9ee] text-[#006400] transition-transform active:scale-90"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1 overflow-y-auto px-4 py-3">
            <div className="mx-auto flex w-full max-w-md flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const active = isLinkActive(pathname, link.href);
                /* Từng mục trồi vào từ phải, so le theo thứ tự mỗi lần mở
                   drawer — dàn đều trong khoảng thời gian "sóng" loang ra
                   (850ms) nên mục cuối cùng vừa hiện xong đúng lúc sóng
                   loang tới hết khung menu. */
                const itemStyle = {
                  transitionDelay: menuOpen ? `${220 + i * 95}ms` : "0ms",
                };
                return link.children ? (
                  <div
                    key={link.label}
                    className={`transition-[opacity,transform] duration-300 ease-out ${
                      menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                    }`}
                    style={itemStyle}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded((cur) => (cur === link.label ? null : link.label))
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[#f2f9ee] hover:text-[#006400] ${
                        active ? "bg-[#f2f9ee] text-[#006400]" : "text-[#06301B]/80"
                      }`}
                    >
                      {t(link.label)}
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
                          mobileExpanded === link.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        mobileExpanded === link.label ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 py-1 pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => {
                              setMenuOpen(false);
                              setMobileExpanded(null);
                            }}
                            className="rounded-lg px-4 py-2 text-[13px] font-medium text-[#06301B]/70 transition-colors hover:bg-[#f2f9ee] hover:text-[#006400]"
                          >
                            {t(child.label)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-[opacity,transform,background-color,color] duration-300 ease-out hover:bg-[#f2f9ee] hover:text-[#006400] ${
                      active ? "bg-[#f2f9ee] text-[#006400]" : "text-[#06301B]/80"
                    } ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
                    style={itemStyle}
                  >
                    {t(link.label)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative border-t border-black/5 p-4">
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="mx-auto block w-full max-w-md rounded-xl bg-[#006400] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#004d00]"
            >
              {t("Liên hệ ngay")}
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
        /* Menu con — cả khối trồi lên + phóng nhẹ, từng dòng so le fade/trượt vào */
        .nav-dropdown {
          transform: translateY(-10px) scale(0.96);
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .nav-dropdown {
          transform: translateY(0) scale(1);
        }
        .nav-dropdown-item {
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 260ms ease-out, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .nav-dropdown-item {
          opacity: 1;
          transform: translateY(0);
        }
        .nav-dropdown-item:nth-child(2) { transition-delay: 40ms; }
        .nav-dropdown-item:nth-child(3) { transition-delay: 80ms; }
        .nav-dropdown-item:nth-child(4) { transition-delay: 120ms; }
        .nav-dropdown-item:nth-child(5) { transition-delay: 160ms; }

        /* "Vân sóng" — các vòng tròn lan toả từ góc trên-phải (đúng tâm
           của hiệu ứng clip-path), mô phỏng gợn sóng loang ra trên mặt
           nước, tô điểm thêm cho hiệu ứng mở menu toàn màn hình. */
        .wave-ring {
          position: absolute;
          top: -12vmax;
          right: -12vmax;
          width: 24vmax;
          height: 24vmax;
          border-radius: 9999px;
          border: 2.5px solid rgba(0, 100, 0, 0.55);
          box-shadow: 0 0 26px 3px rgba(0, 100, 0, 0.18);
          filter: blur(0.4px);
          transform: scale(0.15);
          opacity: 0;
          animation: wave-ring-pulse 1800ms cubic-bezier(0.19, 1, 0.22, 1) both;
        }
        .wave-rings-wrap .wave-ring:nth-child(2) { border-color: rgba(34, 139, 34, 0.5); }
        .wave-rings-wrap .wave-ring:nth-child(3) { border-color: rgba(11, 122, 11, 0.46); }
        .wave-rings-wrap .wave-ring:nth-child(4) { border-color: rgba(0, 100, 0, 0.4); }
        @keyframes wave-ring-pulse {
          0% { transform: scale(0.15); opacity: 0.9; }
          55% { opacity: 0.5; }
          100% { transform: scale(1); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-wiggle, .nav-dropdown, .nav-dropdown-item, .wave-ring { animation: none; transition: none; }
        }
      `}</style>
    </div>
  );
}
