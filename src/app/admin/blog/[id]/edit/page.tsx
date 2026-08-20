import { redirect, notFound } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { sql, type BlogPost } from "@/lib/db";
import BlogForm from "@/components/admin/Blogform";

type Params = { params: Promise<{ id: string }> };

export default async function AdminBlogEditPage({ params }: Params) {
  if (!(await isAdminAuthed())) redirect("/admin/blog/login");

  const { id } = await params;
  const rows = (await sql`SELECT * FROM blog_posts WHERE id::text = ${id}`) as BlogPost[];
  const post = rows[0];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-5 py-10 sm:px-8">
      <h1 className="mx-auto mb-8 max-w-3xl text-2xl font-extrabold text-[#06301B]">
        Sửa bài viết
      </h1>
      <BlogForm post={post} />
    </div>
  );
}
