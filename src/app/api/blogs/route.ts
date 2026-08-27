import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { translateEntity, type EntitySpec } from "@/lib/translate-content";

const BLOG_TRANSLATE_SPEC: EntitySpec = {
  title: { kind: "string" },
  excerpt: { kind: "string" },
  tag: { kind: "string" },
  content: { kind: "html" },
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "bai-viet";
}

export async function GET() {
  const authed = await isAdminAuthed();
  const rows = authed
    ? await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`
    : await sql`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`;
  return NextResponse.json({ posts: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, excerpt, content, tag, cover_image, author, status, is_featured } = body;

  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Thiếu tiêu đề" }, { status: 400 });
  }

  let slug = slugify(title);
  const existing = await sql`SELECT id FROM blog_posts WHERE slug = ${slug}`;
  if (existing.length > 0) slug = `${slug}-${randomUUID().slice(0, 6)}`;

  const publishedAt = status === "published" ? new Date().toISOString() : null;

  const translations = await translateEntity(
    { title, excerpt, tag: tag || "Tin tức", content },
    BLOG_TRANSLATE_SPEC
  );

  const rows = await sql`
    INSERT INTO blog_posts
      (slug, title, excerpt, content, tag, cover_image, author, status, is_featured, published_at, translations)
    VALUES
      (${slug}, ${title}, ${excerpt || ""}, ${content || ""}, ${tag || "Tin tức"},
       ${cover_image || ""}, ${author || "Unifarm"}, ${status || "draft"}, ${!!is_featured}, ${publishedAt},
       ${JSON.stringify(translations || {})}::jsonb)
    RETURNING *
  `;

  return NextResponse.json({ post: rows[0] }, { status: 201 });
}
