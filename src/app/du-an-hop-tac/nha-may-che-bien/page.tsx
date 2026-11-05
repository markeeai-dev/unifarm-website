import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import NhaMayBanner from "@/components/du-an/nha-may-che-bien/NhaMayBanner";
import NhaMayThongSo from "@/components/du-an/nha-may-che-bien/NhaMayThongSo";
import NhaMayGioiThieu from "@/components/du-an/nha-may-che-bien/NhaMayGioiThieu";
import NhaMayQuyTrinh from "@/components/du-an/nha-may-che-bien/NhaMayQuyTrinh";
import NhaMayGallery from "@/components/du-an/nha-may-che-bien/NhaMayGallery";
import NhaMayTieuChuan from "@/components/du-an/nha-may-che-bien/NhaMayTieuChuan";
import NhaMaySanPham from "@/components/du-an/nha-may-che-bien/NhaMaySanPham";
import NhaMayCta from "@/components/du-an/nha-may-che-bien/NhaMayCta";

export const metadata: Metadata = {
  title: "Nhà Máy Chế Biến | Dự Án & Hợp Tác | Unifarm",
  description:
    "Tổ hợp chế biến sâu chuối và dưa hấu của Unifarm, vận hành theo dây chuyền cấp đông IQF khép kín — từ vùng trồng tập trung đến thị trường xuất khẩu.",
};

export default function NhaMayCheBienPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <main className="flex-1">
        <NhaMayBanner />
        <NhaMayThongSo />
        <NhaMayGioiThieu />
        <NhaMayQuyTrinh />
        <NhaMayGallery />
        <NhaMayTieuChuan />
        <NhaMaySanPham />
        <NhaMayCta />
      </main>
      <Footer />
    </div>
  );
}
