import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";
import { sql, type Distributor } from "@/lib/db";
import DistributorsListClient from "@/components/admin/DistributorsListClient";

export default async function AdminDistributorsListPage() {
  const distributors = (await sql`
    SELECT * FROM distributors ORDER BY sort_order ASC, created_at ASC
  `) as Distributor[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#06301B]">Quản trị Hệ thống phân phối</h1>
          <p className="mt-1 text-sm text-gray-500">
            {distributors.length} cửa hàng đang được hiển thị trên trang Hệ thống phân phối.
          </p>
        </div>
        <Link
          href="/admin/distributors/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
        >
          <StoreIcon size={16} /> Cửa hàng mới
        </Link>
      </div>

      <DistributorsListClient distributors={distributors} />
    </div>
  );
}
