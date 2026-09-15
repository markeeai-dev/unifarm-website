import type { Metadata } from "next";
// import AgroviaHero from "@/components/AgroviaHero";
// import GreenPlatformIntro from "@/components/GreenPlatformIntro";
// import SmartFarmingLanding from "@/components/Smartfarminglanding";
// import SmartFarmingSolutions from "@/components/SmartFarmingSolutions";
// import SmartSolutionsSlider from "@/components/Smartsolutionsslider";
// import TrustedBy from "@/components/TrustedBy";
// import Testimonialsslider from "@/components/Testimonialsslider";
// import FaqVideoList from "@/components/Faqvideolist";
import HomeBanner from "@/components/Homebanner";
import AboutFarmHero from "@/components/Aboutfarmhero";
// import FarmQuotesBanner from "@/components/FarmQuotesBanner";
import AgroviaHero from "@/components/AgroviaHero";
import Agrihero from "@/components/Agrihero";
import RiceTabsShowcase from "@/components/Ricetabsshowcase";
import Servicessection from "@/components/Servicessection";
import NewsUpdatesSection from "@/components/Newsupdatessection";
import QuoteSlider from "@/components/Quoteslider";
import Footer from "@/components/Footer";
import Contactsection from "@/components/Contactsection";
import ClientsMarquee from "@/components/Clientsmarquee";
import FaqVideoList from "@/components/Faqvideolist";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import SocialFloat from "@/components/Socialfloat";
import TopSellingProducts from "@/components/san-pham/Topsellingproducts";
import AgricultureProjects from "@/components/Agricultureprojects";
import AgriTechHero from "@/components/Agritechhero";
import SmartFarmingShowcase from "@/components/gioi-thieu/Smartfarmingshowcase";
import Aboutbanner from "@/components/gioi-thieu/Aboutbanner";

export const metadata: Metadata = {
  title: "Unifarm | Nông nghiệp công nghệ cao Việt Nam",
  description:
    "Thành lập từ năm 2009, Unifarm là hệ sinh thái nông nghiệp công nghệ cao tại Việt Nam — từ nghiên cứu giống, canh tác bền vững, chế biến quy mô lớn đến phân phối nông sản sạch ra thị trường.",
};

export default function Home() {
  return (
    <>
      <SocialFloat />
      <ScrollToTopButton />
      {/* 1. Hero — first impression, full nav + CTA */}
      <HomeBanner />
      {/*   */}
      {/* 2. Quick trust signal right under the hero */}
      
      {/* 3-4. About us — broad intro, then a deeper feature/stats look */}
      {/* <AboutFarmHero />       */}
      <ClientsMarquee />
      <AgriTechHero />
      <Aboutbanner />
      <SmartFarmingShowcase />
      
      <AgroviaHero />
      
      {/* 5-6. What we do / why choose us */}
      {/* <Servicessection /> */}
      <AgricultureProjects />
      
      {/* <TopSellingProducts /> */}
      
      <FaqVideoList />
      {/* 7-8. Products — detailed showcase, then bestsellers */}
      <QuoteSlider />
      {/* <RiceTabsShowcase /> */}
      <NewsUpdatesSection />
      {/* 9. Secondary promo / investor CTA banner, breaks up the page before social proof */}
      {/* 10-11. Social proof + fresh content */}
      {/* 12. Contact */}
      
      <Contactsection />
      {/* <FarmQuotesBanner /> */}
      {/* <TrustedBy />
      <GreenPlatformIntro />
      <SmartFarmingSolutions />
      <SmartFarmingLanding />
      <SmartSolutionsSlider />
      <Testimonialsslider />
       */}
       

      <Footer />
    </>
  );
}
