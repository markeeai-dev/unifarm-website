import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { sql, type Product } from "@/lib/db";
import ProductsTabs from "@/components/admin/ProductsTabs";

export default async function AdminProductsListPage() {
  const products = (await sql`
    SELECT * FROM products ORDER BY sort_order ASC, created_at ASC
  `) as Product[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#06301B]">Quản trị Sản phẩm</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} sản phẩm · chia theo 3 danh mục để dễ tìm và dễ thêm.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
        >
          <PackagePlus size={16} /> Sản phẩm mới
        </Link>
      </div>

      <ProductsTabs products={products} />
    </div>
  );
}
