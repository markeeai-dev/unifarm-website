import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/config/site";
import CustomCursor from "@/components/Customcursor";
import HomeTopHeader from "@/components/Hometopheader";
import SiteIntro from "@/components/Siteintro";
import AdminLoginGate from "@/components/Adminlogingate";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Script chặn, chạy đồng bộ trước khi trình duyệt vẽ khung hình đầu
            tiên — nếu intro đã chạy trong tab này rồi (sessionStorage) thì
            đánh dấu ngay trên <html> để CSS ẩn overlay tức thì, tránh chớp
            hình 1 nhịp khi F5 lại trang (SSR luôn render sẵn overlay vì
            server không biết sessionStorage). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('unifarm_intro_seen')==='1'){document.documentElement.setAttribute('data-intro-seen','1');}}catch(e){}",
          }}
        />
        <SiteIntro />
        <AdminLoginGate />
        <CustomCursor />
        <HomeTopHeader />
        {children}
      </body>
    </html>
  );
}
