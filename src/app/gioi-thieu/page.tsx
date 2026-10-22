import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql, type TimelineMilestone } from "@/lib/db";
import SmartFarmingShowcase from "@/components/gioi-thieu/Smartfarmingshowcase";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import SocialFloat from "@/components/Socialfloat";
import TeamMembers from "@/components/gioi-thieu/Teammembers";
import EarthWaterLove from "@/components/gioi-thieu/Earthwaterlove";
import CompanyJourney from "@/components/gioi-thieu/Companyjourney";
import HeroBanner from "@/components/gioi-thieu/Herobanner";
import AboutBanner from "@/components/gioi-thieu/Aboutbanner";
import CoreValues from "@/components/gioi-thieu/Corevalues";
import PhilosophySection from "@/components/gioi-thieu/Philosophysection";
import StatsSectionPreview from "@/components/gioi-thieu/Statssectionpreview";
import EarthWaterBannerPreview from "@/components/gioi-thieu/Earthwaterbannerpreview";
import CompetitiveCapability from "@/components/gioi-thieu/Competitivecapability";
import EcosystemModel from "@/components/gioi-thieu/Ecosystemmodel";
import AgriTechPillars from "@/components/gioi-thieu/Agritechpillars";
import TimelineJourney from "@/components/gioi-thieu/Timelinejourney";
import Agrihero from "@/components/Agrihero";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Dự án", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Góc chia sẻ", href: "/" },
  { label: "Tuyển dụng", href: "/" },
];

export const metadata: Metadata = {
  title: "Về chúng tôi | Unifarm",
  description:
    "Hành trình kiến tạo của Unifarm — từ 2009 đến nay: nghiên cứu giống, mở rộng vùng trồng, hợp tác chuyển giao công nghệ và xây dựng hệ sinh thái nông nghiệp bền vững tại Việt Nam.",
};

// Mốc thời gian thêm/sửa/xoá trong admin cần hiện lên trang này mà không
// phải deploy lại — làm mới dữ liệu tối đa mỗi 60s (giống trang /blog).
export const revalidate = 60;

export default async function GioiThieuPage() {
  const milestones = (await sql`
    SELECT * FROM timeline_milestones ORDER BY sort_order ASC, created_at ASC
  `) as TimelineMilestone[];

  return (
    <>
      <SocialFloat />
      <ScrollToTopButton />
      <HeroBanner />
      
      {/* <EarthWaterLove /> */}
      {/* <AboutBanner /> */}
      <CoreValues />
      <Agrihero />
      {/* <PhilosophySection /> */}
      <TimelineJourney milestones={milestones} />
      
      {/* <EarthWaterBannerPreview /> */}
      <CompetitiveCapability />
      {/* <StatsSectionPreview /> */}
      
      <EcosystemModel />
      
      {/* <TeamMembers /> */}
      {/* <AgriTechPillars /> */}
      {/* <CompanyJourney /> */}
      

      <Footer />
    </>
  );
}
