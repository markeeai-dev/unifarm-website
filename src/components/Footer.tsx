/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState } from "react";
import Image from "next/image";

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
  { label: "Tìm kiếm", href: "/search" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Hỏi đáp", href: "/hoi-dap" },
  { label: "Chăm sóc khách hàng", href: "/cham-soc-khach-hang" },
  { label: "Liên hệ", href: "/lien-he" },
];

const guideLinks: LinkItem[] = [
  { label: "Tìm kiếm", href: "/search" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Hỏi đáp", href: "/hoi-dap" },
  { label: "Chăm sóc khách hàng", href: "/cham-soc-khach-hang" },
  { label: "Liên hệ", href: "/lien-he" },
];

const socials = [
  { name: "Facebook", href: "#", path: "M13 22v-8h2.7l.4-3.3H13V8.6c0-.9.3-1.6 1.7-1.6H16V4.1C15.6 4 14.6 4 13.5 4 11.1 4 9.5 5.4 9.5 8.2v2.5H7V14h2.5v8H13Z" },
  { name: "Twitter", href: "#", path: "M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.6 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 0 1-1.9.1 4.1 4.1 0 0 0 3.9 2.9A8.3 8.3 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2Z" },
  { name: "Youtube", href: "#", path: "M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.4C2.2 14 2.4 15.8 2.4 15.8s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7.5.2 7.5.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.4c0-1.8-.2-3.6-.2-3.6ZM9.9 14.6V8.9l5.3 2.9-5.3 2.8Z" },
  { name: "Pinterest", href: "#", path: "M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.7.2-2.6l1.4-6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-1 3.8-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-2.3 3.1-5 0-2.1-1.5-3.6-4.1-3.6-3 0-4.8 2.2-4.8 4.5 0 .9.3 1.8.8 2.4.1.1.1.2.1.3l-.3 1.1c0 .2-.1.3-.3.2-1.2-.5-2-2.3-2-3.7 0-3 2.2-5.8 6.3-5.8 3.3 0 5.9 2.4 5.9 5.5 0 3.3-2.1 5.9-4.9 5.9-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2Z" },
];

function AccordionColumn({
  title,
  links,
}: {
  title: string;
  links: LinkItem[];
}) {
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
          {title}
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
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
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
              Thông tin liên hệ
            </h3>

            <a href="/" className="mb-4 inline-flex items-center">
              <Image
                src="/images/logo-unifarm.png"
                alt="Unifarm"
                width={829}
                height={400}
                className="h-10 w-auto"
              />
            </a>

            <ul className="space-y-3 text-sm leading-relaxed text-white/70">
              <li>
                <span className="font-semibold text-white/90">
                  CÔNG TY CỔ PHẦN NÔNG NGHIỆP U&amp;I (UNIFARM)
                </span>
              </li>
              <li>
                <span className="font-semibold text-white/90">Trụ sở chính:</span>{" "}
                158, Đường Ngô Gia Tự, Phường Thủ Dầu Một, Tp. Hồ Chí Minh
              </li>
              <li>
                <span className="font-semibold text-white/90">Chi nhánh:</span>{" "}
                368, Đường Thuận Giao 09, Phường Thuận Giao, Tp. Hồ Chí Minh; 20
                Bờ Sông Sét, P. Tân Mai, Quận Hoàng Mai, Tp Hà Nội
              </li>
              <li>
                <span className="font-semibold text-white/90">Trang trại:</span>{" "}
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

          {/* Support */}
          <AccordionColumn title="Hỗ trợ" links={supportLinks} />

          {/* Guide */}
          <AccordionColumn title="Hướng dẫn" links={guideLinks} />

          {/* Newsletter */}
          <div className="py-4 sm:py-0">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#fffacd]">
              Đăng ký bản tin
            </h3>
            <p className="mb-4 text-sm italic text-[#87cefa]/90">
              Bạn sẽ là người đầu tiên được biết về: Chương trình khuyến mãi,
              giảm giá…
            </p>

            <form onSubmit={handleSubmit} className="flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm focus-within:ring-[#87cefa]">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-white/50 outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap bg-[#006400] px-4 text-sm font-bold uppercase tracking-wide text-[#fffacd] transition-colors hover:bg-[#004d00]"
              >
                Đăng ký
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
              Cảm ơn bạn đã đăng ký!
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
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
            © Bản quyền thuộc về{" "}
            <span className="font-semibold text-[#fffacd]">Unifarm</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}