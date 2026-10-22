import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { sql } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import { translateEntity, type EntitySpec } from "@/lib/translate-content";

const JOB_TRANSLATE_SPEC: EntitySpec = {
  title: { kind: "string" },
  dept: { kind: "string" },
  income: { kind: "string" },
  benefit: { kind: "string" },
  tags: { kind: "string[]" },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM jobs WHERE id::text = ${id}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const job = rows[0];
  if (job.status !== "active" && !(await isAdminAuthed())) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
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

  const current = await sql`SELECT sort_order FROM jobs WHERE id::text = ${id}`;
  if (current.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let sortOrder = Number(sort_order);
  if (!sortOrder || sortOrder <= 0) {
    sortOrder = Number(current[0].sort_order);
  }

  const tagsArr = Array.isArray(tags) ? tags : [];

  const rows = await sql`
    UPDATE jobs SET
      title = ${title},
      level = ${level || "Fresher"},
      dept = ${dept},
      color = ${color || "#006400"},
      income = ${income || ""},
      income_bucket = ${income_bucket || "Dưới 8 triệu"},
      location = ${location},
      experience = ${experience || "Không yêu cầu"},
      headcount = ${headcount || 1},
      benefit = ${benefit || ""},
      deadline_date = ${deadline_date || null},
      tags = ${JSON.stringify(tagsArr)}::jsonb,
      status = ${status || "active"},
      sort_order = ${sortOrder},
      updated_at = now()
    WHERE id::text = ${id}
    RETURNING *
  `;
  const job = rows[0];

  // Dịch 4 ngôn ngữ chạy NGẦM sau khi đã trả response — giữ nguyên bản dịch
  // cũ cho tới khi bản mới dịch xong, tránh bắt admin chờ khi bấm Lưu.
  after(async () => {
    try {
      const translations = await translateEntity(
        { title, dept, income, benefit, tags: tagsArr },
        JOB_TRANSLATE_SPEC
      );
      if (translations) {
        await sql`UPDATE jobs SET translations = ${JSON.stringify(translations)}::jsonb WHERE id::text = ${id}`;
      }
    } catch (err) {
      console.error("Background translateEntity failed for job", id, err);
    }
  });

  return NextResponse.json({ job });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM jobs WHERE id::text = ${id}`;
  return NextResponse.json({ ok: true });
}
