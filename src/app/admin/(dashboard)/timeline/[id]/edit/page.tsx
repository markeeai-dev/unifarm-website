import { notFound } from "next/navigation";
import { sql, type TimelineMilestone } from "@/lib/db";
import TimelineForm from "@/components/admin/Timelineform";
import { FormHeader } from "@/components/admin/ui";

type Params = { params: Promise<{ id: string }> };

export default async function AdminTimelineEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM timeline_milestones WHERE id::text = ${id}`) as TimelineMilestone[];
  const milestone = rows[0];
  if (!milestone) notFound();

  return (
    <div>
      <FormHeader backHref="/admin/timeline" title="Sửa mốc lịch sử" />
      <TimelineForm milestone={milestone} />
    </div>
  );
}
