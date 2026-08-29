import DistributorForm from "@/components/admin/Distributorform";
import { FormHeader } from "@/components/admin/ui";

export default function AdminDistributorNewPage() {
  return (
    <div>
      <FormHeader backHref="/admin/distributors" title="Cửa hàng mới" />
      <DistributorForm />
    </div>
  );
}
