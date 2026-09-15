"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FilePlus,
  ShoppingBasket,
  PackagePlus,
  Briefcase,
  UserPlus,
  History,
  CalendarPlus,
  Store,
  MapPinPlus,
  MessagesSquare,
  ExternalLink,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import LogoutButton from "@/components/admin/Logoutbutton";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    group: "Tổng quan",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Blog",
    items: [
      { href: "/admin/blog", label: "Danh sách bài viết", icon: Newspaper },
      { href: "/admin/blog/new", label: "Thêm bài viết", icon: FilePlus },
    ],
  },
  {
    group: "Sản phẩm",
    items: [
      { href: "/admin/products", label: "Danh sách sản phẩm", icon: ShoppingBasket },
      { href: "/admin/products/new", label: "Thêm sản phẩm", icon: PackagePlus },
    ],
  },
  {
    group: "Tuyển dụng",
    items: [
      { href: "/admin/jobs", label: "Danh sách vị trí", icon: Briefcase },
      { href: "/admin/jobs/new", label: "Thêm vị trí", icon: UserPlus },
    ],
  },
  {
    group: "Hành trình Unifarm",
    items: [
      { href: "/admin/timeline", label: "Danh sách mốc", icon: History },
      { href: "/admin/timeline/new", label: "Thêm mốc", icon: CalendarPlus },
    ],
  },
  {
    group: "Nhà phân phối",
    items: [
      { href: "/admin/distributors", label: "Danh sách cửa hàng", icon: Store },
      { href: "/admin/distributors/new", label: "Thêm cửa hàng", icon: MapPinPlus },
    ],
  },
  {
    group: "Liên hệ",
    items: [{ href: "/admin/contacts", label: "Liên hệ & Góp ý", icon: MessagesSquare }],
  },
];

function checkActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/blog/new") return pathname === href;
  if (href === "/admin/blog") return pathname.startsWith("/admin/blog") && pathname !== "/admin/blog/new";
  if (href === "/admin/products/new") return pathname === href;
  if (href === "/admin/products")
    return pathname.startsWith("/admin/products") && pathname !== "/admin/products/new";
  if (href === "/admin/jobs/new") return pathname === href;
  if (href === "/admin/jobs") return pathname.startsWith("/admin/jobs") && pathname !== "/admin/jobs/new";
  if (href === "/admin/timeline/new") return pathname === href;
  if (href === "/admin/timeline")
    return pathname.startsWith("/admin/timeline") && pathname !== "/admin/timeline/new";
  if (href === "/admin/distributors/new") return pathname === href;
  if (href === "/admin/distributors")
    return pathname.startsWith("/admin/distributors") && pathname !== "/admin/distributors/new";
  return pathname === href;
}

function SidebarContent({
  pathname,
  onClose,
  showCloseBtn,
}: {
  pathname: string;
  onClose: () => void;
  showCloseBtn: boolean;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-black/5 px-4 py-4">
        <Image
          src="/images/logo-unifarm.png"
          alt="Unifarm"
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <div className="text-[17px] font-black leading-tight tracking-wide text-[#006400]">
            UNIFARM
          </div>
          <div className="mt-0.5 text-[8.5px] font-bold uppercase tracking-wider text-gray-400">
            Admin quản trị
          </div>
        </div>
        {showCloseBtn && (
          <button
            onClick={onClose}
            aria-label="Đóng menu"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/5 bg-gray-50 text-gray-500 transition-colors hover:border-[#006400]/20 hover:bg-[#f2f9ee] hover:text-[#006400]"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {NAV.map((group, gi) => (
          <div key={group.group} className={gi < NAV.length - 1 ? "mb-4" : ""}>
            <div className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              {group.group}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = checkActive(item.href, pathname);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-[13px] transition-colors ${
                      active
                        ? "border-l-[#006400] bg-[#f2f9ee] font-bold text-[#006400]"
                        : "border-l-transparent font-medium text-gray-500 hover:bg-[#f2f9ee] hover:text-[#006400]"
                    }`}
                  >
                    <Icon size={16} className={`shrink-0 ${active ? "opacity-100" : "opacity-75"}`} />
                    <span className="flex-1">{item.label}</span>
                    {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#006400]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-2.5 h-px bg-black/5" />

      {/* Footer */}
      <div className="flex flex-col gap-1 p-2.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#06301B]"
        >
          <ExternalLink size={14} className="shrink-0" />
          Xem website
        </Link>
        <LogoutButton />
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[230px] shrink-0 flex-col border-r border-black/5 bg-white shadow-[1px_0_10px_rgba(15,23,42,0.04)] lg:flex">
        <SidebarContent pathname={pathname} onClose={() => {}} showCloseBtn={false} />
      </aside>

      {/* Mobile topbar */}
      <div className="fixed inset-x-0 top-0 z-[1000] flex h-[52px] items-center gap-2.5 border-b border-black/5 bg-white px-3.5 shadow-[0_1px_8px_rgba(15,23,42,0.07)] lg:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Mở menu"
          className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border transition-colors ${
            mobileOpen
              ? "border-[#006400]/20 bg-[#f2f9ee] text-[#006400]"
              : "border-black/5 bg-gray-50 text-gray-600"
          }`}
        >
          {mobileOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2} />}
        </button>
        <Image
          src="/images/logo-unifarm.png"
          alt="Unifarm"
          width={30}
          height={30}
          className="h-[30px] w-[30px] shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <span className="text-[15px] font-black tracking-wide text-[#006400]">UNIFARM</span>
          <span className="ml-1.5 align-top text-[9px] font-bold uppercase tracking-wider text-gray-400">
            Admin
          </span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[1100] animate-[fadeBackdrop_220ms_ease] bg-slate-900/55 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 left-0 z-[1101] flex w-[260px] flex-col overflow-hidden bg-white shadow-[4px_0_32px_rgba(15,23,42,0.18)] animate-[adminDrawerIn_280ms_cubic-bezier(0.22,1,0.36,1)]">
            <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} showCloseBtn />
          </div>
        </>
      )}
    </>
  );
}
