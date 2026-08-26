import { notFound } from "next/navigation";
import { sql, type Distributor } from "@/lib/db";
import DistributorForm from "@/components/admin/Distributorform";

type Params = { params: Promise<{ id: string }> };

export default async function AdminDistributorEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM distributors WHERE id::text = ${id}`) as Distributor[];
  const distributor = rows[0];
  if (!distributor) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#06301B]">Sửa cửa hàng</h1>
      <DistributorForm distributor={distributor} />
    </div>
  );
}
