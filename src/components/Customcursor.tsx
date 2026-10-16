"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * CustomCursor — hiệu ứng thêm cho con trỏ chuột thật của máy (không ẩn/thay
 * con trỏ gốc). Một vòng tròn nhỏ bám sát chuột tức thì, không độ trễ.
 * - Phồng to + đổi màu khi rê vào link/button để báo hiệu có thể bấm được.
 * - Tự tắt trên thiết bị cảm ứng / không có chuột thật (pointer: fine),
 *   khi người dùng bật "giảm hiệu ứng chuyển động" (prefers-reduced-motion),
 *   và ở khu vực /admin (thao tác nhập liệu, không cần hiệu ứng trang trí —
 *   giống cách SiteIntro/HomeTopHeader/SmoothScroll đã tự loại trừ admin).
 */
export default function CustomCursor() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isAdminRoute) return;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      const transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      dot.style.transform = transform;
      ring.style.transform = transform;
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        ring.classList.add("custom-cursor-ring--hover");
      } else {
        ring.classList.remove("custom-cursor-ring--hover");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerover", onPointerOver);
    };
  }, [isAdminRoute]);

  if (isAdminRoute) return null;

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />

      <style>{`
        .custom-cursor-dot,
        .custom-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          pointer-events: none;
          border-radius: 50%;
          transform: translate3d(-9999px, -9999px, 0);
          display: none;
        }
        html.custom-cursor-active .custom-cursor-dot,
        html.custom-cursor-active .custom-cursor-ring {
          display: block;
        }

        .custom-cursor-dot {
          width: 5px;
          height: 5px;
          margin: -2.5px 0 0 -2.5px;
          background: #054a00;
        }

        .custom-cursor-ring {
          width: 34px;
          height: 34px;
          margin: -17px 0 0 -17px;
          border: 1.5px solid #0a6b0a;
          background: rgba(10, 107, 10, 0.08);
          transition: width 250ms cubic-bezier(0.22, 1, 0.36, 1),
            height 250ms cubic-bezier(0.22, 1, 0.36, 1),
            margin 250ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 250ms ease, background 250ms ease;
        }
        .custom-cursor-ring--hover {
          width: 52px;
          height: 52px;
          margin: -26px 0 0 -26px;
          border-color: #054a00;
          background: rgba(5, 74, 0, 0.18);
        }
      `}</style>
    </>
  );
}
