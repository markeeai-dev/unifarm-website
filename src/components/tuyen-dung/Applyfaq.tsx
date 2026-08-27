"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Reveal from "./Reveal";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const FAQS = [
  {
    q: "Ai có thể ứng tuyển chương trình này?",
    a: "Chương trình mở cho sinh viên năm 3, năm 4 và người mới tốt nghiệp trong vòng 1 năm. Một số vị trí Fresher/Junior/Senior ưu tiên người đã có kinh nghiệm.",
  },
  {
    q: "Vị trí thực tập có được trả trợ cấp không?",
    a: "Có. Mọi vị trí thực tập tại Unifarm đều có trợ cấp hàng tháng, mức cụ thể ghi rõ trong từng tin tuyển dụng.",
  },
  {
    q: "Làm việc xa nhà thì có được hỗ trợ chỗ ở không?",
    a: "Các vị trí làm việc tại nhà máy hoặc vùng nguyên liệu (Vĩnh Long, An Giang, Đồng Nai...) được hỗ trợ nhà ở và xe đưa đón theo ca.",
  },
  {
    q: "Sau khi thực tập, tôi có cơ hội trở thành nhân viên chính thức không?",
    a: "Có. Phần lớn thực tập sinh hoàn thành tốt chương trình được đề nghị ký hợp đồng chính thức ở cấp Fresher trở lên.",
  },
  {
    q: "Tôi cần chuẩn bị hồ sơ như thế nào để ứng tuyển?",
    a: "Bạn chỉ cần CV (tiếng Việt hoặc tiếng Anh) gửi qua email hoặc bấm nút Ứng tuyển ngay tại vị trí mong muốn — không cần đơn xin việc theo mẫu.",
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
      </div>
    </section>
  );
}
