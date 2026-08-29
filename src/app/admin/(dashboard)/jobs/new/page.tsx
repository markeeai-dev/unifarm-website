import JobForm from "@/components/admin/Jobform";
import { FormHeader } from "@/components/admin/ui";

export default function AdminJobNewPage() {
  return (
    <div>
      <FormHeader backHref="/admin/jobs" title="Vị trí mới" />
      <JobForm />
    </div>
  );
}
