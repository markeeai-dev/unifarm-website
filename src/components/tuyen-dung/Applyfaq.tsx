"use client";

import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const FAQS = [
  {
    q: "Tôi có thể ứng tuyển những vị trí nào?",
    a: "Các vị trí đang tuyển được cập nhật tại mục Cơ hội nghề nghiệp. Bạn có thể tìm theo lĩnh vực công việc, địa điểm, kinh nghiệm và yêu cầu của từng vị trí.",
  },
  {
    q: "Tôi cần chuẩn bị gì để ứng tuyển?",
    a: "Hồ sơ và yêu cầu cụ thể được ghi tại từng vị trí. Với hầu hết vị trí, bạn có thể bắt đầu bằng việc gửi CV và thông tin liên hệ.",
  },
  {
    q: "Tôi chưa có kinh nghiệm trong nông nghiệp, có thể ứng tuyển không?",
    a: "Có nhiều công việc trong nông nghiệp cần kiến thức và kỹ năng từ những lĩnh vực khác. Điều quan trọng là yêu cầu cụ thể của từng vị trí và khả năng học hỏi để thích nghi với công việc.",
  },
  {
    q: "Unifarm có tuyển sinh viên thực tập và người mới tốt nghiệp không?",
    a: "Các chương trình và vị trí phù hợp sẽ được công bố theo nhu cầu tuyển dụng từng thời điểm.",
  },
  {
    q: "Làm việc tại nông trường có được hỗ trợ chỗ ở và đi lại không?",
    a: "Tùy địa điểm và vị trí công việc, Unifarm có thể có các chính sách hỗ trợ khác nhau. Thông tin cụ thể sẽ được trao đổi trong quá trình tuyển dụng.",
  },
  {
    q: "Tôi có thể phát triển nghề nghiệp tại Unifarm như thế nào?",
    a: "Unifarm định hướng phát triển theo cả con đường quản lý và con đường chuyên môn. Bạn có thể tìm hiểu chi tiết tại trang Nghề nghiệp tại Unifarm.",
  },
];

export default function ApplyFAQ() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
            {t("Giải đáp nhanh")}
          </p>
          <h2 className="uppercase mt-3 text-2xl font-extrabold text-[#06301B] sm:text-3xl md:text-4xl">
            {t("Câu hỏi thường gặp")}
          </h2>
        </Reveal>

        <Reveal delay={0.15} duration={1} className="mt-12 divide-y divide-[#06301B]/10 border-t border-[#06301B]/10">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[15px] font-semibold text-[#06301B]">{t(item.q)}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006400] text-white">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                {isOpen && (
                  <p className="-mt-2 max-w-2xl pb-5 text-sm leading-relaxed text-[#06301B]/60">
                    {t(item.a)}
                  </p>
                )}
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={0.2} duration={1} className="mt-10 text-center">
          <Link
            href="/tuyen-dung/nghe-nghiep"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#006400] transition-colors hover:text-[#06301B]"
          >
            {t("Tìm hiểu con đường nghề nghiệp")}
            <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
