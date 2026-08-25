"use client";

import { Sprout, Droplets, PackageCheck, LineChart } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";

const DEFINITIONS = [
  {
    icon: Sprout,
    text: "Người chăm sóc cây giỏi phải hiểu cây, hiểu đất và hiểu rễ.",
  },
  {
    icon: Droplets,
    text: "Người vận hành tưới phải hiểu nước, áp lực và thiết bị điều khiển.",
  },
  {
    icon: PackageCheck,
    text: "Người Packing House phải hiểu chất lượng, tiêu chuẩn và độ hoàn thiện của từng thùng hàng.",
  },
  {
    icon: LineChart,
    text: "Người quản lý phải hiểu cây – người – sản lượng – chất lượng – chi phí – dữ liệu.",
  },
];

export default function NgheChuyenNghiep() {
  return (
    <section
      id="nghe-chuyen-nghiep"
      className="bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
            Giá trị nghề nghiệp
          </p>
          <h2 className="uppercase mt-2 text-2xl font-extrabold leading-snug text-[#06301B] sm:text-3xl lg:text-4xl">
            Người Làm Nông Nghiệp Giỏi Là Một Người Có Nghề
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#06301B]/65 sm:text-[15px]">
            Nông nghiệp chuyên nghiệp là một tập hợp của rất nhiều nghề chuyên môn khác
            nhau, mỗi vị trí đều đòi hỏi kiến thức và tay nghề riêng.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <Reveal className="order-2 lg:order-1" duration={1}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_70px_-25px_rgba(15,40,20,0.4)]">
              <Image
                src="/images/UNIFARM/20260805_083315.jpg"
                alt="Người lao động Unifarm với sản phẩm chuối vừa thu hoạch"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06301B]/70 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-6 text-lg font-extrabold leading-snug text-white sm:text-xl">
                Mỗi vị trí một chuyên môn — cùng tạo nên một nông trường vận hành trơn tru
              </p>
            </div>
          </Reveal>

          <div className="order-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:order-2">
            {DEFINITIONS.map(({ icon: Icon, text }, i) => (
              <Reveal key={text} delay={i * 0.1} duration={1}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(15,40,20,0.06)] ring-1 ring-[#06301B]/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,40,20,0.14)]">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#006400] transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006400] text-white shadow-lg transition-transform duration-400 group-hover:-translate-y-1 group-hover:scale-105">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <p className="mt-5 text-sm leading-relaxed text-[#06301B]/75">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
