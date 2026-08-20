"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor — hiệu ứng thêm cho con trỏ chuột thật của máy (không ẩn/thay
 * con trỏ gốc). Một vòng tròn nhỏ "đuổi theo" chuột với độ trễ mượt (nội suy
 * tuyến tính mỗi frame) và kéo dài theo hướng di chuyển khi rê nhanh — tạo
 * cảm giác như một "con chuột thứ 2" bị kéo theo con trỏ thật.
 * - Phồng to + đổi màu khi rê vào link/button để báo hiệu có thể bấm được.
 * - Tự tắt trên thiết bị cảm ứng / không có chuột thật (pointer: fine)
 *   và khi người dùng bật "giảm hiệu ứng chuyển động" (prefers-reduced-motion).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let ringAngle = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        ring.classList.add("custom-cursor-ring--hover");
      } else {
        ring.classList.remove("custom-cursor-ring--hover");
      }
    };

    const tick = () => {
      // Nội suy tuyến tính — vòng tròn "đuổi theo" con trỏ thật một cách mượt, có trễ nhẹ,
      // giống như một "con chuột thứ 2" bị kéo theo.
      const prevRingX = ringX;
      const prevRingY = ringY;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      // Càng bị kéo nhanh, vòng tròn càng kéo dài theo hướng di chuyển (hiệu ứng "vệt kéo").
      const dx = ringX - prevRingX;
      const dy = ringY - prevRingY;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.4) ringAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = 1 + Math.min(dist, 22) / 22 * 0.6;
      const squeeze = 1 / Math.sqrt(stretch);

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${ringAngle}deg) scale(${stretch}, ${squeeze})`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerover", onPointerOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

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
