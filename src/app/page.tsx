// import AgroviaHero from "@/components/AgroviaHero";
// import GreenPlatformIntro from "@/components/GreenPlatformIntro";
// import SmartFarmingLanding from "@/components/Smartfarminglanding";
// import SmartFarmingSolutions from "@/components/SmartFarmingSolutions";
// import SmartSolutionsSlider from "@/components/Smartsolutionsslider";
// import TrustedBy from "@/components/TrustedBy";
// import Testimonialsslider from "@/components/Testimonialsslider";
// import FaqVideoList from "@/components/Faqvideolist";
import AgricultureHero from "@/components/Agriculturehero";
import AboutFarmHero from "@/components/Aboutfarmhero";
// import FarmQuotesBanner from "@/components/FarmQuotesBanner";
import AgroviaHero from "@/components/AgroviaHero";
import Agrihero from "@/components/Agrihero";
import RiceTabsShowcase from "@/components/Ricetabsshowcase";
import SmartFarmingShowcase from "@/components/Smartfarmingshowcase";
import Servicessection from "@/components/Servicessection";
import TopSellingProducts from "@/components/Topsellingproducts";
import NewsUpdatesSection from "@/components/Newsupdatessection";
import QuoteSlider from "@/components/Quoteslider";
import Footer from "@/components/Footer";
import Contactsection from "@/components/Contactsection";
import ClientsMarquee from "@/components/Clientsmarquee";
import FaqVideoList from "@/components/Faqvideolist";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import SocialFloat from "@/components/Socialfloat";

export default function Home() {
  return (
    <>
    <SocialFloat />
      <ScrollToTopButton />
      {/* 1. Hero — first impression, full nav + CTA */}
      <AgricultureHero />
      {/* 2. Quick trust signal right under the hero */}
      <ClientsMarquee />
      {/* 3-4. About us — broad intro, then a deeper feature/stats look */}
      <AboutFarmHero />      
      <Agrihero />
      <AgroviaHero />
      {/* 5-6. What we do / why choose us */}
      <Servicessection />   
      <SmartFarmingShowcase />
      {/* 7-8. Products — detailed showcase, then bestsellers */}
      <QuoteSlider />
      <RiceTabsShowcase />
      <TopSellingProducts />
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
       <FaqVideoList />

      <Footer />
    </>
  );
}
