import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import DuanBanner from "@/components/du-an/DuanBanner";
import DuanTruCot from "@/components/du-an/DuanTruCot";
import DuanNguyenTac from "@/components/du-an/DuanNguyenTac";
import DuanContactForm from "@/components/du-an/DuanContactForm";
import Bandonongsanxanh from "@/components/dich-vu/Bandonongsanxanh";

export const metadata: Metadata = {
  title: "Dự Án & Hợp Tác | Unifarm",
  description:
    "Hệ thống nông trường công nghệ cao và chuỗi giá trị khép kín của Unifarm — vùng trồng tập trung 1.694+ ha, tổ hợp chế biến sâu và dịch vụ chuyển giao kỹ thuật cho nhà nông. Cùng Unifarm bắt đầu dự án hợp tác nông nghiệp.",
};

export default function DuAnHopTacPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <DuanBanner />

      <main className="flex-1">
        <DuanTruCot />
        <DuanNguyenTac />
        <Bandonongsanxanh />
        <DuanContactForm />
      </main>
      <Footer />
    </div>
  );
}
