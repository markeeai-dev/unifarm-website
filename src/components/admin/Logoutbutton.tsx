"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/blog/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-[#06301B]/15 px-5 py-2.5 text-sm font-semibold text-[#06301B]/70 transition-colors hover:bg-[#06301B]/5"
    >
      Đăng xuất
    </button>
  );
}
