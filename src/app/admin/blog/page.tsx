import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { sql, type BlogPost } from "@/lib/db";
import LogoutButton from "@/components/admin/Logoutbutton";

export default async function AdminBlogListPage() {
  if (!(await isAdminAuthed())) redirect("/admin/blog/login");

  const posts = (await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`) as BlogPost[];

  return (
    <div className="min-h-screen bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-[#06301B]">Quản trị Blog</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/new"
              className="rounded-full bg-[#006400] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#004d00]"
            >
              + Bài viết mới
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-16px_rgba(0,100,0,0.25)]">
          {posts.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">Chưa có bài viết nào.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f2f9ee] text-xs uppercase tracking-wide text-[#06301B]/60">
                <tr>
                  <th className="px-5 py-3">Tiêu đề</th>
                  <th className="px-5 py-3">Chuyên mục</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Cập nhật</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-semibold text-[#06301B]">{p.title}</td>
                    <td className="px-5 py-3 text-gray-500">{p.tag}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          p.status === "published"
                            ? "bg-[#f2f9ee] text-[#006400]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status === "published" ? "Đã đăng" : "Nháp"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(p.updated_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/blog/${p.id}/edit`}
                        className="font-semibold text-[#006400] hover:underline"
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
