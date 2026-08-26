"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Distributor } from "@/lib/db";
import { SectionCard } from "@/components/admin/DashboardCharts";

type FormValues = {
  name: string;
  province: string;
  district: string;
  address: string;
  hours: string;
  phone: string;
  sort_order: number | "";
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10";
const labelClass = "block text-sm font-semibold text-[#06301B]";

export default function DistributorForm({ distributor }: { distributor?: Distributor }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    name: distributor?.name ?? "",
    province: distributor?.province ?? "Hồ Chí Minh",
    district: distributor?.district ?? "",
    address: distributor?.address ?? "",
    hours: distributor?.hours ?? "7:00 - 21:00",
    phone: distributor?.phone ?? "",
    sort_order: distributor?.sort_order ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = distributor ? `/api/distributors/${distributor.id}` : "/api/distributors";
      const method = distributor ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          sort_order: values.sort_order === "" ? undefined : Number(values.sort_order),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }
      router.push("/admin/distributors");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!distributor) return;
    if (!confirm(`Xoá cửa hàng "${distributor.name}"? Hành động này không thể hoàn tác.`)) return;
    await fetch(`/api/distributors/${distributor.id}`, { method: "DELETE" });
    router.push("/admin/distributors");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/distributors"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-[#006400]"
      >
        <ArrowLeft size={15} /> Quay lại danh sách
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <SectionCard title="Thông tin cửa hàng" sub="Tên và vị trí hành chính">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Tên cửa hàng</label>
              <input
                required
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="VD: Cửa hàng Thuận Giao"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tỉnh/TP</label>
                <input
                  required
                  value={values.province}
                  onChange={(e) => set("province", e.target.value)}
                  placeholder="VD: Hồ Chí Minh"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Quận/Huyện</label>
                <input
                  required
                  value={values.district}
                  onChange={(e) => set("district", e.target.value)}
                  placeholder="VD: Thuận An"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Địa chỉ & Liên hệ" sub="Hiển thị công khai trên trang Hệ thống phân phối">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Địa chỉ</label>
              <input
                required
                value={values.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="VD: 12 Đường ĐT743, P. Thuận Giao"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Giờ hoạt động</label>
                <input
                  value={values.hours}
                  onChange={(e) => set("hours", e.target.value)}
                  placeholder="VD: 7:00 - 21:00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Số điện thoại</label>
                <input
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="VD: 0274 3 771 234"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Thứ tự hiển thị" sub="Để trống để tự động xếp cuối danh sách">
          <div className="sm:w-1/2 sm:pr-2.5">
            <label className={labelClass}>Thứ tự</label>
            <input
              type="number"
              min={1}
              value={values.sort_order}
              onChange={(e) => set("sort_order", e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Tự động"
              className={inputClass}
            />
          </div>
        </SectionCard>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#006400] px-7 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00] disabled:opacity-60"
          >
            {saving ? "Đang lưu…" : distributor ? "Lưu thay đổi" : "Tạo cửa hàng"}
          </button>

          <Link
            href="/admin/distributors"
            className="rounded-full border border-[#06301B]/15 px-6 py-3 text-sm font-semibold text-[#06301B] transition-colors hover:bg-gray-50"
          >
            Huỷ
          </Link>

          {distributor && (
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} /> Xoá cửa hàng
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
