"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

/**
 * AdminLoginGate — "công tắc" mặt trăng/mặt trời góc dưới trái.
 * Với người dùng thường: trông như 1 nút đổi giao diện tối/sáng vô hại.
 * Bấm vào: icon đổi trăng -> mặt trời, nền tối nhẹ lại, và 1 form đăng
 * nhập admin trượt ra bên phải nút. Đăng nhập đúng mật khẩu sẽ chuyển
 * tới /admin. Bấm mặt trời sẽ quay lại trăng và ẩn form đi.
 */
export default function AdminLoginGate() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    setError("");
  };

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
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Nền tối nhẹ toàn trang khi mở — hiệu ứng "chuyển dark mode" */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-700 ease-out ${
          open ? "opacity-35" : "opacity-0"
        }`}
      />

      <div
        ref={wrapRef}
        className="fixed bottom-6 left-4 z-50 flex items-end gap-3 sm:left-6"
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={open ? "Đóng" : "Chuyển giao diện"}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#06301B] text-[#fffacd] shadow-lg ring-1 ring-white/10 transition-transform duration-300 hover:scale-110"
        >
          <Moon
            size={20}
            strokeWidth={1.8}
            className={`absolute transition-all duration-500 ${
              open ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <Sun
            size={20}
            strokeWidth={1.8}
            className={`absolute transition-all duration-500 ${
              open ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-64 flex-col gap-2.5 rounded-2xl border border-[#fffacd]/15 bg-[#06301B] p-4 shadow-2xl"
          >
            <label htmlFor="admin-gate-password" className="text-xs font-semibold uppercase tracking-wide text-[#fffacd]/80">
              Quản trị viên
            </label>
            <input
              id="admin-gate-password"
              type="password"
              autoFocus={open}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#87cefa]/60"
            />
            {error && <p className="text-xs font-medium text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#87cefa] px-3 py-2 text-sm font-bold text-[#06301B] transition-colors hover:bg-[#a5dcff] disabled:opacity-60"
            >
              {loading ? "Đang vào…" : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
