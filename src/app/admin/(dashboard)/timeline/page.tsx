import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { sql, type TimelineMilestone } from "@/lib/db";
import TimelineList from "@/components/admin/Timelinelist";

export default async function AdminTimelineListPage() {
  const milestones = (await sql`
    SELECT * FROM timeline_milestones ORDER BY sort_order ASC, created_at ASC
  `) as TimelineMilestone[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#06301B]">Quản trị Mốc lịch sử</h1>
          <p className="mt-1 text-sm text-gray-500">
            {milestones.length} mốc · sắp xếp theo thứ tự hiển thị trên trang Giới thiệu.
          </p>
        </div>
        <Link
          href="/admin/timeline/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
        >
          <CalendarPlus size={16} /> Mốc mới
        </Link>
      </div>

      <TimelineList milestones={milestones} />
    </div>
  );
}
