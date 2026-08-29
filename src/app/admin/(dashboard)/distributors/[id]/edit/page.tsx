import { notFound } from "next/navigation";
import { sql, type Distributor } from "@/lib/db";
import DistributorForm from "@/components/admin/Distributorform";
import { FormHeader } from "@/components/admin/ui";

type Params = { params: Promise<{ id: string }> };

export default async function AdminDistributorEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM distributors WHERE id::text = ${id}`) as Distributor[];
  const distributor = rows[0];
  if (!distributor) notFound();

  return (
    <div>
      <FormHeader backHref="/admin/distributors" title="Sửa cửa hàng" />
      <DistributorForm distributor={distributor} />
    </div>
  );
}
