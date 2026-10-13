"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * RiceTabsShowcase — "Hồ sơ tiêu chuẩn Unifarm"
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * - Rút gọn về đúng 5 mục tiêu chuẩn/quy trình thật của Unifarm.
 * - Thanh tab được thiết kế theo kiểu "hồ sơ file" (folder tab): tab đang
 *   chọn nổi lên, nối liền với khung nội dung màu trắng bên dưới; các tab
 *   còn lại lùi xuống thấp hơn và tối màu hơn, như những hồ sơ nằm phía
 *   sau — đúng cảm giác đang "rút một tệp hồ sơ" ra xem.
 * - Khung nội dung: đánh số "Hồ sơ 0x/05", tiêu đề lớn, danh sách các mục
 *   thông tin (đậm phần đầu dòng), nút liên hệ riêng theo từng hồ sơ.
 * - Đổi tab: ảnh mở màn theo kiểu cuốn màn từ trái, chữ crossfade nhẹ.
 *
 * Palette:
 *   Yellow      #FFFACD  (soft accent tint)
 *   Dark green  #006400  (headings / active tab / hover states)
 *   Light blue  #87CEFA  (accent tint / tab underline / + button)
 */

const ACCENT = "#87cefa";

function FlaskIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 3h6M10 3v6.2L5.5 18a2 2 0 0 0 1.8 2.9h9.4a2 2 0 0 0 1.8-2.9L14 9.2V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PackageIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 8v8a1 1 0 0 1-.5.87l-8 4.5a1 1 0 0 1-1 0l-8-4.5A1 1 0 0 1 3 16V8a1 1 0 0 1 .5-.87l8-4.5a1 1 0 0 1 1 0l8 4.5A1 1 0 0 1 21 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.3 7.3 12 12l8.7-4.7M12 12v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SnowflakeIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2v20M4.9 5.5l14.2 13M19.1 5.5 4.9 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 2 9.8 4.2M12 2l2.2 2.2M12 22l-2.2-2.2M12 22l2.2-2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function QrCodeIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 14h3v3h-3v-3ZM20 14h1v1h-1v-1ZM14 20h1v1h-1v-1ZM17 17h1v1h-1v-1ZM20 20h1v1h-1v-1Z" fill="currentColor" />
    </svg>
  );
}

const TABS = [
  {
    id: "kiem-soat-du-luong",
    tabLabel: "Kiểm Soát Dư Lượng",
    title: "Kiểm Soát Từ Đầu Vào",
    image: "/images/UNIFARM/2.jpg",
    icon: FlaskIcon,
    kind: "steps" as const,
    items: [
      {
        lead: "01 · Đầu vào",
        text: "Kiểm soát danh mục vật tư và thuốc BVTV theo cây trồng và yêu cầu của thị trường đích.",
      },
      {
        lead: "02 · Trong sản xuất",
        text: "Ghi nhận việc sử dụng vật tư; tăng cường giải pháp sinh học và quản lý dịch hại tổng hợp nhằm giảm phụ thuộc vào hóa chất.",
      },
      {
        lead: "03 · Trước thu hoạch",
        text: "Kiểm soát thời gian cách ly và đối chiếu giới hạn dư lượng theo yêu cầu của thị trường.",
      },
      {
        lead: "04 · Kiểm nghiệm",
        text: "Thực hiện kiểm nghiệm dư lượng theo yêu cầu của sản phẩm, khách hàng hoặc thị trường trước khi cung ứng.",
      },
    ],
    cta: "Liên hệ Xem Kết Quả Kiểm Nghiệm Mẫu",
  },
  {
    id: "so-che-dong-goi",
    tabLabel: "Sơ Chế & Đóng Gói",
    title: "Giữ Chất Lượng Sau Thu Hoạch",
    image: "/images/UNIFARM/DJI_20260805085036_0330_D.JPG",
    icon: PackageIcon,
    kind: "flow" as const,
    flow: ["Thu hoạch", "Vận chuyển về nhà đóng gói", "Sơ chế & phân loại", "Đóng gói"],
    cta: "Liên hệ để biết thêm về quy trình",
  },
  {
    id: "bao-quan-van-chuyen",
    tabLabel: "Bảo Quản & Vận Chuyển",
    title: "Kiểm Soát Đến Khi Giao Hàng",
    image: "/images/UNIFARM/16.JPG",
    icon: SnowflakeIcon,
    kind: "flow" as const,
    flow: ["Sau đóng gói", "Lưu kho", "Vận chuyển", "Giao hàng"],
    cta: "Liên hệ để xem kho lạnh",
  },
  {
    id: "truy-xuat-nguon-goc",
    tabLabel: "Truy Xuất Nguồn Gốc",
    title: "Từ Một Thùng Hàng Trở Về Vùng Trồng",
    image: "/images/UNIFARM/20260805_083315.jpg",
    icon: QrCodeIcon,
    kind: "flow" as const,
    flow: ["Mã thùng hàng", "Lô đóng gói", "Ngày thu hoạch / đóng gói", "Vùng trồng", "Hồ sơ sản xuất liên quan"],
    note: "Thông tin truy xuất được kết nối với hệ thống quản lý sản xuất và đóng gói của Unifarm theo phạm vi dữ liệu áp dụng cho từng sản phẩm.",
    cta: "Liên hệ để xem truy xuất nguồn gốc",
  },
];

function FileTabIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RiceTabsShowcase() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
    <section ref={sectionRef} className="w-full bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* TIÊU ĐỀ SECTION */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#006400] sm:text-sm">
            {t("Hệ thống kiểm soát chất lượng")}
          </p>
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-neutral-900 sm:text-3xl lg:text-[38px]">
            {t("Từ nông trại đến thị trường")}
          </h2>
        </div>

        {/* TABS — kiểu "hồ sơ file": tab đang mở nổi lên và nối liền với
            khung nội dung màu trắng, các tab còn lại lùi thấp hơn/tối màu
            hơn như đang nằm phía sau trong một tập hồ sơ. */}
        <div className="relative">
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
            <div className="flex w-full min-w-max items-end gap-1.5 sm:grid sm:min-w-0 sm:grid-cols-4 sm:items-end sm:gap-2">
              {TABS.map((tab, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(i)}
                    className={`group relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-xl border px-4 py-3.5 text-left text-[12px] font-bold transition-all duration-300 ease-out sm:w-full sm:justify-center sm:whitespace-normal sm:px-3 sm:text-center sm:text-[13px] lg:text-sm ${
                      isActive
                        ? "-mb-px z-10 border-neutral-200 border-b-[#fffde7] bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat text-[#006400] shadow-[0_-10px_24px_-12px_rgba(0,0,0,0.18)]"
                        : "translate-y-2 border-transparent bg-[#f2e9c4]/80 text-neutral-500 hover:-translate-y-0.5 hover:bg-[#f8f0d4] hover:text-[#006400]"
                    }`}
                  >
                    {/* dải màu nhấn trên đỉnh tab đang mở, như nhãn màu của hồ sơ */}
                    <span
                      className="absolute inset-x-3 top-0 h-[3px] rounded-full transition-opacity duration-300"
                      style={{ backgroundColor: ACCENT, opacity: isActive ? 1 : 0 }}
                    />
                    <FileTabIcon
                      className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                        isActive ? "text-[#87cefa]" : "text-neutral-400 group-hover:text-[#87cefa]"
                      }`}
                    />
                    {t(tab.tabLabel)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile-only affordance hint: the tab strip scrolls horizontally on
              phones (sm:overflow-visible turns it into a static grid at sm+),
              so fade the right edge to signal there's another tab cut off. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#fffde7] to-transparent sm:hidden"
          />
        </div>

        {/* KHUNG HỒ SƠ — nối liền phía dưới tab đang mở */}
        <div
          className="relative  bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat p-5  sm:p-8 lg:p-10"
          style={{
            transition: inView ? "opacity 1200ms ease-out, transform 1200ms ease-out" : "none",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
            {/* ẢNH — mở màn kiểu cuốn màn từ trái mỗi khi đổi hồ sơ */}
            <div className="mx-auto w-full max-w-[560px]">
              <div className="overflow-hidden">
                <div
                  className="relative h-[280px] w-full sm:h-[360px] lg:h-[480px]"
                  style={{
                    clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                    transition: "clip-path 700ms cubic-bezier(0.65,0,0.35,1)",
                  }}
                >
                  <Image
                    src={active.image}
                    alt={t(active.title)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* NỘI DUNG HỒ SƠ */}
            <div
              className="transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                <FileTabIcon className="h-3.5 w-3.5 text-[#87cefa]" />
                {t("Hồ sơ")} {String(activeIndex + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}
              </div>

              <h3 className="uppercase mt-3 text-balance text-3xl font-extrabold leading-[1.2] tracking-[-0.01em] text-[#006400] sm:text-4xl lg:text-[38px]">
                {t(active.title)}
              </h3>
              <span
                className="mt-4 block h-1 w-14 rounded-full"
                style={{ background: `linear-gradient(90deg, #006400, ${ACCENT})` }}
              />

              {active.kind === "steps" ? (
                <ul className="mt-6 space-y-4">
                  {active.items.map((it, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006400]/10 text-[#006400]">
                        <active.icon className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-[15px] leading-relaxed text-gray-600">
                        <span className="font-bold text-neutral-800">{t(it.lead)}: </span>
                        {t(it.text)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
                    {active.flow.map((stage, i) => (
                      <div key={stage} className="flex items-center gap-2 sm:gap-0">
                        <span className="rounded-full border border-[#006400]/20 bg-white px-4 py-2 text-[13px] font-bold text-[#006400] shadow-sm sm:text-sm">
                          {t(stage)}
                        </span>
                        {i < active.flow.length - 1 && (
                          <span
                            className="flex shrink-0 items-center justify-center text-[#87cefa] sm:mx-2 sm:rotate-0"
                            aria-hidden="true"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {active.note && (
                    <p className="mt-5 text-[13px] leading-relaxed text-gray-500">{t(active.note)}</p>
                  )}
                </>
              )}

              {/* divider rule between the body copy and the button */}
              <div className="my-7 h-px w-full bg-gray-200" />

              <Link href="/#contact" className="group inline-flex items-center gap-4">
                <span
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md ring-4 ring-[#87cefa]/15 transition-all duration-300 group-hover:ring-[#87cefa]/30"
                  style={{ backgroundColor: ACCENT }}
                >
                  <PhoneIcon />
                </span>
                <span className="text-sm font-semibold tracking-wide text-gray-800 transition-colors duration-300 group-hover:text-[#006400]">
                  {t(active.cta)}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
