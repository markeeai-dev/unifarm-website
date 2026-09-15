"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Trash2, Loader2, MailOpen, Circle } from "lucide-react";
import type { ContactMessage, ContactMessageSource } from "@/lib/db";
import { SearchInput, EmptyState } from "@/components/admin/ui";

type TabId = "all" | ContactMessageSource;

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "contact", label: "Liên hệ trang chủ" },
  { id: "du_an", label: "Dự án & Hợp tác" },
  { id: "feedback", label: "Góp ý (Tuyển dụng)" },
];

const SOURCE_BADGE: Record<ContactMessageSource, string> = {
  contact: "bg-[#f2f9ee] text-[#006400]",
  du_an: "bg-[#eaf5fb] text-[#1c6fa0]",
  feedback: "bg-[#fdf6e3] text-[#9a7b0a]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageCard({
  message,
  onDeleted,
  onToggleRead,
}: {
  message: ContactMessage;
  onDeleted: (id: string) => void;
  onToggleRead: (id: string, is_read: boolean) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Xoá lượt gửi này? Hành động này không thể hoàn tác.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/contact/${message.id}`, { method: "DELETE" });
      onDeleted(message.id);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleRead = async () => {
    setToggling(true);
    try {
      const next = !message.is_read;
      await fetch(`/api/contact/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: next }),
      });
      onToggleRead(message.id, next);
      router.refresh();
    } finally {
      setToggling(false);
    }
  };

  const isAnonymous = message.source === "feedback";

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm transition-colors sm:p-5 ${
        message.is_read ? "border-black/5 bg-white" : "border-[#006400]/20 bg-[#f2f9ee]/40"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {!message.is_read && <Circle size={8} className="fill-[#006400] text-[#006400]" />}
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${SOURCE_BADGE[message.source]}`}>
          {TABS.find((t) => t.id === message.source)?.label ?? message.source}
        </span>
        {message.category && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
            {message.category}
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400">{formatDate(message.created_at)}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#06301B]">
        {isAnonymous ? (
          <span className="font-bold italic text-gray-500">Góp ý ẩn danh</span>
        ) : (
          <>
            <span className="font-bold">{message.name || "—"}</span>
            {message.email && (
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <Mail size={13} /> {message.email}
              </span>
            )}
            {message.phone && (
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <Phone size={13} /> {message.phone}
              </span>
            )}
            {message.location && (
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <MapPin size={13} /> {message.location}
              </span>
            )}
          </>
        )}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{message.message}</p>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleRead}
          disabled={toggling}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-bold text-[#06301B] transition-colors hover:border-[#006400]/40 hover:text-[#006400] disabled:opacity-60"
        >
          {toggling ? <Loader2 size={12} className="animate-spin" /> : <MailOpen size={12} />}
          {message.is_read ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Xoá
        </button>
      </div>
    </div>
  );
}

export default function ContactsListClient({ messages: initial }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initial);
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const map: Record<TabId, number> = { all: messages.length, contact: 0, du_an: 0, feedback: 0 };
    messages.forEach((m) => {
      map[m.source] += 1;
    });
    return map;
  }, [messages]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (activeTab !== "all" && m.source !== activeTab) return false;
      if (
        q &&
        !m.name.toLowerCase().includes(q) &&
        !m.email.toLowerCase().includes(q) &&
        !m.phone.toLowerCase().includes(q) &&
        !m.message.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [messages, activeTab, search]);

  const handleDeleted = (id: string) => setMessages((prev) => prev.filter((m) => m.id !== id));
  const handleToggleRead = (id: string, is_read: boolean) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read } : m)));

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? "border-[#006400] bg-[#006400] text-white shadow-sm"
                  : "border-black/10 bg-white text-[#06301B]/70 hover:border-[#006400]/40 hover:text-[#006400]"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                  active ? "bg-white/20 text-white" : "bg-[#f2f9ee] text-[#006400]"
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên, email, số điện thoại, nội dung…" />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          message={messages.length === 0 ? "Chưa có lượt liên hệ hay góp ý nào." : "Không tìm thấy kết quả phù hợp."}
        />
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {visible.map((m) => (
            <MessageCard key={m.id} message={m} onDeleted={handleDeleted} onToggleRead={handleToggleRead} />
          ))}
        </div>
      )}
    </div>
  );
}
