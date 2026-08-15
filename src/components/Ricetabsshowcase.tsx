/* eslint-disable @next/next/no-img-element */
"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";

/**
 * RiceTabsShowcase
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * - Tab bar is split into equal-width columns across the full 1500px
 *   container; the whole bar eases in from the right over 4s on first
 *   scroll-into-view.
 * - Below: a tall, portrait-oriented image on the left and title / body
 *   copy (justified) / a "+ Xem thêm" button on the right, separated by
 *   a thin divider rule.
 * - First scroll-in: image eases in from the left, text eases in from
 *   the right, both over 4s.
 * - Tab switch: the image reveals with a left-anchored "curtain opening"
 *   wipe (clip-path), the text crossfades — both smooth and quick.
 *
 * Palette:
 *   Yellow      #FFFACD  (soft accent tint)
 *   Dark green  #006400  (headings / active tab / hover states)
 *   Light blue  #87CEFA  (accent tint / tab underline / + button)
 */

const ACCENT = "#87cefa";

const TABS = [
  {
    id: "chuoi-xanh",
    label: "Chuối Xanh",
    title: "Chuối Xanh Tự Nhiên",
    image: "/images/banana/banana-bunch-green-615119.jpg",
    paragraphs: [
      "Chuối xanh Unifarm được thu hoạch đúng độ già, vỏ còn xanh nhưng thịt quả đã đủ tinh bột, thường dùng để chế biến các món ăn dân dã như chuối xanh nấu ốc, gỏi chuối xanh hay ăn kèm rau sống. Nhờ được trồng theo quy trình canh tác sạch, chuối xanh giữ được vị chát nhẹ đặc trưng và độ giòn tự nhiên.",
      "Khác với chuối chín chứa nhiều đường, chuối xanh giàu tinh bột kháng và chất xơ, hỗ trợ tiêu hóa và tạo cảm giác no lâu. Đây cũng là nguyên liệu quen thuộc trong nhiều bài thuốc dân gian, được nhiều gia đình Việt tin dùng trong bữa ăn hằng ngày.",
    ],
  },
  {
    id: "chuoi-su",
    label: "Chuối Sứ",
    title: "Chuối Sứ Đặc Sản",
    image: "/images/banana/bananas-musa-571542.jpg",
    paragraphs: [
      "Chuối sứ (chuối hương) có quả to, vỏ dày, khi còn xanh thường được dùng để luộc, nướng hoặc chiên giòn — món ăn vặt quen thuộc của người Việt. Chuối sứ Unifarm được trồng trên vùng đất phù sa, quả đều, cùi dày và ít hạt.",
      "Khi chín, chuối sứ có vị ngọt thanh, mùi thơm dịu đặc trưng khác hẳn các giống chuối khác. Chuối sứ xanh còn được nhiều hộ gia đình sử dụng để chế biến các món gỏi, chuối sứ chấm muối ớt hay ăn kèm bánh xèo, mắm nêm.",
    ],
  },
  {
    id: "chuoi-tieu-xanh",
    label: "Chuối Tiêu Xanh",
    title: "Chuối Tiêu Xanh Sạch",
    image: "/images/banana/banana-shrub-1628206.jpg",
    paragraphs: [
      "Chuối tiêu xanh được tuyển chọn theo tiêu chuẩn xuất khẩu, quả thẳng, đều, được thu hoạch khi vỏ vẫn còn xanh để đảm bảo thời gian bảo quản và vận chuyển dài ngày. Đây là giống chuối phổ biến nhất trong các đơn hàng xuất khẩu của Unifarm.",
      "Sau thu hoạch, chuối tiêu xanh được xử lý qua các bước làm sạch, phân loại và đóng gói theo quy trình khép kín, hạn chế tối đa dư lượng thuốc bảo vệ thực vật. Nhờ vậy, chuối tiêu xanh Unifarm luôn giữ được độ tươi và chất lượng đồng đều khi đến tay đối tác.",
    ],
  },
  {
    id: "rau-cu-sach",
    label: "Rau Củ Sạch",
    title: "Rau Củ Quả Sạch",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    paragraphs: [
      "Rau củ sạch Unifarm được canh tác theo hướng hữu cơ, hạn chế tối đa phân bón hóa học và thuốc trừ sâu, ưu tiên sử dụng phân hữu cơ vi sinh và các biện pháp phòng trừ sâu bệnh sinh học. Mỗi luống rau đều được kiểm tra độ an toàn trước khi thu hoạch.",
      "Từ rau ăn lá, củ quả đến các loại rau gia vị, tất cả đều được thu hái đúng độ tuổi, đóng gói trong ngày để giữ trọn độ tươi ngon và giá trị dinh dưỡng. Đây là nguồn thực phẩm xanh, sạch mà Unifarm mong muốn mang đến từng bữa ăn gia đình Việt.",
    ],
  },
  {
    id: "trai-cay-huu-co",
    label: "Trái Cây Hữu Cơ",
    title: "Trái Cây Hữu Cơ",
    image: "/images/banana/banana-plant-1590834.jpg",
    paragraphs: [
      "Trái cây hữu cơ tại Unifarm được trồng theo quy trình khép kín, không sử dụng thuốc bảo vệ thực vật hóa học, đảm bảo an toàn tuyệt đối cho người tiêu dùng. Từng vườn cây đều được theo dõi sát sao từ khâu chăm sóc đến thu hoạch.",
      "Nhờ canh tác hữu cơ, trái cây giữ được hương vị tự nhiên, hàm lượng dinh dưỡng cao và thời gian bảo quản tốt hơn. Đây là lựa chọn lý tưởng cho những gia đình quan tâm đến sức khỏe và ưu tiên thực phẩm sạch trong bữa ăn hằng ngày.",
    ],
  },
  {
    id: "xuat-khau",
    label: "Xuất Khẩu Nông Sản",
    title: "Nông Sản Xuất Khẩu Tiêu Chuẩn Quốc Tế",
    image: "/images/banana/banana-green-2444554.jpg",
    paragraphs: [
      "Nông sản xuất khẩu của Unifarm được sản xuất và đóng gói theo quy trình khép kín, đạt các tiêu chuẩn kiểm định nghiêm ngặt về dư lượng thuốc bảo vệ thực vật, độ tươi và quy cách đóng gói trước khi rời kho. Mỗi lô hàng đều được truy xuất nguồn gốc rõ ràng từ vùng trồng đến cảng xuất.",
      "Với sản lượng ổn định và chất lượng đồng đều qua từng vụ mùa, chuối xanh và nông sản Việt Nam ngày càng khẳng định vị thế trên thị trường quốc tế, được nhiều đối tác tại châu Á, châu Âu và Trung Đông tin chọn nhập khẩu dài hạn.",
    ],
  },
];

export default function RiceTabsShowcase() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(true); // controls tab-switch reveal

  const active = TABS[activeIndex];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleTabClick = (i: SetStateAction<number>) => {
  if (i === activeIndex) return;

  setVisible(false);

  window.setTimeout(() => {
    setActiveIndex(i);
    setVisible(true);
  }, 700);
};

  return (
    <section ref={sectionRef} className="w-full bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* TABS — split into equal-width columns across the full container,
            eases in from the right over 4s on first scroll-into-view */}
        <div
          className="overflow-x-auto sm:overflow-visible"
          style={{
            transition: inView
              ? "transform 4000ms cubic-bezier(0.16,1,0.3,1), opacity 4000ms ease-out"
              : "none",
            transform: inView ? "translateX(0)" : "translateX(140px)",
            opacity: inView ? 1 : 0,
          }}
        >
          <div className="flex w-full min-w-max border-b border-gray-200 sm:grid sm:min-w-0 sm:grid-cols-3 lg:grid-cols-6">
            {TABS.map((tab, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(i)}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className={`group relative shrink-0 whitespace-nowrap px-5 pb-4 text-center text-sm font-semibold transition-all duration-500 ease-out sm:whitespace-normal sm:px-3 ${
                        isActive
                        ? "text-[#006400]"
                        : "text-gray-400 hover:-translate-y-[1px] hover:text-[#006400]"
                    }`}
                    >
                    {tab.label}

                    <span
                        className="absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                        backgroundColor: ACCENT,
                        transform:
                            isActive || hoverIndex === i
                            ? "scaleX(1)"
                            : "scaleX(0)",
                        opacity:
                            isActive || hoverIndex === i
                            ? 1
                            : 0,
                        }}
                    />
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-5">
          {/* LEFT: tall portrait image — slides in from the left over 4s on
              first scroll-in; on tab change it reveals with a left-anchored
              "curtain opening" wipe */}
          <div
            className="mx-auto w-full max-w-[650px] "
            style={{
              transition: inView
                ? "transform 4000ms cubic-bezier(0.16,1,0.3,1), opacity 4000ms ease-out"
                : "none",
              transform: inView ? "translateX(0)" : "translateX(-140px)",
              opacity: inView ? 1 : 0,
            }}
          >
            <div className="overflow-hidden">
              <div
                style={{
                  clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                    transition: "clip-path 700ms cubic-bezier(0.65,0,0.35,1)",
                }}
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[620px]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: title / justified body copy / divider / button —
              slides in from the right over 4s on first scroll-in, quick
              crossfade on tab change */}
            <div
                className="lg:max-w-[660px] lg:justify-self-center"
                style={{
                    transition: inView
                    ? "transform 4000ms cubic-bezier(0.16,1,0.3,1), opacity 4000ms ease-out"
                    : "none",
                    transform: inView ? "translateX(0)" : "translateX(140px)",
                    opacity: inView ? 1 : 0,
                }}
            >
            <div
              className="transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <h3 className="text-3xl font-extrabold leading-tight tracking-[-0.01em] text-[#006400] font-display sm:text-4xl lg:text-[42px]">
                {active.title}
              </h3>

              <div className="mt-6 space-y-4">
                {active.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-justify text-[15px] leading-relaxed text-gray-500"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* divider rule between the body copy and the button */}
              <div className="my-7 h-px w-full bg-gray-200" />

              <button className="group inline-flex items-center gap-4">
                <span
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md ring-4 ring-[#87cefa]/15 transition-all duration-300 group-hover:ring-[#87cefa]/30"
                  style={{ backgroundColor: ACCENT }}
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span className="text-sm font-semibold tracking-wide text-gray-800 font-display transition-colors duration-300 group-hover:text-[#006400]">
                  Xem thêm
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}