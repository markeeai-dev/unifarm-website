/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Leaf, User, Mail, Phone, MessageSquare, CheckCircle2, ClipboardList } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * ContactSection — "Liên hệ" (Trà xanh / tea-plantation brand)
 * -----------------------------------------------------------
 * - Ảnh nền cố định (bg-fixed): không cuộn theo, tạo hiệu ứng parallax nhẹ
 * - Form nổi màu trắng, xuất hiện trượt từ dưới lên khi cuộn tới (IntersectionObserver)
 * - Tông màu: Vàng kem #fffacd · Xanh lá đậm #006400 · Xanh dương nhạt #87cefa
 * - Responsive chuẩn mobile-first
 *
 * Cách dùng trong Next.js (App Router):
 *  - Đổi <img> bên dưới thành next/image nếu muốn tối ưu ảnh (nhớ giữ style
 *    object-fit + fixed attachment vẫn cần một <div> nền CSS như ở đây,
 *    vì next/image không hỗ trợ background-attachment: fixed trực tiếp).
 *  - Thời gian xuất hiện form đang để 4000ms (~4s) theo yêu cầu. Có thể chỉnh
 *    nhanh ở hằng số REVEAL_DURATION_MS bên dưới.
 */

const REVEAL_DURATION_MS = 4000;

const BG_IMAGE_URL =
  "https://images.openai.com/static-rsc-4/An-vs2aGZf7YwcCbIMvarZwwLJfiV6vZ6Tj7I7qvjBPJvamXCYB6QwW4go9CYw_RvMSqr-hkcW1rSeDjuEgolSjoTC3RTFKHfdtLou10ABIYbq8UvZW7T0z46fhtjYxb4eyH0-3432ysL_RTggssYNtBhufgPFmPHKQy7l7OynJ9dWC0huxRlTIJ6yJif6Xx?purpose=fullsize";

export default function ContactSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", needs: "", message: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: form.name,
          email: form.email,
          phone: form.phone,
          category: form.needs,
          message: form.message,
          website: form.website,
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

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative isolate min-h-[78vh] w-full overflow-hidden"
    >
      {/* Ảnh nền cố định — không cuộn theo trang */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-scroll sm:bg-fixed"
        style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
        aria-hidden="true"
      />
      {/* Lớp phủ tạo độ tương phản, pha thêm sắc xanh lá đậm thương hiệu */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#00320066] via-[#00280080] to-[#001a00b3]"
        aria-hidden="true"
      />

      {/* Nội dung */}
      <div className="relative flex min-h-[78vh] w-full items-center justify-center px-4 py-10 sm:py-16">
        <div
          className="w-full max-w-md sm:max-w-lg motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100"
          style={{
            transitionProperty: "transform, opacity",
            transitionDuration: `${REVEAL_DURATION_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transform: visible ? "translateY(0)" : "translateY(96px)",
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="relative rounded-2xl bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,50,0,0.45)] sm:p-9">
            {/* Huy hiệu lá trà — điểm nhấn thương hiệu */}
            <div className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#006400] shadow-md sm:h-11 sm:w-11">
              <Leaf className="h-5 w-5 text-[#fffacd]" strokeWidth={2} />
            </div>

            {/* Eyebrow */}
            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-center rounded-full border border-[#87cefa] bg-[#fffacd]/60 px-3 py-1 text-[11px] font-medium tracking-wide text-[#006400] sm:text-xs">
                {t("Hợp tác cùng Unifarm")}
              </span>
            </div>

            {/* Tiêu đề */}
            <h2 className="uppercase mt-4 flex items-center justify-center gap-2 text-center text-3xl font-extrabold text-[#006400] sm:text-4xl lg:text-[42px]">
              {t("Trao Đổi Thông Tin Cùng Unifarm")}
              {/* <Image
                src="/images/mascot/banana-mascot.png"
                alt=""
                aria-hidden="true"
                width={200}
                height={200}
                className="h-9 w-9 rotate-[-8deg] sm:h-11 sm:w-11"
              /> */}
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm text-neutral-500 sm:text-[15px]">
              {t("Đội ngũ chuyên môn của chúng tôi sẽ liên hệ trao đổi phương án hợp tác hoặc chương trình cung ứng trong thời gian sớm nhất!")}
            </p>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center gap-3 rounded-xl bg-[#f2fbf2] px-4 py-8 text-center">
                <CheckCircle2 className="h-9 w-9 text-[#006400]" />
                <p className="text-sm font-medium text-[#006400]">
                  {t("Đã tiếp nhận thông tin thành công. Unifarm sẽ phản hồi bạn trong vòng 24h - 48h làm việc!")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 sm:space-y-4">
                {/* Honeypot chống bot — người dùng thật không thấy field này */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only"
                />
                {/* Tên */}
                <label className="block">
                  <span className="sr-only">{t("Họ và tên của bạn")}</span>
                  <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                    <User className="h-4 w-4 shrink-0 text-[#006400]/70" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("Họ và tên của bạn")}
                      required
                      className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>
                </label>

                {/* Email + SĐT */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-3">
                  <label className="block">
                    <span className="sr-only">{t("Email của bạn")}</span>
                    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                      <Mail className="h-4 w-4 shrink-0 text-[#006400]/70" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t("Email của bạn")}
                        required
                        className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="sr-only">{t("Số điện thoại của bạn")}</span>
                    <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                      <Phone className="h-4 w-4 shrink-0 text-[#006400]/70" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={t("Số điện thoại của bạn")}
                        className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                  </label>
                </div>

                {/* Nhu cầu */}
                <label className="block">
                  <span className="sr-only">{t("Nhu cầu")}</span>
                  <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                    <ClipboardList className="h-4 w-4 shrink-0 text-[#006400]/70" />
                    <select
                      name="needs"
                      value={form.needs}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-neutral-800 focus:outline-none"
                    >
                      <option value="" disabled>
                        {t("Nhu cầu")}
                      </option>
                      <option value="Mua hàng">{t("Mua hàng")}</option>
                      <option value="Cung ứng">{t("Cung ứng")}</option>
                      <option value="Hợp tác Farm">{t("Hợp tác Farm")}</option>
                      <option value="Nghề nghiệp">{t("Nghề nghiệp")}</option>
                    </select>
                  </div>
                </label>

                {/* Thông tin chi tiết */}
                <label className="block">
                  <span className="sr-only">{t("Thông tin chi tiết")}</span>
                  <div className="flex gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#006400]/70" />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("Thông tin chi tiết")}
                      rows={4}
                      required
                      className="w-full resize-none bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>
                </label>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                {/* Nút gửi */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#006400] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#004d00] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:mx-auto sm:px-10"
                >
                  {submitting ? t("Đang gửi…") : t("Gửi Yêu Cầu Hợp Tác")}
                  {/* <Image
                    src="/images/mascot/banana-mascot.png"
                    alt=""
                    aria-hidden="true"
                    width={200}
                    height={200}
                    className="h-6 w-6 transition-transform group-hover:translate-x-0.5"
                  /> */}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}