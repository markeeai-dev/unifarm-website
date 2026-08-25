import Link from "next/link";
import { UserPlus } from "lucide-react";
import { sql, type Job } from "@/lib/db";
import JobsListClient from "@/components/admin/JobsListClient";

export default async function AdminJobsListPage() {
  const jobs = (await sql`SELECT * FROM jobs ORDER BY sort_order ASC, created_at ASC`) as Job[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#06301B]">Quản trị Tuyển dụng</h1>
          <p className="mt-1 text-sm text-gray-500">
            {jobs.length} vị trí đang được quản lý trên trang Tuyển dụng.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
        >
          <UserPlus size={16} /> Vị trí mới
        </Link>
      </div>

      <JobsListClient jobs={jobs} />
    </div>
  );
}
