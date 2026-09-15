import type { Metadata } from "next";
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
import { sql, type Product } from "@/lib/db";

export const metadata: Metadata = {
  title: "Sản phẩm | Unifarm",
  description:
    "Sản phẩm Unifarm: trái cây tươi, cây giống nuôi cấy mô và sản phẩm chế biến đạt tiêu chuẩn xuất khẩu — sản xuất từ vùng trồng công nghệ cao, kiểm soát chất lượng nghiêm ngặt.",
};

export default async function SanPhamPage() {
  const products = (await sql`
    SELECT * FROM products ORDER BY sort_order ASC, created_at ASC
  `) as Product[];

  return (
    <>
      <SocialFloat />
      <ScrollToTopButton />

      <SanPhamHero />

      <FreshProduceShowcase />
      <CategoryShowcase />
      <ProductsShowcase products={products} />
      {/* <TopSellingProducts /> */}
      <NewProductAnnouncement />
      
      <RiceTabsShowcase />
      
      {/* <LeadershipCommitmentPreview /> */}

      <Footer />
    </>
  );
}
