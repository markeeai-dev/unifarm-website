import { notFound } from "next/navigation";
import { sql, type Product } from "@/lib/db";
import ProductForm from "@/components/admin/Productform";

type Params = { params: Promise<{ id: string }> };

export default async function AdminProductsEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM products WHERE id::text = ${id}`) as Product[];
  const product = rows[0];
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-[#06301B]">Sửa sản phẩm</h1>
      <ProductForm product={product} />
    </div>
  );
}
