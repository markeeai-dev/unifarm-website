import { notFound } from "next/navigation";
import { sql, type Job } from "@/lib/db";
import JobForm from "@/components/admin/Jobform";
import { FormHeader } from "@/components/admin/ui";

type Params = { params: Promise<{ id: string }> };

export default async function AdminJobEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM jobs WHERE id::text = ${id}`) as Job[];
  const job = rows[0];
  if (!job) notFound();

  return (
    <div>
      <FormHeader backHref="/admin/jobs" title="Sửa vị trí tuyển dụng" />
      <JobForm job={job} />
    </div>
  );
}
