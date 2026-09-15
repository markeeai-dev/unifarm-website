import { NextRequest, NextResponse } from "next/server";
import { sql, type ContactMessageSource } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

const VALID_SOURCES: ContactMessageSource[] = ["contact", "du_an", "feedback"];

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const source = req.nextUrl.searchParams.get("source");
  const rows =
    source && VALID_SOURCES.includes(source as ContactMessageSource)
      ? await sql`SELECT * FROM contact_messages WHERE source = ${source} ORDER BY created_at DESC`
      : await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;

  return NextResponse.json({ messages: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  // Honeypot — input ẩn mà người dùng thật không bao giờ điền, bot thì
  // thường điền vào mọi field thấy được trong DOM. Coi như gửi thành công
  // để không "lộ" cho bot biết nó đã bị chặn, nhưng không lưu gì cả.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const source = body.source as ContactMessageSource;
  if (!VALID_SOURCES.includes(source)) {
    return NextResponse.json({ error: "Thiếu nguồn gửi" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";

  if (source === "feedback") {
    // Ẩn danh — chỉ có nội dung góp ý, không có tên/liên hệ.
    if (!message) {
      return NextResponse.json({ error: "Vui lòng nhập nội dung góp ý" }, { status: 400 });
    }
  } else {
    // Form liên hệ/hợp tác — nội dung là tuỳ chọn, nhưng bắt buộc có cách
    // để Unifarm liên hệ lại (tên + email hoặc số điện thoại).
    if (!name) {
      return NextResponse.json({ error: "Vui lòng nhập họ tên" }, { status: 400 });
    }
    if (!email && !phone) {
      return NextResponse.json({ error: "Vui lòng nhập email hoặc số điện thoại" }, { status: 400 });
    }
  }

  const rows = await sql`
    INSERT INTO contact_messages (source, name, email, phone, location, category, message)
    VALUES (${source}, ${name}, ${email}, ${phone}, ${location}, ${category}, ${message})
    RETURNING id
  `;

  return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
}
