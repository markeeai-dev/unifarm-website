"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const CATEGORIES = [
  "Vị trí tuyển dụng",
  "Công việc",
  "Nơi làm việc",
  "Thu nhập & phúc lợi",
  "Cơ hội phát triển",
  "Khác",
];

function FloatingIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}

export default function FeedbackBox() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name,
          email: contact,
          category: category || "",
          message,
          website,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t("Có lỗi xảy ra, vui lòng thử lại."));
        return;
      }
      setSubmitted(true);
    } catch {
      setError(t("Không thể kết nối, vui lòng kiểm tra mạng và thử lại."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setContact("");
    setMessage("");
    setCategory(null);
    setSubmitted(false);
    setError("");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06301B] via-[#06301B] to-[#006400] py-16 sm:py-20 lg:py-28">
      {/* decorative ambient glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-[#FFFACD]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left — intro text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-[#FFFACD]">
              <FloatingIcon>
                <MessageCircleHeart size={18} />
              </FloatingIcon>
              {t("Trao đổi với Unifarm")}
            </p>

            <h2 className="mt-2 text-2xl font-extrabold uppercase leading-snug text-white sm:text-3xl lg:text-4xl">
              {t("Bạn còn điều gì muốn biết?")}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-[15px]">
              {t(
                "Bạn muốn hiểu thêm về một vị trí, nơi làm việc, môi trường, cơ hội phát triển hay cuộc sống tại nông trường? Hãy gửi câu hỏi cho Unifarm."
              )}
            </p>
          </motion.div>

          {/* Right — form card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-2xl shadow-black/20 sm:p-8"
          >
            {/* decorative glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FFFACD]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#06301B]/10 blur-3xl" />

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="relative space-y-5"
                >
                  {/* Honeypot chống bot — người dùng thật không thấy field này */}
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="sr-only"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#06301B]">
                      {t("Chủ đề")} <span className="font-normal text-[#06301B]/40">{t("(không bắt buộc)")}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CATEGORIES.map((c) => {
                        const active = category === c;
                        return (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setCategory(active ? null : c)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
                              active
                                ? "border-[#06301B] bg-[#06301B] text-white"
                                : "border-[#06301B]/15 bg-white text-[#06301B]/60 hover:border-[#06301B]/40 hover:text-[#06301B]"
                            }`}
                          >
                            {t(c)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="feedback-name" className="text-sm font-semibold text-[#06301B]">
                        {t("Họ và tên")}
                      </label>
                      <input
                        id="feedback-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("Nguyễn Văn A")}
                        className="mt-2 w-full rounded-xl border border-[#06301B]/15 bg-white p-4 text-sm text-[#06301B] outline-none transition-all duration-200 placeholder:text-[#06301B]/35 focus:border-[#06301B] focus:ring-4 focus:ring-[#06301B]/10 sm:text-[15px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="feedback-contact" className="text-sm font-semibold text-[#06301B]">
                        {t("Email / Số điện thoại")}
                      </label>
                      <input
                        id="feedback-contact"
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={t("Email hoặc số điện thoại")}
                        className="mt-2 w-full rounded-xl border border-[#06301B]/15 bg-white p-4 text-sm text-[#06301B] outline-none transition-all duration-200 placeholder:text-[#06301B]/35 focus:border-[#06301B] focus:ring-4 focus:ring-[#06301B]/10 sm:text-[15px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="feedback-message" className="text-sm font-semibold text-[#06301B]">
                      {t("Câu hỏi của bạn")}
                    </label>
                    <textarea
                      id="feedback-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("Chia sẻ điều bạn muốn biết thêm về Unifarm…")}
                      className="mt-2 w-full resize-none rounded-xl border border-[#06301B]/15 bg-white p-4 text-sm leading-relaxed text-[#06301B] outline-none transition-all duration-200 placeholder:text-[#06301B]/35 focus:border-[#06301B] focus:ring-4 focus:ring-[#06301B]/10 sm:text-[15px]"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFFACD] px-6 py-3.5 text-sm font-semibold text-[#06301B] transition-all hover:gap-3 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:gap-2 disabled:hover:scale-100 sm:w-auto sm:px-8"
                  >
                    <Send size={16} />
                    {submitting ? t("Đang gửi…") : t("Gửi câu hỏi")}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative flex flex-col items-center py-8 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: "backOut" }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#06301B] text-white"
                  >
                    <CheckCircle2 size={30} />
                  </motion.span>

                  <h3 className="uppercase mt-5 text-lg font-bold text-[#06301B]">
                    {t("Cảm ơn bạn đã gửi câu hỏi!")}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#06301B]/60">
                    {t(
                      "Unifarm đã nhận được câu hỏi của bạn và sẽ liên hệ lại sớm nhất có thể."
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 text-sm font-semibold text-[#006400] transition-colors hover:text-[#06301B] hover:underline underline-offset-4"
                  >
                    {t("Gửi câu hỏi khác")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
