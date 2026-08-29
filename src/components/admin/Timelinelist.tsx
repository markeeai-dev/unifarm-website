"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageOff, Pencil, Trash2, Loader2, ChevronUp, ChevronDown, ListChecks } from "lucide-react";
import type { TimelineMilestone } from "@/lib/db";
import { TIMELINE_ICON_MAP, DEFAULT_TIMELINE_ICON } from "@/lib/timeline-icons";
import { SearchInput, EmptyState } from "@/components/admin/ui";

async function patchMilestone(m: TimelineMilestone, sort_order: number) {
  await fetch(`/api/timeline/${m.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      year: m.year,
      caption: m.caption,
      icon: m.icon,
      stat: m.stat,
      partner_title: m.partner_title,
      partner_bullets: m.partner_bullets,
      image: m.image,
      media: m.media,
      bottom: m.bottom,
      sort_order,
    }),
  });
}

function MilestoneCard({
  milestone,
  isFirst,
  isLast,
  reordering,
  onMove,
  onDeleted,
}: {
  milestone: TimelineMilestone;
  isFirst: boolean;
  isLast: boolean;
  reordering: boolean;
  onMove: (dir: -1 | 1) => void;
  onDeleted: (id: string) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const Icon = TIMELINE_ICON_MAP[milestone.icon] ?? TIMELINE_ICON_MAP[DEFAULT_TIMELINE_ICON];

  const handleDelete = async () => {
    if (!confirm(`Xoá mốc "${milestone.caption}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/timeline/${milestone.id}`, { method: "DELETE" });
      onDeleted(milestone.id);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(0,100,0,0.35)] sm:flex-row">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gray-50 sm:aspect-square sm:w-44">
        {milestone.image ? (
          <Image
            src={milestone.image}
            alt={milestone.caption}
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff size={22} className="text-gray-300" />
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#006400] shadow-sm backdrop-blur-sm">
          <Icon size={16} strokeWidth={2} />
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f2f9ee] px-2.5 py-1 text-xs font-extrabold text-[#006400]">
              {milestone.year}
            </span>
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-bold text-[#06301B]/60">
              Thứ tự #{milestone.sort_order}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-bold text-[#06301B]" title={milestone.caption}>
            {milestone.caption}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <ListChecks size={12} /> {milestone.stat?.length ?? 0} chỉ số
            </span>
            <span>{milestone.partner_bullets?.length ?? 0} ý đối tác</span>
            <span>{milestone.media?.length ?? 0} video</span>
            <span>{milestone.bottom?.length ?? 0} ghi chú</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={isFirst || reordering}
              aria-label="Đưa lên trên"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[#06301B]/60 transition-colors hover:border-[#006400]/40 hover:text-[#006400] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={isLast || reordering}
              aria-label="Đưa xuống dưới"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-[#06301B]/60 transition-colors hover:border-[#006400]/40 hover:text-[#006400] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/timeline/${milestone.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-xs font-bold text-[#06301B] transition-colors hover:border-[#006400]/40 hover:text-[#006400]"
            >
              <Pencil size={13} /> Sửa
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelineList({ milestones: initial }: { milestones: TimelineMilestone[] }) {
  const [milestones, setMilestones] = useState(initial);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return milestones;
    return milestones.filter((m) => m.caption.toLowerCase().includes(q) || m.year.toLowerCase().includes(q));
  }, [milestones, search]);

  const handleDeleted = (id: string) => setMilestones((prev) => prev.filter((m) => m.id !== id));

  // Luôn dựa vào vị trí trong danh sách ĐẦY ĐỦ (không phải danh sách đã
  // lọc) để tráo sort_order — tránh đổi nhầm thứ tự khi đang gõ tìm kiếm.
  const handleMove = async (index: number, dir: -1 | 1) => {
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    const a = milestones[index];
    const b = milestones[targetIndex];
    const aSort = a.sort_order;
    const bSort = b.sort_order;

    setReorderingId(a.id);
    const next = [...milestones];
    next[index] = { ...b, sort_order: aSort };
    next[targetIndex] = { ...a, sort_order: bSort };
    setMilestones(next);

    try {
      await Promise.all([patchMilestone(a, bSort), patchMilestone(b, aSort)]);
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div>
      <div className="mt-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên mốc hoặc năm…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={milestones.length === 0 ? "Chưa có mốc lịch sử nào." : "Không tìm thấy mốc phù hợp."} />
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((m) => {
            const fullIndex = milestones.findIndex((x) => x.id === m.id);
            return (
              <MilestoneCard
                key={m.id}
                milestone={m}
                isFirst={fullIndex === 0}
                isLast={fullIndex === milestones.length - 1}
                reordering={reorderingId === m.id}
                onMove={(dir) => handleMove(fullIndex, dir)}
                onDeleted={handleDeleted}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
