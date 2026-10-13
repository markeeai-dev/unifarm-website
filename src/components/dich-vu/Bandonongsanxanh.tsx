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
            className="mx-auto mt-4 max-w-4xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-5xl"
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
            {t("Unifarm cùng doanh nghiệp, hợp tác xã và nông dân phát triển các vùng sản xuất phù hợp với điều kiện tự nhiên, lợi thế của từng địa phương và nhu cầu thị trường.")}
          </motion.p>
        </div>

        {/* Thống kê nhanh — số chạy từ 0 lên khi cuộn tới */}
        {/* <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 sm:mt-12">
          {STATS.map((s, i) => (
            <StatFloating key={s.label} stat={s} inView={inView} reduce={!!reduce} delay={1100 + i * 300} />
          ))}
        </div> */}

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
                <DetailPanel region={selectedRegion} />
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



// function DetailPanel({
//   region,
// }: {
//   region: Region | null;
// }) {
//   const { t } = useLanguage();
//   const [activeTab, setActiveTab] = useState(0);

//   const tabs = [
//     {
//       id: "production",
//       label: "Vùng Unifarm đang sản xuất",
//       description:
//         "Các vùng sản xuất do Unifarm trực tiếp tổ chức hoặc quản lý.",
//       color: C.green,
//       background: `${C.green}0D`,
//       sectionKeywords: ["vùng trồng", "trang trại"],
//     },
//     {
//       id: "linked",
//       label: "Vùng liên kết",
//       description:
//         "Các vùng Unifarm đang hợp tác cùng doanh nghiệp, hợp tác xã và nông dân.",
//       color: C.blue,
//       background: `${C.blue}12`,
//       sectionKeywords: ["liên kết", "chế biến", "gia tăng giá trị"],
//     },
//     {
//       id: "developing",
//       label: "Vùng đang phát triển",
//       description:
//         "Các khu vực đang khảo sát, thử nghiệm hoặc xây dựng dự án mới.",
//       color: "#C58A18",
//       background: "#C58A1812",
//       sectionKeywords: ["phát triển", "chuyển giao"],
//     },
//   ];

//   if (!region) {
//     return (
//       <div
//         className="flex min-h-[240px] items-center justify-center border p-8 text-center"
//         style={{
//           borderColor: `${C.forest}18`,
//           background: C.warm,
//         }}
//       >
//         <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
//           {t("Bấm vào điểm đánh dấu trên bản đồ để xem thông tin vùng sản xuất nông sản xanh.")}
//         </p>
//       </div>
//     );
//   }

//   const tab = tabs[activeTab];

//   const projects = region.sections
//     .filter((section) =>
//       tab.sectionKeywords.some((keyword) =>
//         section.title.toLowerCase().includes(keyword)
//       )
//     )
//     .flatMap((section) =>
//       section.items.map((item) => ({
//         ...item,
//         sectionTitle: section.title,
//       }))
//     );

//   function getField(fields: Field[], keywords: string[]) {
//     return fields.find((field) =>
//       keywords.some((keyword) =>
//         field.label.toLowerCase().includes(keyword)
//       )
//     )?.value;
//   }

//   if (region.comingSoon) {
//     return (
//       <div
//         className="border p-6 sm:p-8"
//         style={{
//           borderColor: `${C.forest}18`,
//           background: C.warm,
//         }}
//       >
//         <p
//           className="text-xs font-bold uppercase tracking-[0.2em]"
//           style={{ color: C.green }}
//         >
//           {t(region.name)}
//         </p>

//         <h3
//           className="mt-3 text-2xl font-extrabold leading-tight"
//           style={{ color: C.forest }}
//         >
//           {t("Đang khảo sát & mở rộng vùng dự án")}
//         </h3>

//         <p className="mt-3 text-sm leading-7 text-neutral-600">
//           {t(
//             "Unifarm đang khảo sát và phát triển vùng nguyên liệu tại khu vực này. Thông tin dự án cụ thể sẽ được cập nhật khi có dữ liệu chính thức."
//           )}
//         </p>

//         <a
//           href="https://unifarm.com.vn/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-opacity hover:opacity-80"
//           style={{ background: C.green }}
//         >
//           {t("Xem dự án")}
//           <ArrowRight className="h-4 w-4" />
//         </a>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="border p-5 sm:p-7 lg:p-8"
//       style={{
//         borderColor: `${C.forest}18`,
//         background: C.warm,
//       }}
//     >
//       {/* Tiêu đề */}
//       <div
//         className="border-b pb-5"
//         style={{ borderColor: `${C.forest}14` }}
//       >
//         <p
//           className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
//           style={{ color: C.green }}
//         >
//           <MapPin className="h-4 w-4" style={{ color: C.blue }} />
//           {t(region.name)}
//         </p>

//         <h3
//           className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl"
//           style={{ color: C.forest }}
//         >
//           {t("Bản đồ nông sản xanh Unifarm")}
//         </h3>

//         <p className="mt-3 text-sm leading-7 text-neutral-600">
//           {t(
//             "Unifarm cùng doanh nghiệp, hợp tác xã và nông dân phát triển các vùng sản xuất phù hợp với điều kiện tự nhiên, lợi thế của từng địa phương và nhu cầu thị trường."
//           )}
//         </p>
//       </div>

//       {/* 3 tab */}
//       <div
//         className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3"
//         role="tablist"
//         aria-label="Nhóm vùng sản xuất Unifarm"
//       >
//         {tabs.map((item, index) => {
//           const isActive = activeTab === index;

//           return (
//             <button
//               key={item.id}
//               type="button"
//               role="tab"
//               aria-selected={isActive}
//               onClick={() => setActiveTab(index)}
//               className="flex min-h-[76px] items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 sm:flex-col sm:items-start sm:justify-center sm:p-4"
//               style={{
//                 borderColor: isActive
//                   ? item.color
//                   : `${C.forest}18`,
//                 background: isActive
//                   ? item.background
//                   : "#FFFFFF",
//                 boxShadow: isActive
//                   ? `inset 0 0 0 1px ${item.color}35`
//                   : "none",
//               }}
//             >
//               <span
//                 className="h-3 w-3 shrink-0 rounded-full"
//                 style={{ background: item.color }}
//               />

//               <span
//                 className="text-xs font-extrabold leading-5"
//                 style={{
//                   color: isActive ? item.color : C.forest,
//                 }}
//               >
//                 {t(item.label)}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Nội dung tab được chọn */}
//       <div className="mt-5">
//         <div
//           className="rounded-xl border p-4 sm:p-5"
//           style={{
//             borderColor: `${tab.color}35`,
//             background: tab.background,
//           }}
//         >
//           <h4
//             className="text-sm font-extrabold uppercase leading-6 tracking-wide"
//             style={{ color: tab.color }}
//           >
//             {t(tab.label)}
//           </h4>

//           <p className="mt-2 text-sm leading-6 text-neutral-600">
//             {t(tab.description)}
//           </p>
//         </div>

//         {projects.length > 0 ? (
//           <div className="mt-4 space-y-3">
//             {projects.map((project, index) => {
//               const product =
//                 getField(project.fields, [
//                   "giống chủ lực",
//                   "sản phẩm",
//                   "phân loại",
//                 ]) ??
//                 (project.name.toLowerCase().includes("chuối")
//                   ? "Chuối cấy mô"
//                   : undefined);

//               const scale = getField(project.fields, ["quy mô"]);
//               const location = getField(project.fields, ["địa điểm"]);
//               const model = getField(project.fields, [
//                 "mô hình",
//                 "hình thức",
//               ]);

//               return (
//                 <article
//                   key={`${project.name}-${index}`}
//                   className="overflow-hidden rounded-xl border"
//                   style={{
//                     borderColor: `${tab.color}25`,
//                     background: "#FFFFFF",
//                   }}
//                 >
//                   <div
//                     className="flex items-start gap-3 border-b p-4"
//                     style={{
//                       borderColor: `${tab.color}20`,
//                       background: tab.background,
//                     }}
//                   >
//                     <span
//                       className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
//                       style={{ background: tab.color }}
//                     />

//                     <h5
//                       className="text-sm font-extrabold leading-6 sm:text-base"
//                       style={{ color: C.forest }}
//                     >
//                       {t(project.name)}
//                     </h5>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
//                     {product && (
//                       <div>
//                         <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
//                           {t("Sản phẩm")}
//                         </p>
//                         <p className="mt-1 text-sm leading-6 text-neutral-700">
//                           {t(product)}
//                         </p>
//                       </div>
//                     )}

//                     {scale && (
//                       <div>
//                         <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
//                           {t("Quy mô")}
//                         </p>
//                         <p
//                           className="mt-1 text-sm font-extrabold"
//                           style={{ color: tab.color }}
//                         >
//                           {t(scale)}
//                         </p>
//                       </div>
//                     )}

//                     {location && (
//                       <div className="sm:col-span-2">
//                         <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
//                           {t("Địa điểm")}
//                         </p>
//                         <p className="mt-1 text-sm leading-6 text-neutral-700">
//                           {t(location)}
//                         </p>
//                       </div>
//                     )}

//                     {model && (
//                       <div className="sm:col-span-2">
//                         <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
//                           {t("Hình thức")}
//                         </p>
//                         <p className="mt-1 text-sm leading-6 text-neutral-700">
//                           {t(model)}
//                         </p>
//                       </div>
//                     )}

//                     {project.fields
//                       .filter(
//                         (field) =>
//                           ![
//                             "quy mô",
//                             "địa điểm",
//                             "mô hình",
//                             "hình thức",
//                             "giống chủ lực",
//                             "sản phẩm",
//                             "phân loại",
//                           ].some((keyword) =>
//                             field.label.toLowerCase().includes(keyword)
//                           )
//                       )
//                       .map((field) => (
//                         <div
//                           key={`${project.name}-${field.label}`}
//                           className="sm:col-span-2"
//                         >
//                           <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
//                             {t(field.label)}
//                           </p>
//                           <p className="mt-1 text-sm leading-6 text-neutral-700">
//                             {t(field.value)}
//                           </p>
//                         </div>
//                       ))}
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         ) : (
//           <div
//             className="mt-4 rounded-xl border border-dashed p-5 text-sm leading-6 text-neutral-500"
//             style={{ borderColor: `${tab.color}50` }}
//           >
//             {t(
//               "Thông tin dự án thuộc nhóm này sẽ được cập nhật khi có dữ liệu chính thức."
//             )}
//           </div>
//         )}
//       </div>

//       {/* Nút ở cuối tab */}
//       <div
//         className="mt-6 border-t pt-5"
//         style={{ borderColor: `${C.forest}14` }}
//       >
//         <a
//           href="https://unifarm.com.vn/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:gap-3 sm:w-auto"
//           style={{
//             background: C.green,
//             boxShadow: `0 8px 20px ${C.green}20`,
//           }}
//         >
//           {t("Xem dự án")}
//           <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//         </a>
//       </div>
//     </div>
//   );
// }

function DetailPanel({
  region,
}: {
  region: Region | null;
}) {
  const { t } = useLanguage();

  const statusItems = [
    {
      number: "01",
      title: "VÙNG UNIFARM ĐANG SẢN XUẤT",
      description:
        "Các vùng sản xuất do Unifarm trực tiếp tổ chức hoặc quản lý.",
      color: C.green,
      bg: `${C.green}0D`,
    },
    {
      number: "02",
      title: "VÙNG LIÊN KẾT",
      description:
        "Các vùng Unifarm đang hợp tác cùng doanh nghiệp, hợp tác xã và nông dân.",
      color: C.blue,
      bg: `${C.blue}12`,
    },
    {
      number: "03",
      title: "VÙNG ĐANG PHÁT TRIỂN",
      description:
        "Các khu vực đang khảo sát, thử nghiệm hoặc xây dựng dự án mới.",
      color: "#C58A18",
      bg: "#C58A1812",
    },
  ];

  if (!region) {
    return (
      <div
        className="flex h-full min-h-[240px] items-center justify-center border p-8 text-center"
        style={{
          borderColor: `${C.forest}18`,
          background: C.warm,
        }}
      >
        <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
          {t(
            "Bấm vào điểm đánh dấu trên bản đồ để xem thông tin vùng sản xuất nông sản xanh."
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      className="border p-5 sm:p-7 lg:p-8"
      style={{
        borderColor: `${C.forest}18`,
        background: C.warm,
      }}
    >
      {/* Tiêu đề khu vực */}
      <div
        className="border-b pb-5"
        style={{ borderColor: `${C.forest}14` }}
      >
        <p
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: C.green }}
        >
          <MapPin
            className="h-4 w-4"
            style={{ color: C.blue }}
          />
          {t(region.name)}
        </p>

        <h3
          className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl"
          style={{ color: C.forest }}
        >
          {t("Bản đồ nông sản xanh Unifarm")}
        </h3>

        <p className="mt-3 text-sm leading-7 text-neutral-600">
          {t(
            "Unifarm cùng doanh nghiệp, hợp tác xã và nông dân phát triển các vùng sản xuất phù hợp với điều kiện tự nhiên, lợi thế của từng địa phương và nhu cầu thị trường."
          )}
        </p>
      </div>

      {/* Ba trạng thái vùng sản xuất */}
      <div className="mt-5 space-y-3">
        {statusItems.map((item) => (
          <div
            key={item.number}
            className="flex gap-3 rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: `${item.color}25`,
              background: item.bg,
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
              style={{
                background: `${item.color}18`,
                color: item.color,
              }}
            >
              {item.number}
            </div>

            <div className="min-w-0 flex-1">
              <h4
                className="text-xs font-extrabold leading-5 tracking-wide sm:text-sm"
                style={{ color: C.forest }}
              >
                {t(item.title)}
              </h4>

              <p className="mt-1.5 text-sm leading-6 text-neutral-600">
                {t(item.description)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chú thích ký hiệu */}
      <div
        className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4"
        style={{ borderColor: `${C.forest}14` }}
      >
        {statusItems.map((item) => (
          <div
            key={item.number}
            className="inline-flex items-center gap-2 text-xs text-neutral-500"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: item.color }}
            />
            {t(
              item.number === "01"
                ? "Đang sản xuất"
                : item.number === "02"
                  ? "Liên kết"
                  : "Đang phát triển"
            )}
          </div>
        ))}
      </div>

      {/* Nút xem dự án */}
      <div
        className="mt-6 border-t pt-5"
        style={{ borderColor: `${C.forest}14` }}
      >
        <a
          href="https://unifarm.com.vn/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          style={{
            background: C.green,
            boxShadow: `0 6px 18px ${C.green}20`,
          }}
        >
          {t("XEM DỰ ÁN")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
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
