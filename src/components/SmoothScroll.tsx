"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Cuộn mượt toàn site — thay quán tính cuộn chuột/bàn phím mặc định của
 * trình duyệt (nhảy khựng theo từng nấc) bằng chuyển động có easing, hơi
 * chậm lại một nhịp rồi trôi mượt tới vị trí đích. Chỉ can thiệp cuộn dọc
 * bằng chuột/bàn phím trên desktop — cuộn chạm (touch) trên di động vẫn
 * dùng cuộn gốc của hệ điều hành vì vốn đã mượt sẵn.
 *
 * Chạy 1 instance dùng chung cho cả site (mount ở root layout), tắt hẳn ở
 * các trang /admin (thao tác nhập liệu cần phản hồi tức thì, không cần
 * hiệu ứng trôi) và khi người dùng bật "prefers-reduced-motion".
 *
 * Đồng bộ với GSAP ScrollTrigger (dùng ở section quy trình sản xuất của
 * trang Nhà máy chế biến): Lenis cuộn "ảo" (áp transform riêng), không tự
 * đụng tới native scroll theo cách ScrollTrigger mặc định lắng nghe — nếu
 * không nối 2 bên lại, ScrollTrigger tính sai thời điểm pin/un-pin, khiến
 * trang bị "cứng" giữa chừng khi cuộn chuột/trackpad (chỉ kéo thanh cuộn
 * tay mới nhúc nhích vì thao tác đó bỏ qua cả Lenis lẫn ScrollTrigger).
 * Theo đúng hướng dẫn tích hợp chính thức của GSAP: để `gsap.ticker` làm
 * vòng lặp raf duy nhất cho Lenis, và gọi `ScrollTrigger.update()` mỗi khi
 * Lenis phát sự kiện scroll.
 */

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export default function SmoothScroll() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdminRoute) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      syncTouch: false,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [isAdminRoute]);

  // Next.js reset về đầu trang khi chuyển route bằng cách gọi scrollIntoView()
  // một lần trên phần tử gốc của trang mới — nhưng nếu Lenis đang giữa chừng
  // 1 cú trôi mượt (isScrolling === "smooth") lúc người dùng bấm link, nó bỏ
  // qua sự kiện scroll đó (coi là do chính nó gây ra) và vòng lặp raf ngay
  // sau đó tiếp tục kéo trang về lại "targetScroll" cũ của trang trước —
  // khiến trang mới bị cuộn xuống lại đúng vị trí cũ. Chủ động ép Lenis nhảy
  // thẳng về đầu (không hoạt ảnh) mỗi khi đổi route để đồng bộ lại trạng thái.
  //
  // Khi URL đích có #hash (vd: điều hướng sang "/du-an-hop-tac#hop-tac" từ
  // trang khác), nhảy thẳng tới đúng phần tử đó thay vì luôn về đầu trang —
  // nếu không, bước "ép về 0" ở trên sẽ đè mất vị trí hash ngay sau khi trang
  // mới mount, khiến link trông như chỉ chuyển trang chứ không cuộn tới đích.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isAdminRoute) return;

    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;

    if (target instanceof HTMLElement) {
      getLenis()?.scrollTo(target, { immediate: true });
    } else {
      getLenis()?.scrollTo(0, { immediate: true });
    }
  }, [pathname, isAdminRoute]);

  return null;
}
