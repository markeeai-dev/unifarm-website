/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Flame,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

/** All 34 current provinces/centrally-run cities of Vietnam
 *  (post 2025 administrative merger). */
const VN_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "An Giang",
  "Cà Mau",
  "Bắc Ninh",
  "Thái Nguyên",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Tĩnh",
  "Hải Phòng",
  "Hưng Yên",
  "Khánh Hòa",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Nghệ An",
  "Ninh Bình",
  "Phú Thọ",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sơn La",
  "Tây Ninh",
  "Thanh Hóa",
  "Huế",
  "Tuyên Quang",
  "Vĩnh Long",
];

type Dimension = "Địa điểm" | "Mức thu nhập" | "Kinh nghiệm" | "Phòng ban";

const FILTER_OPTIONS: Record<Dimension, string[]> = {
  "Địa điểm": ["Tất cả", ...VN_PROVINCES],
  "Mức thu nhập": ["Tất cả", "Dưới 8 triệu", "8 - 12 triệu", "Trên 12 triệu"],
  "Kinh nghiệm": ["Tất cả", "Không yêu cầu", "Có kinh nghiệm"],
  "Phòng ban": [
    "Tất cả",
    "Kinh doanh",
    "Kỹ thuật",
    "Sản xuất",
    "Chất lượng",
    "Marketing",
    "Data",
  ],
};

const UNIFARM: { name: string; logo: string } = {
  name: "Unifarm",
  logo: "/images/logo-unifarm.png",
};

type Level = "Intern" | "Fresher" | "Junior" | "Middle" | "Senior";

const LEVEL_STYLES: Record<Level, { bg: string; text: string }> = {
  Intern: { bg: "#eaf3e8", text: "#06301B" },
  Fresher: { bg: "#cfe4cb", text: "#06301B" },
  Junior: { bg: "#006400", text: "#fff" },
  Middle: { bg: "#F5E98A", text: "#06301B" },
  Senior: { bg: "#FFFACD", text: "#06301B" },
};

type Position = {
  title: string;
  level: Level;
  dept: string;
  color: string;
  income: string;
  incomeBucket: "Dưới 8 triệu" | "8 - 12 triệu" | "Trên 12 triệu";
  location: string;
  experience: "Không yêu cầu" | "Có kinh nghiệm";
  headcount: number;
  benefit: string;
  daysLeft: number;
  tags: string[];
};

const POSITIONS: Position[] = [
  {
    title: "Kỹ sư Nông nghiệp Công nghệ cao",
    level: "Middle",
    dept: "Kỹ thuật",
    color: "#006400",
    income: "12 - 18 triệu",
    incomeBucket: "Trên 12 triệu",
    location: "Lâm Đồng",
    experience: "Có kinh nghiệm",
    headcount: 2,
    benefit: "Trực tiếp vận hành nhà kính công nghệ cao, tối ưu quy trình canh tác.",
    daysLeft: 20,
    tags: [],
  },
  {
    title: "Nhân viên Vận hành Sản xuất",
    level: "Fresher",
    dept: "Sản xuất",
    color: "#1f5c34",
    income: "8 - 12 triệu",
    incomeBucket: "8 - 12 triệu",
    location: "Đồng Nai",
    experience: "Không yêu cầu",
    headcount: 5,
    benefit: "Đào tạo vận hành dây chuyền chế biến từ đầu, phụ cấp ca đêm.",
    daysLeft: 18,
    tags: ["Không cần kinh nghiệm"],
  },
  {
    title: "Chuyên viên Kinh doanh Xuất khẩu",
    level: "Junior",
    dept: "Kinh doanh",
    color: "#006400",
    income: "12 - 18 triệu",
    incomeBucket: "Trên 12 triệu",
    location: "TP. Hồ Chí Minh",
    experience: "Có kinh nghiệm",
    headcount: 2,
    benefit: "Phát triển thị trường xuất khẩu nông sản sang Nhật, Hàn, Trung Đông.",
    daysLeft: 12,
    tags: ["HOT"],
  },
  {
    title: "Nhân viên QA/QC Nhà máy",
    level: "Fresher",
    dept: "Chất lượng",
    color: "#1f5c34",
    income: "8 - 12 triệu",
    incomeBucket: "8 - 12 triệu",
    location: "Cần Thơ",
    experience: "Không yêu cầu",
    headcount: 2,
    benefit: "Được đào tạo quy trình ISO/HACCP, phụ cấp ca đêm.",
    daysLeft: 5,
    tags: ["Không cần kinh nghiệm", "HOT"],
  },
  {
    title: "Chuyên viên Marketing Nông sản",
    level: "Junior",
    dept: "Marketing",
    color: "#006400",
    income: "8 - 12 triệu",
    incomeBucket: "8 - 12 triệu",
    location: "TP. Hồ Chí Minh",
    experience: "Có kinh nghiệm",
    headcount: 1,
    benefit: "Chủ động xây dựng nội dung thương hiệu nông sản sạch đa nền tảng.",
    daysLeft: 22,
    tags: [],
  },
  {
    title: "Trưởng nhóm Quản lý Vùng trồng",
    level: "Senior",
    dept: "Sản xuất",
    color: "#FFFACD",
    income: "Trên 12 triệu",
    incomeBucket: "Trên 12 triệu",
    location: "Vĩnh Long",
    experience: "Có kinh nghiệm",
    headcount: 1,
    benefit: "Quản lý vận hành vùng nguyên liệu, làm việc trực tiếp với nông dân liên kết.",
    daysLeft: 25,
    tags: [],
  },
  {
    title: "Thực tập sinh Phân tích Dữ liệu Nông nghiệp",
    level: "Intern",
    dept: "Data",
    color: "#0B7A0B",
    income: "4 - 6 triệu",
    incomeBucket: "Dưới 8 triệu",
    location: "Hà Nội",
    experience: "Không yêu cầu",
    headcount: 3,
    benefit: "Có mentor 1-1, cơ hội ký chính thức sau kỳ thực tập.",
    daysLeft: 9,
    tags: ["Không cần kinh nghiệm"],
  },
  {
    title: "Nhân viên R&D Sản phẩm Chế biến",
    level: "Middle",
    dept: "Kỹ thuật",
    color: "#F5E98A",
    income: "12 - 18 triệu",
    incomeBucket: "Trên 12 triệu",
    location: "An Giang",
    experience: "Có kinh nghiệm",
    headcount: 1,
    benefit: "Nghiên cứu phát triển sản phẩm chế biến mới (sấy, IQF, tinh bột kháng).",
    daysLeft: 15,
    tags: [],
  },
];

const PAGE_SIZE = 6;

/* ------------------------------------------------------------------ */
/*  Reveal on scroll — fades + slides up over 1s, once                 */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-linear ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Job card                                                           */
/* ------------------------------------------------------------------ */

function CompanyLogo() {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 shadow-sm sm:h-16 sm:w-16 sm:p-2">
      <Image
        src={UNIFARM.logo}
        alt={UNIFARM.name}
        width={56}
        height={56}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

function JobCard({
  job,
  isSaved,
  onToggleSave,
}: {
  job: Position;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  const level = LEVEL_STYLES[job.level];

  return (
    <article className="group relative flex h-full flex-col gap-3 border border-gray-100 bg-white p-4 shadow-[0_4px_18px_rgba(15,40,20,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,40,20,0.14)] sm:p-5">
      <span
        className="absolute right-0 top-0 rounded-bl-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide"
        style={{ backgroundColor: level.bg, color: level.text }}
      >
        {job.level}
      </span>

      <div className="flex items-start gap-3 pr-14 sm:pr-20">
        <CompanyLogo />
        <div className="min-w-0 flex-1">
          <h3 className="min-h-[3rem] text-base font-bold leading-snug text-[#06301B] line-clamp-2">
            {job.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#06301B]/55">
            <span className="flex items-center gap-1 font-semibold text-[#06301B]/75">
              {UNIFARM.name}
              <BadgeCheck size={14} className="text-[#006400]" />
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: job.color }}
              />
              {job.dept}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#06301B]/60">
        <span className="flex items-center gap-1.5 font-semibold text-[#006400]">
          <CircleDollarSign size={14} />
          {job.income}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          Cần tuyển {job.headcount} người
        </span>
      </div>

      {job.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                tag === "HOT" ? "bg-[#FFFACD] text-[#06301B]" : "bg-[#f2f9ee] text-[#006400]"
              }`}
            >
              {tag === "HOT" && <Flame size={11} />}
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <span className="flex items-center gap-1.5 text-sm text-[#06301B]/45">
          <Clock size={14} />
          Còn {job.daysLeft} ngày
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={isSaved ? "Bỏ lưu tin" : "Lưu tin"}
            onClick={onToggleSave}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
              isSaved
                ? "border-[#006400] bg-[#006400]/10 text-[#006400]"
                : "border-[#06301B]/10 text-[#06301B]/30 hover:border-[#006400] hover:text-[#006400]"
            }`}
          >
            <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <a
            href={`mailto:tuyendung@unifarm.com?subject=${encodeURIComponent(
              `Ứng tuyển vị trí ${job.title} tại Unifarm`
            )}`}
            className="inline-flex items-center gap-1 rounded-full bg-[#f2f9ee] px-3 py-1.5 text-sm font-bold text-[#006400] transition-colors group-hover:bg-[#006400] group-hover:text-white"
          >
            Ứng tuyển
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export default function JobListings() {
  const [dimension, setDimension] = useState<Dimension>("Địa điểm");
  const [dimensionOpen, setDimensionOpen] = useState(false);
  const [activeValue, setActiveValue] = useState("Tất cả");
  const [locationSearch, setLocationSearch] = useState("");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);
  const pillTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveValue("Tất cả");
    setLocationSearch("");
    setPage(1);
  }, [dimension]);

  const filtered = POSITIONS.filter((p) => {
    if (activeValue === "Tất cả") return true;
    switch (dimension) {
      case "Địa điểm":
        return p.location === activeValue;
      case "Mức thu nhập":
        return p.incomeBucket === activeValue;
      case "Kinh nghiệm":
        return p.experience === activeValue;
      case "Phòng ban":
        return p.dept === activeValue;
      default:
        return true;
    }
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const visibleOptions = FILTER_OPTIONS[dimension].filter((opt) => {
    if (dimension !== "Địa điểm" || opt === "Tất cả") return true;
    return opt.toLowerCase().includes(locationSearch.trim().toLowerCase());
  });

  const scrollPills = (dir: 1 | -1) => {
    pillTrackRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const toggleSaved = (title: string) => {
    setSaved((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f9ee] text-[#006400]">
              <Flame size={18} />
            </span>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-[#06301B] sm:text-4xl">
                Vị trí đang tuyển gấp
              </h2>
              <Image
                src="/images/mascot/mascot-duo.png"
                alt=""
                aria-hidden="true"
                width={200}
                height={200}
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={80} className="relative z-20 mt-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setDimensionOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-[#06301B]/12 bg-white px-4 py-2.5 text-sm font-semibold text-[#06301B] shadow-sm transition-colors hover:border-[#006400]"
              >
                <SlidersHorizontal size={15} className="text-[#006400]" />
                Lọc theo: {dimension}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    dimensionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dimensionOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-lg border border-black/5 bg-white py-2 shadow-lg">
                  {(Object.keys(FILTER_OPTIONS) as Dimension[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDimension(d);
                        setDimensionOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2 text-sm text-[#06301B]/75 transition-colors hover:bg-[#f2f9ee] hover:text-[#006400]"
                    >
                      {d}
                      {d === dimension && <Check size={14} className="text-[#006400]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {dimension === "Địa điểm" && (
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#06301B]/35"
                />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Tìm tỉnh/thành..."
                  className="w-52 rounded-lg border border-[#06301B]/12 bg-white py-2.5 pl-8 pr-3 text-sm text-[#06301B] placeholder:text-[#06301B]/35 outline-none transition-colors focus:border-[#006400] sm:w-64"
                />
              </div>
            )}
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Cuộn trái"
              onClick={() => scrollPills(-1)}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#06301B]/10 text-[#06301B]/45 transition-colors hover:border-[#006400] hover:text-[#006400] sm:flex"
            >
              <ChevronLeft size={15} />
            </button>
            <div
              ref={pillTrackRef}
              className="flex gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {visibleOptions.length === 0 ? (
                <p className="py-2 text-sm text-[#06301B]/40">
                  Không tìm thấy tỉnh/thành phù hợp.
                </p>
              ) : (
                visibleOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setActiveValue(opt);
                      setPage(1);
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeValue === opt
                        ? "bg-[#006400] text-white"
                        : "border border-[#06301B]/12 text-[#06301B]/65 hover:border-[#006400] hover:text-[#006400]"
                    }`}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              aria-label="Cuộn phải"
              onClick={() => scrollPills(1)}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#06301B]/10 text-[#06301B]/45 transition-colors hover:border-[#006400] hover:text-[#006400] sm:flex"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((job, i) => (
            <Reveal key={job.title} delayMs={i * 90}>
              <JobCard
                job={job}
                isSaved={saved.includes(job.title)}
                onToggleSave={() => toggleSaved(job.title)}
              />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-[#06301B]/50">
            Không có vị trí phù hợp với bộ lọc này.
          </p>
        )}

        <Reveal delayMs={120} className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Trang trước"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#06301B]/15 text-[#06301B]/60 transition-colors hover:border-[#006400] hover:text-[#006400] disabled:opacity-30 disabled:hover:border-[#06301B]/15 disabled:hover:text-[#06301B]/60"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-[#06301B]/70">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            aria-label="Trang sau"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#06301B]/15 text-[#06301B]/60 transition-colors hover:border-[#006400] hover:text-[#006400] disabled:opacity-30 disabled:hover:border-[#06301B]/15 disabled:hover:text-[#06301B]/60"
          >
            <ChevronRight size={16} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
