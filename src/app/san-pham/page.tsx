import TopSellingProducts from "@/components/san-pham/Topsellingproducts";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import SocialFloat from "@/components/Socialfloat";
import FreshProduceShowcase from "@/components/san-pham/Freshproduceshowcase";
import CategoryShowcase from "@/components/san-pham/Categoryshowcase";
import ProductsShowcase from "@/components/san-pham/Productsshowcase";
import NewProductAnnouncement from "@/components/san-pham/Newproductannouncement";
import LeadershipCommitmentPreview from "@/components/san-pham/Leadershipcommitmentpreview";
import SanPhamHero from "@/components/san-pham/Sanphamhero";
import RiceTabsShowcase from "@/components/Ricetabsshowcase";

export default function SanPhamPage() {
  return (
    <>
      <SocialFloat />
      <ScrollToTopButton />

      <SanPhamHero />

      <FreshProduceShowcase />
      <CategoryShowcase />
      <ProductsShowcase />
      {/* <TopSellingProducts /> */}
      <NewProductAnnouncement />
      
      <RiceTabsShowcase />
      
      {/* <LeadershipCommitmentPreview /> */}

      <Footer />
    </>
  );
}
