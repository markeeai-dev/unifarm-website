"use client";

/**
 * BanDoNongSanXanh — "Bản đồ nông sản xanh Việt Nam"
 * ------------------------------------------------------------------
 * Bố cục 2 cột: TRÁI là hình dạng Việt Nam liền khối (không vẽ ranh
 * giới từng tỉnh — địa giới tỉnh cũ đã lỗi thời sau đợt sáp nhập tỉnh
 * 2025), chỉ đánh dấu 3 khu vực lớn Bắc – Trung – Nam bằng marker cố
 * định toạ độ, không gắn tên tỉnh cụ thể nào. PHẢI là bảng chi tiết —
 * bấm vào 1 khu vực thì nội dung dự án của khu vực đó (3 nhóm: Vùng
 * trồng & trang trại / Chế biến & giá trị / Dự án phát triển & chuyển
 * giao) hiện ra bên phải, có hiệu ứng chuyển mượt. Khu vực chưa có dữ
 * liệu dự án cụ thể để công bố (Bắc, Trung) hiển thị trạng thái "đang
 * mở rộng" trung thực, không bịa số liệu/tên dự án.
 *
 * `REGIONS` là nguồn dữ liệu duy nhất — mỗi khu vực có `pos` là % toạ
 * độ cố định của marker trên bản đồ (đã tính sẵn theo trung tâm địa lý
 * khu vực, không phụ thuộc dữ liệu ranh giới tỉnh nào). Bản đồ nền
 * dùng dữ liệu hình dạng quốc gia từ `@svg-maps/vietnam` (CC BY 4.0)
 * chỉ để lấy đúng đường viền lãnh thổ thật — mọi tỉnh được tô cùng 1
 * màu, không viền, không hover/click riêng từng tỉnh.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import vietnamMap from "@svg-maps/vietnam";
import { useIsMobile } from "@/lib/use-is-mobile";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

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

const [, , VIETNAM_VW, VIETNAM_VH] = vietnamMap.viewBox.split(" ").map(Number);

type Field = { label: string; value: string };
type RegionItem = { name: string; fields: Field[] };
type RegionSection = { title: string; short: string; subtitle?: string; items: RegionItem[] };
type Region = {
  id: "bac" | "trung" | "nam";
  name: string;
  totalHa: string;
  /** Ảnh nhỏ hiện ở đầu đường chỉ nối ra từ marker. */
  image: string;
  /** % toạ độ cố định của marker trên bản đồ (hệ PADDED_VIEWBOX), ứng
   * với trung tâm địa lý của khu vực — không phụ thuộc ranh giới tỉnh. */
  pos: { x: number; y: number };
  /** % toạ độ cố định của thẻ ảnh callout, luôn nằm gọn trong phần đệm
   * bên trái bản đồ — canh riêng cho từng khu vực để không bao giờ tràn
   * ra ngoài khung nhìn dù ở marker nào. */
  calloutPos: { x: number; y: number };
  /** Vị trí callout riêng cho mobile — container hẹp hơn hẳn desktop nên
   * cần % khác để không bị tràn ra ngoài; nếu bỏ trống dùng calloutPos. */
  calloutPosMobile?: { x: number; y: number };
  sections: RegionSection[];
  /** true = khu vực đang mở rộng, chưa có dự án cụ thể để công bố. */
  comingSoon?: boolean;
};

const REGIONS: Region[] = [
  {
    id: "nam",
    name: "Miền Nam",
    totalHa: "1.694,47",
    image: "/images/UNIFARM/2.jpg",
    pos: { x: 34.5, y: 69.3 },
    calloutPos: { x: 20, y: 74 },
    calloutPosMobile: { x: 92, y: 74 },
    sections: [
      {
        title: "Vùng trồng & trang trại",
        short: "Vùng trồng",
        items: [
          {
            name: "Khu Nông nghiệp CNC An Thái",
            fields: [
              { label: "Quy mô", value: "500 ha" },
              {
                label: "Địa điểm",
                value: "Xã An Thái, H. Phú Giáo, Bình Dương (Thành lập 2009)",
              },
              {
                label: "Điểm nổi bật",
                value:
                  "Trung tâm CNC đa lĩnh vực (Sinh học – Tự động hóa – Số hóa), ứng dụng công nghệ tưới & quản lý Israel",
              },
            ],
          },
          {
            name: "Chuối cấy mô Thanh An",
            fields: [
              { label: "Quy mô", value: "1.000 ha" },
              { label: "Địa điểm", value: "Xã Thanh An, H. Dầu Tiếng, Bình Dương" },
              {
                label: "Mô hình",
                value: "Hợp tác giữa Unifarm & Công ty TNHH MTV Cao su Dầu Tiếng",
              },
              { label: "Định hướng", value: "Vùng trồng chuối tập trung đạt chuẩn xuất khẩu" },
            ],
          },
          {
            name: "Chuối cấy mô Minh Tân",
            fields: [
              { label: "Quy mô", value: "194,47 ha" },
              { label: "Địa điểm", value: "Xã Minh Tân, H. Dầu Tiếng, Bình Dương" },
              { label: "Giống chủ lực", value: "Chuối Cavendish (AAA) cấy mô CNC" },
              {
                label: "Định hướng",
                value: "Chuỗi giá trị chuối chất lượng cao phục vụ xuất khẩu",
              },
            ],
          },
        ],
      },
      {
        title: "Chế biến & gia tăng giá trị",
        short: "Chế biến",
        subtitle: "Định hướng theo chuỗi giá trị nông nghiệp CNC",
        items: [
          {
            name: "Tinh bột kháng",
            fields: [
              { label: "Phân loại", value: "Sản phẩm chế biến sâu từ chuối xanh" },
              {
                label: "Ứng dụng",
                value: "Nâng cao giá trị nông sản và chuỗi cung ứng thực phẩm sạch",
              },
            ],
          },
          {
            name: "Công nghệ cấp đông IQF",
            fields: [
              {
                label: "Ứng dụng",
                value: "Bảo quản sau thu hoạch, giữ trọn chất lượng nông sản",
              },
              { label: "Mục tiêu", value: "Đáp ứng tiêu chuẩn kỹ thuật các thị trường xuất khẩu" },
            ],
          },
          {
            name: "Chế biến sâu nông sản",
            fields: [
              {
                label: "Mục tiêu",
                value: "Tối ưu hóa chuỗi giá trị, hạn chế thất thoát sau thu hoạch",
              },
            ],
          },
        ],
      },
      {
        title: "Dự án phát triển & chuyển giao",
        short: "Chuyển giao",
        items: [
          {
            name: "Mở rộng vùng trồng & Liên kết sản xuất",
            fields: [
              {
                label: "Mô hình",
                value: "Hợp tác với doanh nghiệp, nông trường và đối tác địa phương",
              },
              { label: "Mục tiêu", value: "Quy mô hóa sản xuất, tạo vùng nguyên liệu tập trung" },
            ],
          },
          {
            name: "Ứng dụng & Chuyển giao công nghệ cao",
            fields: [
              {
                label: "Công nghệ",
                value:
                  "Nhân giống vô tính cấy mô, nhà kính, hệ thống tưới nhỏ giọt tự động, phần mềm điều khiển từ Israel",
              },
              {
                label: "Phạm vi",
                value: "Nhân rộng mô hình nông nghiệp chuẩn VietGAP/GLOBALGAP cho khu vực và toàn quốc",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "trung",
    name: "Miền Trung",
    totalHa: "—",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/vuon2.jpg",
    pos: { x: 41.2, y: 47.1 },
    calloutPos: { x: 80, y: 47 },
    calloutPosMobile: { x: 25, y: 47 },
    comingSoon: true,
    sections: [],
  },
  {
    id: "bac",
    name: "Miền Bắc",
    totalHa: "—",
    image: "/images/UNIFARM/UNIFARM/hinh-chinh/1787655032394_1582751505492234802_4935324150679931320_6e7befd02ac62654f5522a88f1772c1d.jpg",
    pos: { x: 29.9, y: 24.3 },
    calloutPos: { x: 21, y: 11 },
    calloutPosMobile: { x: 77, y: 11 },
    comingSoon: true,
    sections: [],
  },
];

function totalProjects(region: Region) {
  return region.sections.reduce((n, s) => n + s.items.length, 0);
}

const STATS: { target: number; format: (n: number) => string; label: string }[] = [
  { target: 3, format: (n) => String(Math.round(n)).padStart(2, "0"), label: "Vùng trồng" },
  {
    target: 1694,
    format: (n) => `${Math.round(n).toLocaleString("vi-VN")}+`,
    label: "Ha quy mô",
  },
  { target: 100, format: (n) => `${Math.round(n)}%`, label: "Định hướng xuất khẩu" },
];

export default function BanDoNongSanXanh() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(REGIONS[0]?.id ?? null);
  const [hasClicked, setHasClicked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tabResetKey, setTabResetKey] = useState(selectedId);
  const selectedRegion = REGIONS.find((r) => r.id === selectedId) ?? null;

  // Reset về tab đầu tiên mỗi khi đổi vùng — điều chỉnh state ngay trong lúc
  // render (theo khuyến nghị của React) thay vì dùng useEffect riêng.
  if (selectedId !== tabResetKey) {
    setTabResetKey(selectedId);
    setActiveTab(0);
  }

  return (
    <section
      id="ban-do"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-28"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          y: reduce ? 0 : glowY,
          background: `radial-gradient(closest-side, ${C.soft}22, ${C.cream}00 70%), radial-gradient(closest-side at 80% 20%, ${C.blue}1a, transparent 60%)`,
        }}
      />
      <Particles />

      <motion.div
        initial={reduce ? false : { y: 60, scale: 0.97 }}
        animate={inView ? { y: 0, scale: 1 } : {}}
        transition={{ duration: 1.6, ease: EASE }}
        className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10"
      >
        {/* Heading */}
        <div className="text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="text-xs font-bold uppercase tracking-[0.32em]"
            style={{ color: C.green }}
          >
            {t("Mạng lưới nông nghiệp xanh")}
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-5xl"
            style={{ color: C.forest }}
          >
            {t("Bản đồ nông sản xanh Việt Nam")}
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{ color: C.fresh }}
          >
            {t("Kết nối vùng trồng – công nghệ – chế biến – thị trường")}
          </motion.p>
        </div>

        {/* Thống kê nhanh — số chạy từ 0 lên khi cuộn tới */}
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 sm:mt-12">
          {STATS.map((s, i) => (
            <StatFloating key={s.label} stat={s} inView={inView} reduce={!!reduce} delay={1100 + i * 300} />
          ))}
        </div>

        {/* Bản đồ (trái) + Chi tiết (phải) — xuất hiện sau cùng, chậm và sang */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.8, delay: 2.1, ease: EASE }}
          className="mt-14 sm:mt-16 lg:flex lg:items-start lg:gap-12"
        >
          <div className="mx-auto w-full max-w-[560px] lg:w-[52%] lg:max-w-none">
            <VietnamMap
              inView={inView}
              hoveredId={hoveredId}
              selectedId={selectedId}
              zoomEnabled={hasClicked}
              onHover={setHoveredId}
              onSelect={(id) => {
                setSelectedId(id);
                setHasClicked(true);
              }}
            />
          </div>

          <div className="mt-10 lg:mt-0 lg:w-[48%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRegion?.id ?? "empty"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <DetailPanel
                  region={selectedRegion}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bản đồ Việt Nam — hình quốc gia liền khối (không vẽ ranh giới tỉnh), */
/* chỉ đánh dấu 3 khu vực Bắc – Trung – Nam bằng marker cố định toạ độ  */
/* ------------------------------------------------------------------ */

/** Đệm thêm quanh viewBox thật để khi phóng to (zoom) khu vực đang chọn,
 * phần bản đồ không bao giờ tràn ra ngoài khung nhìn của SVG, đồng thời
 * chừa đủ chỗ bên trái cho thẻ ảnh callout của từng khu vực. */
const VIEWBOX_PAD = 190;
const PADDED_VIEWBOX = `${-VIEWBOX_PAD} ${-VIEWBOX_PAD} ${VIETNAM_VW + VIEWBOX_PAD * 2} ${VIETNAM_VH + VIEWBOX_PAD * 2}`;

/** Quy đổi % (hệ PADDED_VIEWBOX) sang toạ độ thật trong SVG — dùng để vẽ
 * đường chỉ nối từ marker tới thẻ ảnh callout cố định bên trái. */
function pctToUser(pct: number, size: number) {
  return (pct / 100) * (size + VIEWBOX_PAD * 2) - VIEWBOX_PAD;
}

/** Điểm đầu/cuối đường chỉ nối marker (toạ độ thật %) tới vị trí callout
 * cố định (đã canh sẵn cho từng khu vực trong REGIONS, luôn nằm gọn
 * trong phần đệm bên trái nên không bao giờ tràn ra ngoài khung nhìn). */
function lineEndFor(pos: { x: number; y: number }, calloutPos: { x: number; y: number }) {
  return {
    x1: pctToUser(pos.x, VIETNAM_VW),
    y1: pctToUser(pos.y, VIETNAM_VH),
    x2: pctToUser(calloutPos.x, VIETNAM_VW),
    y2: pctToUser(calloutPos.y, VIETNAM_VH),
  };
}

function VietnamMap({
  inView,
  hoveredId,
  selectedId,
  zoomEnabled,
  onHover,
  onSelect,
}: {
  inView: boolean;
  hoveredId: string | null;
  selectedId: string | null;
  zoomEnabled: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}) {
  const zoomOrigin = zoomEnabled ? REGIONS.find((r) => r.id === selectedId)?.pos ?? null : null;
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const calloutFor = (r: Region) => (isMobile && r.calloutPosMobile ? r.calloutPosMobile : r.calloutPos);
  /** Khối lãnh thổ Việt Nam trông lệch trái trong khung nhìn hẹp trên
   * mobile — phần "thân" đất liền mà mắt người theo dõi (dải ven biển)
   * nằm lệch trái trong hộp bao hình học của cả nước (điểm cực bắc/nam
   * kéo hộp bao rộng thêm về bên phải). Dịch riêng phần HÌNH DẠNG bản đồ
   * (không đụng vị trí marker/đường chỉ/ảnh callout) sang phải một chút
   * trên mobile để mắt nhìn thấy cân đối hơn — desktop giữ nguyên 0%. */
  const MOBILE_MAP_SHIFT_PCT = 16;
  const mapShiftPct = isMobile ? MOBILE_MAP_SHIFT_PCT : 0;
  const mapShiftUser = (mapShiftPct / 100) * (VIETNAM_VW + VIEWBOX_PAD * 2);
  const posFor = (r: Region) =>
    isMobile ? { x: r.pos.x + MOBILE_MAP_SHIFT_PCT, y: r.pos.y } : r.pos;

  return (
    <div className="relative">
      <motion.svg
        viewBox={PADDED_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-[560px] lg:max-w-[760px]"
        style={{ aspectRatio: `${VIETNAM_VW + VIEWBOX_PAD * 2} / ${VIETNAM_VH + VIEWBOX_PAD * 2}` }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, delay: 2.2, ease: EASE }}
      >
        <motion.g
          animate={{ scale: zoomOrigin ? 1.16 : 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            transformBox: "view-box",
            transformOrigin: zoomOrigin ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : "50% 50%",
          }}
        >
          {/* Hình quốc gia liền khối: mọi tỉnh tô cùng 1 màu, không viền —
              chỉ lấy đúng đường viền lãnh thổ thật, không hiển thị ranh
              giới hành chính bên trong (đã lỗi thời sau sáp nhập tỉnh). */}
          <g
            aria-hidden
            style={{ pointerEvents: "none" }}
            transform={mapShiftUser ? `translate(${mapShiftUser}, 0)` : undefined}
          >
            {vietnamMap.locations.map((loc) => (
              <path key={loc.id} d={loc.path} fill={`${C.soft}45`} stroke="none" />
            ))}
          </g>

          {REGIONS.map((r) => {
            const end = lineEndFor(posFor(r), calloutFor(r));
            const isFocused = hoveredId === r.id || selectedId === r.id;
            return (
              <line
                key={`line-${r.id}`}
                x1={end.x1}
                y1={end.y1}
                x2={end.x2}
                y2={end.y2}
                stroke={C.green}
                strokeWidth={1.5}
                strokeDasharray="4 5"
                style={{
                  opacity: isFocused ? 0.75 : 0.4,
                  transition: "opacity 400ms ease-out",
                }}
              />
            );
          })}
        </motion.g>
      </motion.svg>

      <div className="pointer-events-none absolute inset-0">
        {REGIONS.map((r, i) => {
          const isFocused = hoveredId === r.id || selectedId === r.id;
          return (
            <div key={r.id}>
              <Marker
                region={r}
                pos={posFor(r)}
                index={i}
                active={selectedId === r.id}
                hovered={hoveredId === r.id}
                delay={2.9 + i * 0.15}
                inView={inView}
                onHover={onHover}
                onSelect={onSelect}
              />
              {/* Thẻ ảnh callout ở đầu đường chỉ — nằm hẳn ngoài bản đồ, không
                  chú thích tên tỉnh, chỉ ghi tên khu vực (Bắc/Trung/Nam). */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: `${calloutFor(r).x}%`,
                  top: `${calloutFor(r).y}%`,
                  opacity: 1,
                  transform: `translate(-50%, -50%) scale(${isFocused ? 1.06 : 1})`,
                  transition: "opacity 350ms ease-out, transform 350ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <div
                  className="h-14 w-20 overflow-hidden ring-2 ring-white sm:h-24 sm:w-40"
                  style={{ boxShadow: "0 14px 30px -10px rgba(6,59,36,0.55)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                </div>
                <p
                  className="mt-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: C.forest }}
                >
                  {String(i + 1).padStart(2, "0")} · {t(r.name)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.3em]"
        style={{ color: `${C.forest}55` }}
      >
        {t("Việt Nam")}
      </p>
      <p className="mt-1 text-center text-[9px] text-neutral-400">
        {t("Bản đồ: svg-maps.com (CC BY 4.0)")}
      </p>
    </div>
  );
}

function Marker({
  region,
  pos,
  index,
  active,
  hovered,
  delay,
  inView,
  onHover,
  onSelect,
}: {
  region: Region;
  pos: { x: number; y: number };
  index: number;
  active: boolean;
  hovered: boolean;
  delay: number;
  inView: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}) {
  return (
    <motion.button
      type="button"
      className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      onMouseEnter={() => onHover(region.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(region.id)}
      aria-label={`Xem chi tiết dự án tại ${region.name}`}
    >
      <span
        className="absolute h-9 w-9 rounded-full"
        style={{
          background: C.green,
          opacity: active ? 0.25 : 0.12,
          animation: "marker-pulse 2.2s ease-out infinite",
        }}
      />
      <span
        className="absolute h-6 w-6 rounded-full border-2 transition-all duration-300"
        style={{
          borderColor: C.green,
          transform: active || hovered ? "scale(1.25)" : "scale(1)",
          boxShadow: active || hovered ? `0 0 16px ${C.green}88` : `0 0 6px ${C.green}55`,
        }}
      />
      <span
        className="relative flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black text-white"
        style={{ background: C.green }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* tooltip nhanh khi hover — click mới cập nhật panel bên phải */}
      {/* <span
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-3 py-1.5 text-[11px] font-bold shadow-lg transition-all duration-200"
        style={{
          background: C.forest,
          color: C.yellow,
          opacity: hovered && !active ? 1 : 0,
          transform: hovered && !active ? "translate(-50%, 0)" : "translate(-50%, 4px)",
        }}
      >
        {region.name} · {region.comingSoon ? "Đang mở rộng" : `${totalProjects(region).toString().padStart(2, "0")} dự án`}
      </span> */}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Panel chi tiết (phải) — 3 nhóm nội dung của vùng đang chọn           */
/* ------------------------------------------------------------------ */

function DetailPanel({
  region,
  activeTab,
  onTabChange,
}: {
  region: Region | null;
  activeTab: number;
  onTabChange: (i: number) => void;
}) {
  const { t } = useLanguage();

  if (!region) {
    return (
      <div
        className="flex h-full min-h-[240px] items-center justify-center border p-8 text-center"
        style={{ borderColor: `${C.forest}18`, background: `${C.warm}` }}
      >
        <p className="max-w-xs text-sm text-neutral-400">
          {t("Bấm vào điểm đánh dấu trên bản đồ để xem chi tiết vùng dự án.")}
        </p>
      </div>
    );
  }

  if (region.comingSoon) {
    return (
      <div className="border p-6 sm:p-8" style={{ borderColor: `${C.forest}18`, background: C.warm }}>
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: C.green }}>
          <MapPin className="h-3.5 w-3.5" style={{ color: C.blue }} />
          {t(region.name)}
        </p>
        <p className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: C.forest }}>
          {t("Đang khảo sát & mở rộng vùng dự án")}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
          {t(
            "Unifarm đang khảo sát và mở rộng vùng nguyên liệu tại khu vực này. Thông tin dự án cụ thể sẽ được cập nhật khi triển khai chính thức."
          )}
        </p>
        <button
          type="button"
          className="group mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:gap-3"
          style={{ color: C.green }}
        >
          {t("Liên hệ tìm hiểu thêm")}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const section = region.sections[activeTab] ?? region.sections[0];

  return (
    <div className="border p-6 sm:p-8" style={{ borderColor: `${C.forest}18`, background: C.warm }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b pb-5" style={{ borderColor: `${C.forest}14` }}>
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: C.green }}>
            <MapPin className="h-3.5 w-3.5" style={{ color: C.blue }} />
            {t(region.name)}
          </p>
          <p className="mt-1 text-3xl font-extrabold leading-none sm:text-4xl" style={{ color: C.forest }}>
            {region.totalHa} <span className="text-base font-bold">HA</span>
          </p>
        </div>
        <p className="text-sm font-semibold text-neutral-400">
          {totalProjects(region).toString().padStart(2, "0")} {t("dự án đang triển khai")}
        </p>
      </div>

      {/* 3 tab — rút gọn nội dung dài thành từng nhóm riêng */}
      <div className="mt-6 flex gap-1.5 border-b" style={{ borderColor: `${C.forest}14` }}>
        {region.sections.map((s, i) => {
          const isActive = i === activeTab;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => onTabChange(i)}
              className="relative flex-1 whitespace-nowrap px-1.5 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide transition-colors sm:flex-initial sm:px-3.5 sm:text-sm"
              style={{ color: isActive ? C.forest : "#9ca3af" }}
            >
              <span className="mr-1" style={{ color: C.soft }}>
                {i + 1}.
              </span>
              {t(s.short)}
              <span
                className="absolute inset-x-3 -bottom-px h-[2px] rounded-full transition-opacity duration-300"
                style={{ background: C.green, opacity: isActive ? 1 : 0 }}
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${region.id}-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-6"
        >
          {section.subtitle && (
            <p className="mb-3 text-xs font-semibold italic text-neutral-400">{t(section.subtitle)}</p>
          )}

          <div className="divide-y" style={{ borderColor: `${C.forest}0f` }}>
            {section.items.map((item, ii) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + ii * 0.08, ease: EASE }}
                className="py-4 first:pt-0"
              >
                <p className="text-[15px] font-bold" style={{ color: C.ink }}>
                  {t(item.name)}
                </p>
                <dl className="mt-2 space-y-1.5">
                  {item.fields.map((f) => (
                    <div key={f.label} className="flex flex-wrap gap-x-1.5 text-sm leading-relaxed">
                      <dt className="shrink-0 font-bold" style={{ color: C.fresh }}>
                        {t(f.label)}:
                      </dt>
                      <dd className="text-neutral-600">{t(f.value)}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        className="group mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:gap-3"
        style={{ color: C.green }}
      >
        {t("Liên hệ tìm hiểu thêm")}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thống kê nổi — số chạy từ 0 lên đúng giá trị khi cuộn tới, font số   */
/* dùng tabular-nums để các chữ số luôn đều nhau, không xô lệch.        */
/* ------------------------------------------------------------------ */

function StatFloating({
  stat,
  inView,
  reduce,
  delay,
}: {
  stat: { target: number; format: (n: number) => string; label: string };
  inView: boolean;
  reduce: boolean;
  delay: number;
}) {
  const { t } = useLanguage();
  const [value, setValue] = useState(() => (reduce ? stat.target : 0));
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || reduce) return;
    started.current = true;

    let raf = 0;
    const duration = 1600;
    const timeout = window.setTimeout(() => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(stat.target * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, reduce, stat.target, delay]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: delay / 1000, ease: EASE }}
      className="border-l pl-3 text-center sm:text-left"
      style={{ borderColor: `${C.green}55` }}
    >
      <div
        className="text-3xl font-extrabold leading-none tracking-tight tabular-nums sm:text-4xl"
        style={{ color: C.forest }}
      >
        {stat.format(value)}
      </div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 sm:text-[11px]">
        {t(stat.label)}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Particle nền — vài chấm trôi rất nhẹ, không gây rối                 */
/* ------------------------------------------------------------------ */

function Particles() {
  const dots = [
    { top: "12%", left: "8%", size: 5, delay: 0 },
    { top: "22%", left: "88%", size: 4, delay: 1.2 },
    { top: "68%", left: "6%", size: 6, delay: 2.4 },
    { top: "80%", left: "92%", size: 4, delay: 0.6 },
    { top: "45%", left: "50%", size: 3, delay: 1.8 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: C.soft,
            opacity: 0.25,
            animation: `particle-drift 7s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(6px, -14px); }
        }
        @keyframes marker-pulse {
          0% { transform: scale(0.7); opacity: 0.35; }
          100% { transform: scale(2.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
