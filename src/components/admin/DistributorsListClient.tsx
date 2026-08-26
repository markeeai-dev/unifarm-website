"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, ChevronUp, ChevronDown, MapPin, Phone, Clock } from "lucide-react";
import type { Distributor } from "@/lib/db";

async function patchDistributor(d: Distributor, sort_order: number) {
  await fetch(`/api/distributors/${d.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: d.name,
      province: d.province,
      district: d.district,
      address: d.address,
      hours: d.hours,
      phone: d.phone,
      sort_order,
    }),
  });
}

function DistributorRow({
  distributor,
  isFirst,
  isLast,
  reordering,
  onMove,
  onDeleted,
}: {
  distributor: Distributor;
  isFirst: boolean;
  isLast: boolean;
  reordering: boolean;
  onMove: (dir: -1 | 1) => void;
  onDeleted: (id: string) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Xoá cửa hàng "${distributor.name}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/distributors/${distributor.id}`, { method: "DELETE" });
      onDeleted(distributor.id);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="border-b border-black/5 transition-colors hover:bg-[#f2f9ee]/40">
      <td className="py-3 pl-4 pr-2">
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={isFirst || reordering}
            aria-label="Đưa lên trên"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-[#06301B]/60 transition-colors hover:border-[#006400]/40 hover:text-[#006400] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={isLast || reordering}
            aria-label="Đưa xuống dưới"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-[#06301B]/60 transition-colors hover:border-[#006400]/40 hover:text-[#006400] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      </td>
      <td className="py-3 pr-4">
        <p className="text-sm font-bold text-[#06301B]">{distributor.name}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={11} strokeWidth={2} />
          {distributor.address}
        </p>
      </td>
      <td className="py-3 pr-4">
        <span className="rounded-full bg-[#f2f9ee] px-2.5 py-1 text-xs font-bold text-[#006400]">
          {distributor.district}
        </span>
      </td>
      <td className="py-3 pr-4 text-sm text-[#06301B]/80">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} strokeWidth={2} className="text-[#006400]" />
          {distributor.hours || "—"}
        </span>
      </td>
      <td className="py-3 pr-4 text-sm text-[#06301B]/80">
        <span className="inline-flex items-center gap-1.5">
          <Phone size={13} strokeWidth={2} className="text-[#006400]" />
          {distributor.phone || "—"}
        </span>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/distributors/${distributor.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-bold text-[#06301B] transition-colors hover:border-[#006400]/40 hover:text-[#006400]"
          >
            <Pencil size={12} /> Sửa
          </Link>
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
      </td>
    </tr>
  );
}

export default function DistributorsListClient({ distributors: initial }: { distributors: Distributor[] }) {
  const [distributors, setDistributors] = useState(initial);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const handleDeleted = (id: string) => setDistributors((prev) => prev.filter((d) => d.id !== id));

  const handleMove = async (index: number, dir: -1 | 1) => {
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= distributors.length) return;

    const a = distributors[index];
    const b = distributors[targetIndex];
    const aSort = a.sort_order;
    const bSort = b.sort_order;

    setReorderingId(a.id);
    const next = [...distributors];
    next[index] = { ...b, sort_order: aSort };
    next[targetIndex] = { ...a, sort_order: bSort };
    setDistributors(next);

    try {
      await Promise.all([patchDistributor(a, bSort), patchDistributor(b, aSort)]);
    } finally {
      setReorderingId(null);
    }
  };

  if (distributors.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-500">Chưa có cửa hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-[#006400] bg-[#f7f6ec] text-xs font-bold uppercase tracking-wide text-[#06301B]">
              <th className="w-14 py-3 pl-4">Thứ tự</th>
              <th className="py-3 pr-4">Cửa hàng</th>
              <th className="py-3 pr-4">Quận/Huyện</th>
              <th className="py-3 pr-4">Giờ hoạt động</th>
              <th className="py-3 pr-4">Điện thoại</th>
              <th className="py-3 pr-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {distributors.map((d, i) => (
              <DistributorRow
                key={d.id}
                distributor={d}
                isFirst={i === 0}
                isLast={i === distributors.length - 1}
                reordering={reorderingId === d.id}
                onMove={(dir) => handleMove(i, dir)}
                onDeleted={handleDeleted}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
