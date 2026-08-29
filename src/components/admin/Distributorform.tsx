"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Distributor } from "@/lib/db";
import { Card, Field, FormActions, inputClass } from "@/components/admin/ui";

type FormValues = {
  name: string;
  province: string;
  district: string;
  address: string;
  hours: string;
  phone: string;
  sort_order: number | "";
};

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
  const [deleting, setDeleting] = useState(false);
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
    setDeleting(true);
    try {
      await fetch(`/api/distributors/${distributor.id}`, { method: "DELETE" });
      router.push("/admin/distributors");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
      <Card title="Thông tin cửa hàng" hint="Tên và vị trí hành chính">
        <Field label="Tên cửa hàng">
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="VD: Cửa hàng Thuận Giao"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Tỉnh/TP">
            <input
              required
              value={values.province}
              onChange={(e) => set("province", e.target.value)}
              placeholder="VD: Hồ Chí Minh"
              className={inputClass}
            />
          </Field>
          <Field label="Quận/Huyện">
            <input
              required
              value={values.district}
              onChange={(e) => set("district", e.target.value)}
              placeholder="VD: Thuận An"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Địa chỉ & Liên hệ" hint="Hiển thị công khai trên trang Hệ thống phân phối">
        <Field label="Địa chỉ">
          <input
            required
            value={values.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="VD: 12 Đường ĐT743, P. Thuận Giao"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Giờ hoạt động">
            <input
              value={values.hours}
              onChange={(e) => set("hours", e.target.value)}
              placeholder="VD: 7:00 - 21:00"
              className={inputClass}
            />
          </Field>
          <Field label="Số điện thoại">
            <input
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="VD: 0274 3 771 234"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card title="Thứ tự hiển thị" hint="Để trống để tự động xếp cuối danh sách">
        <div className="sm:w-1/2 sm:pr-2.5">
          <Field label="Thứ tự">
            <input
              type="number"
              min={1}
              value={values.sort_order}
              onChange={(e) => set("sort_order", e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Tự động"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>}

      <FormActions
        cancelHref="/admin/distributors"
        saving={saving}
        submitLabel={distributor ? "Lưu thay đổi" : "Tạo cửa hàng"}
        onDelete={distributor ? handleDelete : undefined}
        deleting={deleting}
        deleteLabel="Xoá cửa hàng"
      />
    </form>
  );
}
