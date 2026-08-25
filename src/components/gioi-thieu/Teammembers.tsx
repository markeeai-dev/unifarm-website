"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * TeamMembers ("Các Thành Viên Chuyên Gia")
 * Next.js + Tailwind CSS component — no extra dependencies.
 *
 * - Infinite-loop carousel (7 real cards, cloned edges) showing ~4 full
 *   cards at a time on desktop, autoplaying every 3.5s.
 * - A horizontal avatar bar sits above the carousel — a round photo + name
 *   per member. As the carousel autoplays, the avatar whose card is
 *   currently leading lights up (scale-up + soft pulsing glow ring), and
 *   the matching card below gets the same pulse, so both stay in sync
 *   automatically. Clicking an avatar glides the carousel to that member
 *   (shortest direction across the loop); autoplay just continues after.
 * - Dragging glides across as many cards as the drag distance implies
 *   (not a rigid "one drag = one slide" snap) for a smooth, continuous feel.
 * - Hover on a card: crossfades to the avatar photo, a soft white light
 *   sweeps across once, and a dark scrim panel fades in with avatar,
 *   name, position, bio, experience bullets, and Facebook / Zalo /
 *   Instagram / TikTok links. On touch devices, tapping a card toggles
 *   the same reveal (a tap that was actually a drag is ignored).
 * - Whole section eases in over ~4.5s on first scroll-into-view.
 *
 * Palette:
 *   Yellow      #FFFACD
 *   Dark green  #006400
 *   Light blue  #87CEFA (accent)
 */

const ACCENT = "#87cefa";

type Socials = {
  facebook?: string;
  zalo?: string;
  instagram?: string;
  tiktok?: string;
};

type Member = {
  id: string;
  name: string;
  position: string;
  avatar: string; // small round headshot for the back of the card
  coverImage: string; // front-of-card photo
  description: string;
  experience: string[];
  socials: Socials;
};

const MEMBERS: Member[] = [
  {
    id: "an",
    name: "Nguyễn Thị Lan Anh",
    position: "Chuyên gia dinh dưỡng",
    avatar: "/images/team/lan-anh-avatar.jpg",
    coverImage: "/images/team/lan-anh-cover.jpg",
    description:
      "Đồng hành cùng đội ngũ xây dựng khẩu phần rau củ quả cân bằng, đảm bảo dinh dưỡng cho từng combo sản phẩm.",
    experience: ["10 năm tư vấn dinh dưỡng lâm sàng", "Từng công tác tại Viện Dinh Dưỡng Quốc Gia"],
    socials: {
      facebook: "https://facebook.com/lan.anh.nutrition",
      zalo: "https://zalo.me/lananh",
      instagram: "https://instagram.com/lananh.nutri",
      tiktok: "https://tiktok.com/@lananh.nutri",
    },
  },
  {
    id: "hoang",
    name: "Trần Minh Hoàng",
    position: "Kỹ sư nông nghiệp",
    avatar: "/images/team/minh-hoang-avatar.jpg",
    coverImage: "/images/team/minh-hoang-cover.jpg",
    description:
      "Giám sát quy trình canh tác hữu cơ tại vùng trồng, đảm bảo mỗi lứa rau củ đạt chuẩn trước khi thu hoạch.",
    experience: ["8 năm quản lý nông trại hữu cơ", "Chứng chỉ VietGAP & GlobalGAP"],
    socials: {
      facebook: "https://facebook.com/minh.hoang.farm",
      zalo: "https://zalo.me/minhhoang",
      instagram: "https://instagram.com/minhhoang.farm",
    },
  },
  {
    id: "thu",
    name: "Phạm Thị Bích Thu",
    position: "Quản lý chất lượng",
    avatar: "/images/team/bich-thu-avatar.jpg",
    coverImage: "/images/team/bich-thu-cover.jpg",
    description:
      "Kiểm định độ tươi, dư lượng và bao bì trước khi sản phẩm rời kho, giữ chuẩn chất lượng đồng nhất mỗi ngày.",
    experience: ["6 năm kiểm định thực phẩm tươi sống", "Đào tạo HACCP cho đội vận hành"],
    socials: {
      facebook: "https://facebook.com/bich.thu.qc",
      zalo: "https://zalo.me/bichthu",
      tiktok: "https://tiktok.com/@bichthu.qc",
    },
  },
  {
    id: "duc",
    name: "Lê Anh Đức",
    position: "Chuyên gia thu mua",
    avatar: "/images/team/anh-duc-avatar.jpg",
    coverImage: "/images/team/anh-duc-cover.jpg",
    description:
      "Làm việc trực tiếp với nông hộ để chọn lứa hàng ngon nhất, thương lượng giá công bằng cho cả hai bên.",
    experience: ["12 năm trong ngành thu mua nông sản", "Mạng lưới hơn 50 nông hộ liên kết"],
    socials: {
      facebook: "https://facebook.com/anh.duc.purchasing",
      zalo: "https://zalo.me/anhduc",
      instagram: "https://instagram.com/anhduc.sourcing",
      tiktok: "https://tiktok.com/@anhduc.sourcing",
    },
  },
  {
    id: "linh",
    name: "Vũ Khánh Linh",
    position: "Chuyên gia đóng gói & bảo quản",
    avatar: "/images/team/khanh-linh-avatar.jpg",
    coverImage: "/images/team/khanh-linh-cover.jpg",
    description:
      "Nghiên cứu giải pháp đóng gói giữ độ tươi lâu hơn mà vẫn thân thiện với môi trường.",
    experience: ["5 năm R&D bao bì thực phẩm", "Phát triển dây chuyền bảo quản lạnh nội bộ"],
    socials: {
      facebook: "https://facebook.com/khanh.linh.packaging",
      instagram: "https://instagram.com/khanhlinh.rd",
      tiktok: "https://tiktok.com/@khanhlinh.rd",
    },
  },
  {
    id: "nam",
    name: "Đỗ Hoài Nam",
    position: "Điều phối vận chuyển",
    avatar: "/images/team/hoai-nam-avatar.jpg",
    coverImage: "/images/team/hoai-nam-cover.jpg",
    description:
      "Tối ưu lộ trình giao hàng để rau củ quả đến tay khách hàng trong ngày, luôn tươi như mới hái.",
    experience: ["7 năm điều phối logistics chuỗi lạnh", "Quản lý đội xe giao hàng toàn thành phố"],
    socials: {
      facebook: "https://facebook.com/hoai.nam.logistics",
      zalo: "https://zalo.me/hoainam",
    },
  },
  {
    id: "mai",
    name: "Hoàng Thị Diệu Mai",
    position: "Chăm sóc khách hàng",
    avatar: "/images/team/dieu-mai-avatar.jpg",
    coverImage: "/images/team/dieu-mai-cover.jpg",
    description:
      "Lắng nghe phản hồi khách hàng mỗi ngày để cải thiện sản phẩm và trải nghiệm mua sắm.",
    experience: ["4 năm chăm sóc khách hàng ngành F&B", "Xây dựng quy trình phản hồi 24h"],
    socials: {
      facebook: "https://facebook.com/dieu.mai.support",
      zalo: "https://zalo.me/dieumai",
      instagram: "https://instagram.com/dieumai.cs",
      tiktok: "https://tiktok.com/@dieumai.cs",
    },
  },
];

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 650;
const CLONE_COUNT = 4;

/* One-time global keyframes for the "nổi lên / nháy nháy" active pulse,
   shared by the nav avatar and the matching card. */
const PulseStyles = () => (
  <style>{`
    @keyframes memberActivePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(135, 206, 250, 0.55); }
      50% { box-shadow: 0 0 0 12px rgba(135, 206, 250, 0); }
    }
    .member-active-pulse {
      animation: memberActivePulse 1.8s ease-out infinite;
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  Social icons                                                        */
/* ------------------------------------------------------------------ */
type SocialKey = keyof Socials;

const SOCIAL_LABELS: Record<SocialKey, string> = {
  facebook: "Facebook",
  zalo: "Zalo",
  instagram: "Instagram",
  tiktok: "TikTok",
};

function SocialGlyph({ type }: { type: SocialKey }) {
  switch (type) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.91h-2.33V22C18.34 21.23 22 17.08 22 12.06Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.2" cy="6.8" r="1.1" className="fill-current stroke-none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M16.5 2h-3v13.2a2.9 2.9 0 1 1-2.05-2.77V9.3a6 6 0 1 0 5.05 5.93V9.1a7.6 7.6 0 0 0 4.5 1.45V7.4a4.7 4.7 0 0 1-4.5-4.4V2Z" />
        </svg>
      );
    case "zalo":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <text x="12" y="15.8" textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-current stroke-none">
            Z
          </text>
        </svg>
      );
  }
}

function SocialRow({ socials }: { socials: Socials }) {
  const entries = (Object.keys(SOCIAL_LABELS) as SocialKey[]).filter((key) => socials[key]);
  if (entries.length === 0) return null;

  return (
    <div className="pointer-events-auto mt-3 flex items-center justify-center gap-2">
      {entries.map((key) => (
        <a
          key={key}
          href={socials[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_LABELS[key]}
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/90 ring-1 ring-white/40 transition-all duration-200 hover:text-[#006400] sm:h-8 sm:w-8"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)")}
        >
          <SocialGlyph type={key} />
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook                                                  */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/* ------------------------------------------------------------------ */
/*  Card                                                                */
/* ------------------------------------------------------------------ */
function MemberCard({
  member,
  dragMovedRef,
  active,
}: {
  member: Member;
  dragMovedRef: React.RefObject<boolean>;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const revealed = hovered || tapped;

  return (
    <div
      className={`group relative aspect-[4/5.2] w-full cursor-pointer select-none overflow-hidden bg-[#fffacd] shadow-[0_14px_34px_rgba(0,0,0,0.12)] transition-transform duration-500 ${
        active ? "member-active-pulse scale-[1.03]" : "scale-100"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (dragMovedRef.current) {
          dragMovedRef.current = false;
          return;
        }
        setTapped((t) => !t);
      }}
    >
      {/* Base photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={member.coverImage}
        alt={member.name}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
        style={{ opacity: revealed ? 0 : 1 }}
      />
      {/* Avatar photo — crossfades in behind the reveal panel */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={member.avatar}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-sm transition-opacity duration-500 ease-out"
        style={{ opacity: revealed ? 1 : 0 }}
      />

      {/* Soft light sweep — plays once as the card is revealed */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/45 to-transparent"
        style={{
          width: "60%",
          transform: revealed ? "translateX(220%) skewX(-12deg)" : "translateX(-160%) skewX(-12deg)",
          transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Bottom name label — default state */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300"
        style={{ opacity: revealed ? 0 : 1 }}
      >
        <p className="text-base font-bold text-white sm:text-lg">{member.name}</p>
        <p className="mt-0.5 text-xs font-medium text-[#87cefa] sm:text-sm">{member.position}</p>
      </div>

      {/* Center reveal panel — avatar / name / position / description / experience */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/55 px-5 text-center transition-all duration-400 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1)" : "scale(0.92)",
        }}
      >
        <div
          className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-4 ring-[#87cefa]/40 sm:h-16 sm:w-16"
          style={{ backgroundColor: ACCENT }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.avatar}
            alt={member.name}
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        <p className="mt-3 text-lg font-bold text-white sm:text-xl">{member.name}</p>
        <span
          className="mt-1 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#006400] sm:text-xs"
          style={{ backgroundColor: ACCENT }}
        >
          {member.position}
        </span>

        <p className="mt-2 text-xs leading-relaxed text-white/85 sm:text-sm">{member.description}</p>

        <ul className="mt-2 space-y-1 text-left">
          {member.experience.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] leading-snug text-white/75 sm:text-xs">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <SocialRow socials={member.socials} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */
export default function TeamMembers() {
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.12);

  const [perView, setPerView] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1.25);
      else if (window.innerWidth < 1024) setPerView(2.3);
      else setPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const realCount = MEMBERS.length;
  const slides = [
    ...MEMBERS.slice(-CLONE_COUNT),
    ...MEMBERS,
    ...MEMBERS.slice(0, CLONE_COUNT),
  ];

  const [index, setIndex] = useState(CLONE_COUNT);
  const [withTransition, setWithTransition] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dragX, setDragX] = useState(0);
  const [dragBaseWidth, setDragBaseWidth] = useState(0);
  const dragging = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartX = useRef(0);
  const [isHovering, setIsHovering] = useState(false);

  /* ---- autoplay (paused while hovering or dragging; resumes as normal
     after a name-bar click, since a click is just a manual jump) ---- */
  useEffect(() => {
    if (isHovering || dragging.current) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isHovering, index]);

  /* ---- seamless jump when hitting a cloned edge ---- */
  const handleTransitionEnd = () => {
    if (index >= realCount + CLONE_COUNT) {
      setWithTransition(false);
      setIndex(index - realCount);
    } else if (index < CLONE_COUNT) {
      setWithTransition(false);
      setIndex(index + realCount);
    }
  };

  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

  /* ---- pointer drag — glides across as many cards as the distance implies ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragMovedRef.current = false;
    dragStartX.current = e.clientX;
    setDragX(0);
    setDragBaseWidth(containerRef.current ? containerRef.current.offsetWidth : 0);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 6) dragMovedRef.current = true;
    setDragX(delta);
  };

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;

    const cardWidthPx = dragBaseWidth / perView || 1;
    const rawDelta = dragX / cardWidthPx;
    let deltaCards = Math.round(rawDelta);
    if (deltaCards === 0 && Math.abs(rawDelta) > 0.15) {
      deltaCards = rawDelta > 0 ? 1 : -1;
    }
    const clamped = Math.max(-CLONE_COUNT, Math.min(CLONE_COUNT, deltaCards));

    if (clamped !== 0) setIndex((i) => i - clamped);
    setDragX(0);
  }, [dragBaseWidth, dragX, perView]);

  /* ---- name-bar navigation: jump to a member's card via the shortest
     path across the loop, then let autoplay carry on as usual ---- */
  const goToMember = (realIndex: number) => {
    const target = CLONE_COUNT + realIndex;
    const candidates = [target - realCount, target, target + realCount];
    let best = candidates[0];
    let bestDist = Math.abs(candidates[0] - index);
    for (const c of candidates) {
      const d = Math.abs(c - index);
      if (d < bestDist) {
        best = c;
        bestDist = d;
      }
    }
    setIndex(best);
  };

  const activeRealIndex = ((index - CLONE_COUNT) % realCount + realCount) % realCount;

  const slidePercent = 100 / perView;
  const baseOffset = -(index * slidePercent);
  const dragOffsetPercent = dragBaseWidth ? (dragX / dragBaseWidth) * 100 : 0;

  return (
    <section className="w-full bg-[#fffacd] py-16 sm:py-20 lg:py-15">
      <div
        ref={sectionRef}
        className="mx-auto max-w-full px-4 transition-all ease-out sm:px-6 lg:px-8"
        style={{
          transitionDuration: "6500ms",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(48px)",
        }}
      >
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#87CEFA]">
            Đồng hành cùng bạn
          </span>
          <h2 className="uppercase mt-3 text-3xl font-extrabold leading-tight tracking-[-0.01em] text-[#006400] sm:text-4xl lg:text-[42px]">
            Các Thành Viên Chuyên Gia
          </h2>
        </div>

        {/* Avatar bar — auto-highlights whoever the carousel is currently on;
            click an avatar to glide the carousel to that member */}
        <PulseStyles />
        <div className="mt-8 flex justify-start gap-4 overflow-x-auto px-1 pb-3 sm:mt-10 sm:justify-center sm:gap-6 sm:overflow-visible sm:pb-1">
          {MEMBERS.map((member, i) => {
            const active = i === activeRealIndex;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => goToMember(i)}
                className="flex shrink-0 flex-col items-center gap-1.5 focus:outline-none"
              >
                <span
                  className={`block h-12 w-12 overflow-hidden rounded-full ring-2 transition-all duration-300 sm:h-14 sm:w-14 ${
                    active ? "member-active-pulse scale-110 ring-[#87cefa]" : "scale-100 ring-[#006400]/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span
                  className="max-w-[72px] whitespace-nowrap text-[11px] font-semibold leading-tight transition-colors duration-300 sm:max-w-[88px] sm:text-xs"
                  style={{ color: active ? "#006400" : "rgba(0,100,0,0.55)" }}
                >
                  {member.name.split(" ").slice(-2).join(" ")}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="relative mt-6 sm:mt-8"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={containerRef}
            className="overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <div
              className="flex cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(${baseOffset + dragOffsetPercent}%)`,
                transition: withTransition
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((member, i) => {
                const slideRealIndex = ((i - CLONE_COUNT) % realCount + realCount) % realCount;
                return (
                  <div key={i} className="shrink-0 px-1.5 sm:px-2" style={{ width: `${slidePercent}%` }}>
                    <MemberCard
                      member={member}
                      dragMovedRef={dragMovedRef}
                      active={slideRealIndex === activeRealIndex}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}