/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Eye,
  Clock,
  Zap,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";
import type { BlogPost } from "@/lib/db";
import { TAG_OPTIONS, TAG_COLOR, DEFAULT_TAG_COLOR } from "@/lib/blog-tags";
import { BorderTrace, Particles, CornerBrackets, BLOG_DECOR_KEYFRAMES } from "./Decor";
import { useIntroReady } from "@/lib/use-intro-ready";

function readingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200));
}

/* ─── Floating stat card (mascot hero) ─── */
function StatCard({
  icon,
  label,
  value,
  delay,
  pos,
  introReady,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
  pos: string;
  introReady: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={introReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ scale: 1.06, y: -3 }}
      className={`absolute ${pos} z-10 flex items-center gap-3 rounded-2xl px-4 py-3`}
      style={{
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,100,0,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,100,0,0.06)",
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: "linear-gradient(135deg, #006400, #0B7A0B)",
          boxShadow: "0 4px 12px rgba(0,100,0,0.4)",
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase leading-none tracking-wider text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-extrabold leading-none text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}

const ALL_TAG = "__all__";
const FILTER_TABS = [ALL_TAG, ...TAG_OPTIONS];

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const introReady = useIntroReady();
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [activeTab, setActiveTab] = useState(ALL_TAG);
  const [visibleCount, setVisibleCount] = useState(9);

  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; excerpt: string }>>({});
  const lastTranslatedLang = useRef<string>("");

  const translatePosts = useCallback(
    async (targetLang: string, signal?: AbortSignal) => {
      if (posts.length === 0) return;
      if (lastTranslatedLang.current === targetLang) return;
      try {
        const textsToTranslate: string[] = [];
        const postIds: string[] = [];
        posts.forEach((p) => {
          textsToTranslate.push(p.title);
          textsToTranslate.push(p.excerpt || "");
          postIds.push(p.id);
        });

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: textsToTranslate, targetLang }),
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const translations: string[] = data.translations;

        const newMap: Record<string, { title: string; excerpt: string }> = {};
        postIds.forEach((id, idx) => {
          newMap[id] = {
            title: translations[idx * 2] || "",
            excerpt: translations[idx * 2 + 1] || "",
          };
        });
        setTranslatedMap(newMap);
        lastTranslatedLang.current = targetLang;
      } catch {
        // giữ nguyên tiếng Việt nếu dịch lỗi
      }
    },
    [posts]
  );

  useEffect(() => {
    const controller = new AbortController();
    if (lang !== "vi" && posts.length > 0) translatePosts(lang, controller.signal);
    if (lang === "vi") {
      setTranslatedMap({});
      lastTranslatedLang.current = "";
    }
    return () => controller.abort();
  }, [lang, posts, translatePosts]);

  const isTranslated = lang !== "vi" && Object.keys(translatedMap).length > 0;

  const latestPosts = posts.filter((p) => !p.is_featured).slice(0, 6);
  const popularPosts = posts
    .filter((p) => p.is_featured)
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 6);
  const filteredAll = activeTab === ALL_TAG ? posts : posts.filter((p) => p.tag === activeTab);

  return (
    <main className="min-h-screen text-gray-900">
      <style>{`
        ${BLOG_DECOR_KEYFRAMES}
        @keyframes float-mascot {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%     { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes card-glow {
          0%,100% { box-shadow: 0 4px 10px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.05); }
          50%     { box-shadow: 0 8px 24px rgba(0,100,0,0.08), 0 2px 6px rgba(0,0,0,0.04); }
        }
        @keyframes blog-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .blog-card {
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #fffef5 100%);
          border: 1px solid rgba(0,100,0,0.1);
          border-radius: 18px;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, border-color 0.35s ease;
          animation: card-glow 4s ease-in-out infinite;
        }
        .blog-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #006400, #0B7A0B, #006400);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .blog-card:hover::before { transform: scaleX(1); }
        .blog-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(0,100,0,0.4);
          box-shadow: 0 30px 70px rgba(0,100,0,0.18), 0 10px 25px rgba(0,0,0,0.1);
          animation: none;
        }
        .blog-cta-btn { position: relative; overflow: hidden; }
        .blog-cta-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%);
          transform: translateX(-120%);
          pointer-events: none;
        }
        .blog-cta-btn:hover::after { animation: blog-shine 0.65s ease forwards; }
        .float-mascot { animation: float-mascot 5s ease-in-out infinite; }
      `}</style>

      {/* ═══════ HERO — MASCOT ═══════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #ffffff 0%, #fffef2 45%, #fffde7 75%, #fffbea 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#006400 1px,transparent 1px),linear-gradient(to bottom,#006400 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <BorderTrace color="rgba(0,100,0,0.15)" duration={14} />
        <Particles count={18} light seed={1} />

        <motion.div
          className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,100,0,0.07) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-20 right-0 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(135,206,250,0.14) 0%, transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <CornerBrackets color="rgba(0,100,0,0.18)" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 xl:gap-14">
          {/* LEFT — mascot with floating stats */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={introReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-2 flex justify-center lg:order-1 lg:justify-end"
          >
            <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center">
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(0,100,0,0.18) 20%, transparent 70%)",
                  filter: "blur(28px)",
                  transform: "scale(0.85)",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 0.95, 0.85] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div
                className="float-mascot relative overflow-hidden"
                style={{
                  filter:
                    "drop-shadow(0 28px 56px rgba(0,100,0,0.22)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-1/2 z-5 h-[2px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    animation: "borderTrace 3s linear infinite",
                  }}
                />
                <Image
                  src="/images/products/dua-vip.png"
                  alt="Unifarm Blog"
                  width={557}
                  height={640}
                  className="h-auto w-full max-w-[300px] object-contain transition-transform duration-700 hover:scale-105 sm:max-w-[340px] lg:max-w-[380px]"
                />
                <p
                  className="-mt-6 text-center text-2xl font-extrabold tracking-[0.15em] text-[#006400]"
                  style={{ textShadow: "0 0 18px rgba(255,255,255,0.7)" }}
                >
                  UNIFARM BLOG
                </p>
              </div>

              <StatCard
                pos="left-0 top-[8%] sm:left-[-8%] sm:top-[20%]"
                label="Bài viết"
                value={`${posts.length}+`}
                delay={0.5}
                icon={<FileText className="h-4 w-4 text-white" />}
                introReady={introReady}
              />
              <StatCard
                pos="right-0 top-[42%] sm:right-[-5%] sm:top-[35%]"
                label="Lượt đọc"
                value="12,400+"
                delay={0.7}
                icon={<Users className="h-4 w-4 text-white" />}
                introReady={introReady}
              />
              <StatCard
                pos="left-[5%] bottom-[15%]"
                label="Tăng trưởng"
                value="+250%"
                delay={0.9}
                icon={<BarChart3 className="h-4 w-4 text-white" />}
                introReady={introReady}
              />
            </div>
          </motion.div>

          {/* RIGHT — text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.75 }}
            className="order-1 text-center lg:order-2 lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={introReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest"
              style={{
                background: "linear-gradient(135deg,rgba(0,100,0,0.1) 0%,rgba(135,206,250,0.1) 100%)",
                border: "1px solid rgba(0,100,0,0.2)",
                color: "#006400",
                boxShadow: "0 0 24px rgba(0,100,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                🌱
              </motion.span>
              Tri thức Unifarm
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="uppercase mt-6 max-w-[600px] text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-[3.4rem]"
              style={{
                background: "linear-gradient(135deg, #06301B 20%, #006400 60%, #1E6FA8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Tri Thức Chỉ Thực Sự Lớn Lên Khi Được Chia Sẻ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-5 max-w-lg text-[17px] leading-relaxed text-gray-500 lg:mx-0"
            >
              Mỗi ngày ngoài cánh đồng đều đặt ra những bài toán mới. Unifarm không giữ tri thức cho riêng mình. Đây là nơi chúng tôi đóng góp cho nền nông nghiệp bằng việc chia sẻ minh bạch những gì đúc kết được từ thử nghiệm thực địa và dữ liệu sản xuất.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              {[
                { icon: <Zap className="h-3.5 w-3.5" />, label: "Kỹ thuật canh tác" },
                { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Câu chuyện nông sản" },
                { icon: <Sparkles className="h-3.5 w-3.5" />, label: "Tin tức" },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#006400]/70">
                  {item.icon} {item.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <motion.a
                href="#latest"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="blog-cta-btn inline-flex items-center gap-2 rounded-2xl px-7 py-[15px] text-[15px] font-bold tracking-wide text-white"
                style={{
                  background: "linear-gradient(135deg, #006400 0%, #0B7A0B 100%)",
                  boxShadow:
                    "0 14px 44px rgba(0,100,0,0.42), 0 4px 12px rgba(0,100,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <Sparkles className="h-4 w-4" /> Bài mới nhất
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  →
                </motion.span>
              </motion.a>
              <motion.a
                href="#popular"
                whileHover={{ scale: 1.04, y: -2 }}
                className="inline-flex items-center gap-2 rounded-2xl px-7 py-[15px] text-[15px] font-bold text-[#006400] transition"
                style={{ background: "rgba(0,100,0,0.06)", border: "1px solid rgba(0,100,0,0.2)" }}
              >
                <TrendingUp className="h-4 w-4" /> Nổi bật
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ LATEST ═══════ */}
      {latestPosts.length > 0 && (
        <section
          id="latest"
          className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-24"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right,rgba(0,100,0,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,100,0,0.04) 1px,transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <BorderTrace color="rgba(0,100,0,0.3)" glow="rgba(0,100,0,0.15)" duration={12} />
          <Particles count={16} light seed={2} />
          <CornerBrackets color="rgba(0,100,0,0.15)" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#006400]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#006400]">Mới nhất</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#006400]/25 to-transparent" />
            </div>
            <h2 className="uppercase mb-4 text-3xl font-black text-gray-900 sm:text-4xl">Bài viết mới nhất</h2>
            <p className="mb-12 max-w-md text-sm text-gray-400">
              Cập nhật mới nhất về nông nghiệp công nghệ cao từ Unifarm.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  delay={i * 0.08}
                  translatedTitle={isTranslated ? translatedMap[post.id]?.title : undefined}
                  translatedExcerpt={isTranslated ? translatedMap[post.id]?.excerpt : undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ POPULAR — dark green section ═══════ */}
      {popularPosts.length > 0 && (
        <section
          id="popular"
          className="relative overflow-hidden py-24"
          style={{ background: "linear-gradient(148deg, #006400 0%, #0B7A0B 55%, #06301B 100%)" }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <BorderTrace color="rgba(255,255,255,0.35)" glow="rgba(255,255,255,0.12)" duration={9} />
          <Particles count={30} seed={3} />

          <motion.div
            className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)", filter: "blur(50px)" }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,250,205,0.22) 0%, transparent 70%)", filter: "blur(40px)" }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <CornerBrackets color="rgba(255,255,255,0.2)" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
                  Bài đọc nhiều
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
            </div>
            <h2 className="uppercase mb-4 text-3xl font-black text-white sm:text-4xl">Bài viết nổi bật</h2>
            <p className="mb-12 max-w-md text-sm text-white/45">Những bài viết được bạn đọc quan tâm nhất.</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  delay={i * 0.08}
                  variant="dark"
                  translatedTitle={isTranslated ? translatedMap[post.id]?.title : undefined}
                  translatedExcerpt={isTranslated ? translatedMap[post.id]?.excerpt : undefined}
                />
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)" }}
          />
        </section>
      )}

      {/* ═══════ ALL POSTS ═══════ */}
      <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(0,100,0,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,100,0,0.035) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <BorderTrace color="rgba(0,100,0,0.28)" glow="rgba(0,100,0,0.12)" duration={14} />
        <Particles count={14} light seed={4} />
        <CornerBrackets color="rgba(0,100,0,0.15)" />

        {/* Language toggle + header */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#006400]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#006400]">Khám phá</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#006400]/25 to-transparent" />
              </div>
              <h2 className="uppercase text-3xl font-black text-gray-900 sm:text-4xl">Tất cả bài viết</h2>
            </div>

            <div className="inline-flex items-center rounded-full border border-[#006400]/20 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setLang("vi")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  lang === "vi" ? "bg-[#006400] text-white" : "text-[#06301B]/60 hover:text-[#006400]"
                }`}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  lang === "en" ? "bg-[#006400] text-white" : "text-[#06301B]/60 hover:text-[#006400]"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap gap-2.5 overflow-visible">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setVisibleCount(9);
                }}
                className="whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200"
                style={
                  activeTab === tab
                    ? { background: "linear-gradient(135deg, #006400, #0B7A0B)", color: "#fff", border: "1px solid transparent" }
                    : { background: "rgba(0,100,0,0.05)", color: "#666", border: "1px solid rgba(0,100,0,0.12)" }
                }
              >
                {tab === ALL_TAG ? "Tất cả" : tab}
              </button>
            ))}
          </div>

          {filteredAll.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#006400]/25" />
              <p className="text-base">Chưa có bài viết trong chuyên mục này.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAll.slice(0, visibleCount).map((post, i) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    delay={i * 0.05}
                    translatedTitle={isTranslated ? translatedMap[post.id]?.title : undefined}
                    translatedExcerpt={isTranslated ? translatedMap[post.id]?.excerpt : undefined}
                  />
                ))}
              </div>
              {visibleCount < filteredAll.length && (
                <div className="mt-14 text-center">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setVisibleCount((prev) => prev + 9)}
                    className="blog-cta-btn inline-flex items-center gap-2 rounded-2xl px-9 py-4 text-base font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #006400, #0B7A0B)",
                      boxShadow: "0 14px 44px rgba(0,100,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    Xem thêm <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16">
        <Particles count={14} light seed={5} />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div
            className="relative overflow-hidden rounded-[22px] px-10 py-16 sm:px-16"
            style={{ background: "linear-gradient(135deg, #041a0c 0%, #06301B 45%, #0B7A0B 100%)" }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,100,0,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(0,100,0,0.18) 1px,transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-[-40%] w-[40%]"
              style={{
                background: "linear-gradient(120deg, transparent, rgba(135,206,250,0.1), rgba(255,250,205,0.15), transparent)",
                animation: "blog-scan 7s linear infinite",
              }}
            />
            <motion.div
              className="pointer-events-none absolute right-[5%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,250,205,0.25) 0%, rgba(0,100,0,0.15) 40%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.35em] text-[#FFFACD]">Unifarm</p>
                <h3 className="uppercase mb-5 text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
                  Cùng Unifarm xây dựng nông nghiệp bền vững
                </h3>
                <p className="mb-8 max-w-md text-sm font-light leading-relaxed text-white/55 sm:text-base">
                  Khám phá sản phẩm nông sản sạch và hành trình phát triển của Unifarm.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/san-pham"
                      className="blog-cta-btn inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #006400, #0B7A0B)",
                        boxShadow: "0 14px 44px rgba(0,100,0,0.42), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      Xem sản phẩm
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                  <Link
                    href="/gioi-thieu"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold transition"
                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
                  >
                    Tìm hiểu thêm
                  </Link>
                </div>
              </div>

              <div className="hidden justify-center lg:flex">
                <div className="relative flex h-[140px] w-[140px] items-center justify-center">
                  <div
                    className="pointer-events-none absolute h-[200px] w-[200px] rounded-full"
                    style={{ border: "1px solid rgba(255,250,205,0.3)", animation: "spin 12s linear infinite" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                      background: "linear-gradient(135deg, #006400, #06301B)",
                      animation: "pulse 3s ease-in-out infinite",
                    }}
                  />
                  <span className="relative z-10 text-4xl">🌱</span>
                  <p className="absolute -bottom-8 text-center text-[8px] uppercase tracking-[0.25em] text-white/40">
                    Unifarm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─────────────── Post Card ─────────────── */
function PostCard({
  post,
  delay = 0,
  variant = "light",
  translatedTitle,
  translatedExcerpt,
}: {
  post: BlogPost;
  delay?: number;
  variant?: "light" | "dark";
  translatedTitle?: string;
  translatedExcerpt?: string;
}) {
  const tc = TAG_COLOR[post.tag] ?? DEFAULT_TAG_COLOR;
  const mins = readingTime(post.content);

  const displayTitle = translatedTitle || post.title;
  const displayExcerpt = translatedExcerpt || post.excerpt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 0.68, 0, 1.05] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`group block ${variant === "dark" ? "" : "blog-card"}`}
        style={
          variant === "dark"
            ? {
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, border-color 0.4s",
              }
            : undefined
        }
      >
        <div className="relative h-56 overflow-hidden" style={{ borderRadius: "18px 18px 0 0" }}>
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #fffef0, #fffacd)" }}
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                <Sparkles className="h-10 w-10 text-[#006400]/30" />
              </motion.div>
            </div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55))" }} />

          <span
            className="absolute left-3 top-3 rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ background: tc.bg, color: tc.text, backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            {post.tag}
          </span>

          {(post.view_count ?? 0) > 0 && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-[10px] text-white/80 backdrop-blur-sm">
              <Eye className="h-3 w-3" /> {(post.view_count || 0).toLocaleString()}
            </span>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-medium text-white/70">
            <Clock className="h-3 w-3" /> {mins} phút đọc
          </div>
        </div>

        <div className="p-5">
          <h3
            className={`uppercase mb-2 line-clamp-2 text-[15px] font-bold leading-snug transition-colors duration-300 ${
              variant === "dark" ? "text-white group-hover:text-[#FFFACD]" : "text-gray-900 group-hover:text-[#006400]"
            }`}
          >
            {displayTitle}
          </h3>
          {displayExcerpt && (
            <p className={`mb-4 line-clamp-2 text-[13px] leading-relaxed ${variant === "dark" ? "text-white/45" : "text-gray-500"}`}>
              {displayExcerpt}
            </p>
          )}
          <div
            className={`flex items-center justify-between pt-3 text-[11px] ${
              variant === "dark" ? "border-t border-white/10 text-white/35" : "border-t border-gray-100 text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{
                  background: variant === "dark" ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #006400, #0B7A0B)",
                }}
              >
                <span className="text-[8px] font-bold text-white">U</span>
              </div>
              <span className="font-semibold">{post.author}</span>
            </div>
            {post.published_at && <span>{new Date(post.published_at).toLocaleDateString("vi-VN")}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
