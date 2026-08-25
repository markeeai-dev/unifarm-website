import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { sql, type BlogPost } from "@/lib/db";
import BlogForm from "@/components/admin/Blogform";

type Params = { params: Promise<{ id: string }> };

export default async function AdminBlogEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM blog_posts WHERE id::text = ${id}`) as BlogPost[];
  const post = rows[0];
  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006400] hover:underline"
      >
        <ArrowLeft size={15} /> Quay lại danh sách
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-extrabold text-[#06301B]">Sửa bài viết</h1>
      <BlogForm post={post} />
    </div>
  );
}
