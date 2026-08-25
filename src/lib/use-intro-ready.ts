"use client";

import { useEffect, useState } from "react";

/**
 * Tín hiệu dùng chung: "Intro loading đã (bắt đầu) mở màn xong chưa?"
 * SiteIntro (trong root layout) dispatch event này đúng lúc màn hình intro
 * bắt đầu mở ra (curtain-peel) — các banner đầu trang gọi hook này thay cho
 * việc tự set "mounted=true" ngay khi mount, để hiệu ứng xuất hiện của banner
 * không bị "chạy xong âm thầm" phía sau lớp intro rồi biến mất khi intro tắt.
 *
 * Nếu SiteIntro không tồn tại (không mount) hoặc có lỗi, có timeout dự phòng
 * 2.5s để banner vẫn luôn hiện ra, không bị treo mãi.
 */
const EVENT_NAME = "unifarm:intro-ready";

declare global {
  interface Window {
    __unifarmIntroReady?: boolean;
  }
}

function getInitial() {
  if (typeof window === "undefined") return false;
  return window.__unifarmIntroReady === true;
}

export function markIntroReady() {
  if (typeof window === "undefined") return;
  if (window.__unifarmIntroReady) return;
  window.__unifarmIntroReady = true;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useIntroReady() {
  const [ready, setReady] = useState(getInitial);

  useEffect(() => {
    if (ready) return;
    const onReady = () => setReady(true);
    window.addEventListener(EVENT_NAME, onReady);
    const fallback = setTimeout(() => setReady(true), 4000);
    return () => {
      window.removeEventListener(EVENT_NAME, onReady);
      clearTimeout(fallback);
    };
  }, [ready]);

  return ready;
}
