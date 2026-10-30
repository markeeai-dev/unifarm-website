'use client';

import { useState, type CSSProperties } from 'react';
import { ImageOff } from 'lucide-react';
import type { Product } from '@/lib/db';

/**
 * Phần hiển thị chi tiết sản phẩm dùng chung giữa trang công khai
 * (Productsshowcase.tsx — bảng chi tiết khi bấm vào 1 sản phẩm) và bản
 * xem trước trực tiếp trong trang admin thêm/sửa sản phẩm — CÙNG một
 * component nên hai nơi luôn hiển thị giống hệt nhau, không thể lệch.
 */

export type Category = { id: string; label: string };

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Tất cả sản phẩm' },
  { id: 'fresh', label: 'Trái cây tươi' },
  { id: 'seedling', label: 'Cây giống nuôi cấy mô' },
  { id: 'processed', label: 'Sản phẩm chế biến' },
];

function ShieldCheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FlaskIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 3h6M10 3v6.2L5.5 18a2 2 0 0 0 1.8 2.9h9.4a2 2 0 0 0 1.8-2.9L14 9.2V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function FactoryIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 21V11l6 4v-4l6 4V6l6 4v11H3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export const QUALITY_COMMITMENTS = [
  { icon: ShieldCheckIcon, label: 'Truy xuất nguồn gốc minh bạch' },
  { icon: FlaskIcon, label: 'Kiểm soát dư lượng nghiêm ngặt (MRL)' },
  { icon: FactoryIcon, label: 'Sản xuất trên dây chuyền hiện đại' },
];

type ProductLike = Pick<
  Product,
  | 'id'
  | 'name'
  | 'subtitle'
  | 'standard'
  | 'category'
  | 'description'
  | 'specs'
  | 'commitments'
  | 'image'
  | 'gallery'
  | 'origin'
  | 'season'
  | 'packaging'
  | 'storage'
  | 'supply_status'
>;

/** Nhãn tình trạng cung ứng — màu theo ý nghĩa (đang có hàng / theo mùa vụ /
 * sắp có / tạm hết), chỉ hiển thị khi có dữ liệu thật. */
export function getSupplyStatusTone(status: string): { bg: string; text: string } {
  switch (status) {
    case 'Đang cung ứng':
      return { bg: '#e8f5e9', text: '#1b6b2e' };
    case 'Sắp có hàng':
      return { bg: '#e8f0fe', text: '#1a56b0' };
    case 'Tạm hết hàng':
      return { bg: '#fdeaea', text: '#b3261e' };
    default:
      return { bg: '#fff8e1', text: '#8a6d00' };
  }
}

/** Nhãn chứng nhận/tiêu chuẩn — CHỈ hiển thị khi sản phẩm có `standard` thật
 * do admin nhập (vd. GlobalG.A.P, VietGAP...). Không bịa mặc định theo danh
 * mục: không phải sản phẩm nào cũng có cùng một chứng nhận. Trả về chuỗi
 * rỗng nếu chưa có dữ liệu thật — nơi gọi cần tự ẩn khi rỗng. */
export function getCertBadge(p: Pick<Product, 'standard' | 'category'>, t: (text: string) => string = (s) => s) {
  void t;
  return p.standard || '';
}

/** Bảng thông số kỹ thuật — CHỈ dùng `specs` thật do admin nhập. Không bịa
 * thông số mặc định theo danh mục (vd. "Độ ngọt 13-16", "Mùa vụ: Quanh năm"
 * áp cho mọi sản phẩm) — trả về mảng rỗng nếu chưa có dữ liệu thật, nơi gọi
 * cần tự ẩn bảng khi rỗng. */
export function getProductSpecs(
  p: Pick<Product, 'specs'>
): { label: string; value: string }[] {
  return p.specs && p.specs.length > 0 ? p.specs : [];
}

/** Ảnh an toàn: không có `src` (chưa upload) hoặc URL load lỗi (link hỏng/hết hạn)
 * đều rơi về icon trung tính thay vì để trình duyệt hiện icon ảnh vỡ mặc định. */
export function ProductImage({
  src,
  alt,
  className = '',
  iconSize = 28,
  style,
}: {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: number;
  style?: CSSProperties;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <ImageOff size={iconSize} className="text-neutral-300" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} style={style} onError={() => setBroken(true)} />
  );
}

/** 3 ảnh cho gallery ở bảng chi tiết — dùng `gallery` (ảnh thật) nếu có,
 * ngược lại rơi về ảnh chính + 2 góc chụp demo placeholder. */
export function getGalleryImages(p: Pick<Product, 'gallery' | 'image' | 'id'>): string[] {
  if (p.gallery && p.gallery.length > 0) return p.gallery;
  return [p.image, `https://picsum.photos/seed/${p.id}-alt1/500/500`, `https://picsum.photos/seed/${p.id}-alt2/500/500`];
}

/** Ảnh lớn + dải thumbnail bên dưới, bấm để đổi ảnh xem chính — dùng `key={product.id}`
 * ở nơi gọi để state tự reset về ảnh đầu tiên mỗi khi đổi sản phẩm, không cần effect.
 * Không tự tra dịch (`useLanguage`) — nhận thẳng `product.name` đã được nơi gọi giải
 * quyết trước, nên dùng được cả ở admin (không có LanguageProvider bọc ngoài). */
export function ProductGallery({ product }: { product: Pick<Product, 'gallery' | 'image' | 'id' | 'name'> }) {
  const images = getGalleryImages(product);
  const [active, setActive] = useState(images[0]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="aspect-[16/11] w-full overflow-hidden rounded-xl border border-neutral-100 bg-gradient-to-b from-[#fffacd]/30 to-[#87cefa]/10 p-5 shadow-inner sm:p-6">
        <ProductImage
          key={active}
          src={active}
          alt={product.name}
          className="h-full w-full object-contain"
          style={{ animation: 'ps-fadeUp 320ms ease-out both' }}
          iconSize={40}
        />
      </div>
      <div className="flex items-center gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(src)}
            aria-label={`Xem ảnh ${i + 1}`}
            className={`h-14 w-14 overflow-hidden rounded-lg border-2 p-1 transition-all duration-300 sm:h-16 sm:w-16 ${
              active === src
                ? 'border-[#006400] shadow-[0_4px_14px_rgba(0,100,0,0.25)]'
                : 'border-neutral-200 opacity-70 hover:border-[#87cefa] hover:opacity-100'
            }`}
          >
            <ProductImage src={src} alt="" className="h-full w-full object-contain" iconSize={18} />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Cột "chi tiết" của bảng sản phẩm — nhãn danh mục, tên, tiêu đề phụ,
 * chứng nhận, mô tả, bảng thông số, cam kết chất lượng. Đây chính là phần
 * nội dung dễ gõ sai nhất khi thêm/sửa, nên dùng chung y hệt ở cả trang
 * công khai lẫn bản xem trước trong admin. Không bao gồm các nút hành
 * động (liên hệ/PDF) — đó là hành vi riêng của từng trang gọi tới. */
export function ProductDetailPanel({
  product,
  categoryLabel,
  t = (s: string) => s,
}: {
  product: ProductLike;
  categoryLabel?: string | null;
  t?: (text: string) => string;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      {categoryLabel && (
        <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[#87cefa]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#006400]">
          {categoryLabel}
        </span>
      )}
      <h3 className="uppercase text-xl font-extrabold text-neutral-900 sm:text-2xl">{product.name || '—'}</h3>
      {product.subtitle && <p className="mt-1 text-sm font-semibold text-neutral-500">{product.subtitle}</p>}
      {getCertBadge(product, t) && (
        <p className="mb-4 mt-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006400] sm:text-sm">
          <ShieldCheckIcon className="h-4 w-4" /> {getCertBadge(product, t)}
        </p>
      )}

      <div
        className="prose-product mb-5 text-sm leading-relaxed text-neutral-600"
        dangerouslySetInnerHTML={{ __html: product.description || `<p class="italic text-neutral-400">${t('Chưa có mô tả')}</p>` }}
      />

      <hr className="mb-5 border-neutral-100" />

      {(() => {
        const specRows = getProductSpecs(product);
        if (specRows.length === 0) return null;
        return (
          <>
            <p className="mb-2 text-sm font-bold text-neutral-900">{t('Bảng thông số')}</p>
            <div className="mb-5 overflow-hidden rounded-lg border border-neutral-200">
              <table className="w-full table-fixed text-left text-xs sm:text-sm">
                <tbody>
                  <tr className="bg-[#006400]/5">
                    <th className="w-1/2 px-3 py-2 font-semibold text-neutral-700">{t('Đặc tính')}</th>
                    <th className="px-3 py-2 font-semibold text-neutral-700">{t('Chi tiết sản phẩm')}</th>
                  </tr>
                  {specRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#87cefa]/5'}>
                      <td className="px-3 py-2 text-neutral-500">{row.label}</td>
                      <td className="px-3 py-2 font-medium text-neutral-800">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {(product.origin || product.season || product.packaging || product.storage || product.supply_status) && (
        <div className="mb-5 grid grid-cols-1 gap-x-4 gap-y-2.5 rounded-lg border border-neutral-200 p-3.5 text-xs sm:grid-cols-2 sm:text-sm">
          {product.origin && (
            <p>
              <span className="font-semibold text-neutral-700">{t('Xuất xứ / Vùng trồng')}: </span>
              <span className="text-neutral-600">{product.origin}</span>
            </p>
          )}
          {product.season && (
            <p>
              <span className="font-semibold text-neutral-700">{t('Mùa vụ')}: </span>
              <span className="text-neutral-600">{product.season}</span>
            </p>
          )}
          {product.packaging && (
            <p>
              <span className="font-semibold text-neutral-700">{t('Đóng gói')}: </span>
              <span className="text-neutral-600">{product.packaging}</span>
            </p>
          )}
          {product.storage && (
            <p>
              <span className="font-semibold text-neutral-700">{t('Bảo quản')}: </span>
              <span className="text-neutral-600">{product.storage}</span>
            </p>
          )}
          {product.supply_status && (
            <p className="sm:col-span-2">
              <span className="font-semibold text-neutral-700">{t('Khả năng cung ứng')}: </span>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  backgroundColor: getSupplyStatusTone(product.supply_status).bg,
                  color: getSupplyStatusTone(product.supply_status).text,
                }}
              >
                {t(product.supply_status)}
              </span>
            </p>
          )}
        </div>
      )}

      <p className="mb-3 text-sm font-bold text-neutral-900">{t('Cam kết chất lượng')}</p>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {QUALITY_COMMITMENTS.map((c, i) => (
          <div key={c.label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006400]/10 text-[#006400]">
              <c.icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] leading-snug text-neutral-500">{product.commitments?.[i] ?? t(c.label)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
