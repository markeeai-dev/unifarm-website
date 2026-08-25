/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Eye, User, Clock, Sparkles } from "lucide-react";
import type { BlogPost } from "@/lib/db";
import { TAG_COLOR, DEFAULT_TAG_COLOR } from "@/lib/blog-tags";
import { Particles, BLOG_DECOR_KEYFRAMES } from "./Decor";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ");
}

function readingTime(html: string) {
  const text = stripHtml(html);
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200));
}

export default function BlogDetailClient({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [translated, setTranslated] = useState<{ title: string; excerpt: string; content: string } | null>(null);
  const lastTranslatedLang = useRef<string>("");

  const translatePost = useCallback(
    async (targetLang: string, signal?: AbortSignal) => {
      if (lastTranslatedLang.current === targetLang) return;
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: [post.title, post.excerpt || "", post.content], targetLang }),
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const tr: string[] = data.translations;
        setTranslated({ title: tr[0] || post.title, excerpt: tr[1] || post.excerpt || "", content: tr[2] || post.content });
        lastTranslatedLang.current = targetLang;
      } catch {
        // giữ nguyên tiếng Việt nếu dịch lỗi
      }
    },
    [post]
  );

  useEffect(() => {
    const controller = new AbortController();
    if (lang !== "vi") translatePost(lang, controller.signal);
    if (lang === "vi") {
      setTranslated(null);
      lastTranslatedLang.current = "";
    }
    return () => controller.abort();
  }, [lang, translatePost]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [post.slug]);

  const isTranslated = lang !== "vi" && translated !== null;
  const mins = readingTime(post.content);
  const displayContent = isTranslated ? translated.content : post.content;

  return (
    <main className="min-h-screen text-gray-900">
      <style>{`
        ${BLOG_DECOR_KEYFRAMES}
        .detail-cta-btn { position: relative; overflow: hidden; }
        .detail-cta-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%);
          transform: translateX(-120%); pointer-events: none;
        }
        .detail-cta-btn:hover::after { animation: blog-shine 0.65s ease forwards; }
        .blog-content { line-height: 1.85; color: #4b5563; font-size: 17px; }
        .blog-content p { margin: 0.9rem 0; }
        .blog-content h1 { font-size: 32px; font-weight: 900; color: #06301B; margin: 2rem 0 1rem; line-height: 1.3; }
        .blog-content h2 { font-size: 26px; font-weight: 800; color: #06301B; margin: 1.75rem 0 0.9rem; line-height: 1.35; }
        .blog-content h3 { font-size: 21px; font-weight: 700; color: #06301B; margin: 1.5rem 0 0.75rem; }
        .blog-content h4 { font-size: 18px; font-weight: 700; color: #06301B; margin: 1.25rem 0 0.6rem; }
        .blog-content ul { padding-left: 1.4rem; margin: 1rem 0; list-style: disc; }
        .blog-content ol { padding-left: 1.4rem; margin: 1rem 0; list-style: decimal; }
        .blog-content li { margin: 0.35rem 0; }
        .blog-content a { color: #006400; text-decoration: underline; text-underline-offset: 2px; }
        .blog-content strong { color: #06301B; font-weight: 700; }
        .blog-content blockquote {
          border-left: 4px solid #006400; margin: 1.5rem 0; padding: 0.75rem 1.25rem;
          background: linear-gradient(90deg, rgba(0,100,0,0.05), transparent);
          border-radius: 0 10px 10px 0; color: #475569; font-style: italic;
        }
        .blog-content code { background: #f1f5f9; color: #006400; padding: 2px 7px; border-radius: 6px; font-family: monospace; font-size: 0.85em; }
        .blog-content pre { background: #06301B; color: #e2e8f0; padding: 1.1rem 1.3rem; border-radius: 12px; overflow: auto; margin: 1.25rem 0; }
        .blog-content pre code { background: none; color: inherit; padding: 0; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 14px; margin: 1.5rem auto; display: block; }
        .blog-content iframe, .blog-content video { max-width: 100%; border-radius: 14px; margin: 1.5rem auto; display: block; }
        .blog-content div[data-youtube-video] { display: flex; justify-content: center; margin: 1.5rem 0; }
        .blog-content hr { border: none; border-top: 2px solid rgba(0,100,0,0.12); margin: 2rem 0; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; border: 1px solid rgba(0,100,0,0.12); }
        .blog-content td, .blog-content th { border: 1px solid rgba(0,100,0,0.12); padding: 10px 14px; font-size: 0.92em; }
        .blog-content th { background: #f2f9ee; font-weight: 700; color: #06301B; }
      `}</style>

      {/* ═══════ HERO — cover image as background ═══════ */}
      <section className="relative overflow-hidden">
        {post.cover_image ? (
          <div className="absolute inset-0">
            <Image src={post.cover_image} alt={post.title} fill priority className="object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(4,26,12,0.55) 0%, rgba(4,26,12,0.75) 50%, rgba(4,26,12,0.92) 100%)" }}
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #041a0c 0%, #06301B 45%, #0B7A0B 100%)" }} />
        )}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.3) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <Particles count={12} seed={7} />

        <div className="relative z-10 mx-auto max-w-4xl px-5 pb-14 pt-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex items-center gap-2"
          >
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Blog
            </Link>
            <span className="text-white/30">/</span>
            <span className="max-w-[200px] truncate text-sm text-white/40 sm:max-w-[400px]">{post.title}</span>
          </motion.div>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {post.tag}
            </motion.div>

            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setLang("vi")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                  lang === "vi" ? "bg-white text-[#06301B]" : "text-white/70 hover:text-white"
                }`}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                  lang === "en" ? "bg-white text-[#06301B]" : "text-white/70 hover:text-white"
                }`}
              >
                English
              </button>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="uppercase mb-5 text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {isTranslated ? translated.title : post.title}
          </motion.h1>

          {(isTranslated ? translated.excerpt : post.excerpt) && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 max-w-2xl text-base font-light leading-relaxed text-white/60 sm:text-lg"
            >
              {isTranslated ? translated.excerpt : post.excerpt}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <div
              className="flex items-center gap-2.5 rounded-2xl px-4 py-2"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg, #FFFACD, #F5E98A)", boxShadow: "0 4px 10px rgba(255,250,205,0.3)" }}
              >
                <User className="h-4 w-4 text-[#06301B]" />
              </div>
              <div>
                <p className="text-xs font-bold leading-none text-white">{post.author}</p>
                <p className="mt-0.5 text-[10px] text-white/40">Unifarm</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[12px] font-medium text-white/50">
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#FFFACD]" />
                  {new Date(post.published_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#FFFACD]" /> {mins} phút đọc
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#FFFACD]" /> {(post.view_count || 0).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ ARTICLE ═══════ */}
      <div className="relative" style={{ background: "#ffffff" }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#006400 1px,transparent 1px),linear-gradient(to bottom,#006400 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 pt-8" style={{ borderTop: "2px solid rgba(0,100,0,0.08)" }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg, #006400, #0B7A0B)", boxShadow: "0 6px 18px rgba(0,100,0,0.35)" }}
              >
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{post.author}</p>
                <p className="text-[11px] text-gray-400">Biên tập bởi Unifarm</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> {(post.view_count || 0).toLocaleString()} lượt xem
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {mins} phút đọc
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ CTA ═══════ */}
      <section className="relative overflow-hidden py-14" style={{ background: "linear-gradient(160deg, #ffffff 0%, #fffef2 45%, #fffde7 100%)" }}>
        <Particles count={10} light seed={8} />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-[22px] px-8 py-10 text-center sm:px-14"
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
            <motion.div
              className="pointer-events-none absolute right-[10%] top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,250,205,0.25) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.35em] text-[#FFFACD]">Unifarm</p>
              <h3 className="uppercase mb-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Khám phá thêm về Unifarm
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-sm font-light leading-relaxed text-white/55">
                Tìm hiểu sản phẩm nông sản sạch và hành trình phát triển bền vững của chúng tôi.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/san-pham"
                    className="detail-cta-btn inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #006400, #0B7A0B)", boxShadow: "0 14px 44px rgba(0,100,0,0.42), inset 0 1px 0 rgba(255,255,255,0.15)" }}
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
                  <Sparkles className="h-4 w-4" /> Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ RELATED ═══════ */}
      {related.length > 0 && (
        <section className="relative py-20" style={{ background: "#faf9f4" }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006400]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#006400]">Liên quan</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#006400]/25 to-transparent" />
            </div>
            <h3 className="uppercase mb-10 text-2xl font-black text-gray-900">Bài viết liên quan</h3>
            <div className="grid gap-7 sm:grid-cols-3">
              {related.map((r) => {
                const rtc = TAG_COLOR[r.tag] ?? DEFAULT_TAG_COLOR;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="group block overflow-hidden rounded-[18px] transition-all duration-450"
                      style={{ background: "linear-gradient(180deg, #ffffff, #fffef5)", border: "1px solid rgba(0,100,0,0.1)", boxShadow: "0 4px 10px rgba(0,0,0,0.04)" }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {r.cover_image ? (
                          <Image
                            src={r.cover_image}
                            alt={r.title}
                            fill
                            sizes="(min-width: 640px) 33vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #fffef0, #fffacd)" }} />
                        )}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5))" }} />
                        <span className="absolute left-3 top-3 rounded-lg px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ background: rtc.bg, color: rtc.text }}>
                          {r.tag}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="line-clamp-2 text-[15px] font-bold leading-snug text-gray-900 transition group-hover:text-[#006400]">{r.title}</p>
                        {r.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">{r.excerpt}</p>}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
