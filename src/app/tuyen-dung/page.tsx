import type { Metadata } from "next";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/Socialfloat";
import ScrollToTopButton from "@/components/Scrolltotopbutton";
import TuyenDungHero from "@/components/tuyen-dung/Tuyendunghero";
import WhyUnifarm from "@/components/tuyen-dung/Whyunifarm";
import JobListings from "@/components/tuyen-dung/Joblistings";
import ApplyProcess from "@/components/tuyen-dung/Applyprocess";
import ApplyBenefits from "@/components/tuyen-dung/Applybenefits";
import FeedbackBox from "@/components/tuyen-dung/Feedbackbox";
import ApplyFAQ from "@/components/tuyen-dung/Applyfaq";
import ApplyFinalCTA from "@/components/tuyen-dung/Applyfinalcta";
import { sql, type Job } from "@/lib/db";

export const metadata: Metadata = {
  title: "Tuyển dụng | Unifarm",
  description:
    "Gia nhập Unifarm — hệ sinh thái nông nghiệp công nghệ cao. Xem các vị trí đang tuyển, lộ trình phát triển từ Intern đến Senior và quyền lợi khi trở thành một phần của đội ngũ.",
};

export default async function TuyenDungPage() {
  const jobs = (await sql`SELECT * FROM jobs WHERE status = 'active' ORDER BY sort_order ASC, created_at ASC`) as Job[];

  return (
    <div className="flex flex-1 flex-col">
      <SocialFloat />
      <ScrollToTopButton />
      <TuyenDungHero />
      <main className="flex-1">
        {/* <WhyUnifarm /> */}
        <ApplyBenefits />
        <JobListings jobs={jobs} />
        <ApplyProcess />
        
        <FeedbackBox />
        <ApplyFAQ />
        <ApplyFinalCTA />
      </main>
      <Footer />
    </div>
  );
}
