"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Image as ImageIcon, FileText, ListChecks, ShieldCheck, Trash2, Plus } from "lucide-react";
import type { Product, SpecField } from "@/lib/db";
import { SingleImageUploader, GalleryUploader } from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card, Field, FormActions, inputClass, labelClass } from "@/components/admin/ui";

type FormValues = {
  name: string;
  category: Product["category"];
  type: Product["type"];
  price: number;
  subtitle: string;
  standard: string;
  image: string;
  gallery: string[];
  description: string;
  specs: SpecField[];
  commitments: string;
  sort_order: number;
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    name: product?.name ?? "",
    category: product?.category ?? "fresh",
    type: product?.type ?? "other",
    price: product?.price ?? 0,
    subtitle: product?.subtitle ?? "",
    standard: product?.standard ?? "",
    image: product?.image ?? "",
    gallery: product?.gallery ?? [],
    description: product?.description ?? "",
    specs: product?.specs ?? [],
    commitments: product?.commitments?.join("\n") ?? "",
    sort_order: product?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setSpec = (index: number, key: keyof SpecField, value: string) =>
    setValues((v) => ({
      ...v,
      specs: v.specs.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));

  const addSpec = () =>
    setValues((v) => ({ ...v, specs: [...v.specs, { label: "", value: "" }] }));

  const removeSpec = (index: number) =>
    setValues((v) => ({ ...v, specs: v.specs.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        category: values.category,
        type: values.type,
        price: values.price,
        subtitle: values.subtitle,
        standard: values.standard,
        image: values.image,
        gallery: values.gallery,
        description: values.description,
        specs: values.specs,
        commitments: values.commitments
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        sort_order: values.sort_order,
      };

      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm(`Xoá sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
      <Card icon={<Info size={18} strokeWidth={2} />} title="Thông tin cơ bản">
        <Field label="Tên sản phẩm">
          <input required value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Danh mục">
            <select
              value={values.category}
              onChange={(e) => set("category", e.target.value as FormValues["category"])}
              className={inputClass}
            >
              <option value="fresh">Trái cây tươi</option>
              <option value="seedling">Cây giống nuôi cấy mô</option>
              <option value="processed">Sản phẩm chế biến</option>
            </select>
          </Field>
          <Field label="Loại (quick-filter)">
            <select
              value={values.type}
              onChange={(e) => set("type", e.target.value as FormValues["type"])}
              className={inputClass}
            >
              <option value="banana">Chuối</option>
              <option value="pineapple">Dứa</option>
              <option value="melon">Dưa lưới</option>
              <option value="other">Khác</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Giá">
            <input
              type="number"
              value={values.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Thứ tự hiển thị" hint="Để trống hoặc 0 để tự xuống cuối">
            <input
              type="number"
              value={values.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Tiêu đề phụ">
          <input
            value={values.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="VD: Giòn xốp tự nhiên, Hương vị đậm đà"
            className={inputClass}
          />
        </Field>

        <Field label="Nhãn chứng nhận">
          <input
            value={values.standard}
            onChange={(e) => set("standard", e.target.value)}
            placeholder="VD: Đạt tiêu chuẩn xuất khẩu — để trống sẽ dùng nhãn mặc định theo danh mục"
            className={inputClass}
          />
        </Field>
      </Card>

      <Card icon={<ImageIcon size={18} strokeWidth={2} />} title="Hình ảnh">
        <SingleImageUploader
          value={values.image}
          onChange={(url) => set("image", url)}
          label="Ảnh chính"
          hint="Ảnh đại diện hiển thị ở danh sách và thẻ sản phẩm."
          aspect="aspect-[4/3]"
        />
        <div>
          <label className={labelClass}>Thư viện ảnh</label>
          <div className="mt-1.5">
            <GalleryUploader value={values.gallery} onChange={(urls) => set("gallery", urls)} />
          </div>
        </div>
      </Card>

      <Card icon={<FileText size={18} strokeWidth={2} />} title="Nội dung">
        <RichTextEditor
          value={values.description}
          onChange={(html) => set("description", html)}
          label="Mô tả sản phẩm"
          minHeight={260}
          required
        />
      </Card>

      <Card icon={<ListChecks size={18} strokeWidth={2} />} title="Bảng thông số">
        <div className="space-y-2.5">
          {values.specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <input
                value={spec.label}
                onChange={(e) => setSpec(i, "label", e.target.value)}
                placeholder="Nhãn"
                className={`w-1/2 ${inputClass}`}
              />
              <input
                value={spec.value}
                onChange={(e) => setSpec(i, "value", e.target.value)}
                placeholder="Giá trị"
                className={`w-1/2 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                aria-label="Xoá dòng"
                className="shrink-0 rounded-full border border-red-200 p-2.5 text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSpec}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#06301B]/15 px-4 py-2 text-xs font-semibold text-[#06301B]/70 transition-colors hover:bg-[#06301B]/5"
        >
          <Plus size={13} /> Thêm thông số
        </button>
      </Card>

      <Card icon={<ShieldCheck size={18} strokeWidth={2} />} title="Cam kết chất lượng" hint="Mỗi dòng 1 cam kết, tối đa 3 dòng">
        <textarea
          rows={3}
          value={values.commitments}
          onChange={(e) => set("commitments", e.target.value)}
          placeholder={"Truy xuất nguồn gốc minh bạch\nKiểm soát dư lượng nghiêm ngặt (MRL)\nSản xuất trên dây chuyền hiện đại"}
          className={inputClass}
        />
      </Card>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>}

      <FormActions
        cancelHref="/admin/products"
        saving={saving}
        submitLabel={product ? "Lưu thay đổi" : "Tạo sản phẩm"}
        onDelete={product ? handleDelete : undefined}
        deleting={deleting}
        deleteLabel="Xoá sản phẩm"
      />
    </form>
  );
}
