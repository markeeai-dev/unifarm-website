import Link from "next/link";
import { Plus } from "lucide-react";
import { sql, type BlogPost } from "@/lib/db";
import BlogList from "@/components/admin/Bloglist";

export default async function AdminBlogListPage() {
  const posts = (await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`) as BlogPost[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">Nội dung</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#06301B]">Quản trị Blog</h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} bài viết trên website.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
        >
          <Plus size={16} /> Bài viết mới
        </Link>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
