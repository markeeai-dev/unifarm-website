import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [row] = (await sql`
    SELECT mime_type, data FROM media WHERE id = ${id}
  `) as { mime_type: string; data: Buffer }[];

  if (!row) {
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime_type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
