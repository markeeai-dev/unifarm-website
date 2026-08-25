"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Job } from "@/lib/db";
import {
  Briefcase,
  CalendarDays,
  MapPin,
  Pencil,
  Search,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";

type StatusFilter = "all" | "active" | "closed";

const LEVEL_BADGE: Record<Job["level"], string> = {
  Intern: "bg-[#eaf3e8] text-[#06301B]",
  Fresher: "bg-[#cfe4cb] text-[#06301B]",
  Junior: "bg-[#006400] text-white",
  Middle: "bg-[#F5E98A] text-[#06301B]",
  Senior: "bg-[#FFFACD] text-[#06301B]",
};

function formatDate(iso: string | null) {
  if (!iso) return "Không giới hạn";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Không giới hạn";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function JobCard({ job, onDeleted }: { job: Job; onDeleted: (id: string) => void }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Xoá vị trí "${job.title}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted(job.id);
        router.refresh();
      } else {
        alert("Xoá thất bại, vui lòng thử lại.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-[#06301B]">{job.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${LEVEL_BADGE[job.level]}`}>
              {job.level}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
              <Briefcase size={12} />
              {job.dept}
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
            job.status === "active" ? "bg-[#f2f9ee] text-[#006400]" : "bg-gray-100 text-gray-500"
          }`}
        >
          {job.status === "active" ? "Đang mở" : "Đã đóng"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
        <span className="flex items-center gap-1.5 font-semibold text-[#006400]">
          <Wallet size={13} />
          {job.income || "Thoả thuận"}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={13} />
          {job.headcount} người
        </span>
      </div>

      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                tag === "HOT" ? "bg-[#FFFACD] text-[#06301B]" : "bg-[#f2f9ee] text-[#006400]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/5 pt-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarDays size={13} />
          Hạn: {formatDate(job.deadline_date)}
        </span>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/admin/jobs/${job.id}/edit`}
            className="flex items-center gap-1 rounded-full bg-[#f2f9ee] px-3 py-1.5 text-xs font-bold text-[#006400] transition-colors hover:bg-[#006400] hover:text-white"
          >
            <Pencil size={12} /> Sửa
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={12} /> {deleting ? "Đang xoá…" : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobsListClient({ jobs }: { jobs: Job[] }) {
  const [list, setList] = useState(jobs);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((j) => {
      if (status !== "all" && j.status !== status) return false;
      if (q && !j.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [list, query, status]);

  const activeCount = list.filter((j) => j.status === "active").length;

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên vị trí…"
            className="w-full rounded-lg border border-[#06301B]/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10 sm:w-52"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang mở</option>
          <option value="closed">Đã đóng</option>
        </select>
      </div>

      <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {filtered.length} / {list.length} vị trí · {activeCount} đang mở
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-sm text-gray-400">
          {list.length === 0 ? "Chưa có vị trí tuyển dụng nào." : "Không tìm thấy vị trí phù hợp."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onDeleted={(id) => setList((prev) => prev.filter((j) => j.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
}
