/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * Footer — F1genz Farm
 * -----------------------------------------------------------------
 * Design notes:
 * - Palette: Vàng #fffacd (soft cream-yellow, used sparingly as glow/label
 *   accent), Xanh lá đậm #006400 (deep green, the anchor color — this is a
 *   farm brand, green IS the brand), Xanh dương nhạt #87cefa (light blue,
 *   used only as a cool counter-accent on links/hover so the palette
 *   doesn't read as flat "vegetable green").
 * - Background: a dim root-vegetable photo sits under a deep-green→black
 *   gradient wash, echoing the reference screenshot but pulled together
 *   with the brand palette instead of a generic dark overlay.
 * - Signature element: a thin "furrow" divider (a repeating dashed line
 *   styled like a plowed row) separates the link grid from the bottom
 *   bar — a small, literal nod to farming rather than a generic <hr>.
 * - Mobile: link columns become single-tap accordions so the footer
 *   doesn't dump five stacked lists on a narrow screen.
 * -----------------------------------------------------------------
 */

type LinkItem = { label: string; href: string };

const supportLinks: LinkItem[] = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Dự án & Hợp tác", href: "/du-an-hop-tac" },
  { label: "Dịch vụ & Giải pháp", href: "/dich-vu" },
  { label: "Unifarm hôm nay", href: "/" },
  { label: "Nghề nghiệp", href: "/tuyen-dung" },
];

const guideLinks: LinkItem[] = [
  { label: "Hợp tác cùng Unifarm", href: "/du-an-hop-tac#hop-tac" },
  { label: "Hệ thống phân phối", href: "/he-thong-phan-phoi" },
  { label: "Liên hệ", href: "/#contact" },
];

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/Unifarm.SafeFoodForLife", path: "M13 22v-8h2.7l.4-3.3H13V8.6c0-.9.3-1.6 1.7-1.6H16V4.1C15.6 4 14.6 4 13.5 4 11.1 4 9.5 5.4 9.5 8.2v2.5H7V14h2.5v8H13Z" },
  { name: "Youtube", href: "https://www.youtube.com/@unifarm.safefoodforlifeui2999", path: "M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.4C2.2 14 2.4 15.8 2.4 15.8s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7.5.2 7.5.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.4c0-1.8-.2-3.6-.2-3.6ZM9.9 14.6V8.9l5.3 2.9-5.3 2.8Z" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/unifarmvn/", path: "M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2C18.5 11.1 17.5 10.1 15.9 10.1C14.9 10.1 14.2 10.6 13.8 11.2V10.3H11.4C11.4 10.6 11.4 18.5 11.4 18.5H13.8V14C13.8 13.7 13.8 13.5 13.9 13.3C14.1 12.8 14.6 12.2 15.4 12.2C16.4 12.2 16.9 12.9 16.9 14.1V18.5H18.5M8.7 9.1C9.5 9.1 10 8.5 10 7.8C10 7.1 9.5 6.5 8.7 6.5C7.9 6.5 7.4 7.1 7.4 7.8C7.4 8.5 7.9 9.1 8.7 9.1M9.9 18.5V10.3H7.5V18.5H9.9Z" },
];

function AccordionColumn({
  title,
  links,
}: {
  title: string;
  links: LinkItem[];
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 sm:border-none">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 sm:pointer-events-none sm:py-0"
        aria-expanded={open}
      >
        <span className="text-sm font-bold uppercase tracking-wider text-[#fffacd]">
          {t(title)}
        </span>
        <svg
          className={`h-4 w-4 text-[#87cefa] transition-transform duration-300 sm:hidden ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul
        className={`overflow-hidden transition-all duration-300 sm:mt-5 sm:!max-h-none sm:overflow-visible ${
          open ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="group flex items-center gap-2 py-1.5 text-sm text-white/70 transition-colors hover:text-[#87cefa]"
            >
              <span className="text-[#006400] transition-colors group-hover:text-[#87cefa]">
                »
              </span>
              {t(link.label)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <footer className="relative overflow-hidden text-white">
      {/* Background photo + brand-toned wash */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url('/images/UNIFARM/1787207482427_1582751505492234802_4935324150679931320_939749211a6e5c72f28397e7e138b486.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00230f]/90 via-[#001b0b]/55 to-black" />
        <div className="absolute inset-0 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {/* Contact / brand */}
          <div className="pb-6 sm:pb-0">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#fffacd]">
              {t("Thông tin liên hệ")}
            </h3>

            <a href="/" className="mb-2 inline-flex items-center">
              <Image
                src="/images/logo-unifarm.png"
                alt="Unifarm"
                width={829}
                height={400}
                className="h-10 w-auto"
              />
            </a>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fffacd]">
              {t("Safe Food For Life")}
            </p>
            <p className="mt-1 mb-4 text-sm italic text-white/60">
              {t("Làm nông nghiệp là yêu Đất – Nước")}
            </p>

            <ul className="space-y-3 text-sm leading-relaxed text-white/70">
              <li>
                <span className="font-semibold text-white/90">
                  CÔNG TY CỔ PHẦN NÔNG NGHIỆP U&amp;I (UNIFARM)
                </span>
              </li>
              <li>
                <span className="font-semibold text-white/90">{t("Trụ sở chính:")}</span>{" "}
                158, Đường Ngô Gia Tự, Phường Thủ Dầu Một, Tp. Hồ Chí Minh
              </li>
              <li>
                <span className="font-semibold text-white/90">{t("Chi nhánh:")}</span>{" "}
                368, Đường Thuận Giao 09, Phường Thuận Giao, Tp. Hồ Chí Minh; 20
                Bờ Sông Sét, P. Tân Mai, Quận Hoàng Mai, Tp Hà Nội
              </li>
              <li>
                <span className="font-semibold text-white/90">{t("Trang trại:")}</span>{" "}
                Dự án nông nghiệp ứng dụng công nghệ cao An Thái, Phước Thành,
                Tp. Hồ Chí Minh
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#87cefa]" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.7 3.6 5 6.4 6.4l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
                </svg>
                (0274) 3889887
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#87cefa]" fill="currentColor">
                  <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.8 5.7L19.8 6H4.2ZM20 8.1l-7.4 5.4a1 1 0 0 1-1.2 0L4 8.1V18h16V8.1Z" />
                </svg>
                info@unifarm.com.vn
              </li>
              <li>MST: 3701528386 — Ngày thành lập: 12/06/2009</li>
            </ul>
          </div>

          {/* Khám phá */}
          <AccordionColumn title="Khám phá" links={supportLinks} />

          {/* Hợp tác & Kết nối */}
          <AccordionColumn title="Hợp tác & Kết nối" links={guideLinks} />

          {/* Newsletter */}
          <div className="py-4 sm:py-0">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#fffacd]">
              {t("Nhận thông tin từ Unifarm")}
            </h3>
            <p className="mb-4 text-sm italic text-[#87cefa]/90">
              {t("Nhận những cập nhật mới về sản phẩm, nghiên cứu, công nghệ, dự án và hoạt động của Unifarm.")}
            </p>

            <form onSubmit={handleSubmit} className="flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm focus-within:ring-[#87cefa]">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Nhập email của bạn...")}
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/50 outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap bg-[#006400] px-4 text-sm font-bold uppercase tracking-wide text-[#fffacd] transition-colors hover:bg-[#004d00]"
              >
                {t("Đăng ký")}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            <p
              className={`mt-2 text-xs text-[#87cefa] transition-opacity duration-300 ${
                submitted ? "opacity-100" : "opacity-0"
              }`}
              aria-live="polite"
            >
              {t("Cảm ơn bạn đã đăng ký!")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(s.name)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-[#006400] hover:text-[#fffacd] hover:ring-[#006400]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Signature furrow divider — a "plowed row" motif instead of a plain <hr> */}
        <div
          className="mt-10 h-px w-full bg-[repeating-linear-gradient(90deg,rgba(135,206,250,0.5)_0px,rgba(135,206,250,0.5)_6px,transparent_6px,transparent_14px)] sm:mt-14"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center text-xs text-white/50 sm:py-8">
          <p>
            © <span className="font-semibold text-[#fffacd]">Unifarm</span>.{" "}
            {t("All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
}