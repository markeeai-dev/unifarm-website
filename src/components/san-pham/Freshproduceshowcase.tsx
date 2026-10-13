'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

/**
 * FreshProduceShowcase
 * -----------------------------------------------------------------
 * - Khối tiêu đề ở trên cùng: dòng chữ nhỏ nghiêng "Green Agriculture"
 *   + tiêu đề lớn in hoa "WELCOME TO UNIFARM", có hình lá trang trí mờ
 *   phía trên — giống bố cục ảnh mẫu.
 * - Ảnh lớn PNG (nền trong suốt) nằm giữa; 4 mục đặc điểm bố trí quanh
 *   ảnh: 2 mục gần tâm phía trên, 2 mục ở rìa ngoài ngang với mép trên
 *   của ảnh — đúng vị trí như ảnh mẫu.
 * - Cuộn tới đâu, xuất hiện tới đó (IntersectionObserver, chạy 1 lần):
 *     • Khối tiêu đề hiện ra đầu tiên.
 *     • Ảnh lớn hiện ra kế tiếp (scale + fade, ~700ms).
 *     • Ngay khi ảnh hiện xong, 4 mục xuất hiện LẦN LƯỢT sau đó, mỗi mục
 *       trễ hơn mục trước 150ms, tạo cảm giác "rơi vào" nối tiếp nhau.
 * - Hover từng mục: toàn bộ item nhích lên mượt mà — vòng tròn icon
 *   chuyển từ viền mảnh sang nền xanh lá đậm đặc, icon đổi màu vàng
 *   nhạt, phóng to nhẹ; tiêu đề và mô tả cũng nhích lên theo, tất cả
 *   cùng chung một nhịp chuyển động (transition 500ms) cho cảm giác
 *   đồng bộ, mượt mà.
 * - Mobile: bỏ layout absolute (không phù hợp màn hẹp), chuyển sang
 *   xếp dọc gọn gàng: tiêu đề — 2 mục trên — ảnh — 2 mục dưới, dùng
 *   lưới 2 cột, khoảng cách được rút gọn cho vừa màn hình hẹp.
 * - Tông màu: vàng nhạt #fffacd, xanh lá đậm #006400, xanh dương nhạt
 *   #87cefa.
 * -----------------------------------------------------------------
 */

type Feature = {
  title: string;
  desc: string;
  icon: 'sprout' | 'wheat' | 'basket' | 'search';
};

const FEATURES: Feature[] = [
  {
    title: 'Kiểm soát xuyên suốt',
    desc: 'Từ nguồn giống, quy trình canh tác đến thu hoạch, sơ chế, đóng gói và bảo quản.',
    icon: 'sprout',
  },
  {
    title: 'Truy xuất nguồn gốc',
    desc: 'Mỗi lô hàng có thể truy xuất từ vùng trồng, thời điểm thu hoạch đến đóng gói và giao hàng.',
    icon: 'search',
  },
  {
    title: 'Kiểm soát dư lượng',
    desc: 'Quản lý đầu vào, thời gian cách ly và giới hạn dư lượng theo yêu cầu của từng thị trường.',
    icon: 'basket',
  },
  {
    title: 'Độ đồng đều & Kỷ luật giao hàng',
    desc: 'Kiểm soát quy cách, chất lượng sản phẩm và kế hoạch giao hàng theo yêu cầu của khách hàng.',
    icon: 'wheat',
  },
];

// Real photo cutout (transparent PNG) — banana, cam, chanh, kiwi, táo tươi
const IMAGE_SRC = '/images/Gio-trai-cay.png';
const IMAGE_W = 1200;
const IMAGE_H = 550;

// Title fades in immediately; the image reveals right after (700ms); items
// then cascade in one after another right as the image finishes.
const IMAGE_REVEAL_MS = 700;
const ITEM_STEP_MS = 150;

function FeatureIcon({ type, className }: { type: Feature['icon']; className?: string }) {
  const common = { viewBox: '0 0 24 24', className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 } as const;
  switch (type) {
    case 'sprout':
      return (
        <svg {...common}>
          <path d="M12 21c-5-1-7-5-7-9 4 0 7 2 8 6 1-4 4-6 8-6 0 4-2 8-7 9Z" strokeLinejoin="round" />
          <path d="M12 21v-9" strokeLinecap="round" />
        </svg>
      );
    case 'wheat':
      return (
        <svg {...common}>
          <path d="M12 3v18" strokeLinecap="round" />
          <path d="M12 6c-2 0-3.2 1.1-3.2 2.4S10 10.8 12 10.8 M12 6c2 0 3.2 1.1 3.2 2.4S14 10.8 12 10.8" strokeLinecap="round" />
          <path d="M12 11c-2 0-3.2 1.1-3.2 2.4S10 15.8 12 15.8 M12 11c2 0 3.2 1.1 3.2 2.4S14 15.8 12 15.8" strokeLinecap="round" />
          <path d="M9 21c0-1.7 1.3-3 3-3s3 1.3 3 3" strokeLinecap="round" />
        </svg>
      );
    case 'basket':
      return (
        <svg {...common}>
          <path d="M4 10h16l-1.4 9.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 10Z" strokeLinejoin="round" />
          <path d="M8 10 9.5 5M16 10 14.5 5M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
          <path d="M8 10.3l1.6 1.6 3-3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

/** Faint decorative leaf-sprig flourish, sits above the "Green Agriculture" line. */
function LeafFlourish() {
  return (
    <svg viewBox="0 0 64 24" className="h-5 w-16 text-[#006400]/25" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 12h22M40 12h22" strokeLinecap="round" />
      <path d="M32 4c4 3 4 5 0 8-4-3-4-5 0-8Z" />
      <path d="M32 12c4 3 4 5 0 8-4-3-4-5 0-8Z" />
    </svg>
  );
}

function SectionTitle({ visible }: { visible: boolean }) {
  const { t } = useLanguage();
  return (
    <div
      className="mb-10 text-center transition-all duration-700 ease-out sm:mb-14"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-16px)',
      }}
    >
      <div className="mb-2 flex justify-center">
        <LeafFlourish />
      </div>
      <p className="text-base italic text-[#006400] sm:text-lg">
        {t('Tiêu chuẩn Unifarm')}
      </p>
      <h2 className="mt-1 text-2xl font-extrabold uppercase tracking-wide text-neutral-900 sm:text-3xl lg:text-[38px]">
        {t('Chất lượng được xây dựng từ hệ thống')}
      </h2>
    </div>
  );
}

function FeatureItem({
  feature,
  visible,
  delayMs,
}: {
  feature: Feature;
  visible: boolean;
  delayMs: number;
}) {
  const { t } = useLanguage();
  return (
    <div
      className="group flex flex-col items-center text-center transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(26px) scale(0.82)',
        transitionDelay: `${delayMs}ms`,
      }}
    >
      <span className="mb-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#006400]/25 bg-white text-[#006400] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-110 group-hover:border-[#006400] group-hover:bg-[#006400] group-hover:text-[#fffacd] group-hover:shadow-[0_16px_32px_rgba(0,100,0,0.35)] sm:h-[72px] sm:w-[72px]">
        <FeatureIcon type={feature.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-neutral-800 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:text-[#006400] sm:text-base">
        {t(feature.title)}
      </h3>
      <p className="max-w-[210px] text-xs leading-relaxed text-neutral-500 transition-all duration-500 ease-out group-hover:-translate-y-0.5 sm:text-sm">
        {t(feature.desc)}
      </p>
    </div>
  );
}

export default function FreshProduceShowcase() {
  const { t } = useLanguage();
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
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const HeroImage = (
    <div
      className="relative mx-auto w-[320px] transition-all ease-out sm:w-[610px] md:w-[790px] lg:w-[820px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.82)',
        transitionDuration: `${IMAGE_REVEAL_MS}ms`,
      }}
    >
      <div className="absolute inset-0 -z-10 rounded-full bg-[#87cefa]/20 blur-3xl" />
      <Image
        src={IMAGE_SRC}
        alt={t('Nông sản tươi Unifarm')}
        width={IMAGE_W}
        height={IMAGE_H}
        className="h-auto w-full drop-shadow-[0_30px_55px_rgba(0,60,0,0.28)]"
      />
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat">
      <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:py-10">
        <SectionTitle visible={visible} />

        {/* ---- Desktop / tablet: image with items positioned around it, like the reference:
              item1/item2 sit near the center above the image, item3/item4 sit out at the
              edges level with the image's top edge, and the image itself dominates the
              lower two-thirds of the block. ---- */}
        <div className="relative mx-auto hidden max-w-[1300px] md:block" style={{ minHeight: 760 }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {HeroImage}
          </div>

          <div className="absolute left-[34%] top-0 -translate-x-1/2">
            <FeatureItem feature={FEATURES[0]} visible={visible} delayMs={IMAGE_REVEAL_MS} />
          </div>
          <div className="absolute right-[34%] top-0 translate-x-1/2">
            <FeatureItem feature={FEATURES[1]} visible={visible} delayMs={IMAGE_REVEAL_MS + ITEM_STEP_MS} />
          </div>
          <div className="absolute left-[1%] top-[27%]">
            <FeatureItem feature={FEATURES[2]} visible={visible} delayMs={IMAGE_REVEAL_MS + ITEM_STEP_MS * 2} />
          </div>
          <div className="absolute right-[1%] top-[27%]">
            <FeatureItem feature={FEATURES[3]} visible={visible} delayMs={IMAGE_REVEAL_MS + ITEM_STEP_MS * 3} />
          </div>
        </div>

        {/* ---- Mobile: stacked, image centered between two 2-item rows ---- */}
        <div className="flex flex-col items-center gap-8 md:hidden">
          <div className="grid w-full grid-cols-2 gap-x-3 gap-y-8">
            <FeatureItem feature={FEATURES[0]} visible={visible} delayMs={IMAGE_REVEAL_MS} />
            <FeatureItem feature={FEATURES[1]} visible={visible} delayMs={IMAGE_REVEAL_MS + ITEM_STEP_MS} />
          </div>

          {HeroImage}

          <div className="grid w-full grid-cols-2 gap-x-3 gap-y-8">
            <FeatureItem feature={FEATURES[2]} visible={visible} delayMs={IMAGE_REVEAL_MS + ITEM_STEP_MS * 2} />
            <FeatureItem feature={FEATURES[3]} visible={visible} delayMs={IMAGE_REVEAL_MS + ITEM_STEP_MS * 3} />
          </div>
        </div>
      </div>
    </section>
  );
}
