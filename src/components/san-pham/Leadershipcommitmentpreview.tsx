'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

/**
 * LeadershipCommitment
 * ---------------------
 * "Cam kết chất lượng từ Ban Lãnh Đạo Unifarm"
 * A cream, edge-to-edge band with a circular portrait, name/role, a quote,
 * and a dot carousel — decorated with real transparent-background PNGs
 * (basil leaves top-right, tomato cluster bottom-left) that float above
 * the section and spill past its edges for a layered 3D feel.
 *
 * NOTE on the decorative images: they're hotlinked from pngimg.com
 * (CC BY-NC 4.0 — non-commercial only). Fine for a prototype/demo, but
 * for a production/commercial site replace `DECOR.basil` / `DECOR.tomato`
 * with your own licensed PNG assets (e.g. served from /public/images/).
 *
 * All slides render simultaneously, stacked in the same CSS grid cell
 * (gridArea: '1 / 1'). The container's height is therefore always the
 * height of the TALLEST slide, so switching the active slide only
 * crossfades opacity — it never changes layout/height.
 *
 * Usage: <LeadershipCommitment />
 */

const DECOR = {
  basil: '/images/san-pham/la-dep.png',
  tomato: '/images/san-pham/ca-chua.png',
};

const SLIDES = [
  {
    name: 'Nguyễn Văn Minh',
    role: 'Tổng Giám Đốc Unifarm',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    quote:
      'Chất lượng không phải là một lời hứa suông, mà là cam kết chúng tôi thực hiện mỗi ngày, từ khâu chọn giống, canh tác đến khi sản phẩm đến tay người tiêu dùng. Unifarm luôn đặt sức khỏe khách hàng lên hàng đầu, kiểm soát nghiêm ngặt từng công đoạn để mang đến những sản phẩm nông nghiệp sạch, an toàn và bền vững nhất.',
  },
  {
    name: 'Trần Thị Hoa',
    role: 'Giám Đốc Chất Lượng',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    quote:
      'Mỗi sản phẩm rời khỏi nông trại Unifarm đều trải qua quy trình kiểm định khắt khe theo tiêu chuẩn quốc tế. Chúng tôi tin rằng niềm tin của khách hàng được xây dựng từ sự minh bạch và nhất quán trong từng lô hàng, không có ngoại lệ.',
  },
  {
    name: 'Lê Quốc Bảo',
    role: 'Giám Đốc Vận Hành Nông Trại',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    quote:
      'Canh tác bền vững là kim chỉ nam của chúng tôi. Từ đất, nước đến quy trình chăm sóc, mọi quyết định đều hướng đến một nền nông nghiệp lành mạnh cho cả người tiêu dùng và môi trường hôm nay lẫn mai sau.',
  },
];

const AUTOPLAY_MS = 6000;

export default function LeadershipCommitment() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(i);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  };

  return (
    <section className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 sm:py-20">
      {/* <h2 className="mb-10 sm:mb-14 px-4 text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-800">
        Cam kết chất lượng từ Ban Lãnh Đạo Unifarm
      </h2> */}

      <div className="relative w-full bg-[#fffde7] bg-[url('/images/nen_trang.png')] bg-repeat py-16 sm:py-20">
        {/* Decorative basil leaves — real transparent PNG, floats above the
            section and spills past the top/right edge for a layered 3D feel.
            Offsets kept smaller than the section's own edge so it stays fully
            on-screen (no viewport horizontal overflow). */}
        <img
          src={DECOR.basil}
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none select-none absolute z-20
            -top-6 -right-3 sm:-top-8 sm:-right-4 md:-top-10 md:right-2
            w-32 sm:w-44 md:w-56
            drop-shadow-[0_18px_25px_rgba(0,0,0,0.18)]
            animate-[decor-float_6s_ease-in-out_infinite]
          "
        />

        {/* Decorative tomato cluster — real transparent PNG, floats above the
            section and spills past the bottom/left edge. */}
        <img
          src={DECOR.tomato}
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none select-none absolute z-20
            -bottom-6 -left-3 sm:-bottom-8 sm:-left-6 md:-bottom-10 md:-left-6
            w-36 sm:w-52 md:w-64
            drop-shadow-[0_18px_25px_rgba(0,0,0,0.2)]
            animate-[decor-float_7s_ease-in-out_infinite]
          "
          style={{ animationDelay: '0.8s' }}
        />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
          {/* Grid-stack crossfade: every slide occupies the same grid cell
              (gridArea 1/1), so the container's height is always the tallest
              slide's height — swapping `active` only fades opacity, the
              layout never jumps or reflows. */}
          <div className="grid w-full place-items-center">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                style={{ gridArea: '1 / 1' }}
                className={`flex w-full flex-col items-center transition-opacity duration-700 ease-out ${
                  i === active
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={i !== active}
              >
                <div className="mb-5 h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-[3px] border-[#8CA86E] shadow-sm">
                  <img
                    src={slide.avatar}
                    alt={t(slide.name)}
                    className="h-full w-full object-cover"
                  />
                </div>

                <h3 className="uppercase text-lg sm:text-xl font-medium text-neutral-800">
                  {t(slide.name)}
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-[#8CA86E]">
                  {t(slide.role)}
                </p>

                <p className="mt-5 max-w-xl text-[13px] sm:text-[15px] leading-relaxed text-neutral-500">
                  {t(slide.quote)}
                </p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Xem cam kết ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === active
                    ? 'w-7 bg-[#8CA86E]'
                    : 'w-5 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes decor-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1.5deg);
          }
        }
      `}</style>
    </section>
  );
} 