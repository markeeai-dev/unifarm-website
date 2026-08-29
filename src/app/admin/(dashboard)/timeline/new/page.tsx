import TimelineForm from "@/components/admin/Timelineform";
import { FormHeader } from "@/components/admin/ui";

export default function AdminTimelineNewPage() {
  return (
    <div>
      <FormHeader backHref="/admin/timeline" title="Mốc lịch sử mới" />
      <TimelineForm />
    </div>
  );
}
