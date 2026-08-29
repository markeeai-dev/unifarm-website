import AdminSidebar from "./AdminSidebar";
import PageTransition from "./PageTransition";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7f5]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 pt-20 sm:px-8 sm:py-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
