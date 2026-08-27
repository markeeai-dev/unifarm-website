'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/lib/use-is-mobile';

const POSTER = '/video-posters/2021-2.jpg';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
const NAV_LINKS = ['Trang chủ', 'Về chúng tôi', 'Giải pháp', 'Nhà đầu tư', 'Câu chuyện thành công'];

const SLIDES = [
  {
    title: (
      <>
        Nghiên cứu &amp; Giống cây trồng
      </>
    ),
    subhead:
      'Tìm kiếm, tuyển chọn, thử nghiệm và phát triển những bộ giống có khả năng thích nghi và tạo giá trị cao trong điều kiện sản xuất thực tế.',
  },
  {
    title: (
      <>
        Sản xuất quy mô lớn
      </>
    ),
    subhead:
      'Trang trại là nơi thử nghiệm công nghệ, chuẩn hóa quy trình, đào tạo con người, thu thập dữ liệu và kiểm chứng ý tưởng trước khi nhân rộng.',
  },
  {
    title: (
      <>
        Liên kết sản xuất
      </>
    ),
    subhead:
      'Chuẩn hóa và chuyển giao những quy trình đã kiểm chứng thành công cho các hợp tác xã, doanh nghiệp và nông dân liên kết.',
  },
  {
    title: (
      <>
        Sau thu hoạch &amp; Chế biến
      </>
    ),
    subhead:
      'Xử lý, đóng gói, kiểm soát chuỗi lạnh và chế biến chuyên sâu nhằm giữ trọn giá trị nông sản và đáp ứng tiêu chuẩn khắt khe của thị trường.',
  },
  {
    title: (
      <>
        Tiếp nhận ý kiến thị trường
      </>
    ),
    subhead:
      'Lấy phản hồi và tiêu chuẩn kỹ thuật từ thị trường quay trở lại định hướng quy trình thu hoạch, canh tác, chọn giống và nghiên cứu.',
  },
];

const SLIDE_INTERVAL = 3800;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AgroviaHero() {
  const [activeNav, setActiveNav] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const isMobile = useIsMobile();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- headline auto-rotate ---- */
  const startAutoRotate = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
  };

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (i: number) => {
    setSlide(i);
    startAutoRotate();
  };

  return (
    <section className="relative isolate flex min-h-[74vh] w-full flex-col overflow-hidden sm:min-h-[80vh]">
      {/* ---------------- BACKGROUND VIDEO ----------------
          Nguồn chỉ có 854x480 (không có bản độ phân giải cao hơn), nên khi
          phủ kín màn hình sẽ hơi mềm — bỏ scale thừa (từng làm mờ thêm) và
          tăng contrast/saturation nhẹ để bù lại độ nét cảm nhận, đồng thời
          giảm lớp phủ tối để chi tiết thật của video hiện rõ hơn. */}
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover [filter:contrast(1.14)_saturate(1.18)_brightness(1.04)]"
      />
      {(
        <video
          className="absolute inset-0 -z-30 h-full w-full object-cover [filter:contrast(1.14)_saturate(1.18)_brightness(1.04)]"
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER}
        >
          <source src="/video/2021-2.mp4" type="video/mp4" />
        </video>
      )}

      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,26,16,0.4) 0%, rgba(10,26,16,0.04) 22%, rgba(10,26,16,0.02) 45%, rgba(9,20,13,0.42) 78%, rgba(6,14,9,0.74) 100%), linear-gradient(90deg, rgba(6,14,9,0.28) 0%, transparent 35%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Mobile dropdown menu */}
      <div
        className={`absolute left-5 right-5 top-[84px] z-[19] flex flex-col gap-0.5 overflow-hidden rounded-[20px] border border-white/[0.28] bg-ink-deep/90 backdrop-blur-lg transition-all duration-[400ms] ease-[cubic-bezier(.65,0,.2,1)] md:hidden ${
          mobileOpen ? 'max-h-[400px] p-2.5 opacity-100' : 'max-h-0 p-0 opacity-0'
        }`}
      >
        {NAV_LINKS.map((label, i) => (
          <a
            key={label}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveNav(i);
              setMobileOpen(false);
            }}
            className={`rounded-xl px-4 py-3.5 text-[0.95rem] font-semibold transition-colors duration-200 hover:bg-white/10 ${
              activeNav === i ? 'text-[#87cefa]' : 'text-cream'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* ---------------- HERO TEXT ---------------- */}
      <div className="relative z-10 flex flex-1 items-end px-7 pb-10 sm:px-14 sm:pb-36 lg:pl-80 lg:pr-20">
        <div className="max-w-[680px] lg:max-w-[780px]">
          <div className="relative min-h-[250px] animate-rise-in opacity-0 sm:min-h-[220px] lg:min-h-[280px] [animation-delay:.25s]">
            {SLIDES.map((s, i) => (
              <div
                key={i}
                className={`transition-[opacity,transform] ease-[cubic-bezier(.22,.9,.28,1)] ${
                  isMobile ? 'duration-150' : 'duration-500'
                } ${
                  slide === i
                    ? 'relative translate-y-0 opacity-100'
                    : 'pointer-events-none absolute inset-0 translate-y-3.5 opacity-0'
                }`}
              >
                <h1 className="uppercase text-[2.3rem] font-medium leading-[1.06] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.25)] sm:text-[3rem] lg:text-[3.6rem] [&_em]:font-medium [&_em]:not-italic [&_em]:italic [&_em]:text-[#87cefa]">
                  {s.title}
                </h1>
                <p className="mt-4 max-w-[420px] font-sans text-[1.25rem] font-medium leading-[1.55] text-cream/[0.82] lg:max-w-[540px] lg:text-[1.4rem]">
                  {s.subhead}
                </p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-5 flex animate-rise-in gap-1.5 opacity-0 [animation-delay:.4s]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goToSlide(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  slide === i ? 'w-[34px] bg-[#87cefa]' : 'w-[22px] bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex animate-rise-in flex-wrap gap-3.5 font-sans opacity-0 [animation-delay:.55s]">
            <button className="group inline-flex items-center gap-2.5 rounded-full border border-[#87cefa] bg-[#87cefa] px-6 py-3.5 text-[0.92rem] font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:shadow-[0_12px_26px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[.97]">
              Hợp Tác Cùng Unifarm
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="rounded-full border border-white/55 bg-transparent px-6 py-3.5 text-[0.92rem] font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:text-ink active:translate-y-0 active:scale-[.97]">
              Đánh Giá Nông Trại
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
