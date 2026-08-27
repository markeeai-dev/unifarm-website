"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import type { SVGProps } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14.5 8.5h2V5.8c-.35-.05-1.55-.15-2.96-.15-2.93 0-4.94 1.79-4.94 5.08v2.77H6v3.2h3.6V21h3.3v-4.3h3.16l.5-3.2h-3.66v-2.4c0-.93.26-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ZaloGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 8h9l-9 8h9"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.2" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <rect x="6.7" y="10.2" width="2.1" height="7.3" rx="0.4" />
      <circle cx="7.75" cy="7.1" r="1.35" />
      <path d="M11.4 17.5v-7.3h2.1v1.05c.55-.78 1.4-1.25 2.5-1.25 1.85 0 3 1.15 3 3.2v4.3h-2.1v-3.9c0-1.05-.55-1.65-1.5-1.65-.95 0-1.6.65-1.6 1.7v3.85h-2.1Z" />
    </svg>
  );
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  );
}

function TiktokGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.6 3.2c.4 1.9 1.7 3.2 3.7 3.4v2.7c-1.35-.02-2.55-.4-3.65-1.15v5.5c0 3.05-2.15 5.15-5.05 5.15-2.75 0-5-2.05-5-4.95 0-2.85 2.2-4.95 5-4.95.33 0 .65.03.95.09v2.75a2.2 2.2 0 0 0-.95-.21c-1.3 0-2.35 1.02-2.35 2.32 0 1.3 1.05 2.3 2.35 2.3 1.35 0 2.4-1.02 2.4-2.5V3.2h2.63Z" />
    </svg>
  );
}

function YoutubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" strokeWidth={1.7} />
      <path d="M10.2 9.3v5.4l4.7-2.7-4.7-2.7Z" fill="currentColor" />
    </svg>
  );
}

const CHANNELS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Unifarm.SafeFoodForLife",
    icon: FacebookGlyph,
    bg: "var(--color-forest, #1f5c34)",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/unifarmvn/",
    icon: LinkedinGlyph,
    bg: "var(--color-green, #2f7a45)",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/unifarm_official1/",
    icon: InstagramGlyph,
    bg: "var(--color-gold, #f2c230)",
    dark: true,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@unifarm.vn",
    icon: TiktokGlyph,
    bg: "var(--color-forest, #1f5c34)",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@unifarm.safefoodforlifeui2999",
    icon: YoutubeGlyph,
    bg: "var(--color-green, #2f7a45)",
  },
  {
    label: "Zalo",
    href: "https://zalo.me",
    icon: ZaloGlyph,
    bg: "var(--color-gold, #f2c230)",
    dark: true,
  },
  {
    label: "Email",
    href: "mailto:hi@unifarm.com",
    icon: Mail,
    bg: "var(--color-forest, #1f5c34)",
  },
  {
    label: "Gọi ngay",
    href: "tel:+840988001002",
    icon: Phone,
    bg: "var(--color-green, #2f7a45)",
  },
];

export default function SocialFloat() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Gộp theo khung hình (rAF) — tránh gọi lại setState ở mỗi sự kiện
    // scroll thô, có thể bắn nhiều lần hơn 1 frame khi cuộn nhanh/quán tính.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 300);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-social-float]")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  return (
    <div
      data-social-float
      className={`fixed bottom-20 right-3 z-40 flex flex-col items-end gap-2 transition-all duration-500 ease-out sm:bottom-28 sm:right-6 sm:gap-3 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0 pointer-events-none"
      }`}
    >
      {/* Socials */}
      <div className="flex w-36 flex-col items-end sm:w-40">
        {CHANNELS.map((c, i) => (
          <div
            key={c.label}
            className={`grid w-full transition-all duration-300 ease-out ${
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            style={{
              transitionDelay: open ? `${i * 45}ms` : `${(CHANNELS.length - 1 - i) * 25}ms`,
            }}
          >
            <div className="min-h-0 overflow-hidden">
              {/* py-1.5 + pr-1 để scale-110 không bị cắt trên/phải */}
              <div className="flex justify-end py-1.5 pr-1">
                <a
                  href={c.href}
                  target={
                    c.href.startsWith("tel:") || c.href.startsWith("mailto:")
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    c.href.startsWith("tel:") || c.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={t(c.label)}
                  className={`social-item group relative flex h-10 w-10 items-center justify-center rounded-full shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:scale-110 sm:h-12 sm:w-12 ${
                    open ? "social-wiggle" : ""
                  }`}
                  style={{
                    background: c.bg,
                    color: c.dark ? "var(--color-ink, #1a1a1a)" : "#fff",
                    animationDelay: open ? `${i * 0.12}s` : "0s",
                  }}
                >
                  <c.icon size={20} strokeWidth={1.8} />

                  {/* Tooltip – nằm trong w-40 nên không bị cắt */}
                  <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:mr-3.5 group-hover:opacity-100">
                    {t(c.label)}
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút chính – chỉ lắc khi đóng */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("Đóng liên hệ") : t("Mở liên hệ")}
        aria-expanded={open}
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest,#1f5c34)] text-white shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:scale-110 sm:h-14 sm:w-14 ${
          open ? "" : "wiggle-btn"
        }`}
      >
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[var(--color-forest,#1f5c34)]/40" />
        )}

        {open ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <MessageCircle size={24} strokeWidth={1.8} />
        )}
      </button>

      <style jsx>{`
        .wiggle-btn {
          animation: float-wiggle 5s ease-in-out infinite;
        }
        .wiggle-btn:hover {
          animation-play-state: paused;
        }

        .social-wiggle {
          animation: social-wave 2.8s ease-in-out infinite;
        }
        .social-wiggle:hover {
          animation-play-state: paused;
        }

        @keyframes float-wiggle {
          0%,
          92%,
          100% {
            transform: rotate(0deg);
          }
          93% {
            transform: rotate(-9deg);
          }
          94.5% {
            transform: rotate(8deg);
          }
          96% {
            transform: rotate(-5deg);
          }
          97.5% {
            transform: rotate(3deg);
          }
          99% {
            transform: rotate(0deg);
          }
        }

        @keyframes social-wave {
          0%,
          100% {
            transform: rotate(0deg) translateY(0);
          }
          20% {
            transform: rotate(-8deg) translateY(-2px);
          }
          40% {
            transform: rotate(7deg) translateY(2px);
          }
          60% {
            transform: rotate(-6deg) translateY(-1.5px);
          }
          80% {
            transform: rotate(5deg) translateY(1px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wiggle-btn,
          .social-wiggle {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}