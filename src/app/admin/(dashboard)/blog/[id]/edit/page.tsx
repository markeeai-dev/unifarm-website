import { notFound } from "next/navigation";
import { sql, type BlogPost } from "@/lib/db";
import BlogForm from "@/components/admin/Blogform";
import { FormHeader } from "@/components/admin/ui";

type Params = { params: Promise<{ id: string }> };

export default async function AdminBlogEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM blog_posts WHERE id::text = ${id}`) as BlogPost[];
  const post = rows[0];
  if (!post) notFound();

  return (
    <div>
      <FormHeader backHref="/admin/blog" title="Sửa bài viết" />
      <BlogForm post={post} />
    </div>
  );
}
