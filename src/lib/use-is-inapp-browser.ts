"use client";

import { useEffect, useState } from "react";

/**
 * Trình duyệt-trong-app (Zalo, Facebook/Messenger, Instagram, TikTok, Line,
 * WeChat...) trên iOS thường mở trang bằng WKWebView với cấu hình KHÔNG cho
 * phát video inline — quyết định này nằm ở phía app chủ (Zalo...), trang
 * web không có cách nào override được bằng `playsInline`/JS. Hậu quả: video
 * nền bị hiện control mặc định của hệ điều hành và/hoặc sai kích thước
 * (méo/letterbox), trông rất thô — xác nhận qua ảnh chụp thực tế từ Zalo.
 *
 * Vì không thể "sửa" cho video phát đúng trong các webview này, giải pháp
 * thực tế là NHẬN DIỆN và bỏ qua video, chỉ dùng ảnh tĩnh — vẫn có video tự
 * chạy bình thường khi mở bằng Safari/Chrome/quét QR thật.
 */
const IN_APP_UA_SIGNATURES = [
  "zalo",
  "fban",
  "fbav",
  "fb_iab",
  "instagram",
  "line/",
  "micromessenger",
  "musical_ly",
  "bytedancewebview",
  "tiktok",
];

function detect(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return IN_APP_UA_SIGNATURES.some((sig) => ua.includes(sig));
}

/** null ở lần render đầu (server + trước hydrate) — coi như "chưa biết", các
 * component nên xử lý giống hệt `useIsMobile`: fallback an toàn cho tới khi
 * resolve xong ở client. */
export function useIsInAppBrowser() {
  const [isInApp, setIsInApp] = useState<boolean | null>(null);

  useEffect(() => {
    setIsInApp(detect());
  }, []);

  return isInApp;
}
