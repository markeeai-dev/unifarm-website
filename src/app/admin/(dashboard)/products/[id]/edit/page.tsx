import { notFound } from "next/navigation";
import { sql, type Product } from "@/lib/db";
import ProductForm from "@/components/admin/Productform";
import { FormHeader } from "@/components/admin/ui";

type Params = { params: Promise<{ id: string }> };

export default async function AdminProductsEditPage({ params }: Params) {
  const { id } = await params;
  const rows = (await sql`SELECT * FROM products WHERE id::text = ${id}`) as Product[];
  const product = rows[0];
  if (!product) notFound();

  return (
    <div>
      <FormHeader backHref="/admin/products" title="Sửa sản phẩm" />
      <ProductForm product={product} />
    </div>
  );
}
