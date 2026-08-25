import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import AdminShell from "../AdminShell";

export const metadata = { title: "Admin | Unifarm" };

export default async function AdminDashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthed())) redirect("/admin");

  return <AdminShell>{children}</AdminShell>;
}
