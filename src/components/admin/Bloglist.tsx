"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Eye, Pencil, Trash2, ImageOff, Star } from "lucide-react";
import type { BlogPost } from "@/lib/db";
import { TAG_COLOR, DEFAULT_TAG_COLOR } from "@/lib/blog-tags";

type StatusFilter = "all" | "draft" | "published";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function BlogList({ posts: initialPosts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesSearch = !q || p.title.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Xoá bài viết "${post.title}"? Hành động này không thể hoàn tác.`)) return;
    setDeletingId(post.id);
    try {
      const res = await fetch(`/api/blogs/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Toolbar: search + status filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
          />
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white p-1">
          {(
            [
              ["all", "Tất cả"],
              ["published", "Đã đăng"],
              ["draft", "Nháp"],
            ] as [StatusFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === value ? "bg-[#006400] text-white" : "text-[#06301B]/60 hover:bg-[#f2f9ee]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            {posts.length === 0 ? "Chưa có bài viết nào." : "Không tìm thấy bài viết phù hợp."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => {
            const tc = TAG_COLOR[post.tag] ?? DEFAULT_TAG_COLOR;
            return (
              <div
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageOff size={26} className="text-gray-300" />
                    </div>
                  )}
                  <span
                    className="absolute left-2.5 top-2.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm"
                    style={{ background: tc.bg, color: tc.text }}
                  >
                    {post.tag}
                  </span>
                  <span
                    className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${
                      post.status === "published" ? "bg-[#f2f9ee] text-[#006400]" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {post.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                  {post.is_featured && (
                    <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
                      <Star size={10} className="fill-[#FFFACD] text-[#FFFACD]" /> Nổi bật
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-[#06301B]">
                    {post.title}
                  </h3>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-gray-400">
                    <span className="truncate font-medium">{post.author}</span>
                    <span className="inline-flex shrink-0 items-center gap-1">
                      <Eye size={12} /> {(post.view_count || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {post.status === "published" ? formatDate(post.published_at) : formatDate(post.created_at)}
                  </div>

                  <div className="mt-3.5 flex items-center gap-2 border-t border-black/5 pt-3.5">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f2f9ee] px-3 py-2 text-xs font-bold text-[#006400] transition-colors hover:bg-[#006400] hover:text-white"
                    >
                      <Pencil size={12} /> Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post.id}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={12} /> {deletingId === post.id ? "Đang xoá…" : "Xoá"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
