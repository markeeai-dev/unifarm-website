import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM blog_posts WHERE id::text = ${id} OR slug = ${id}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const post = rows[0];
  if (post.status !== "published" && !(await isAdminAuthed())) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, excerpt, content, tag, cover_image, author, status, is_featured } = body;

  const current = await sql`SELECT status, published_at FROM blog_posts WHERE id::text = ${id}`;
  if (current.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let publishedAt: string | null = current[0].published_at;
  if (status === "published" && !publishedAt) publishedAt = new Date().toISOString();
  if (status === "draft") publishedAt = null;

  const rows = await sql`
    UPDATE blog_posts SET
      title = ${title},
      excerpt = ${excerpt || ""},
      content = ${content || ""},
      tag = ${tag || "Tin tức"},
      cover_image = ${cover_image || ""},
      author = ${author || "Unifarm"},
      status = ${status || "draft"},
      is_featured = ${!!is_featured},
      published_at = ${publishedAt}
    WHERE id::text = ${id}
    RETURNING *
  `;

  return NextResponse.json({ post: rows[0] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM blog_posts WHERE id::text = ${id}`;
  return NextResponse.json({ ok: true });
}
