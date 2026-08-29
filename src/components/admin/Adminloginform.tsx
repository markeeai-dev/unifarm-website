"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button, inputClass } from "@/components/admin/ui";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f4f7f5] via-white to-[#f2f9ee] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm animate-[admin-page-in_400ms_cubic-bezier(0.22,1,0.36,1)_both] rounded-2xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(0,100,0,0.3)]"
      >
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo-unifarm.png"
            alt="Unifarm"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <h1 className="mt-3 text-xl font-extrabold text-[#06301B]">Đăng nhập Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Nhập mật khẩu quản trị để vào trang quản lý Unifarm.</p>
        </div>

        <label htmlFor="password" className="mt-6 block text-sm font-semibold text-[#06301B]">
          Mật khẩu
        </label>
        <div className="relative mt-2">
          <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pl-10 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#006400]"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

        <Button type="submit" variant="primary" loading={loading} loadingLabel="Đang đăng nhập…" className="mt-6 w-full">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
