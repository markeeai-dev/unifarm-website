import { sql, type ContactMessage } from "@/lib/db";
import ContactsListClient from "@/components/admin/ContactsListClient";
import { PageHeader } from "@/components/admin/ui";

export default async function AdminContactsPage() {
  const messages = (await sql`
    SELECT * FROM contact_messages ORDER BY created_at DESC
  `) as ContactMessage[];

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHeader
        eyebrow="Nội dung"
        title="Liên hệ & Góp ý"
        subtitle={`${messages.length} lượt gửi từ form Liên hệ, Dự án & Hợp tác, và hộp góp ý Tuyển dụng${
          unreadCount > 0 ? ` — ${unreadCount} chưa đọc` : ""
        }.`}
      />

      <ContactsListClient messages={messages} />
    </div>
  );
}
