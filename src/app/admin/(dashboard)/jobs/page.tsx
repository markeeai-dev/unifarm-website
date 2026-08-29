import Link from "next/link";
import { UserPlus } from "lucide-react";
import { sql, type Job } from "@/lib/db";
import JobsListClient from "@/components/admin/JobsListClient";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminJobsListPage() {
  const jobs = (await sql`SELECT * FROM jobs ORDER BY sort_order ASC, created_at ASC`) as Job[];

  return (
    <div>
      <PageHeader
        eyebrow="Nội dung"
        title="Quản trị Tuyển dụng"
        subtitle={`${jobs.length} vị trí đang được quản lý trên trang Tuyển dụng.`}
        action={
          <Link href="/admin/jobs/new" className={buttonClass("primary")}>
            <UserPlus size={16} /> Vị trí mới
          </Link>
        }
      />

      <JobsListClient jobs={jobs} />
    </div>
  );
}
