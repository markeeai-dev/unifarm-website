import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { sql, type Product } from "@/lib/db";
import ProductsTabs from "@/components/admin/ProductsTabs";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminProductsListPage() {
  const products = (await sql`
    SELECT * FROM products ORDER BY sort_order ASC, created_at ASC
  `) as Product[];

  return (
    <div>
      <PageHeader
        eyebrow="Nội dung"
        title="Quản trị Sản phẩm"
        subtitle={`${products.length} sản phẩm · chia theo 3 danh mục để dễ tìm và dễ thêm.`}
        action={
          <Link href="/admin/products/new" className={buttonClass("primary")}>
            <PackagePlus size={16} /> Sản phẩm mới
          </Link>
        }
      />

      <ProductsTabs products={products} />
    </div>
  );
}
