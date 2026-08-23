/* eslint-disable @next/next/no-img-element */
"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import Link from "next/link";

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

function ShieldCheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    id: "tieu-chuan-nong-trai",
    tabLabel: "Tiêu Chuẩn Nông Trại",
    title: "Vùng Canh Tác Công Nghệ Cao Chuẩn GlobalGAP",
    image: "/images/UNIFARM/1787207482450_1582751505492234802_4935324150679931320_0794621ead9929dd3c30a18993f1671e.jpg",
    icon: ShieldCheckIcon,
    items: [
      {
        lead: "Quy mô hơn 400 ha tại An Thái (Bình Dương)",
        text: "Vùng sản xuất tập trung khép kín, được cách ly an toàn với môi trường ô nhiễm bên ngoài.",
      },
      {
        lead: "Hạ tầng tự động hóa",
        text: "Ứng dụng công nghệ tưới bù áp tự động và mạng lưới nhà kính hiện đại, chuyển giao kỹ thuật trực tiếp từ các chuyên gia Philippines và Israel.",
      },
      {
        lead: "Chứng nhận Quốc tế",
        text: "Đạt chuẩn GlobalGAP và VietGAP toàn diện, trực tiếp đáp ứng tiêu chuẩn kiểm dịch và chất lượng của các thị trường khó tính như Nhật Bản và Hàn Quốc.",
      },
    ],
    cta: "Liên hệ xem hồ sơ chứng nhận",
  },
  {
    id: "kiem-dinh-du-luong",
    tabLabel: "Kiểm Định Dư Lượng",
    title: "Kiểm Soát 100% An Toàn & Không Dư Lượng",
    image: "/images/UNIFARM/2.jpg",
    icon: FlaskIcon,
    items: [
      {
        lead: "Bảo vệ sinh học",
        text: "Tối ưu hóa thiên địch (sử dụng kiến vàng, bẫy sinh học) để diệt côn trùng, hạn chế tối đa việc can thiệp hóa chất nông nghiệp.",
      },
      {
        lead: "Thời gian cách ly tuyệt đối",
        text: "Quy trình bón phân và chăm sóc tuân thủ thời gian cách ly nghiêm ngặt trước kỳ thu hoạch.",
      },
      {
        lead: "Kiểm nghiệm độc lập",
        text: "Lấy mẫu định kỳ xét nghiệm hàng trăm hoạt chất BVTV và chỉ số kim loại nặng, cam kết 0% dư lượng cấm khi ra thị trường.",
      },
    ],
    cta: "Liên hệ Xem Kết Quả Kiểm Nghiệm Mẫu",
  },
  {
    id: "quy-trinh-so-che",
    tabLabel: "Quy Trình Sơ Chế",
    title: "Quy Trình Sơ Chế 4 Giờ Chuẩn Xuất Khẩu",
    image: "/images/UNIFARM/DJI_20260805085036_0330_D.JPG",
    icon: PackageIcon,
    items: [
      {
        lead: "Thu hoạch bằng hệ thống cáp treo ròng rọc",
        text: "Buồng chuối sau khi cắt được treo trên dàn ròng rọc tự động đưa thẳng vào xưởng, loại bỏ 100% rủi ro va đập, dập thâm quả.",
      },
      {
        lead: "Bể rửa khử khuẩn & xử lý mủ",
        text: "Rửa sạch bụi bẩn và mủ tự nhiên bằng nguồn nước kiểm soát nhiệt độ và xử lý vi sinh vô trùng.",
      },
      {
        lead: "Quy cách đóng gói xuất khẩu",
        text: "Phân nải chuẩn kích cỡ, cân định lượng chuẩn xác từng khay/thùng, sử dụng túi thoáng khí và thùng carton 5 lớp chống ẩm chịu lực.",
      },
    ],
    cta: "Liên hệ để biết thêm về quy trình",
  },
  {
    id: "he-thong-kho-lanh",
    tabLabel: "Hệ Thống Kho Lạnh",
    title: "Bảo Quản Chuỗi Lạnh Khép Kín Từ Nông Trại",
    image: "/images/UNIFARM/16.JPG",
    icon: SnowflakeIcon,
    items: [
      {
        lead: "Quy tắc vàng 4 giờ",
        text: "Toàn bộ chuối từ lúc cắt tại vườn đến khi hoàn tất đóng gói và đưa vào kho lạnh diễn ra không quá 4 tiếng đồng hồ.",
      },
      {
        lead: "Nhiệt độ bảo quản chuẩn 13°C – 15°C",
        text: "Kiểm soát độ ẩm và dòng khí lạnh đồng đều, kìm hãm độ chín tự nhiên mà vẫn giữ trọn màu sắc và cấu trúc tươi giòn của quả.",
      },
      {
        lead: "Vận chuyển container lạnh chuyên dụng",
        text: "Kết nối liền mạch từ kho lạnh An Thái đến các hệ thống siêu thị nội địa và cảng biển xuất khẩu.",
      },
    ],
    cta: "Liên hệ để xem kho lạnh",
  },
  {
    id: "truy-xuat-nguon-goc",
    tabLabel: "Truy Xuất Nguồn Gốc Bằng QR",
    title: "Minh Bạch Xuất Xứ & Mã Số Vùng Trồng (PUC)",
    image: "/images/UNIFARM/20260805_083315.jpg",
    icon: QrCodeIcon,
    items: [
      {
        lead: "Mã số vùng trồng quốc gia (Farm Code)",
        text: "Mỗi lô hàng đều được cấp mã vùng trồng được Cục Bảo vệ Thực vật và hải quan các nước nhập khẩu cấp phép.",
      },
      {
        lead: "Nhật ký canh tác số hóa",
        text: "Toàn bộ thông tin từ ngày trổ buồng, bọc nải, ngày thu hoạch và kỹ sư giám sát đều được lưu trữ minh bạch.",
      },
      {
        lead: "Mã QR định danh trên từng thùng hàng",
        text: "Khách hàng và đối tác chỉ cần quét mã QR để tra cứu đầy đủ nguồn gốc xuất xứ của từng lô sản phẩm.",
      },
    ],
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
        {/* TABS — kiểu "hồ sơ file": tab đang mở nổi lên và nối liền với
            khung nội dung màu trắng, các tab còn lại lùi thấp hơn/tối màu
            hơn như đang nằm phía sau trong một tập hồ sơ. */}
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
          <div className="flex w-full min-w-max items-end gap-1.5 sm:grid sm:min-w-0 sm:grid-cols-5 sm:items-end sm:gap-2">
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
                  {tab.tabLabel}
                </button>
              );
            })}
          </div>
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
                  style={{
                    clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                    transition: "clip-path 700ms cubic-bezier(0.65,0,0.35,1)",
                  }}
                >
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[480px]"
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
                Hồ sơ {String(activeIndex + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}
              </div>

              <h3 className="font-display mt-3 text-balance text-3xl font-extrabold leading-[1.2] tracking-[-0.01em] text-[#006400] sm:text-4xl lg:text-[38px]">
                {active.title}
              </h3>
              <span
                className="mt-4 block h-1 w-14 rounded-full"
                style={{ background: `linear-gradient(90deg, #006400, ${ACCENT})` }}
              />

              <ul className="mt-6 space-y-4">
                {active.items.map((it, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006400]/10 text-[#006400]">
                      <active.icon className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[15px] leading-relaxed text-gray-600">
                      <span className="font-bold text-neutral-800">{it.lead}: </span>
                      {it.text}
                    </p>
                  </li>
                ))}
              </ul>

              {/* divider rule between the body copy and the button */}
              <div className="my-7 h-px w-full bg-gray-200" />

              <Link href="/#contact" className="group inline-flex items-center gap-4">
                <span
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md ring-4 ring-[#87cefa]/15 transition-all duration-300 group-hover:ring-[#87cefa]/30"
                  style={{ backgroundColor: ACCENT }}
                >
                  <PhoneIcon />
                </span>
                <span className="text-sm font-semibold tracking-wide text-gray-800 font-display transition-colors duration-300 group-hover:text-[#006400]">
                  {active.cta}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
