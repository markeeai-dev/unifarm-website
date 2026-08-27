"use client";

import { useEffect, type RefObject } from "react";

/**
 * Một số trình duyệt mobile (đặc biệt Safari/Chrome iOS, WebView trong app
 * Zalo/Facebook) đôi khi bỏ qua thuộc tính HTML `autoPlay` — nhất là sau khi
 * React hydrate lại DOM do SSR, hoặc khi tab quay lại foreground sau khi bị
 * ẩn. Hook này chủ động gọi `.play()` bằng JS ở nhiều thời điểm (mount, dữ
 * liệu vừa đủ để phát, tab quay lại foreground) để đảm bảo video nền luôn
 * thực sự tự chạy trên điện thoại thật, không chỉ trong trình giả lập.
 */
export function useForcePlayVideo(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Bắt buộc muted qua property (không chỉ attribute) — một số bản
    // WebKit cũ chỉ tin cậy autoplay khi muted được set bằng JS.
    video.muted = true;

    const tryPlay = () => {
      video.play().catch(() => {
        // Trình duyệt chặn autoplay (hiếm khi xảy ra vì đã muted+playsInline) —
        // bỏ qua, video vẫn hiện được khung hình đầu qua poster.
      });
    };

    tryPlay();
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [videoRef]);
}
