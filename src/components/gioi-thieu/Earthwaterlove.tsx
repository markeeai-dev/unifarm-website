'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * EarthWaterLove — "Làm nông nghiệp là yêu Đất - Nước"
 * -----------------------------------------------------------------
 * - Bố cục 2 cột: ảnh phía trên, thẻ chữ trắng đè lên mép dưới ảnh
 *   một chút (lệch xuống + lệch phải), giống ảnh mẫu "Vua Gạo".
 * - Cuộn tới đâu, xuất hiện tới đó (IntersectionObserver, chạy 1 lần):
 *     • Tiêu đề: mờ dần + trượt từ dưới lên.
 *     • Khối bên trái: trượt từ trái vào, khối bên phải: trượt từ
 *       phải vào — cả hai chạy chậm 4.5s theo đúng yêu cầu.
 * - Hover vào thẻ chữ: thẻ nhô lên nhẹ (translate + đổ bóng đậm hơn).
 * - Nền toàn section: vàng nhạt #fffacd; điểm nhấn tiêu đề & tiêu đề
 *   thẻ dùng xanh lá đậm #006400; vạch chân thẻ dùng xanh dương nhạt
 *   #87cefa để 3 màu thương hiệu xuất hiện cân bằng trên nền sáng.
 * - Giới hạn max-width 1500px theo yêu cầu.
 * -----------------------------------------------------------------
 */

type Feature = {
  title: string;
  body: string;
  image: string;
};

const FEATURES: Feature[] = [
  {
    title: 'Tầm nhìn (đến 2030)',
    body:
      'Hệ sinh thái nông nghiệp công nghệ cao dẫn đầu VN, Việt Nam trở ngõ và vươn tầm thế giới.',
    image:
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?fm=jpg&q=80&w=800&fit=crop&auto=format',
  },
  {
    title: 'Sứ mệnh',
    body:
      'Cung cấp giải pháp nông nghiệp bền vững, vì sức khỏe con người & một hành tinh xanh.',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?fm=jpg&q=80&w=800&fit=crop&auto=format',
  },
];

export default function EarthWaterLove() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Eyebrow + Heading — fade up from below */}
        <div
          className="mb-12 text-center transition-all duration-[1100ms] ease-out sm:mb-16 lg:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="mb-2 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-[#006400] sm:text-sm">
            <span aria-hidden="true">»»</span> GIỚI THIỆU
          </p>
          <h2 className="uppercase mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem]">
          Định hướng {' '}
            <span className="text-[#006400]">phát triển</span>
          </h2>
        </div>

        {/* Two overlapping image + card columns */}
        <div className="grid grid-cols-1 gap-4 sm:gap-x-10 sm:gap-y-6 md:grid-cols-2 lg:gap-x-14">
          {FEATURES.map((f, i) => {
            const fromLeft = i === 0;
            return (
              <div
                key={f.title}
                className="relative pb-16 transition-all ease-out sm:pb-20"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? 'translateX(0)'
                    : `translateX(${fromLeft ? '-140px' : '140px'})`,
                  transitionDuration: '4500ms',
                  transitionDelay: '150ms',
                }}
              >
                {/* Image */}
                <div className="aspect-[4/3.6] w-[88%] overflow-hidden shadow-[0_18px_40px_rgba(0,100,0,0.18)] sm:w-[85%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.image}
                    alt={f.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Overlapping text card */}
                <div className="group absolute bottom-0 right-0 w-[70%] max-w-[380px] translate-y-10  border-b-4 border-[#87cefa] bg-white p-5 shadow-[0_16px_34px_rgba(0,60,0,0.15)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(0,60,0,0.22)] sm:translate-y-2 sm:p-6">
                  <h3 className="uppercase mb-2 text-lg font-bold text-[#006400] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:text-xl">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:text-[15px]">
                    {f.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}