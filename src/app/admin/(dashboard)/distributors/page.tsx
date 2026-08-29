import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";
import { sql, type Distributor } from "@/lib/db";
import DistributorsListClient from "@/components/admin/DistributorsListClient";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminDistributorsListPage() {
  const distributors = (await sql`
    SELECT * FROM distributors ORDER BY sort_order ASC, created_at ASC
  `) as Distributor[];

  return (
    <div>
      <PageHeader
        eyebrow="Nội dung"
        title="Quản trị Hệ thống phân phối"
        subtitle={`${distributors.length} cửa hàng đang được hiển thị trên trang Hệ thống phân phối.`}
        action={
          <Link href="/admin/distributors/new" className={buttonClass("primary")}>
            <StoreIcon size={16} /> Cửa hàng mới
          </Link>
        }
      />

      <DistributorsListClient distributors={distributors} />
    </div>
  );
}
