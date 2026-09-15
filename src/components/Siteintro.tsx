/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { markIntroReady } from "@/lib/use-intro-ready";
import { getLenis } from "@/components/SmoothScroll";

/**
 * SiteIntro — màn hình mở đầu dạng "curtain peel" (2 nửa màn hình tách ra
 * như kéo màn sân khấu), kèm số % đếm lên lớn. Sống trong root layout nên
 * chỉ mount 1 lần/tab, và chỉ CHẠY ĐỦ 1 LẦN DUY NHẤT cho mỗi lượt truy cập
 * (đánh dấu bằng sessionStorage) — những lần chuyển/tải lại trang sau đó
 * trong cùng tab sẽ bỏ qua hoàn toàn, không hiện lại.
 *
 * Luôn render sẵn phần overlay ngay từ lần render đầu tiên (không đợi
 * effect) để tránh hiện trang chủ trần trụi 1 nhịp trước khi intro kịp
 * xuất hiện; việc kiểm tra "đã xem chưa" chạy trong useLayoutEffect (trước
 * khi trình duyệt vẽ khung hình) để người dùng quay lại không bị chớp hình
 * intro dù chỉ 1 khung hình.
 */
const COUNT_MS = 650;
const HOLD_MS = 80;
const PEEL_MS = 270;
const SEEN_KEY = "unifarm_intro_seen";

type Phase = "show" | "peel" | "hidden";

export default function SiteIntro() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const [phase, setPhase] = useState<Phase>(() => (isAdminRoute ? "hidden" : "show"));
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (isAdminRoute) return;

    const alreadySeen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    if (alreadySeen) {
      // Đã chạy intro 1 lần trong tab này rồi — bỏ qua hoàn toàn, không
      // chớp lại hình. Vẫn defer markIntroReady() sang macrotask kế tiếp để
      // các component khác (hero banner...) kịp gắn listener trước.
      const t = window.setTimeout(() => markIntroReady(), 0);
      setPhase("hidden");
      return () => clearTimeout(t);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      window.sessionStorage.setItem(SEEN_KEY, "1");
      // Defer to a new macrotask so sibling components (e.g. hero banners)
      // have had a chance to mount and attach their "intro ready" listener
      // before this event fires — calling it synchronously here would race
      // ahead of those listeners and get missed entirely.
      const t = window.setTimeout(() => markIntroReady(), 0);
      setPhase("hidden");
      return () => clearTimeout(t);
    }

    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    let raf = 0;
    let t1 = 0;
    let t2 = 0;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min(100, Math.round((elapsed / COUNT_MS) * 100)));
      if (elapsed < COUNT_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        t1 = window.setTimeout(() => {
          setPhase("peel");
          t2 = window.setTimeout(() => {
            setPhase("hidden");
            document.body.style.overflow = "";
            getLenis()?.start();
            window.sessionStorage.setItem(SEEN_KEY, "1");
            // Chỉ báo "sẵn sàng" SAU KHI intro đã biến mất hoàn toàn, để
            // trang chủ chạy hiệu ứng xuất hiện của riêng nó SAU (không
            // chạy chung lúc màn đang kéo).
            markIntroReady();
          }, PEEL_MS);
        }, HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
      getLenis()?.start();
    };
  }, [isAdminRoute]);

  if (phase === "hidden") return null;

  const peeling = phase === "peel";

  return (
    <div id="site-intro-overlay" aria-hidden="true" className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#06301B]"
        style={{
          transform: peeling ? "translateY(-100%)" : "translateY(0)",
          transition: `transform ${PEEL_MS}ms cubic-bezier(0.76,0,0.24,1)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#06301B]"
        style={{
          transform: peeling ? "translateY(100%)" : "translateY(0)",
          transition: `transform ${PEEL_MS}ms cubic-bezier(0.76,0,0.24,1)`,
        }}
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-4 px-6 transition-all duration-300 ease-out"
          style={{
            opacity: peeling ? 0 : 1,
            transform: peeling ? "scale(0.92)" : "scale(1)",
          }}
        >
          <div className="intro-logo-in relative h-20 w-20 sm:h-24 sm:w-24">
            <Image
              src="/images/logo-unifarm.png"
              alt="Unifarm"
              fill
              sizes="96px"
              priority
              className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            />
          </div>

          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-6xl font-extrabold text-[#fffacd] sm:text-7xl">
              {progress}
            </span>
          </div>

          <div className="h-[3px] w-28 overflow-hidden rounded-full bg-white/10 sm:w-36">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#87cefa] to-[#fffacd]"
              style={{ width: `${progress}%`, transition: "width 120ms linear" }}
            />
          </div>

          <p className="intro-fade-in mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9e8b8]">
            Safe Food For Life
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes introFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .intro-fade-in {
          opacity: 0;
          animation: introFadeIn 700ms 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes introLogoIn {
          0% {
            opacity: 0;
            transform: scale(1.15);
            filter: blur(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
        }
        .intro-logo-in {
          animation: introLogoIn 750ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
