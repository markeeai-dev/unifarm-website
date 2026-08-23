import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import HanhTrinhNongSanXanh from "@/components/dich-vu/Hanhtrinhnongsanxanh";
import BanDoNongSanXanh from "@/components/dich-vu/Bandonongsanxanh";
import DichvuBanner from "@/components/dich-vu/DichvuBanner";

export const metadata: Metadata = {
  title: "Dịch vụ | Unifarm",
  description:
    "Nông sản xanh — từ vùng trồng đến giá trị bền vững. Hành trình vùng trồng, chế biến, gia tăng giá trị và chuyển giao công nghệ cao của Unifarm trên bản đồ nông nghiệp Việt Nam.",
};

export default function DichVuPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <DichvuBanner />

      <main className="flex-1">
        <HanhTrinhNongSanXanh />
        <BanDoNongSanXanh />
      </main>
      <Footer />
    </div>
  );
}
