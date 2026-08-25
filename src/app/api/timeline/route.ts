import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET() {
  const rows = await sql`SELECT * FROM timeline_milestones ORDER BY sort_order ASC, created_at ASC`;
  return NextResponse.json({ milestones: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  let sortOrder = Number(sort_order) || 0;
  if (sortOrder <= 0) {
    const rows = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM timeline_milestones`;
    sortOrder = Number(rows[0].next);
  }

  const rows = await sql`
    INSERT INTO timeline_milestones
      (year, caption, icon, stat, partner_title, partner_bullets, image, media, bottom, sort_order)
    VALUES
      (${year}, ${caption}, ${icon || "Sprout"}, ${JSON.stringify(stat || [])}::jsonb,
       ${partner_title || ""}, ${JSON.stringify(partner_bullets || [])}::jsonb,
       ${image || ""}, ${JSON.stringify(media || [])}::jsonb,
       ${JSON.stringify(bottom || [])}::jsonb, ${sortOrder})
    RETURNING *
  `;

  return NextResponse.json({ milestone: rows[0] }, { status: 201 });
}
