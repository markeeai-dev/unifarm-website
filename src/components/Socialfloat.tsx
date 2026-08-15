"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Camera, Music2, Play, MessageCircle } from "lucide-react";
import type { SVGProps } from "react";

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

const CHANNELS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FacebookGlyph,
    bg: "var(--color-forest, #1f5c34)",
  },
  {
    label: "Zalo",
    href: "https://zalo.me",
    icon: ZaloGlyph,
    bg: "var(--color-green, #2f7a45)",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: Camera,
    bg: "var(--color-gold, #f2c230)",
    dark: true,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    icon: Music2,
    bg: "var(--color-forest, #1f5c34)",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: Play,
    bg: "var(--color-green, #2f7a45)",
  },
  {
    label: "Email",
    href: "mailto:hi@unifarm.com",
    icon: Mail,
    bg: "var(--color-gold, #f2c230)",
    dark: true,
  },
  {
    label: "Gọi ngay",
    href: "tel:+840988001002",
    icon: Phone,
    bg: "var(--color-forest, #1f5c34)",
  },
];

export default function SocialFloat() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
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
      className={`fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-500 ease-out sm:right-6 sm:bottom-28 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0 pointer-events-none"
      }`}
    >
      {/* Socials */}
      <div className="flex w-40 flex-col items-end">
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
                  aria-label={c.label}
                  className={`social-item group relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:scale-110 ${
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
                    {c.label}
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
        aria-label={open ? "Đóng liên hệ" : "Mở liên hệ"}
        aria-expanded={open}
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest,#1f5c34)] text-white shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:scale-110 ${
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