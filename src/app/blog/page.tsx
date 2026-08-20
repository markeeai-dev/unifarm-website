import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import BlogPageClient from "@/components/blog/Blogpageclient";
import { sql, type BlogPost } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog | Unifarm",
  description:
    "Câu chuyện nông nghiệp công nghệ cao, kiến thức nông sản và cập nhật mới nhất từ Unifarm.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = (await sql`
    SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC
  `) as BlogPost[];

  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <main className="flex-1">
        <BlogPageClient posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
