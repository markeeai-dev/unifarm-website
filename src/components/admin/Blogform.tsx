"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import type { BlogPost } from "@/lib/db";
import { TAG_OPTIONS } from "@/lib/blog-tags";
import { SingleImageUploader } from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card, Field, FormActions, inputClass } from "@/components/admin/ui";
import BlogDetailClient from "@/components/blog/Blogdetailclient";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

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
    tag: post?.tag ?? TAG_OPTIONS[0],
    cover_image: post?.cover_image ?? "",
    author: post?.author ?? "Unifarm",
    status: post?.status ?? "draft",
    is_featured: post?.is_featured ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  // Bài giả lập để xem trước — dùng ĐÚNG component hiển thị thật của trang
  // /blog/[slug] (BlogDetailClient), không viết lại giao diện riêng, nên xem
  // trước luôn khớp 100% với bài thật khi đăng. Giữ nguyên `translations` cũ
  // (nếu có) để không hiện lẫn bản dịch cũ với nội dung tiếng Việt vừa sửa.
  const previewPost: BlogPost = {
    id: post?.id ?? "preview",
    slug: post?.slug ?? "xem-truoc",
    title: values.title || "(Chưa có tiêu đề)",
    excerpt: values.excerpt,
    content: values.content || "<p>(Chưa có nội dung)</p>",
    tag: values.tag,
    cover_image: values.cover_image,
    author: values.author || "Unifarm",
    translations: post?.translations ?? null,
    status: values.status,
    is_featured: values.is_featured,
    view_count: post?.view_count ?? 0,
    published_at: post?.published_at ?? new Date().toISOString(),
    created_at: post?.created_at ?? new Date().toISOString(),
    updated_at: post?.updated_at ?? new Date().toISOString(),
  };

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
    setDeleting(true);
    try {
      await fetch(`/api/blogs/${post.id}`, { method: "DELETE" });
      router.push("/admin/blog");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5">
      <Card title="Thông tin cơ bản">
        <Field label="Tiêu đề" required>
          <input
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Tiêu đề bài viết"
            className={inputClass}
          />
          {post ? (
            <p className="mt-1.5 text-xs text-gray-400">
              Đường dẫn: <span className="font-mono text-[#06301B]/70">/blog/{post.slug}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-400">Đường dẫn (slug) sẽ được tự động tạo từ tiêu đề.</p>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Chuyên mục">
            <select value={values.tag} onChange={(e) => set("tag", e.target.value)} className={inputClass}>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tác giả">
            <input value={values.author} onChange={(e) => set("author", e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Field label="Trạng thái">
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value as FormValues["status"])}
              className={inputClass}
            >
              <option value="draft">Nháp</option>
              <option value="published">Đăng ngay</option>
            </select>
          </Field>

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
      </Card>

      <Card title="Ảnh bìa" hint="Ảnh hiển thị ở trang danh sách và đầu trang chi tiết bài viết.">
        <SingleImageUploader
          value={values.cover_image}
          onChange={(url) => set("cover_image", url)}
          aspect="aspect-video"
        />
      </Card>

      <Card title="Nội dung">
        <Field label="Mô tả ngắn (excerpt)">
          <textarea
            rows={2}
            value={values.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Tóm tắt ngắn gọn hiển thị ở danh sách bài viết..."
            className={`${inputClass} resize-none`}
          />
        </Field>

        <RichTextEditor
          value={values.content}
          onChange={(html) => set("content", html)}
          label="Nội dung bài viết"
          minHeight={320}
          required
        />
      </Card>

      <Card
        icon={<Eye size={18} strokeWidth={2} />}
        title="Xem trước trên website"
        hint="Đúng giao diện sẽ hiển thị ở trang chi tiết bài viết — kiểm tra kỹ trước khi lưu/đăng để tránh phải sửa lại sau khi lên trang chính."
      >
        <div className="max-h-[80vh] overflow-y-auto rounded-xl border border-dashed border-[#06301B]/15 bg-neutral-50">
          <LanguageProvider>
            <BlogDetailClient post={previewPost} related={[]} />
          </LanguageProvider>
        </div>
      </Card>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>}

      <FormActions
        cancelHref="/admin/blog"
        saving={saving}
        submitLabel={post ? "Lưu thay đổi" : "Tạo bài viết"}
        onDelete={post ? handleDelete : undefined}
        deleting={deleting}
        deleteLabel="Xoá bài viết"
      />
    </form>
  );
}
