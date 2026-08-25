"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "../Reveal";

const FAQS = [
  {
    q: "Chưa có kinh nghiệm nông nghiệp thì tiêu chí tuyển dụng là gì?",
    a: "Unifarm ưu tiên thái độ học hỏi, sự chăm chỉ và tinh thần cầu tiến hơn là kinh nghiệm sẵn có. Kiến thức và tay nghề chuyên môn sẽ được đào tạo trực tiếp tại nông trại.",
  },
  {
    q: "Chế độ đào tạo tay nghề 1-1 hoạt động như thế nào?",
    a: "Mỗi người mới được ghép cùng một mentor có kinh nghiệm, đồng hành sát từng đầu việc thực tế cho đến khi thành thạo, thay vì chỉ đào tạo lý thuyết trên giấy.",
  },
  {
    q: "Nếu chọn con đường chuyên gia thì cơ hội phát triển ra sao?",
    a: "Nhánh chuyên môn có lộ trình phát triển bình đẳng với nhánh quản lý — từ học nghề, thành thạo, đến chuyên gia kỹ thuật và trở thành người hướng dẫn, đào tạo lại người khác.",
  },
  {
    q: "Đời sống và tiện ích tại nông trường có đảm bảo không?",
    a: "Các vị trí làm việc tại vùng nguyên liệu được hỗ trợ nhà ở, bữa ăn và xe đưa đón theo ca, cùng không gian sinh hoạt chung để đảm bảo đời sống ổn định.",
  },
  {
    q: "Chính sách đãi ngộ dựa trên KPI năng suất được tính như thế nào?",
    a: "Thu nhập gắn liền với năng suất và chất lượng công việc thực tế, minh bạch theo từng kỳ đánh giá — kỹ năng và hiệu quả càng cao, thu nhập càng tốt.",
  },
];

export default function NgheNghiepFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
            Giải đáp
          </p>
          <h2 className="uppercase mt-3 text-2xl font-extrabold text-[#06301B] sm:text-3xl md:text-4xl">
            Câu Hỏi Thường Gặp Về Cơ Hội Nghề Nghiệp
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.08} duration={0.7}>
                <div
                  className={`overflow-hidden rounded-2xl bg-white ring-1 transition-all duration-400 ${
                    isOpen
                      ? "shadow-[0_16px_36px_rgba(15,40,20,0.12)] ring-[#006400]/25"
                      : "shadow-[0_2px_10px_rgba(15,40,20,0.06)] ring-[#06301B]/[0.06] hover:ring-[#006400]/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={`shrink-0 text-xs font-black tracking-wide transition-colors duration-300 ${
                        isOpen ? "text-[#006400]" : "text-[#06301B]/20"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 text-[15px] font-semibold transition-colors duration-300 ${
                        isOpen ? "text-[#006400]" : "text-[#06301B]"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all duration-400 ${
                        isOpen ? "rotate-[135deg] bg-[#006400]" : "rotate-0 bg-[#0B7A0B]/80"
                      }`}
                    >
                      <Plus size={14} />
                    </span>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows] duration-400 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-[#06301B]/60 sm:px-6 sm:pl-[3.5rem]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
