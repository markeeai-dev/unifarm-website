import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Search } from "lucide-react";

/** Class dùng chung cho input/textarea/select trong mọi form admin — kết
 * hợp với `Field` (đã có margin-top riêng nên input KHÔNG tự thêm mt). */
export const inputClass =
  "w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10";
export const labelClass = "block text-sm font-semibold text-[#06301B]";

/** Header của các trang danh sách (Blog/Sản phẩm/Tuyển dụng/...) — eyebrow +
 * tiêu đề + mô tả + nút hành động chính, đồng nhất cho cả 5 khu vực. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#06301B]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Header của các trang thêm/sửa — link quay lại + tiêu đề, đồng nhất cho
 * cả 5 khu vực (trước đây chỉ Blog có link quay lại). */
export function FormHeader({
  backHref,
  backLabel = "Quay lại danh sách",
  title,
}: {
  backHref: string;
  backLabel?: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-[#006400]"
      >
        <ArrowLeft size={15} /> {backLabel}
      </Link>
      <h1 className="text-2xl font-extrabold text-[#06301B]">{title}</h1>
    </div>
  );
}

/** Khối "thẻ" bọc 1 nhóm trường trong form — thay cho 4 biến thể cục bộ
 * (Sec/Card của Product/Blog/Timeline/Job/Distributor). */
export function Card({
  icon,
  title,
  hint,
  action,
  children,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f2f9ee] text-[#006400]">
              {icon}
            </span>
          )}
          <div>
            <h2 className="text-[15px] font-extrabold text-[#06301B]">{title}</h2>
            {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

/** Label + (hint tuỳ chọn) + control — dùng cùng 1 khoảng cách cho mọi form. */
export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-[#006400]">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-[#006400] px-7 py-3 text-white shadow-sm hover:bg-[#004d00]",
  secondary: "border border-[#06301B]/15 px-6 py-3 text-[#06301B] hover:bg-gray-50",
  danger: "border border-red-200 px-6 py-3 text-red-600 hover:bg-red-50",
  ghost: "px-0 py-0 text-gray-500 hover:text-[#006400]",
};

/** Class cho các nút render bằng `<Link>` (VD: nút "Huỷ" quay lại danh sách),
 * để trông giống hệt `<Button>` mà không cần bọc thêm component. */
export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-bold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASS[variant]} ${extra}`.trim();
}

export function Button({
  variant = "primary",
  loading,
  loadingLabel,
  className,
  disabled,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  loading?: boolean;
  loadingLabel?: ReactNode;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} disabled={disabled || loading} className={buttonClass(variant, className)}>
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" /> {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Thanh nút hành động cuối form: Lưu (spinner khi đang lưu) + Huỷ (quay
 * lại danh sách) + Xoá (nếu đang sửa, spinner khi đang xoá) — cùng 1 bố cục
 * cho cả 5 form thay vì mỗi form tự dựng một kiểu. */
export function FormActions({
  cancelHref,
  saving,
  submitLabel,
  savingLabel = "Đang lưu…",
  onDelete,
  deleting,
  deleteLabel = "Xoá",
  deletingLabel = "Đang xoá…",
}: {
  cancelHref: string;
  saving: boolean;
  submitLabel: string;
  savingLabel?: string;
  onDelete?: () => void;
  deleting?: boolean;
  deleteLabel?: string;
  deletingLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <Button type="submit" variant="primary" loading={saving} loadingLabel={savingLabel}>
        {submitLabel}
      </Button>
      <Link href={cancelHref} className={buttonClass("secondary")}>
        Huỷ
      </Link>
      {onDelete && (
        <Button
          type="button"
          variant="danger"
          loading={deleting}
          loadingLabel={deletingLabel}
          onClick={onDelete}
          className="sm:ml-auto"
        >
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}

/** Ô tìm kiếm dạng pill dùng chung cho mọi toolbar danh sách. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full sm:max-w-xs ${className ?? ""}`}>
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
      />
    </div>
  );
}

/** Khối "chưa có gì" dùng chung cho mọi danh sách rỗng. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-black/5 bg-white p-12 text-center shadow-sm">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
