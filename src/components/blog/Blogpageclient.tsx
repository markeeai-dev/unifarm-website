"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Clock,
} from "lucide-react";
import type { BlogPost } from "@/lib/db";
import { TAG_OPTIONS, TAG_COLOR, DEFAULT_TAG_COLOR } from "@/lib/blog-tags";
import { BorderTrace, Particles, CornerBrackets, BLOG_DECOR_KEYFRAMES } from "./Decor";
import KnowledgeBanner from "./Knowledgebanner";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function readingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200));
}

const ALL_TAG = "__all__";
const FILTER_TABS = [ALL_TAG, ...TAG_OPTIONS];

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(ALL_TAG);
  const [visibleCount, setVisibleCount] = useState(9);

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
      `}</style>

      <KnowledgeBanner />

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
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#006400]">{t("Mới nhất")}</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#006400]/25 to-transparent" />
            </div>
            <h2 className="uppercase mb-4 text-3xl font-black text-gray-900 sm:text-4xl">{t("Bài viết mới nhất")}</h2>
            <p className="mb-12 max-w-md text-sm text-gray-400">
              {t("Cập nhật mới nhất về nông nghiệp công nghệ cao từ Unifarm.")}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, i) => (
                <PostCard key={post.id} post={post} delay={i * 0.08} />
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
                  {t("Bài đọc nhiều")}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
            </div>
            <h2 className="uppercase mb-4 text-3xl font-black text-white sm:text-4xl">{t("Bài viết nổi bật")}</h2>
            <p className="mb-12 max-w-md text-sm text-white/45">{t("Những bài viết được bạn đọc quan tâm nhất.")}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularPosts.map((post, i) => (
                <PostCard key={post.id} post={post} delay={i * 0.08} variant="dark" />
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

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#006400]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#006400]">{t("Khám phá")}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#006400]/25 to-transparent" />
              </div>
              <h2 className="uppercase text-3xl font-black text-gray-900 sm:text-4xl">{t("Tất cả bài viết")}</h2>
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
                {tab === ALL_TAG ? t("Tất cả") : tab}
              </button>
            ))}
          </div>

          {filteredAll.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#006400]/25" />
              <p className="text-base">{t("Chưa có bài viết trong chuyên mục này.")}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAll.slice(0, visibleCount).map((post, i) => (
                  <PostCard key={post.id} post={post} delay={i * 0.05} />
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
                    {t("Xem thêm")} <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      {/* <section className="relative overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-16">
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
                  {t("Cùng Unifarm xây dựng nông nghiệp bền vững")}
                </h3>
                <p className="mb-8 max-w-md text-sm font-light leading-relaxed text-white/55 sm:text-base">
                  {t("Khám phá sản phẩm nông sản sạch và hành trình phát triển của Unifarm.")}
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
                      {t("Xem sản phẩm")}
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
                    {t("Tìm hiểu thêm")}
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
      </section> */}
    </main>
  );
}

/* ─────────────── Post Card ─────────────── */
function PostCard({
  post,
  delay = 0,
  variant = "light",
}: {
  post: BlogPost;
  delay?: number;
  variant?: "light" | "dark";
}) {
  const { t, tr } = useLanguage();
  const tc = TAG_COLOR[post.tag] ?? DEFAULT_TAG_COLOR;
  const mins = readingTime(post.content);

  const displayTitle = tr(post.translations, "title", post.title);
  const displayExcerpt = tr(post.translations, "excerpt", post.excerpt);
  const displayTag = tr(post.translations, "tag", post.tag);

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
            style={{ background: tc.bg, color: tc.text, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            {displayTag}
          </span>

          {(post.view_count ?? 0) > 0 && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1 text-[10px] text-white/80 backdrop-blur-sm">
              <Eye className="h-3 w-3" /> {(post.view_count || 0).toLocaleString()}
            </span>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-medium text-white/70">
            <Clock className="h-3 w-3" /> {mins} {t("phút đọc")}
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
