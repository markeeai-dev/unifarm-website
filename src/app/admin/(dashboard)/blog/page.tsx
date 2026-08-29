import Link from "next/link";
import { Plus } from "lucide-react";
import { sql, type BlogPost } from "@/lib/db";
import BlogList from "@/components/admin/Bloglist";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminBlogListPage() {
  const posts = (await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`) as BlogPost[];

  return (
    <div>
      <PageHeader
        eyebrow="Nội dung"
        title="Quản trị Blog"
        subtitle={`${posts.length} bài viết trên website.`}
        action={
          <Link href="/admin/blog/new" className={buttonClass("primary")}>
            <Plus size={16} /> Bài viết mới
          </Link>
        }
      />

      <BlogList posts={posts} />
    </div>
  );
}
