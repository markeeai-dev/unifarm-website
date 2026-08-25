import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET() {
  const authed = await isAdminAuthed();
  const rows = authed
    ? await sql`SELECT * FROM jobs ORDER BY sort_order ASC, created_at ASC`
    : await sql`SELECT * FROM jobs WHERE status = 'active' ORDER BY sort_order ASC, created_at ASC`;
  return NextResponse.json({ jobs: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    level,
    dept,
    color,
    income,
    income_bucket,
    location,
    experience,
    headcount,
    benefit,
    deadline_date,
    tags,
    status,
    sort_order,
  } = body;

  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Thiếu tiêu đề" }, { status: 400 });
  }
  if (!dept || !String(dept).trim()) {
    return NextResponse.json({ error: "Thiếu phòng ban" }, { status: 400 });
  }
  if (!location || !String(location).trim()) {
    return NextResponse.json({ error: "Thiếu địa điểm" }, { status: 400 });
  }

  let sortOrder = Number(sort_order);
  if (!sortOrder || sortOrder <= 0) {
    const maxRows = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM jobs`;
    sortOrder = Number(maxRows[0].next);
  }

  const tagsArr = Array.isArray(tags) ? tags : [];

  const rows = await sql`
    INSERT INTO jobs
      (title, level, dept, color, income, income_bucket, location, experience,
       headcount, benefit, deadline_date, tags, status, sort_order)
    VALUES
      (${title}, ${level || "Fresher"}, ${dept}, ${color || "#006400"}, ${income || ""},
       ${income_bucket || "Dưới 8 triệu"}, ${location}, ${experience || "Không yêu cầu"},
       ${headcount || 1}, ${benefit || ""}, ${deadline_date || null},
       ${JSON.stringify(tagsArr)}::jsonb, ${status || "active"}, ${sortOrder})
    RETURNING *
  `;

  return NextResponse.json({ job: rows[0] }, { status: 201 });
}
