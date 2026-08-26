"use client";

/**
 * DuanTruCot — Section 2 của trang "Dự Án & Hợp Tác" (id="tru-cot")
 * ------------------------------------------------------------------
 * 3 tab chuyển đổi mượt mô tả 3 trụ cột: Vùng Trồng & Nông Trường /
 * Chế Biến & Công Nghệ / Dịch Vụ & Chuyển Giao. Mỗi tab có một ảnh thật
 * Unifarm minh hoạ riêng ở panel bên trái (crossfade kiểu "Ken Burns"),
 * card nội dung bên phải được nâng cấp lên ngôn ngữ thị giác cao cấp
 * (card trắng nổi khối + viền sáng khi hover) đồng bộ với các trang
 * mới khác trên site.
 */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: false, amount: 0.2 } as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
  soft: "#8FBF72",
  cream: "#F7F4E8",
  warm: "#FCFAF2",
  blue: "#87CEFA",
  yellow: "#FFFACD",
  ink: "#12210F",
};

type Card = {
  title: string;
  meta?: { label: string; value: string };
  bullets?: string[];
  steps?: { title: string; desc: string }[];
};

type TabData = {
  id: string;
  label: string;
  description: string;
  cards: Card[];
};

const TABS: TabData[] = [
  {
    id: "vung-trong",
    label: "Vùng Trồng & Nông Trường",
    description:
      "Hệ thống nông trường quy mô lớn được quy hoạch khép kín, ứng dụng công nghệ điều khiển tự động hóa từ Israel và tiêu chuẩn canh tác sạch chuẩn xuất khẩu.",
    cards: [
      {
        title: "Trung Tâm Nghiên Cứu R&D & Nông Trường An Thái",
        meta: {
          label: "Quy mô & vị trí",
          value: "500 ha – Xã An Thái, Huyện Phú Giáo, Tỉnh Bình Dương (Thành lập từ 06/2009)",
        },
        bullets: [
          "Trung tâm công nghệ cao đa lĩnh vực: Sinh học – Tự động hóa – Số hóa.",
          "Làm chủ công nghệ nhân giống vô tính cấy mô và mạng lưới nhà kính sinh học.",
          "Ứng dụng hệ thống tưới nhỏ giọt bù áp và phần mềm điều khiển trung tâm Israel.",
          "Vùng sản xuất cách ly an toàn sinh học, chuẩn GlobalG.A.P và VietGAP.",
          "Cây trồng: Chuối cấy mô, dưa lưới nhà kính, cây ăn trái tuyển chọn.",
        ],
      },
      {
        title: "Vùng Chuyên Canh Chuối Xuất Khẩu Dầu Tiếng",
        meta: {
          label: "Quy mô & vị trí",
          value:
            "~1.200 ha (Bao gồm phân khu Thanh An 1.000 ha và Minh Tân 194,47 ha) – Huyện Dầu Tiếng, Bình Dương",
        },
        bullets: [
          "Mô hình liên kết quy mô lớn giữa Unifarm và Công ty TNHH MTV Cao su Dầu Tiếng.",
          "Giống chủ lực: Chuối già Nam Mỹ / Cavendish (AAA) nuôi cấy mô chất lượng cao.",
          "Hệ thống cáp tải thu hoạch ròng rọc đưa buồng chuối từ vườn về nhà đóng gói, loại bỏ 100% rủi ro va đập, dập thâm quả.",
          "Nhà đóng gói chuẩn quốc tế: Bể rửa khử khuẩn nhiệt độ kiểm soát và quy cách đóng thùng carton 5 lớp chịu lực.",
        ],
      },
      {
        title: "Vùng Nông Nghiệp Công Nghệ Cao Lâm Hà (Lâm Đồng)",
        meta: {
          label: "Vị trí",
          value: "Huyện Lâm Hà, Tỉnh Lâm Đồng (Khu vực Tây Nguyên)",
        },
        bullets: [
          "Vùng sản xuất nông nghiệp công nghệ cao thích ứng với điều kiện khí hậu và thổ nhưỡng cao nguyên.",
          "Ứng dụng công nghệ tưới tiết kiệm, kiểm soát dinh dưỡng chính xác theo từng giai đoạn sinh trưởng.",
          "Canh tác theo quy trình chuẩn SOP của Unifarm, định hướng phát triển chuỗi giá trị nông sản bền vững.",
        ],
      },
    ],
  },
  {
    id: "che-bien",
    label: "Chế Biến & Công Nghệ",
    description:
      "Hiện thực hóa triết lý Waste-to-Value: Tối ưu hóa từng đơn vị tài nguyên, hạn chế thất thoát sau thu hoạch và nâng cao giá trị dược tính sinh học của nông sản Việt.",
    cards: [
      {
        title: "Dự Án Tinh Bột Kháng Chuối Xanh",
        meta: { label: "Phân loại", value: "Sản phẩm chế biến sâu giá trị cao từ nguồn chuối xanh." },
        bullets: [
          "Hàm lượng chất kháng tiêu sinh học đạt chuẩn (10g/100g), hỗ trợ nuôi dưỡng hệ vi sinh đường ruột và sức khỏe.",
          "Nâng cao giá trị thương phẩm cho trái chuối xanh, gia tăng hiệu quả kinh tế trên cùng một diện tích canh tác.",
          "Cung ứng nguyên liệu sạch cho ngành thực phẩm dinh dưỡng và dược phẩm sinh học.",
        ],
      },
      {
        title: "Tổ Hợp Cấp Đông Nhanh IQF Chuẩn Xuất Khẩu",
        meta: { label: "Ứng dụng", value: "Bảo quản nông sản tươi ngay sau thu hoạch." },
        bullets: [
          "Công nghệ làm lạnh siêu tốc giữ trọn vẹn 100% cấu trúc tế bào, màu sắc và hàm lượng dinh dưỡng tự nhiên.",
          "Kéo dài thời hạn bảo quản mà hoàn toàn không sử dụng hóa chất.",
          "Danh mục chế biến đa dạng: Chuối, Dứa MD2, Dưa lưới, Xoài, Chanh dây, Thanh long, Dưa hấu.",
          "Đáp ứng tiêu chuẩn kỹ thuật kiểm dịch của các thị trường xuất khẩu xa.",
        ],
      },
      {
        title: "Chế Biến Gia Tăng Giá Trị & Khép Kín Chuỗi Cung Ứng",
        bullets: [
          "Đa dạng hóa các dòng sản phẩm: Chuối sấy dẻo công nghệ mặt trời Tropitaste, chuối sấy giòn, Puree trái cây nguyên chất.",
          "Giải quyết triệt để bài toán nông sản dạt/loại 2, biến phế phẩm thành nguồn thu kinh tế ổn định.",
          "Sẵn sàng chuyển giao công nghệ và hợp tác gia công đóng gói theo đơn đặt hàng lớn.",
        ],
      },
    ],
  },
  {
    id: "dich-vu",
    label: "Dịch Vụ & Chuyển Giao",
    description:
      "Đồng hành cùng nông dân, hợp tác xã và doanh nghiệp từ khảo sát, cung ứng đầu vào, chuyển giao kỹ thuật đến trải nghiệm thực tế.",
    cards: [
      {
        title: "01. Tư Vấn Quy Hoạch & Vận Hành Farm",
        bullets: [
          "Đánh giá hiện trạng: Đất, nguồn nước, khí hậu, hạ tầng và địa hình khu đất.",
          "Tư vấn thiết kế tổng thể trang trại tập trung, tối ưu hóa hệ sinh thái theo từng vùng.",
          "Xây dựng định mức đầu tư tài chính, bài toán dòng tiền và quy trình vận hành chuẩn VietGAP/GlobalG.A.P.",
        ],
      },
      {
        title: "02. Cung Ứng Giống & Vật Tư Chuẩn Hóa",
        bullets: [
          "Cung ứng nguồn giống cây trồng nuôi cấy mô thuần chủng: Giống chuối VIP 126 kháng bệnh, giống ổi Đài Loan, dứa MD2.",
          "Cung cấp thiết bị tưới nhỏ giọt bù áp, trạm lọc tự động và hệ thống cảm biến môi trường.",
          "Cung cấp phân bón hữu cơ vi sinh, chế phẩm sinh học an toàn bảo vệ sức khỏe đất và rễ.",
        ],
      },
      {
        title: "03. Chuyển Giao Quy Trình Canh Tác (SOP)",
        steps: [
          {
            title: "Tiếp nhận & Nghiên cứu",
            desc: "Thử nghiệm công nghệ tiên tiến (Israel, Nhật Bản, Đài Loan) tại nông trường Unifarm.",
          },
          {
            title: "Nội địa hóa quy trình",
            desc: "Tối ưu hóa SOP cho phù hợp khí hậu và năng lực lao động địa phương.",
          },
          {
            title: "Chuyển giao & Đồng hành",
            desc: "Đào tạo tay nghề trực tiếp tại vườn và hỗ trợ kỹ thuật suốt chu kỳ mùa vụ.",
          },
        ],
      },
      {
        title: "04. Du Lịch Trải Nghiệm & Mô Hình School in Farm",
        bullets: [
          "Tham quan thực tế mô hình trang trại công nghệ cao: Nhà kính sinh học, hệ thống tưới tự động, cáp treo thu hoạch.",
          "Trải nghiệm quy trình sản xuất, thu hoạch và đóng gói chuẩn xuất khẩu.",
          "Thực hiện mô hình School in Farm: Đưa sinh viên, học viên, chuyên gia đến học hỏi và nghiên cứu giải quyết bài toán thực tế ngoài đồng ruộng.",
        ],
      },
    ],
  },
];

const TAB_IMAGES: Record<string, { src: string; alt: string; tag: string }> = {
  "vung-trong": {
    src: "/images/UNIFARM/16.JPG",
    alt: "Nông trường Unifarm nhìn từ trên cao với hệ thống nhà kính và vùng trồng chuối quy hoạch khép kín",
    tag: "500+ ha vùng trồng công nghệ cao",
  },
  "che-bien": {
    src: "/images/UNIFARM/buong-chuoi.jpg",
    alt: "Vườn chuối Unifarm trước thu hoạch, buồng chuối được bao bọc bảo vệ theo quy trình chuẩn",
    tag: "Waste-to-Value: tối ưu từng đơn vị tài nguyên",
  },
  "dich-vu": {
    src: "/images/UNIFARM/UNIFARM/hinh-chinh/1787655032405_1582751505492234802_4935324150679931320_4d390c1e5cd8777f2674a00dd1340dc7.jpg",
    alt: "Đội ngũ kỹ thuật Unifarm đồng hành cùng nông dân tại vườn chuối",
    tag: "Đồng hành từ khảo sát đến chuyển giao",
  },
};

export default function DuanTruCot() {
  const [activeTab, setActiveTab] = useState(0);
  const reduce = useReducedMotion();
  const tab = TABS[activeTab];
  const image = TAB_IMAGES[tab.id];

  return (
    <section
      id="tru-cot"
      className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-xs font-bold uppercase tracking-[0.32em]"
          style={{ color: C.green }}
        >
          Ba trụ cột hạ tầng Unifarm
        </motion.p>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mt-4 max-w-3xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: C.forest }}
        >
          Vùng trồng · Chế biến · Chuyển giao
        </motion.h2>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="mt-6 h-px w-full max-w-[220px] origin-left"
          style={{ background: C.green }}
        />

        {/* Tab bar */}
        <div
          className="mt-10 flex flex-wrap gap-1 border-b sm:gap-2"
          style={{ borderColor: `${C.forest}18` }}
          role="tablist"
          aria-label="Ba trụ cột hạ tầng Unifarm"
        >
          {TABS.map((t, i) => {
            const isActive = i === activeTab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(i)}
                className="relative px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors sm:px-5 sm:text-sm"
                style={{ color: isActive ? C.forest : "#9ca3af" }}
              >
                <span className="mr-1.5" style={{ color: C.soft }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t.label}
                {isActive && (
                  <motion.span
                    layoutId="truCotTabIndicator"
                    className="absolute inset-x-2 -bottom-px h-[3px] rounded-full"
                    style={{ background: C.green }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content: ảnh minh hoạ (trái) + nội dung (phải) */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Image panel */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_70px_-25px_rgba(6,59,36,0.45)] sm:aspect-[16/10] lg:aspect-[4/5]"
              style={{ background: C.forest }}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={image.src}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    priority={activeTab === 0}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* <motion.div
                key={`${image.tag}-caption`}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-7"
              >
                <span
                  className="w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ background: `${C.green}` }}
                >
                  {String(activeTab + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}
                </span>
                <p className="text-lg font-extrabold leading-snug text-white sm:text-xl">
                  {image.tag}
                </p>
              </motion.div> */}
            </div>
          </div>

          {/* Content cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="max-w-3xl text-base font-semibold leading-relaxed" style={{ color: C.fresh }}>
                {tab.description}
              </p>

              <div
                className={`mt-8 grid grid-cols-1 gap-5 ${
                  tab.cards.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"
                }`}
              >
                {tab.cards.map((card, ci) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 + ci * 0.08, ease: EASE }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_14px_rgba(6,59,36,0.07)] ring-1 ring-[#063B24]/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(6,59,36,0.22)]"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                      style={{ background: C.green }}
                    />

                    <h3
                      className="uppercase text-lg font-extrabold leading-snug"
                      style={{ color: C.forest }}
                    >
                      {card.title}
                    </h3>

                    {card.meta && (
                      <p className="mt-3 text-sm leading-relaxed">
                        <span className="font-bold uppercase tracking-wide" style={{ color: C.ink }}>
                          {card.meta.label}:
                        </span>{" "}
                        <span className="text-neutral-600">{card.meta.value}</span>
                      </p>
                    )}

                    {card.bullets && (
                      <ul className="mt-4 space-y-2.5">
                        {card.bullets.map((b) => (
                          <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-neutral-600">
                            <span
                              className="mt-2 h-1 w-1 shrink-0 rounded-full"
                              style={{ background: C.blue }}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {card.steps && (
                      <div className="mt-4 space-y-4 border-l pl-4" style={{ borderColor: `${C.forest}18` }}>
                        {card.steps.map((s, si) => (
                          <div key={s.title} className="flex gap-3">
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0"
                              style={{ color: C.green }}
                            />
                            <div>
                              <p className="text-sm font-bold" style={{ color: C.ink }}>
                                {String(si + 1).padStart(2, "0")}. {s.title}
                              </p>
                              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
