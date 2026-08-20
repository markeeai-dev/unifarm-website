import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import BlogForm from "@/components/admin/Blogform";

export default async function AdminBlogNewPage() {
  if (!(await isAdminAuthed())) redirect("/admin/blog/login");

  return (
    <div className="min-h-screen bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-5 py-10 sm:px-8">
      <h1 className="mx-auto mb-8 max-w-3xl text-2xl font-extrabold text-[#06301B]">
        Bài viết mới
      </h1>
      <BlogForm />
    </div>
  );
}
