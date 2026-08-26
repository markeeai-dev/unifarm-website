import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import { sql } from "@/lib/db";
import {
  Newspaper,
  ShoppingBasket,
  Briefcase,
  History,
  Store,
  FilePlus,
  PackagePlus,
  UserPlus,
  CalendarPlus,
  MapPinPlus,
  ExternalLink,
} from "lucide-react";
import AdminShell from "./AdminShell";
import AdminLoginForm from "@/components/admin/Adminloginform";
import { StatCard, HBar, DonutChart, SectionCard, QuickAction } from "@/components/admin/DashboardCharts";

const CATEGORY_LABELS: Record<string, string> = {
  fresh: "Trái cây tươi",
  seedling: "Cây giống nuôi cấy mô",
  processed: "Sản phẩm chế biến",
};
const CATEGORY_COLORS: Record<string, string> = {
  fresh: "#006400",
  seedling: "#2563eb",
  processed: "#d97706",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default async function AdminRootPage() {
  if (!(await isAdminAuthed())) {
    return <AdminLoginForm />;
  }

  const [
    productsByCategory,
    [{ n: blogTotal }],
    [{ n: blogPublished }],
    [{ n: jobTotal }],
    [{ n: jobActive }],
    [{ n: timelineCount }],
    [{ n: distributorCount }],
    recentProducts,
    recentPosts,
  ] = await Promise.all([
    sql`SELECT category, COUNT(*)::int AS n FROM products GROUP BY category`,
    sql`SELECT COUNT(*)::int AS n FROM blog_posts`,
    sql`SELECT COUNT(*)::int AS n FROM blog_posts WHERE status = 'published'`,
    sql`SELECT COUNT(*)::int AS n FROM jobs`,
    sql`SELECT COUNT(*)::int AS n FROM jobs WHERE status = 'active'`,
    sql`SELECT COUNT(*)::int AS n FROM timeline_milestones`,
    sql`SELECT COUNT(*)::int AS n FROM distributors`,
    sql`SELECT id, name, category, created_at FROM products ORDER BY created_at DESC LIMIT 5`,
    sql`SELECT id, title, status, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 5`,
  ]) as unknown as [
    { category: string; n: number }[],
    { n: number }[],
    { n: number }[],
    { n: number }[],
    { n: number }[],
    { n: number }[],
    { n: number }[],
    { id: string; name: string; category: string; created_at: string }[],
    { id: string; title: string; status: string; created_at: string }[],
  ];

  const catMap: Record<string, number> = { fresh: 0, seedling: 0, processed: 0 };
  productsByCategory.forEach((row) => { catMap[row.category] = row.n; });
  const productTotal = catMap.fresh + catMap.seedling + catMap.processed;
  const maxCat = Math.max(catMap.fresh, catMap.seedling, catMap.processed, 1);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">Quản trị Unifarm</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#06301B]">Bảng điều khiển</h1>
          <p className="mt-1 text-sm text-gray-500">Tổng quan nội dung đang hiển thị trên website.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]">
            <PackagePlus size={15} /> Thêm sản phẩm
          </Link>
          <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-full bg-[#06301B] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0a4a2b]">
            <FilePlus size={15} /> Thêm bài viết
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng sản phẩm" value={productTotal} sub="Trên trang Sản phẩm" color="#006400" href="/admin/products" icon={<ShoppingBasket size={20} strokeWidth={1.8} />} />
        <StatCard label="Bài viết" value={blogTotal} sub={`${blogPublished} đã đăng · ${blogTotal - blogPublished} nháp`} color="#2563eb" href="/admin/blog" icon={<Newspaper size={20} strokeWidth={1.8} />} />
        <StatCard label="Vị trí tuyển dụng" value={jobTotal} sub={`${jobActive} đang mở · ${jobTotal - jobActive} đã đóng`} color="#d97706" href="/admin/jobs" icon={<Briefcase size={20} strokeWidth={1.8} />} />
        <StatCard label="Mốc lịch sử" value={timelineCount} sub="Trên trang Giới thiệu" color="#7c3aed" href="/admin/timeline" icon={<History size={20} strokeWidth={1.8} />} />
        <StatCard label="Cửa hàng phân phối" value={distributorCount} sub="Trên trang Hệ thống phân phối" color="#0891b2" href="/admin/distributors" icon={<Store size={20} strokeWidth={1.8} />} />
      </div>

      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        <SectionCard title="Sản phẩm theo danh mục" sub={`${productTotal} sản phẩm`} action={<Link href="/admin/products" className="rounded-full bg-[#f2f9ee] px-3 py-1.5 text-xs font-bold text-[#006400] transition-colors hover:bg-[#006400] hover:text-white">Xem tất cả →</Link>}>
          {productTotal > 0 ? (
            <>
              <HBar label={CATEGORY_LABELS.fresh} value={catMap.fresh} max={maxCat} color={CATEGORY_COLORS.fresh} />
              <HBar label={CATEGORY_LABELS.seedling} value={catMap.seedling} max={maxCat} color={CATEGORY_COLORS.seedling} />
              <HBar label={CATEGORY_LABELS.processed} value={catMap.processed} max={maxCat} color={CATEGORY_COLORS.processed} />
            </>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">Chưa có sản phẩm</p>
          )}
        </SectionCard>

        <SectionCard title="Trạng thái nội dung" sub="Blog & Tuyển dụng">
          <div className="flex items-center justify-around gap-4">
            <div className="flex flex-col items-center gap-2">
              <DonutChart size={104} thickness={16} segments={[
                { value: blogPublished, color: "#2563eb", label: "Đã đăng" },
                { value: blogTotal - blogPublished, color: "#bfdbfe", label: "Nháp" },
              ]} />
              <span className="text-xs font-semibold text-gray-500">Bài viết</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DonutChart size={104} thickness={16} segments={[
                { value: jobActive, color: "#d97706", label: "Đang mở" },
                { value: jobTotal - jobActive, color: "#fde68a", label: "Đã đóng" },
              ]} />
              <span className="text-xs font-semibold text-gray-500">Tuyển dụng</span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent tables */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard title="Sản phẩm mới nhất" action={<Link href="/admin/products" className="rounded-full bg-[#f2f9ee] px-3 py-1.5 text-xs font-bold text-[#006400] transition-colors hover:bg-[#006400] hover:text-white">Xem tất cả →</Link>}>
          {recentProducts.length > 0 ? (
            <div className="divide-y divide-black/5">
              {recentProducts.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#06301B]">{p.name}</p>
                    <p className="text-xs text-gray-400">{CATEGORY_LABELS[p.category] || p.category} · {formatDate(p.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">Chưa có sản phẩm</p>
          )}
        </SectionCard>

        <SectionCard title="Bài viết mới nhất" action={<Link href="/admin/blog" className="rounded-full bg-[#f2f9ee] px-3 py-1.5 text-xs font-bold text-[#006400] transition-colors hover:bg-[#006400] hover:text-white">Xem tất cả →</Link>}>
          {recentPosts.length > 0 ? (
            <div className="divide-y divide-black/5">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/admin/blog/${post.id}/edit`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#06301B]">{post.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${post.status === "published" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                    {post.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-gray-400">Chưa có bài viết</p>
          )}
        </SectionCard>
      </div>

      {/* Quick actions */}
      <div className="mt-5">
        <h2 className="mb-3 text-[15px] font-extrabold text-[#0f172a]">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction href="/admin/products/new" label="Thêm sản phẩm mới" desc="Tạo sản phẩm với rich text editor" color="#006400" icon={<PackagePlus size={19} strokeWidth={1.8} />} />
          <QuickAction href="/admin/blog/new" label="Viết bài viết mới" desc="Soạn bài với rich text editor" color="#2563eb" icon={<FilePlus size={19} strokeWidth={1.8} />} />
          <QuickAction href="/admin/jobs/new" label="Thêm vị trí tuyển dụng" desc={`${jobActive} vị trí đang mở`} color="#d97706" icon={<UserPlus size={19} strokeWidth={1.8} />} />
          <QuickAction href="/admin/timeline/new" label="Thêm mốc lịch sử" desc={`${timelineCount} mốc hiện có`} color="#7c3aed" icon={<CalendarPlus size={19} strokeWidth={1.8} />} />
          <QuickAction href="/admin/distributors/new" label="Thêm cửa hàng phân phối" desc={`${distributorCount} cửa hàng hiện có`} color="#0891b2" icon={<MapPinPlus size={19} strokeWidth={1.8} />} />
          <QuickAction href="/admin/products" label="Quản lý sản phẩm" desc={`${productTotal} sản phẩm · 3 danh mục`} color="#0891b2" icon={<ShoppingBasket size={19} strokeWidth={1.8} />} />
          <QuickAction href="/" label="Xem website" desc="Mở trang chủ Unifarm" color="#16a34a" icon={<ExternalLink size={19} strokeWidth={1.8} />} />
        </div>
      </div>
    </AdminShell>
  );
}
