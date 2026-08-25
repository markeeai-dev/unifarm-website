"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ImageOff, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Product } from "@/lib/db";

const CATEGORY_TABS: { id: Product["category"]; label: string }[] = [
  { id: "fresh", label: "Trái cây tươi" },
  { id: "seedling", label: "Cây giống nuôi cấy mô" },
  { id: "processed", label: "Sản phẩm chế biến" },
];

const TYPE_LABELS: Record<Product["type"], string> = {
  banana: "Chuối",
  pineapple: "Dứa",
  melon: "Dưa lưới",
  other: "Khác",
};

const TYPE_OPTIONS: Product["type"][] = ["banana", "pineapple", "melon", "other"];

function formatPrice(price: number) {
  if (!price) return "Chưa có giá";
  return `${price.toLocaleString("vi-VN")} đ`;
}

function ProductCard({
  product,
  onDeleted,
}: {
  product: Product;
  onDeleted: (id: string) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Xoá sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      onDeleted(product.id);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(0,100,0,0.35)]">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gray-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff size={26} className="text-gray-300" />
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#06301B] shadow-sm backdrop-blur-sm">
          {TYPE_LABELS[product.type]}
        </span>
        <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white">
          #{product.sort_order}
        </span>

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#06301B] shadow-sm transition-colors hover:bg-[#f2f9ee]"
          >
            <Pencil size={13} /> Sửa
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Xoá
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="truncate text-sm font-bold text-[#06301B]" title={product.name}>
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="truncate text-xs text-gray-500" title={product.subtitle}>
            {product.subtitle}
          </p>
        )}
        <p className="mt-1.5 text-sm font-extrabold text-[#006400]">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

export default function ProductsTabs({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState<Product["category"]>("fresh");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Product["type"]>("all");

  const counts = useMemo(() => {
    const map: Record<Product["category"], number> = { fresh: 0, seedling: 0, processed: 0 };
    products.forEach((p) => { map[p.category] += 1; });
    return map;
  }, [products]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (p.category !== activeTab) return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, activeTab, typeFilter, search]);

  const handleDeleted = (id: string) => setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id); setTypeFilter("all"); }}
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

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sản phẩm…"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | Product["type"])}
          className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#06301B] outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10 sm:w-auto"
        >
          <option value="all">Tất cả loại</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            {products.filter((p) => p.category === activeTab).length === 0
              ? "Chưa có sản phẩm nào trong danh mục này."
              : "Không tìm thấy sản phẩm phù hợp."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
