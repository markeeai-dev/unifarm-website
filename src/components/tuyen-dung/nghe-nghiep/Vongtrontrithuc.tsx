"use client";

import { GraduationCap, Sprout, Users } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";

const MODELS = [
  {
    icon: GraduationCap,
    title: "Đưa Học Viên Đến Nông Trại",
    desc: "Đưa sinh viên, học viên đến nơi các bài toán thực tế đang diễn ra trên cánh đồng.",
    color: "#006400",
    glow: "rgba(0,100,0,0.22)",
    image: "/images/UNIFARM/DJI_20260805085036_0330_D.JPG",
  },
  {
    icon: Sprout,
    title: "Đưa Nông Trại Vào Giảng Đường",
    desc: "Đưa dữ liệu, mẫu vật và bài toán thực tế của farm vào giảng đường, viện nghiên cứu.",
    color: "#0B7A0B",
    glow: "rgba(11,122,11,0.22)",
    image: "/images/UNIFARM/16.JPG",
  },
  {
    icon: Users,
    title: "Đưa Tri Thức Về Cộng Đồng",
    desc: "Đưa giống tốt, kỹ thuật chuẩn và tri thức quản trị trở lại cộng đồng người nông dân.",
    color: "#006400",
    glow: "rgba(0,100,0,0.22)",
    image: "/images/UNIFARM/2.jpg",
  },
];

export default function VongTronTriThuc() {
  return (
    <section className="bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center" duration={1}>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#006400]">
            Đào tạo & Cộng đồng
          </p>
          <h2 className="uppercase mt-2 text-2xl font-extrabold leading-snug text-[#06301B] sm:text-3xl lg:text-4xl">
            Vòng Tròn Tri Thức: Trường – Nông Trại – Làng
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-14">
          {MODELS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1} duration={1}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(15,40,20,0.06)] ring-1 ring-[#06301B]/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(15,40,20,0.16)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-1 -top-4 select-none text-6xl font-black leading-none text-white/25"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                    style={{ backgroundColor: m.color, boxShadow: `0 12px 24px -8px ${m.glow}` }}
                  >
                    <m.icon size={19} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="uppercase text-[15px] font-bold text-[#06301B]">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#06301B]/60">{m.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
