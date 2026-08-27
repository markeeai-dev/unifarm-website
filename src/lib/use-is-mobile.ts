/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

/**
 * true/false sau khi xác định được kích thước màn hình thật ở client;
 * null trong lần render đầu (SSR + trước khi hydrate) — dùng để mặc định
 * hiển thị phương án nhẹ (ảnh tĩnh) cho tới khi biết chắc là màn hình lớn,
 * tránh mobile tải nhầm video nặng trước khi kịp phát hiện.
 */
export function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpointPx]);

  return isMobile;
}
