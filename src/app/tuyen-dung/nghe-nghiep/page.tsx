import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import NgheNghiepHeroBanner from "@/components/tuyen-dung/nghe-nghiep/Nghenghiepherobanner";
import NgheChuyenNghiep from "@/components/tuyen-dung/nghe-nghiep/Nghechuyennghiep";
import LoTrinh from "@/components/tuyen-dung/nghe-nghiep/Lotrinh";
import KyNangThuNhap from "@/components/tuyen-dung/nghe-nghiep/Kynangthunhap";
import VongTronTriThuc from "@/components/tuyen-dung/nghe-nghiep/Vongtrontrithuc";
import TimViTri from "@/components/tuyen-dung/nghe-nghiep/Timvitri";
import NgheNghiepFAQ from "@/components/tuyen-dung/nghe-nghiep/Nghenghiepfaq";
import NgheNghiepCTA from "@/components/tuyen-dung/nghe-nghiep/Nghenghiepcta";

export const metadata: Metadata = {
  title: "Nghề nghiệp | Unifarm",
  description:
    "Văn hoá & con đường nghề nghiệp tại Unifarm — nông nghiệp hiện đại cần những con người hiện đại, với hai lộ trình phát triển bình đẳng: quản lý và chuyên môn.",
};

export default function NgheNghiepPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <NgheNghiepHeroBanner />
      <main className="flex-1">
        <NgheChuyenNghiep />
        <LoTrinh />
        <KyNangThuNhap />
        <VongTronTriThuc />
        <TimViTri />
        {/* <NgheNghiepFAQ /> */}
        <NgheNghiepCTA />
      </main>
      <Footer />
    </div>
  );
}
