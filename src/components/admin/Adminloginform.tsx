"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Sai mật khẩu");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(0,100,0,0.3)]"
      >
        <h1 className="text-xl font-extrabold text-[#06301B]">Đăng nhập Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Nhập mật khẩu quản trị để vào trang quản lý Unifarm.</p>

        <label htmlFor="password" className="mt-6 block text-sm font-semibold text-[#06301B]">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[#06301B]/15 px-4 py-2.5 text-sm outline-none focus:border-[#006400] focus:ring-4 focus:ring-[#006400]/10"
        />

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#006400] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#004d00] disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
