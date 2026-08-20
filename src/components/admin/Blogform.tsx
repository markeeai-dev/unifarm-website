"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/db";

type FormValues = {
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  cover_image: string;
  author: string;
  status: "draft" | "published";
  is_featured: boolean;
};

export default function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    tag: post?.tag ?? "Tin tức",
    cover_image: post?.cover_image ?? "",
    author: post?.author ?? "Unifarm",
    status: post?.status ?? "draft",
    is_featured: post?.is_featured ?? false,
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
      const url = post ? `/api/blogs/${post.id}` : "/api/blogs";
      const method = post ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm(`Xoá bài viết "${post.title}"? Hành động này không thể hoàn tác.`)) return;
    await fetch(`/api/blogs/${post.id}`, { method: "DELETE" });
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[#06301B]">Tiêu đề</label>
        <input
          required
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#06301B]">Mô tả ngắn (excerpt)</label>
        <textarea
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          className="mt-1.5 w-full resize-none rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#06301B]">
          Nội dung (mỗi đoạn cách nhau 1 dòng trống)
        </label>
        <textarea
          required
          rows={14}
          value={values.content}
          onChange={(e) => set("content", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm leading-relaxed outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[#06301B]">Chuyên mục (tag)</label>
          <input
            value={values.tag}
            onChange={(e) => set("tag", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#06301B]">Tác giả</label>
          <input
            value={values.author}
            onChange={(e) => set("author", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#06301B]">Ảnh bìa (URL)</label>
        <input
          value={values.cover_image}
          onChange={(e) => set("cover_image", e.target.value)}
          placeholder="https://..."
          className="mt-1.5 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="block text-sm font-semibold text-[#06301B]">Trạng thái</label>
          <select
            value={values.status}
            onChange={(e) => set("status", e.target.value as FormValues["status"])}
            className="mt-1.5 rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
          >
            <option value="draft">Nháp</option>
            <option value="published">Đăng ngay</option>
          </select>
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium text-[#06301B]">
          <input
            type="checkbox"
            checked={values.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
            className="h-4 w-4 accent-[#006400]"
          />
          Bài nổi bật
        </label>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#006400] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#004d00] disabled:opacity-60"
        >
          {saving ? "Đang lưu…" : post ? "Lưu thay đổi" : "Tạo bài viết"}
        </button>

        {post && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Xoá bài viết
          </button>
        )}
      </div>
    </form>
  );
}
