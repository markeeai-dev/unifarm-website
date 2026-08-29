import ProductForm from "@/components/admin/Productform";
import { FormHeader } from "@/components/admin/ui";

export default function AdminProductsNewPage() {
  return (
    <div>
      <FormHeader backHref="/admin/products" title="Sản phẩm mới" />
      <ProductForm />
    </div>
  );
}
