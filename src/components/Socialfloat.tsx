"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import type { SVGProps } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.01H7.9v-2.93h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.45 2.93h-2.33V22C18.34 21.23 22 17.08 22 12.06Z" />
    </svg>
  );
}

function ZaloGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.85 1.47 5.39 3.77 7.04-.17.9-.63 2.33-1.57 3.6a.4.4 0 0 0 .42.62c1.95-.43 3.52-1.3 4.5-1.98A11.6 11.6 0 0 0 12 20c5.52 0 10-4.03 10-9s-4.48-9-10-9Zm-4.55 7.1h3.98c.33 0 .6.27.6.6 0 .18-.08.34-.21.45l-3.14 2.95h2.75c.33 0 .6.27.6.6s-.27.6-.6.6H7.3a.6.6 0 0 1-.41-1.04l3.15-2.96H7.45a.6.6 0 0 1-.6-.6c0-.33.27-.6.6-.6Zm7.2-.1c.9 0 1.63.49 2 1.19v-.5c0-.33.27-.6.6-.6s.6.27.6.6v3.9c0 .33-.27.6-.6.6s-.6-.27-.6-.6v-.1a2.3 2.3 0 0 1-2 1.09 2.54 2.54 0 0 1 0-5.08Zm0 1.2a1.34 1.34 0 1 0 0 2.68 1.34 1.34 0 0 0 0-2.68Z" />
    </svg>
  );
}

function LinkedinGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 5.5a2 2 0 1 1-4.01 0 2 2 0 0 1 4.01 0ZM3.2 8.75h3.5V21H3.2V8.75ZM9.6 8.75H13v1.68h.05c.47-.9 1.63-1.84 3.36-1.84 3.6 0 4.26 2.37 4.26 5.44V21h-3.65v-5.3c0-1.26-.02-2.89-1.76-2.89-1.76 0-2.03 1.37-2.03 2.79V21H9.6V8.75Z" />
    </svg>
  );
}

function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="17.35" cy="6.65" r="1.25" fill="currentColor" />
    </svg>
  );
}

function TiktokGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.68-.74-1.06-1.71-1.06-2.82h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7v-6.3a7.72 7.72 0 0 0 4.51 1.45V7.2s-1.88.09-3.45-1.38Z" />
    </svg>
  );
}

function YoutubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 6.5c1.5 0 5.07.14 6.62.72.9.34 1.6 1.06 1.94 1.97.56 1.56.69 4.81.69 4.81s0 3.26-.69 4.82a3.1 3.1 0 0 1-1.94 1.97c-1.55.58-5.12.71-6.62.71s-5.07-.13-6.62-.71a3.1 3.1 0 0 1-1.94-1.97c-.56-1.56-.69-4.82-.69-4.82s0-3.25.69-4.81A3.1 3.1 0 0 1 5.38 7.2c1.55-.58 5.12-.71 6.62-.71ZM10 9.9v5.2l4.7-2.6-4.7-2.6Z" />
    </svg>
  );
}

const CHANNELS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Unifarm.SafeFoodForLife",
    icon: FacebookGlyph,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/unifarmvn/",
    icon: LinkedinGlyph,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/unifarm_official1/",
    icon: InstagramGlyph,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@unifarm.vn",
    icon: TiktokGlyph,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@unifarm.safefoodforlifeui2999",
    icon: YoutubeGlyph,
  },
  {
    label: "Zalo",
    href: "https://zalo.me",
    icon: ZaloGlyph,
  },
  {
    label: "Email",
    href: "mailto:hi@unifarm.com",
    icon: Mail,
  },
  {
    label: "Gọi ngay",
    href: "tel:+840988001002",
    icon: Phone,
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
      <div className="flex w-auto flex-col items-end gap-1.5">
        {CHANNELS.map((c, i) => (
          <div
            key={c.label}
            className={`grid w-full ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            style={{
              transitionProperty: "grid-template-rows, opacity",
              transitionDuration: "300ms",
              transitionTimingFunction: "ease-out",
              transitionDelay: open ? `${i * 45}ms` : `${(CHANNELS.length - 1 - i) * 25}ms`,
            }}
          >
            <div className="min-h-0 overflow-hidden">
              {/* py-1 + pr-1 để scale-110 không bị cắt trên/phải */}
              <div className="flex justify-end py-1 pr-1">
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
                  className={`social-item group relative isolate flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-white shadow-[0_10px_24px_-8px_rgba(6,59,36,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:shadow-[0_16px_30px_-8px_rgba(6,59,36,0.6)] active:scale-95 sm:h-12 sm:w-12 ${
                    open ? "social-wiggle" : ""
                  }`}
                  style={{
                    background: "#063B24",
                    animationDelay: open ? `${i * 0.12}s` : "0s",
                  }}
                >
                  <c.icon size={19} strokeWidth={1.8} className="relative z-10 h-[19px] w-[19px] shrink-0" />

                  {/* Tooltip — pill kem/forest đồng bộ badge của site */}
                  <span
                    className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold opacity-0 shadow-md transition-all duration-300 group-hover:mr-3.5 group-hover:opacity-100"
                    style={{
                      background: "#FFFACD",
                      color: "#063B24",
                      border: "1px solid rgba(0,100,0,0.25)",
                    }}
                  >
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
        className={`group relative isolate flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-white shadow-[0_14px_30px_-10px_rgba(6,59,36,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 sm:h-14 sm:w-14 ${
          open ? "" : "wiggle-btn"
        }`}
        style={{ background: "#063B24" }}
      >
        {!open && (
          <>
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#FFFACD]/35" />
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#FFFACD]" />
          </>
        )}
        <span className="absolute inset-0 -z-10 origin-bottom-left scale-0 rounded-full bg-white/15 transition-transform duration-500 ease-out group-hover:scale-150" />

        {open ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="relative z-10 h-6 w-6"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <MessageCircle size={24} strokeWidth={1.8} className="relative z-10" />
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