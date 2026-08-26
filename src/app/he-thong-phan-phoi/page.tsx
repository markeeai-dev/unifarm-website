import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import HeThongPhanPhoiBanner from "@/components/Hethongphanphoibanner";
import HeThongPhanPhoi from "@/components/Hethongphanphoi";
import { sql, type Distributor } from "@/lib/db";

export const metadata: Metadata = {
  title: "Hệ thống phân phối | Unifarm",
  description:
    "Danh sách cửa hàng phân phối nông sản Unifarm — tìm cửa hàng gần bạn nhất theo tỉnh/thành và quận/huyện.",
};

// Cửa hàng thêm/sửa/xoá trong admin cần hiện lên trang này mà không phải
// deploy lại — làm mới dữ liệu tối đa mỗi 60s (giống trang /blog).
export const revalidate = 60;

export default async function HeThongPhanPhoiPage() {
  const stores = (await sql`
    SELECT * FROM distributors ORDER BY sort_order ASC, created_at ASC
  `) as Distributor[];

  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <HeThongPhanPhoiBanner />
      <main className="flex-1">
        <HeThongPhanPhoi stores={stores} />
      </main>
      <Footer />
    </div>
  );
}
