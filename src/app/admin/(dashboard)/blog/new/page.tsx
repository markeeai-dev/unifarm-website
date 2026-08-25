import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/components/admin/Blogform";

export default function AdminBlogNewPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006400] hover:underline"
      >
        <ArrowLeft size={15} /> Quay lại danh sách
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-extrabold text-[#06301B]">Bài viết mới</h1>
      <BlogForm />
    </div>
  );
}
