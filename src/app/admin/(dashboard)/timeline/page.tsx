import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { sql, type TimelineMilestone } from "@/lib/db";
import TimelineList from "@/components/admin/Timelinelist";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminTimelineListPage() {
  const milestones = (await sql`
    SELECT * FROM timeline_milestones ORDER BY sort_order ASC, created_at ASC
  `) as TimelineMilestone[];

  return (
    <div>
      <PageHeader
        eyebrow="Nội dung"
        title="Quản trị Mốc lịch sử"
        subtitle={`${milestones.length} mốc · sắp xếp theo thứ tự hiển thị trên trang Giới thiệu.`}
        action={
          <Link href="/admin/timeline/new" className={buttonClass("primary")}>
            <CalendarPlus size={16} /> Mốc mới
          </Link>
        }
      />

      <TimelineList milestones={milestones} />
    </div>
  );
}
