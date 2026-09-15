import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";
import { siteConfig } from "@/config/site";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/gioi-thieu", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/san-pham", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/dich-vu", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/du-an-hop-tac", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/he-thong-phan-phoi", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/tuyen-dung", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/tuyen-dung/nghe-nghiep", priority: 0.5, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const posts = (await sql`
    SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC
  `) as { slug: string; updated_at: string }[];

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
