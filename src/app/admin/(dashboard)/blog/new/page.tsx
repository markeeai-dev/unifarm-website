import BlogForm from "@/components/admin/Blogform";
import { FormHeader } from "@/components/admin/ui";

export default function AdminBlogNewPage() {
  return (
    <div>
      <FormHeader backHref="/admin/blog" title="Bài viết mới" />
      <BlogForm />
    </div>
  );
}
