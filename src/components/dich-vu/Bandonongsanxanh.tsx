"use client";

/**
 * BanDoNongSanXanh — "Bản đồ nông sản xanh Việt Nam"
 * ------------------------------------------------------------------
 * Bố cục 2 cột rõ ràng: TRÁI là bản đồ Việt Nam THẬT (từng tỉnh là 1
 * path riêng, lấy từ bộ dữ liệu `@svg-maps/vietnam`), PHẢI là bảng chi
 * tiết — bấm vào tỉnh có dữ liệu trên bản đồ thì toàn bộ nội dung chi
 * tiết của vùng đó (3 nhóm: Vùng trồng & trang trại / Chế biến & giá
 * trị / Dự án phát triển & chuyển giao) hiện ra bên phải, có hiệu ứng
 * chuyển mượt. Mọi tỉnh đều hover được (sáng lên + phóng nhẹ); tỉnh có
 * dữ liệu thật được tô đậm hơn hẳn để phân biệt.
 *
 * `REGIONS` là nguồn dữ liệu duy nhất — thêm tỉnh mới chỉ cần thêm 1
 * phần tử { id, name, totalHa, sections } với `id` đúng mã tỉnh trong
 * `@svg-maps/vietnam` (vd "hanoi", "dongnai", "lamdong"...) — vị trí
 * marker được tự tính từ hình dạng thật của tỉnh đó, không cần đoán toạ
 * độ tay. Bản đồ dùng dữ liệu của svg-maps.com (CC BY 4.0).
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
  /** Đúng mã tỉnh trong bộ dữ liệu @svg-maps/vietnam (vd "binhduong"). */
  id: string;
  name: string;
  totalHa: string;
  /** Ảnh nhỏ hiện ở đầu đường chỉ nối ra từ marker. */
  image: string;
  sections: RegionSection[];
};

const REGIONS: Region[] = [
  {
    id: "binhduong",
    name: "Bình Dương",
    totalHa: "1.694,47",
    image: "/images/UNIFARM/2.jpg",
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
            Mạng lưới nông nghiệp xanh
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-5xl"
            style={{ color: C.forest }}
          >
            Bản đồ nông sản xanh Việt Nam
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{ color: C.fresh }}
          >
            Kết nối vùng trồng – công nghệ – chế biến – thị trường
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
/* Bản đồ Việt Nam thật — mỗi tỉnh 1 path (dữ liệu @svg-maps/vietnam)   */
/* ------------------------------------------------------------------ */

const REGION_IDS = new Set(REGIONS.map((r) => r.id));

/** Đệm thêm quanh viewBox thật để khi phóng to (zoom) khu vực đang chọn,
 * phần bản đồ không bao giờ tràn ra ngoài khung nhìn của SVG. */
const VIEWBOX_PAD = 150;
const PADDED_VIEWBOX = `${-VIEWBOX_PAD} ${-VIEWBOX_PAD} ${VIETNAM_VW + VIEWBOX_PAD * 2} ${VIETNAM_VH + VIEWBOX_PAD * 2}`;

/** Quy đổi qua lại giữa toạ độ thật trong SVG (hệ viewBox đã đệm) và %
 * (dùng để định vị marker/ảnh bằng HTML tuyệt đối lên trên khung SVG). */
function userToPct(user: number, size: number) {
  return ((user + VIEWBOX_PAD) / (size + VIEWBOX_PAD * 2)) * 100;
}
function pctToUser(pct: number, size: number) {
  return (pct / 100) * (size + VIEWBOX_PAD * 2) - VIEWBOX_PAD;
}

/** Điểm neo đường chỉ chạy chéo lên từ marker + vị trí % để đặt ảnh nhỏ
 * ở đầu đường chỉ đó (giới hạn trong phần đệm để không tràn ra ngoài). */
function lineEndFor(pos: { x: number; y: number }) {
  const x1 = pctToUser(pos.x, VIETNAM_VW);
  const y1 = pctToUser(pos.y, VIETNAM_VH);
  // Đẩy hẳn sang trái, ra ngoài rìa đất liền (phía Tây), dùng phần đệm
  // quanh viewBox làm chỗ chứa thẻ ảnh callout.
  const x2 = Math.max(x1 - 320, -VIEWBOX_PAD + 25);
  const y2 = Math.max(y1 - 205, -VIEWBOX_PAD + 30);
  return {
    x1,
    y1,
    x2,
    y2,
    pct: { x: userToPct(x2, VIETNAM_VW), y: userToPct(y2, VIETNAM_VH) },
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
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [markerPct, setMarkerPct] = useState<Record<string, { x: number; y: number }>>({});
  const [hoverInfo, setHoverInfo] = useState<{ name: string; x: number; y: number } | null>(null);

  const handlePathEnter = (loc: { id: string; name: string }) => {
    onHover(loc.id);
    if (REGION_IDS.has(loc.id)) {
      // Tỉnh có dữ liệu đã có tooltip riêng đầy đủ hơn ở Marker.
      setHoverInfo(null);
      return;
    }
    const el = pathRefs.current[loc.id];
    if (!el) return;
    const bbox = el.getBBox();
    setHoverInfo({
      name: loc.name,
      x: ((bbox.x + bbox.width / 2 + VIEWBOX_PAD) / (VIETNAM_VW + VIEWBOX_PAD * 2)) * 100,
      y: ((bbox.y + bbox.height / 2 + VIEWBOX_PAD) / (VIETNAM_VH + VIEWBOX_PAD * 2)) * 100,
    });
  };
  const handlePathLeave = () => {
    onHover(null);
    setHoverInfo(null);
  };

  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    REGIONS.forEach((r) => {
      const el = pathRefs.current[r.id];
      if (!el) return;
      const bbox = el.getBBox();
      // % tính theo viewBox đã đệm (PADDED_VIEWBOX) — khớp đúng với khung
      // hình thực tế được render và với transform-origin của <g> khi zoom.
      positions[r.id] = {
        x: ((bbox.x + bbox.width / 2 + VIEWBOX_PAD) / (VIETNAM_VW + VIEWBOX_PAD * 2)) * 100,
        y: ((bbox.y + bbox.height / 2 + VIEWBOX_PAD) / (VIETNAM_VH + VIEWBOX_PAD * 2)) * 100,
      };
    });
    setMarkerPct(positions);
  }, []);

  const zoomOrigin = zoomEnabled && selectedId ? markerPct[selectedId] : null;

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
          {vietnamMap.locations.map((loc) => {
            const hasData = REGION_IDS.has(loc.id);
            const isHovered = hoveredId === loc.id;
            const isSelected = selectedId === loc.id;
            return (
              <path
                key={loc.id}
                ref={(el) => {
                  pathRefs.current[loc.id] = el;
                }}
                d={loc.path}
                onMouseEnter={() => handlePathEnter(loc)}
                onMouseLeave={handlePathLeave}
                onClick={() => hasData && onSelect(loc.id)}
                style={{
                  cursor: hasData ? "pointer" : "default",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transition:
                    "fill 300ms ease-out, stroke 300ms ease-out, opacity 300ms ease-out, transform 300ms ease-out",
                  fill: hasData
                    ? isSelected
                      ? `${C.green}8c`
                      : `${C.green}66`
                    : isHovered
                      ? `${C.fresh}75`
                      : `${C.soft}40`,
                  stroke: hasData ? C.green : C.fresh,
                  strokeWidth: hasData ? 1.8 : 1,
                  strokeOpacity: hasData ? 1 : 0.75,
                  opacity: isHovered || isSelected ? 1 : hasData ? 1 : 0.85,
                  transform: isHovered ? "scale(1.025)" : "scale(1)",
                }}
              >
                <title>{loc.name}</title>
              </path>
            );
          })}

          {REGIONS.map((r) => {
            const pos = markerPct[r.id];
            if (!pos) return null;
            const end = lineEndFor(pos);
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
                  opacity: hoveredId === r.id || selectedId === r.id ? 0.6 : 0,
                  transition: "opacity 400ms ease-out",
                }}
              />
            );
          })}
        </motion.g>
      </motion.svg>

      <div className="pointer-events-none absolute inset-0">
        {REGIONS.map((r, i) => {
          const pos = markerPct[r.id];
          if (!pos) return null;
          const isFocused = hoveredId === r.id || selectedId === r.id;
          const end = lineEndFor(pos);
          return (
            <div key={r.id}>
              <Marker
                region={r}
                pos={pos}
                index={i}
                active={selectedId === r.id}
                hovered={hoveredId === r.id}
                delay={2.9 + i * 0.15}
                inView={inView}
                onHover={onHover}
                onSelect={onSelect}
              />
              {/* Thẻ ảnh callout ở đầu đường chỉ — nằm hẳn ngoài bản đồ */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: `${end.pct.x}%`,
                  top: `${end.pct.y}%`,
                  opacity: isFocused ? 1 : 0,
                  transform: `translate(-50%, -50%) scale(${isFocused ? 1 : 0.85})`,
                  transition: "opacity 350ms ease-out, transform 350ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <div
                  className="h-20 w-32 overflow-hidden ring-2 ring-white sm:h-24 sm:w-40"
                  style={{ boxShadow: "0 14px 30px -10px rgba(6,59,36,0.55)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                </div>
                <p
                  className="mt-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: C.forest }}
                >
                  {String(i + 1).padStart(2, "0")} · {r.name}
                </p>
              </div>
            </div>
          );
        })}

        {/* Tooltip tên tỉnh khi rê chuột vào bất kỳ tỉnh nào trên bản đồ */}
        {hoverInfo && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md px-3 py-1.5 text-[11px] font-bold shadow-lg"
            style={{
              left: `${hoverInfo.x}%`,
              top: `${hoverInfo.y - 3}%`,
              background: C.forest,
              color: C.yellow,
            }}
          >
            {hoverInfo.name}
          </div>
        )}
      </div>

      <p
        className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.3em]"
        style={{ color: `${C.forest}55` }}
      >
        Việt Nam
      </p>
      <p className="mt-1 text-center text-[9px] text-neutral-400">
        Bản đồ: svg-maps.com (CC BY 4.0)
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
      <span
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-3 py-1.5 text-[11px] font-bold shadow-lg transition-all duration-200"
        style={{
          background: C.forest,
          color: C.yellow,
          opacity: hovered && !active ? 1 : 0,
          transform: hovered && !active ? "translate(-50%, 0)" : "translate(-50%, 4px)",
        }}
      >
        {region.name} · {totalProjects(region).toString().padStart(2, "0")} dự án
      </span>
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
  if (!region) {
    return (
      <div
        className="flex h-full min-h-[240px] items-center justify-center border p-8 text-center"
        style={{ borderColor: `${C.forest}18`, background: `${C.warm}` }}
      >
        <p className="max-w-xs text-sm text-neutral-400">
          Bấm vào điểm đánh dấu trên bản đồ để xem chi tiết vùng dự án.
        </p>
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
            {region.name}
          </p>
          <p className="mt-1 text-3xl font-extrabold leading-none sm:text-4xl" style={{ color: C.forest }}>
            {region.totalHa} <span className="text-base font-bold">HA</span>
          </p>
        </div>
        <p className="text-sm font-semibold text-neutral-400">
          {totalProjects(region).toString().padStart(2, "0")} dự án đang triển khai
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
              {s.short}
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
            <p className="mb-3 text-xs font-semibold italic text-neutral-400">{section.subtitle}</p>
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
                  {item.name}
                </p>
                <dl className="mt-2 space-y-1.5">
                  {item.fields.map((f) => (
                    <div key={f.label} className="flex flex-wrap gap-x-1.5 text-sm leading-relaxed">
                      <dt className="shrink-0 font-bold" style={{ color: C.fresh }}>
                        {f.label}:
                      </dt>
                      <dd className="text-neutral-600">{f.value}</dd>
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
        Liên hệ tìm hiểu thêm
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
        {stat.label}
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
