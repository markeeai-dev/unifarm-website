import { notFound } from "next/navigation";
import { sql, type Job } from "@/lib/db";
import JobForm from "@/components/admin/Jobform";

type Params = { params: Promise<{ id: string }> };

export default async function AdminJobEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM jobs WHERE id::text = ${id}`) as Job[];
  const job = rows[0];
  if (!job) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#06301B]">Sửa vị trí tuyển dụng</h1>
      <JobForm job={job} />
    </div>
  );
}
