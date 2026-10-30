/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/db';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import {
  CATEGORIES,
  ProductDetailPanel,
  ProductGallery,
  ProductImage,
  getCertBadge,
  getProductSpecs,
  QUALITY_COMMITMENTS,
} from '@/components/ProductDetailPanel';

/**
 * ProductsShowcase — "Nông sản Unifarm"
 * -----------------------------------------------------------------
 * - Card kiểu ảnh PNG cắt nền (không khung màu sau ảnh) — viền mỏng xám,
 *   hover viền chuyển xanh lá đậm sáng rõ, ảnh phóng to nhẹ. Đúng vị trí
 *   giá tiền, hover sẽ đổi thành 3 icon tròn: xem nhanh / giỏ hàng / yêu
 *   thích.
 * - Chuyển mục (tab danh mục): card của mục cũ văng ra ngẫu nhiên theo
 *   từng hướng riêng (xoay + thu nhỏ + mờ dần, ~360ms), sau đó card của
 *   mục mới bay vào từ hướng ngẫu nhiên của chính nó và "nảy" nhẹ về
 *   đúng vị trí (easing overshoot) — so le từng thẻ để cảm giác sống
 *   động, cao cấp hơn kiểu fade-up đơn thuần. Hướng bay của mỗi card
 *   được tính cố định theo id sản phẩm (không dùng Math.random) nên
 *   không lệch giữa server/client. Bấm nhanh nhiều tab liên tiếp vẫn luôn
 *   hội tụ đúng về mục cuối cùng được chọn nhờ dọn timer cũ mỗi lần đổi.
 * -----------------------------------------------------------------
 * ẢNH: thay bằng ảnh PNG nền trong suốt thật của sản phẩm trong mảng
 * PRODUCTS trước khi lên production (ảnh demo dùng placeholder từ
 * picsum.photos chỉ để đảm bảo luôn hiển thị được).
 */

function CartIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20.5" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EyeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ className = 'h-4 w-4', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className={className}>
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C.4 7.7 2 4 5.6 4c2 0 3.5 1.1 4.4 2.6C10.9 5.1 12.4 4 14.4 4 18 4 19.6 7.7 18 11.2c-2.5 4.7-10 9.3-10 9.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CloseIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function DocumentIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.5 13h5M9.5 16.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bỏ dấu tiếng Việt + ký tự đặc biệt để dùng làm tên file PDF an toàn. */
function slugifyFileName(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .toLowerCase() || 'san-pham'
  );
}

/**
 * Xuất PDF tài liệu sản phẩm (tên, mô tả, bảng thông số, cam kết chất
 * lượng) từ chính dữ liệu đang hiển thị trên trang — chụp DOM bằng
 * `html2canvas` thành ảnh rồi nhúng vào PDF (`doc.addImage()`) thay vì
 * dùng font vẽ chữ trực tiếp của jsPDF, vì font mặc định của jsPDF chỉ
 * hỗ trợ Latin1/WinAnsi nên không hiển thị đúng dấu tiếng Việt lẫn tiếng
 * Nhật/Hàn/Trung; chụp ảnh thì chữ hiện đúng y hệt trên mọi ngôn ngữ.
 */
async function downloadProductPdf(
  p: {
    name: string;
    subtitle: string;
    description: string;
    category: Product['category'];
    origin: string;
    season: string;
    packaging: string;
    storage: string;
    supply_status: string;
  },
  specs: { label: string; value: string }[],
  commitments: string[],
  certBadge: string,
  categoryLabel: string,
  t: (text: string) => string
) {
  const { jsPDF } = await import('jspdf');

  const plainDescription = p.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // jsPDF.html() (qua html2canvas) không capture đúng nội dung nếu đặt
  // container ở toạ độ âm/position:fixed ngoài màn hình — html2canvas cần
  // phần tử nằm trong luồng layout bình thường để đo/vẽ đúng. Thay vào đó,
  // bọc trong 1 wrapper cao 0px + overflow:hidden ở cuối <body> để không
  // ảnh hưởng bố cục trang nhưng vẫn "thật sự" nằm trong layout.
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'height:0;overflow:hidden;';

  const container = document.createElement('div');
  container.style.cssText =
    'width:700px;padding:40px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;background:#ffffff;box-sizing:border-box;';
  container.innerHTML = `
    <div style="border-bottom:4px solid #006400;padding-bottom:16px;margin-bottom:24px;">
      <div style="font-size:22px;font-weight:800;color:#006400;letter-spacing:1px;">UNIFARM</div>
      <div style="font-size:11px;color:#666;margin-top:2px;">${t('Tài liệu sản phẩm')}</div>
    </div>
    <div style="font-size:12px;color:#006400;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">${categoryLabel}</div>
    <div style="font-size:26px;font-weight:800;text-transform:uppercase;margin-bottom:6px;">${p.name}</div>
    ${p.subtitle ? `<div style="font-size:14px;color:#555;margin-bottom:10px;">${p.subtitle}</div>` : ''}
    ${certBadge ? `<div style="font-size:13px;color:#006400;font-weight:700;margin-bottom:16px;">${certBadge}</div>` : ''}
    ${plainDescription ? `<div style="font-size:13px;line-height:1.6;color:#333;margin-bottom:20px;">${plainDescription}</div>` : ''}
    ${
      specs.length
        ? `<div style="font-size:14px;font-weight:700;margin-bottom:8px;">${t('Bảng thông số')}</div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12px;">
      <tr style="background:#f0f7ee;">
        <th style="text-align:left;padding:8px;border:1px solid #ddd;width:40%;">${t('Đặc tính')}</th>
        <th style="text-align:left;padding:8px;border:1px solid #ddd;">${t('Chi tiết sản phẩm')}</th>
      </tr>
      ${specs
        .map(
          (row) =>
            `<tr><td style="padding:8px;border:1px solid #ddd;color:#555;">${row.label}</td><td style="padding:8px;border:1px solid #ddd;font-weight:600;">${row.value}</td></tr>`
        )
        .join('')}
    </table>`
        : ''
    }
    ${
      p.origin || p.season || p.packaging || p.storage || p.supply_status
        ? `<table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12px;">
      ${p.origin ? `<tr><td style="padding:6px 8px;color:#555;width:40%;">${t('Xuất xứ / Vùng trồng')}</td><td style="padding:6px 8px;font-weight:600;">${p.origin}</td></tr>` : ''}
      ${p.season ? `<tr><td style="padding:6px 8px;color:#555;">${t('Mùa vụ')}</td><td style="padding:6px 8px;font-weight:600;">${p.season}</td></tr>` : ''}
      ${p.packaging ? `<tr><td style="padding:6px 8px;color:#555;">${t('Đóng gói')}</td><td style="padding:6px 8px;font-weight:600;">${p.packaging}</td></tr>` : ''}
      ${p.storage ? `<tr><td style="padding:6px 8px;color:#555;">${t('Bảo quản')}</td><td style="padding:6px 8px;font-weight:600;">${p.storage}</td></tr>` : ''}
      ${p.supply_status ? `<tr><td style="padding:6px 8px;color:#555;">${t('Khả năng cung ứng')}</td><td style="padding:6px 8px;font-weight:600;">${p.supply_status}</td></tr>` : ''}
    </table>`
        : ''
    }
    ${
      commitments.length
        ? `<div style="font-size:14px;font-weight:700;margin-bottom:8px;">${t('Cam kết chất lượng')}</div>
    <ul style="font-size:12px;line-height:1.8;color:#333;margin:0 0 24px 18px;padding:0;">
      ${commitments.map((c) => `<li>${c}</li>`).join('')}
    </ul>`
        : ''
    }
    <div style="border-top:1px solid #ddd;padding-top:14px;font-size:11px;color:#777;">
      <div>Unifarm — (0274) 3889887 — info@unifarm.com.vn</div>
      <div>158, Đường Ngô Gia Tự, Phường Thủ Dầu Một, Tp. Hồ Chí Minh</div>
    </div>
  `;
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  try {
    // Dùng html2canvas-pro (bản fork có hỗ trợ hàm màu CSS hiện đại như
    // oklch()) thay vì html2canvas gốc — Tailwind CSS v4 định nghĩa bảng
    // màu mặc định bằng oklch(), còn html2canvas gốc không parse được hàm
    // này và ném lỗi "unsupported color function oklch" khi chụp DOM.
    const { default: html2canvas } = await import('html2canvas-pro');
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const contentHeightPerPage = pageHeight - margin * 2;

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Cắt ảnh dài thành từng trang A4 bằng cách vẽ cùng 1 ảnh nhiều lần,
    // mỗi lần dịch lên trên 1 khoảng bằng chiều cao đã hiển thị ở các
    // trang trước — cách chuẩn để "phân trang" một ảnh cao hơn 1 trang.
    // Dùng JPEG (nén có mất mát) thay vì PNG vì nội dung chủ yếu là văn
    // bản trên nền trắng — PNG không nén tốt trường hợp này nên file
    // nặng hơn nhiều lần so với JPEG chất lượng cao, cùng độ nét.
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    let heightLeft = imgHeight;
    let position = margin;

    doc.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= contentHeightPerPage;

    while (heightLeft > 0) {
      position = margin - (imgHeight - heightLeft);
      doc.addPage();
      doc.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeightPerPage;
    }

    doc.save(`${slugifyFileName(p.name)}.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
}

// Deterministic pseudo-random offset per product id (same on server & client —
// avoids hydration mismatches that Math.random() would cause). Spreads each
// card out to its own direction/rotation for the scatter transition.
function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function getScatter(id: string) {
  const h = hashString(id);
  const angle = (h % 360) * (Math.PI / 180);
  const distance = 90 + (h % 110); // 90–200px out
  const rotate = (h % 70) - 35; // -35..35deg
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    rotate,
  };
}

function IconButton({
  onClick,
  children,
  active,
  label,
}: {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 sm:h-9 sm:w-9 ${
        active ? 'bg-[#006400] text-[#fffacd]' : 'bg-[#87cefa]/25 text-[#006400] hover:bg-[#006400] hover:text-[#fffacd]'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductsShowcase({ products }: { products: Product[] }) {
  const { t, tr } = useLanguage();
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [selected, setSelected] = useState<Product | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Nhận điều hướng từ Section 3 (CategoryShowcase): mục "Chuối tươi" /
  // "Dứa" đều thuộc nhóm "Trái cây tươi" nên cùng trỏ về category "fresh".
  // Nhận điều hướng từ Section 5 (NewProductAnnouncement): "#product-<id>"
  // mở thẳng chi tiết đúng sản phẩm đó (vd. sản phẩm thật gần nhất trong
  // lúc chờ sản phẩm mới chính thức ra mắt).
  useEffect(() => {
    const HASH_TO_CATEGORY: Record<string, string> = {
      'fresh-banana': 'fresh',
      'fresh-pineapple': 'fresh',
      'tissue-culture': 'seedling',
      processed: 'processed',
    };
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('product-')) {
        const id = hash.slice('product-'.length);
        const product = products.find((p) => p.id === id);
        if (product) {
          setActiveCat(product.category);
          setSelected(product);
        }
        return;
      }
      const cat = HASH_TO_CATEGORY[hash];
      if (cat) setActiveCat(cat);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [products]);

  // ---- Scroll reveal: toàn bộ khối (tiêu đề, tabs, quick-pick, lưới sản
  // phẩm) mờ dần + trồi lên trong ~4.5s, chạy đúng 1 lần khi cuộn tới.
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ---- Scatter transition state machine -------------------------------
  // displayCat/displayQuick = what's actually rendered right now.
  // isExiting = true while the OLD cards are flying out; once that
  // finishes, displayCat swaps to the target and the NEW cards fly in
  // from their own scattered origin and settle into place.
  // A ref-tracked timer + "skip on first mount" guard means rapid clicks
  // always resolve to the last-clicked category — no leftover stale swap.
  const [displayCat, setDisplayCat] = useState(activeCat);
  const [isExiting, setIsExiting] = useState(false);
  const isFirstRun = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setIsExiting(true);
    const t = setTimeout(() => {
      setDisplayCat(activeCat);
      setIsExiting(false);
    }, 380);
    timersRef.current.push(t);

    return () => timersRef.current.forEach(clearTimeout);
  }, [activeCat]);

  const displayed = products.filter((p) => displayCat === 'all' || p.category === displayCat);

  function handleAddToCart(id: string) {
    setAddedId(id);
    setTimeout(() => setAddedId((cur) => (cur === id ? null : cur)), 1600);
  }

  function toggleLike(id: string) {
    setLiked((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <section id="products" ref={sectionRef} className="w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat">
      <style>{`
        @keyframes ps-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ps-scatterIn {
          0%   { opacity: 0; transform: translate(var(--sx), var(--sy)) rotate(var(--sr)) scale(0.35); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        .prose-product p { margin: 0 0 0.6em; }
        .prose-product p:last-child { margin-bottom: 0; }
        .prose-product ul, .prose-product ol { margin: 0.4em 0 0.6em; padding-left: 1.25em; }
        .prose-product ul { list-style: disc; }
        .prose-product ol { list-style: decimal; }
        .prose-product a { color: #006400; text-decoration: underline; }
        .prose-product strong { color: #1c1c1c; font-weight: 700; }
        .prose-product img { max-width: 100%; height: auto; border-radius: 8px; }
      `}</style>

      <div
        className="mx-auto max-w-[1300px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
        style={{
          transition: 'opacity 4500ms cubic-bezier(0.16,1,0.3,1), transform 4500ms cubic-bezier(0.16,1,0.3,1)',
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(60px)',
        }}
      >
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#006400] sm:text-sm">
            {t('Sản phẩm')}
          </p>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            {t('Khám Phá Sản Phẩm Unifarm')}
          </h2>
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-neutral-200 pb-4 sm:mb-10 sm:gap-x-10">
          {CATEGORIES.map((c) => {
            const isActive = c.id === activeCat;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                className={`whitespace-nowrap border-b-2 pb-1 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'border-[#006400] text-[#006400]'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {t(c.label)}
              </button>
            );
          })}
        </div>

        {/* Product grid — card cũ văng ra ngẫu nhiên (xoay + thu nhỏ + mờ
            dần) khi đổi mục, sau đó card mới của mục đích bay vào từ
            hướng ngẫu nhiên riêng và "nảy" về đúng vị trí (overshoot ease)
            — so le theo thứ tự để tạo cảm giác chuyển cảnh sống động. */}
        {displayed.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-400">
            {t('Chưa có sản phẩm phù hợp trong mục này.')}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {displayed.map((p, i) => {
              const justAdded = addedId === p.id;
              const isLiked = liked.has(p.id);
              const scatter = getScatter(p.id);
              const name = tr(p.translations, 'name', p.name);

              return (
                <div
                  key={p.id}
                  className={isExiting ? 'pointer-events-none' : ''}
                  style={
                    isExiting
                      ? {
                          transform: `translate(${scatter.x}px, ${scatter.y}px) rotate(${scatter.rotate}deg) scale(0.35)`,
                          opacity: 0,
                          transition: `transform 360ms cubic-bezier(0.55,0,0.85,0.35) ${i * 18}ms, opacity 300ms ease-in ${i * 18}ms`,
                        }
                      : ({
                          '--sx': `${scatter.x}px`,
                          '--sy': `${scatter.y}px`,
                          '--sr': `${scatter.rotate}deg`,
                          animation: 'ps-scatterIn 720ms cubic-bezier(0.34,1.56,0.64,1) both',
                          animationDelay: `${i * 45}ms`,
                        } as React.CSSProperties)
                  }
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(p)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelected(p)}
                    className="group h-full cursor-pointer border border-neutral-200 bg-white p-5 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#006400] hover:shadow-[0_16px_30px_rgba(0,100,0,0.14)] sm:h-auto"
                  >
                    {/* Ảnh PNG nền trong suốt — không còn khung màu phía sau */}
                    <div className="mx-auto flex h-32 items-center justify-center sm:h-40">
                      <ProductImage
                        src={p.image}
                        alt={name}
                        className="max-h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                        iconSize={40}
                      />
                    </div>

                    <h3 className="uppercase mt-4 text-[13px] font-bold text-neutral-800 sm:text-sm">{name}</h3>

                    {/* Icon liên hệ (bấm được) <-> 3 icon hành động, đổi chỗ cho nhau khi hover, không xô lệch layout */}
                    <div className="relative mt-2 flex h-9 items-center justify-center">
                      <Link
                        href="/#contact"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Liên hệ tư vấn giá ${name}`}
                        className="absolute inline-flex items-center gap-1.5 rounded-full bg-[#87cefa]/20 px-3 py-1 text-[12px] font-bold text-[#006400] transition-all duration-300 ease-out hover:bg-[#006400] hover:text-[#fffacd] group-hover:scale-0 group-hover:opacity-0 sm:text-[13px]"
                      >
                        <PhoneIcon className="h-3.5 w-3.5" />
                        {t('Liên hệ')}
                      </Link>
                      <div className="absolute flex items-center gap-2 scale-75 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100">
                        <IconButton
                          label={t('Xem nhanh')}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(p);
                          }}
                        >
                          <EyeIcon />
                        </IconButton>
                        <IconButton
                          label={t('Thêm vào giỏ hàng')}
                          active={justAdded}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p.id);
                          }}
                        >
                          {justAdded ? <CheckIcon /> : <CartIcon />}
                        </IconButton>
                        <IconButton
                          label={t('Yêu thích')}
                          active={isLiked}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(p.id);
                          }}
                        >
                          <HeartIcon filled={isLiked} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- PRODUCT DETAIL PANEL ---------------- */}
      {selected && (() => {
        const s = selected;
        const translated = {
          ...s,
          name: tr(s.translations, 'name', s.name),
          subtitle: tr(s.translations, 'subtitle', s.subtitle),
          standard: tr(s.translations, 'standard', s.standard),
          description: tr(s.translations, 'description', s.description),
          specs: tr(s.translations, 'specs', s.specs),
          commitments: tr(s.translations, 'commitments', s.commitments),
          origin: tr(s.translations, 'origin', s.origin),
          season: tr(s.translations, 'season', s.season),
          packaging: tr(s.translations, 'packaging', s.packaging),
          storage: tr(s.translations, 'storage', s.storage),
          supply_status: tr(s.translations, 'supply_status', s.supply_status),
        };
        return (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#001b0b]/80 px-4 py-8 backdrop-blur-sm sm:px-5"
          onClick={() => setSelected(null)}
        >
          <div
            data-lenis-prevent
            className="relative grid max-h-[92vh] w-full max-w-[1240px] grid-cols-1 gap-8 overflow-y-auto rounded-2xl bg-white p-6 pt-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:grid-cols-[1fr_1.2fr] sm:gap-10 sm:p-9 sm:pt-10"
            style={{ animation: 'ps-fadeUp 380ms cubic-bezier(0.19,1,0.22,1) both' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-[#006400] via-[#87cefa] to-[#fffacd]" />

            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={t('Đóng')}
              className="absolute top-3 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#006400] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-200 hover:scale-110 hover:bg-[#00520a] sm:top-4 sm:right-4"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Ảnh sản phẩm — ảnh lớn + dải thumbnail bấm để đổi ảnh xem */}
            <div className="flex min-w-0 items-center justify-center">
              <ProductGallery key={s.id} product={translated} />
            </div>

            {/* Chi tiết */}
            <div className="flex min-w-0 flex-col">
              <ProductDetailPanel
                product={translated}
                categoryLabel={(() => {
                  const catLabel = CATEGORIES.find((c) => c.id === s.category)?.label;
                  return catLabel ? t(catLabel) : null;
                })()}
                t={t}
              />

              {/* Nút kêu gọi hành động */}
              <div className="mt-auto flex flex-col gap-2.5">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#006400] px-6 py-3 text-sm font-bold text-[#fffacd] shadow-md transition-colors duration-300 hover:bg-[#00520a]"
                >
                  <PhoneIcon /> {t('Liên hệ mua hàng')}
                </Link>
                <button
                  type="button"
                  disabled={pdfLoading}
                  onClick={async () => {
                    setPdfLoading(true);
                    try {
                      await downloadProductPdf(
                        translated,
                        getProductSpecs(translated),
                        translated.commitments?.length
                          ? translated.commitments
                          : QUALITY_COMMITMENTS.map((c) => t(c.label)),
                        getCertBadge(translated, t),
                        (() => {
                          const catLabel = CATEGORIES.find((c) => c.id === s.category)?.label;
                          return catLabel ? t(catLabel) : '';
                        })(),
                        t
                      );
                    } catch (err) {
                      console.error('Không tạo được PDF:', err);
                      window.alert(t('Không thể tạo tài liệu PDF lúc này, vui lòng thử lại.'));
                    } finally {
                      setPdfLoading(false);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-700 transition-colors duration-300 hover:border-[#006400] hover:text-[#006400] disabled:cursor-wait disabled:opacity-60"
                >
                  <DocumentIcon />
                  {pdfLoading ? t('Đang tạo tài liệu…') : t('Tải tài liệu sản phẩm')}
                </button>
                <p className="text-center text-[11px] text-neutral-400">{t('Thời gian phản hồi nhanh trong 24h')}</p>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </section>
  );
}