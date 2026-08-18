import Image from "next/image";
import Link from "next/link";
import SmartFarmingShowcase from "@/components/gioi-thieu/Smartfarmingshowcase";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import SocialFloat from "@/components/Socialfloat";
import TeamMembers from "@/components/gioi-thieu/Teammembers";
import EarthWaterLove from "@/components/gioi-thieu/Earthwaterlove";
import CompanyJourney from "@/components/gioi-thieu/Companyjourney";
import HeroBanner from "@/components/gioi-thieu/Herobanner";
import AboutBanner from "@/components/gioi-thieu/Aboutbanner";
import PhilosophySection from "@/components/gioi-thieu/Philosophysection";
import StatsSectionPreview from "@/components/gioi-thieu/Statssectionpreview";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Dự án", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Góc chia sẻ", href: "/" },
  { label: "Tuyển dụng", href: "/" },
];

export default function GioiThieuPage() {
  return (
    <>
      <SocialFloat />
      <ScrollToTopButton />
      <HeroBanner />
      <EarthWaterLove />
      <AboutBanner />
      <PhilosophySection />
      <StatsSectionPreview />
      <SmartFarmingShowcase />
      <TeamMembers />
      
      {/* <CompanyJourney /> */}

      <Footer />
    </>
  );
}
