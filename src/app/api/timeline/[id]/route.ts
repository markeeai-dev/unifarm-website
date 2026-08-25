import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM timeline_milestones WHERE id::text = ${id}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ milestone: rows[0] });
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
  const {
    year,
    caption,
    icon,
    stat,
    partner_title,
    partner_bullets,
    image,
    media,
    bottom,
    sort_order,
  } = body;

  if (!year || !String(year).trim()) {
    return NextResponse.json({ error: "Thiếu năm" }, { status: 400 });
  }

  if (!caption || !String(caption).trim()) {
    return NextResponse.json({ error: "Thiếu tên mốc" }, { status: 400 });
  }

  const current = await sql`SELECT id FROM timeline_milestones WHERE id::text = ${id}`;
  if (current.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows = await sql`
    UPDATE timeline_milestones SET
      year = ${year},
      caption = ${caption},
      icon = ${icon || "Sprout"},
      stat = ${JSON.stringify(stat || [])}::jsonb,
      partner_title = ${partner_title || ""},
      partner_bullets = ${JSON.stringify(partner_bullets || [])}::jsonb,
      image = ${image || ""},
      media = ${JSON.stringify(media || [])}::jsonb,
      bottom = ${JSON.stringify(bottom || [])}::jsonb,
      sort_order = ${Number(sort_order) || 0},
      updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `;

  return NextResponse.json({ milestone: rows[0] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM timeline_milestones WHERE id::text = ${id}`;
  return NextResponse.json({ ok: true });
}
