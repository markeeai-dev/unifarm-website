"use client";

import { usePathname } from "next/navigation";

/** Bọc nội dung mỗi trang admin — key theo pathname nên mỗi lần chuyển
 * route, React remount khối này và animation CSS tự chạy lại từ đầu,
 * tạo cảm giác trang trồi nhẹ vào thay vì bật ra tức thì. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-[admin-page-in_320ms_cubic-bezier(0.22,1,0.36,1)_both]">
      {children}
    </div>
  );
}
