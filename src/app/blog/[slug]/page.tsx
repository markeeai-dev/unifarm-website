import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import BlogDetailClient from "@/components/blog/Blogdetailclient";
import { sql, type BlogPost } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const rows = (await sql`
    SELECT * FROM blog_posts WHERE slug = ${slug} AND status = 'published'
  `) as BlogPost[];
  return rows[0] ?? null;
}

async function getRelated(post: BlogPost) {
  const rows = (await sql`
    SELECT * FROM blog_posts
    WHERE status = 'published' AND tag = ${post.tag} AND id != ${post.id}
    ORDER BY published_at DESC
    LIMIT 3
  `) as BlogPost[];
  return rows;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Bài viết không tồn tại | Unifarm" };
  return {
    title: `${post.title} | Unifarm Blog`,
    description: post.excerpt || undefined,
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(post);

  sql`UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ${post.id}`.catch(() => {});

  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <main className="flex-1">
        <BlogDetailClient post={post} related={related} />
      </main>
      <Footer />
    </div>
  );
}
