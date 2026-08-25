"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, X } from "lucide-react";
import type { Job } from "@/lib/db";
import { SectionCard } from "@/components/admin/DashboardCharts";

type FormValues = {
  title: string;
  level: Job["level"];
  dept: string;
  color: string;
  income: string;
  income_bucket: Job["income_bucket"];
  location: string;
  experience: Job["experience"];
  headcount: number;
  benefit: string;
  deadline_date: string;
  tags: string[];
  status: Job["status"];
  sort_order: number | "";
};

const TAG_SUGGESTIONS = ["HOT", "Không cần kinh nghiệm"];

function toDateInputValue(value: string | Date | null) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10";
const labelClass = "block text-sm font-semibold text-[#06301B]";

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const unusedSuggestions = TAG_SUGGESTIONS.filter((s) => !tags.includes(s));

  return (
    <div>
      <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-lg border border-[#06301B]/15 px-3 py-2 focus-within:border-[#006400] focus-within:ring-4 focus-within:ring-[#006400]/10">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              tag === "HOT" ? "bg-[#FFFACD] text-[#06301B]" : "bg-[#f2f9ee] text-[#006400]"
            }`}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Xoá nhãn ${tag}`}
              className="rounded-full transition-colors hover:text-red-600"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={tags.length === 0 ? "Nhập nhãn rồi nhấn Enter…" : "Thêm nhãn…"}
          className="min-w-[120px] flex-1 border-none bg-transparent py-1 text-sm outline-none"
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400">Gợi ý:</span>
          {unusedSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-full border border-[#06301B]/15 px-2.5 py-0.5 text-xs font-semibold text-[#06301B]/70 transition-colors hover:border-[#006400] hover:text-[#006400]"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobForm({ job }: { job?: Job }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    title: job?.title ?? "",
    level: job?.level ?? "Fresher",
    dept: job?.dept ?? "",
    color: job?.color ?? "#006400",
    income: job?.income ?? "",
    income_bucket: job?.income_bucket ?? "Dưới 8 triệu",
    location: job?.location ?? "",
    experience: job?.experience ?? "Không yêu cầu",
    headcount: job?.headcount ?? 1,
    benefit: job?.benefit ?? "",
    deadline_date: toDateInputValue(job?.deadline_date ?? null),
    tags: job?.tags ?? [],
    status: job?.status ?? "active",
    sort_order: job?.sort_order ?? "",
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
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs";
      const method = job ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          deadline_date: values.deadline_date || null,
          sort_order: values.sort_order === "" ? undefined : Number(values.sort_order),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }
      router.push("/admin/jobs");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    if (!confirm(`Xoá vị trí "${job.title}"? Hành động này không thể hoàn tác.`)) return;
    await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
    router.push("/admin/jobs");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-[#006400]"
      >
        <ArrowLeft size={15} /> Quay lại danh sách
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <SectionCard title="Thông tin cơ bản" sub="Tên vị trí, cấp bậc và phòng ban">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Tên vị trí</label>
              <input
                required
                value={values.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="VD: Kỹ sư nông nghiệp"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Phòng ban</label>
                <input
                  required
                  value={values.dept}
                  onChange={(e) => set("dept", e.target.value)}
                  placeholder="Kinh doanh, Kỹ thuật, Sản xuất, Chất lượng, Marketing, Data..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Địa điểm</label>
                <input
                  required
                  value={values.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Cấp bậc</label>
                <select
                  value={values.level}
                  onChange={(e) => set("level", e.target.value as FormValues["level"])}
                  className={inputClass}
                >
                  <option value="Intern">Intern</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Kinh nghiệm</label>
                <select
                  value={values.experience}
                  onChange={(e) => set("experience", e.target.value as FormValues["experience"])}
                  className={inputClass}
                >
                  <option value="Không yêu cầu">Không yêu cầu</option>
                  <option value="Có kinh nghiệm">Có kinh nghiệm</option>
                </select>
              </div>
            </div>

            <div className="sm:w-1/2 sm:pr-2.5">
              <label className={labelClass}>Số lượng cần tuyển</label>
              <input
                type="number"
                min={1}
                value={values.headcount}
                onChange={(e) => set("headcount", Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Thu nhập & Thời hạn" sub="Mức lương hiển thị công khai và hạn nộp hồ sơ">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Mức thu nhập (hiển thị)</label>
              <input
                value={values.income}
                onChange={(e) => set("income", e.target.value)}
                placeholder="VD: 12 - 18 triệu"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Khoảng thu nhập (lọc)</label>
              <select
                value={values.income_bucket}
                onChange={(e) => set("income_bucket", e.target.value as FormValues["income_bucket"])}
                className={inputClass}
              >
                <option value="Dưới 8 triệu">Dưới 8 triệu</option>
                <option value="8 - 12 triệu">8 - 12 triệu</option>
                <option value="Trên 12 triệu">Trên 12 triệu</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Hạn nộp hồ sơ</label>
              <input
                type="date"
                value={values.deadline_date}
                onChange={(e) => set("deadline_date", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Mô tả & Quyền lợi" sub="Quyền lợi ứng viên và các nhãn nổi bật">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Quyền lợi / mô tả ngắn</label>
              <textarea
                rows={4}
                value={values.benefit}
                onChange={(e) => set("benefit", e.target.value)}
                placeholder={"VD:\n- Lương thưởng cạnh tranh\n- BHXH đầy đủ theo luật lao động\n- Môi trường làm việc chuyên nghiệp"}
                className={`${inputClass} resize-y leading-relaxed`}
              />
              <p className="mt-1.5 text-xs text-gray-400">Mỗi dòng một ý để dễ đọc — ví dụ mỗi quyền lợi trên một dòng riêng.</p>
            </div>
            <div>
              <label className={labelClass}>Nhãn (tags)</label>
              <div className="mt-1.5">
                <TagInput tags={values.tags} onChange={(tags) => set("tags", tags)} />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Trạng thái" sub="Hiển thị, thứ tự sắp xếp và màu badge">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Trạng thái</label>
              <select
                value={values.status}
                onChange={(e) => set("status", e.target.value as FormValues["status"])}
                className={inputClass}
              >
                <option value="active">Đang tuyển</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Thứ tự hiển thị</label>
              <input
                type="number"
                min={1}
                value={values.sort_order}
                onChange={(e) => set("sort_order", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Tự động"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Màu sắc (badge phòng ban)</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(values.color) ? values.color : "#006400"}
                  onChange={(e) => set("color", e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-[#06301B]/15 p-1"
                />
                <input
                  value={values.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="#006400"
                  className="w-full rounded-lg border border-[#06301B]/15 px-3 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
                />
              </div>
            </div>
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
            {saving ? "Đang lưu…" : job ? "Lưu thay đổi" : "Tạo vị trí"}
          </button>

          <Link
            href="/admin/jobs"
            className="rounded-full border border-[#06301B]/15 px-6 py-3 text-sm font-semibold text-[#06301B] transition-colors hover:bg-gray-50"
          >
            Huỷ
          </Link>

          {job && (
            <button
              type="button"
              onClick={handleDelete}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} /> Xoá vị trí
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
