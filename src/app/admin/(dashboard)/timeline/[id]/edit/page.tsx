import { notFound } from "next/navigation";
import { sql, type TimelineMilestone } from "@/lib/db";
import TimelineForm from "@/components/admin/Timelineform";

type Params = { params: Promise<{ id: string }> };

export default async function AdminTimelineEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM timeline_milestones WHERE id::text = ${id}`) as TimelineMilestone[];
  const milestone = rows[0];
  if (!milestone) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#06301B]">Sửa mốc lịch sử</h1>
      <TimelineForm milestone={milestone} />
    </div>
  );
}
