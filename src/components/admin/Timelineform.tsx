"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import type { TimelineMilestone, SpecField } from "@/lib/db";
import { SingleImageUploader } from "@/components/admin/ImageUploader";
import {
  TIMELINE_ICON_OPTIONS,
  TIMELINE_ICON_MAP,
  DEFAULT_TIMELINE_ICON,
} from "@/lib/timeline-icons";
import { Card, Field, FormActions, inputClass } from "@/components/admin/ui";

type MediaItem = { label: string; video: string };

type FormValues = {
  year: string;
  caption: string;
  icon: string;
  image: string;
  stat: SpecField[];
  partner_title: string;
  partner_bullets: string[];
  media: MediaItem[];
  bottom: string[];
  sort_order: number;
};

const MIN_MEDIA_ROWS = 2;

/** Danh sách 1 dòng/mục có thể thêm/xoá — dùng cho partner_bullets và bottom. */
function DynamicListField({
  items,
  onChange,
  placeholder,
  addLabel,
  minRows = 0,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel: string;
  minRows?: number;
}) {
  const setAt = (i: number, value: string) =>
    onChange(items.map((it, idx) => (idx === i ? value : it)));
  const addRow = () => onChange([...items, ""]);
  const removeRow = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <input
            value={item}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            disabled={items.length <= minRows}
            aria-label="Xoá dòng"
            className="shrink-0 rounded-full border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#06301B]/15 px-4 py-2 text-xs font-semibold text-[#06301B]/70 transition-colors hover:bg-[#06301B]/5"
      >
        <Plus size={13} strokeWidth={2.5} /> {addLabel}
      </button>
    </div>
  );
}

export default function TimelineForm({ milestone }: { milestone?: TimelineMilestone }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    year: milestone?.year ?? "",
    caption: milestone?.caption ?? "",
    icon: milestone?.icon ?? DEFAULT_TIMELINE_ICON,
    image: milestone?.image ?? "",
    stat: milestone?.stat && milestone.stat.length > 0 ? milestone.stat : [{ label: "", value: "" }],
    partner_title: milestone?.partner_title ?? "",
    partner_bullets:
      milestone?.partner_bullets && milestone.partner_bullets.length > 0
        ? milestone.partner_bullets
        : [""],
    media:
      milestone?.media && milestone.media.length >= MIN_MEDIA_ROWS
        ? milestone.media
        : [
            { label: "", video: "" },
            { label: "", video: "" },
          ],
    bottom: milestone?.bottom && milestone.bottom.length > 0 ? milestone.bottom : [""],
    sort_order: milestone?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setStat = (index: number, key: keyof SpecField, value: string) =>
    setValues((v) => ({
      ...v,
      stat: v.stat.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));

  const addStat = () =>
    setValues((v) => ({ ...v, stat: [...v.stat, { label: "", value: "" }] }));

  const removeStat = (index: number) =>
    setValues((v) => ({ ...v, stat: v.stat.filter((_, i) => i !== index) }));

  const setMedia = (index: number, key: keyof MediaItem, value: string) =>
    setValues((v) => ({
      ...v,
      media: v.media.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    }));

  const addMedia = () =>
    setValues((v) => ({ ...v, media: [...v.media, { label: "", video: "" }] }));

  const removeMedia = (index: number) =>
    setValues((v) => ({ ...v, media: v.media.filter((_, i) => i !== index) }));

  const resolvedIcon = TIMELINE_ICON_MAP[values.icon];
  const PreviewIcon = resolvedIcon ?? TIMELINE_ICON_MAP[DEFAULT_TIMELINE_ICON];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        year: values.year,
        caption: values.caption,
        icon: values.icon,
        image: values.image,
        stat: values.stat.filter((s) => s.label.trim() || s.value.trim()),
        partner_title: values.partner_title,
        partner_bullets: values.partner_bullets.map((s) => s.trim()).filter(Boolean),
        media: values.media,
        bottom: values.bottom.map((s) => s.trim()).filter(Boolean),
        sort_order: values.sort_order,
      };

      const url = milestone ? `/api/timeline/${milestone.id}` : "/api/timeline";
      const method = milestone ? "PATCH" : "POST";
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
      router.push("/admin/timeline");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!milestone) return;
    if (!confirm(`Xoá mốc "${milestone.caption}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/timeline/${milestone.id}`, { method: "DELETE" });
      router.push("/admin/timeline");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
      <Card title="Thông tin mốc">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Năm" required>
            <input
              required
              value={values.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="VD: 2009–2010 hoặc Hiện nay"
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

        <Field label="Tên mốc (caption)" required>
          <input
            required
            value={values.caption}
            onChange={(e) => set("caption", e.target.value)}
            placeholder="VD: Khởi đầu"
            className={inputClass}
          />
        </Field>

        <Field label="Icon" hint="Chọn icon minh hoạ hiển thị trên dòng thời gian ở trang Giới thiệu.">
          <div className="flex flex-wrap gap-2">
            {TIMELINE_ICON_OPTIONS.map(({ value, label, Icon }) => {
              const active = values.icon === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("icon", value)}
                  title={label}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? "border-[#006400] bg-[#006400] text-white shadow-sm"
                      : "border-[#06301B]/15 bg-white text-[#06301B]/70 hover:border-[#006400]/40 hover:text-[#006400]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-[#06301B]/15 bg-[#f2f9ee] px-4 py-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#06301B] text-white">
              <PreviewIcon size={20} strokeWidth={1.8} />
            </span>
            <div className="text-xs">
              <p className="font-semibold text-[#06301B]">
                Xem trước: <span className="font-mono">{values.icon || DEFAULT_TIMELINE_ICON}</span>
              </p>
              {!resolvedIcon && (
                <p className="mt-0.5 text-amber-600">
                  Icon này không nằm trong danh sách hợp lệ — trang Giới thiệu sẽ tự dùng icon mặc định
                  (Sprout) thay thế.
                </p>
              )}
            </div>
          </div>
        </Field>
      </Card>

      <Card title="Ảnh & Thống kê">
        <Field label="Ảnh trung tâm" hint="Ảnh nền hiển thị phía sau icon của mốc đang chọn.">
          <SingleImageUploader
            value={values.image}
            onChange={(url) => set("image", url)}
            aspect="aspect-video"
          />
        </Field>

        <Field label="Chỉ số (stat)" hint="Các chỉ số nổi bật hiển thị bên cạnh thẻ mốc, VD: Vốn đầu tư — 500 tỷ.">
          <div className="space-y-2.5">
            {values.stat.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <input
                  value={s.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  placeholder="Nhãn"
                  className={`w-1/2 ${inputClass}`}
                />
                <input
                  value={s.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  placeholder="Giá trị"
                  className={`w-1/2 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  disabled={values.stat.length <= 1}
                  aria-label="Xoá dòng"
                  className="shrink-0 rounded-full border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStat}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#06301B]/15 px-4 py-2 text-xs font-semibold text-[#06301B]/70 transition-colors hover:bg-[#06301B]/5"
          >
            <Plus size={13} strokeWidth={2.5} /> Thêm chỉ số
          </button>
        </Field>
      </Card>

      <Card title="Đối tác">
        <Field label="Tiêu đề khối đối tác">
          <input
            value={values.partner_title}
            onChange={(e) => set("partner_title", e.target.value)}
            placeholder="VD: Khởi đầu"
            className={inputClass}
          />
        </Field>

        <Field label="Nội dung khối đối tác" hint="Mỗi dòng là một ý — thêm/xoá dòng tự do.">
          <DynamicListField
            items={values.partner_bullets}
            onChange={(items) => set("partner_bullets", items)}
            placeholder="VD: Hợp tác với 12 hộ nông dân đầu tiên"
            addLabel="Thêm ý"
            minRows={1}
          />
        </Field>
      </Card>

      <Card
        title="Media"
        hint={`Video minh hoạ hiển thị dạng thẻ trên trang Giới thiệu — cần tối thiểu ${MIN_MEDIA_ROWS} video.`}
      >
        <div className="space-y-3">
          {values.media.map((m, i) => (
            <div key={i} className="rounded-lg border border-[#06301B]/15 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#06301B]/50">
                  Video {i + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeMedia(i)}
                  disabled={values.media.length <= MIN_MEDIA_ROWS}
                  aria-label="Xoá video"
                  className="shrink-0 rounded-full border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input
                  value={m.label}
                  onChange={(e) => setMedia(i, "label", e.target.value)}
                  placeholder="Nhãn (VD: Nhà máy sơ chế)"
                  className={inputClass}
                />
                <input
                  value={m.video}
                  onChange={(e) => setMedia(i, "video", e.target.value)}
                  placeholder="/videos/ten-video.mp4 hoặc link YouTube"
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMedia}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#06301B]/15 px-4 py-2 text-xs font-semibold text-[#06301B]/70 transition-colors hover:bg-[#06301B]/5"
        >
          <Plus size={13} strokeWidth={2.5} /> Thêm video
        </button>
      </Card>

      <Card title="Ghi chú thêm">
        <Field label="Khối tổng kết cuối card" hint="Mỗi dòng là một ghi chú, khuyến nghị 2–5 dòng.">
          <DynamicListField
            items={values.bottom}
            onChange={(items) => set("bottom", items)}
            placeholder="VD: Doanh thu tăng trưởng 35% mỗi năm"
            addLabel="Thêm ghi chú"
            minRows={1}
          />
        </Field>
      </Card>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>}

      <FormActions
        cancelHref="/admin/timeline"
        saving={saving}
        submitLabel={milestone ? "Lưu thay đổi" : "Tạo mốc mới"}
        onDelete={milestone ? handleDelete : undefined}
        deleting={deleting}
        deleteLabel="Xoá mốc"
      />
    </form>
  );
}
