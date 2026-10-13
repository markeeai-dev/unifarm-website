"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Handshake,
  MapPinned,
  MessageSquare,
  Phone,
  Sprout,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * DuanContactForm — Section 4 "Bắt Đầu Dự Án Nông Nghiệp Cùng Unifarm"
 * (id="hop-tac") của trang "Dự Án & Hợp Tác". Gửi tới `/api/contact`
 * (source: "du_an") — cùng backend dùng chung với `Contactsection.tsx`.
 */

const NEEDS = [
  "Hợp tác kỹ thuật",
  "Liên kết tiêu thụ",
  "Cung ứng đầu vào",
  "Hợp tác chế biến sâu IQF & Tinh bột kháng",
  "Đăng ký Farm tour",
];

const C = {
  forest: "#063B24",
  green: "#006400",
  fresh: "#2E8B57",
};

type FormState = {
  contactName: string;
  phone: string;
  email: string;
  location: string;
  need: string;
  message: string;
  website: string;
};

const INITIAL_FORM: FormState = {
  contactName: "",
  phone: "",
  email: "",
  location: "",
  need: NEEDS[0],
  message: "",
  website: "",
};

const HIGHLIGHTS = [
  // { icon: Sprout, text: "Khảo sát thực địa và tư vấn quy hoạch farm miễn phí" },
  { icon: Truck, text: "Đồng hành từ cung ứng giống đến bao tiêu đầu ra" },
  { icon: Handshake, text: "Chuyển giao kỹ thuật SOP và hỗ trợ dài hạn tại vườn" },
];

export default function DuanContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "du_an",
          name: form.contactName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          category: form.need,
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
      id="hop-tac"
      className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-20 sm:py-10"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: C.green }}>
            {t("Cùng Unifarm hợp tác phát triển")}
          </p>
          <h2
            className="uppercase mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: C.forest }}
          >
            {t("Bắt Đầu Dự Án Nông Nghiệp Cùng Unifarm")}
          </h2>
          <p className="mx-auto mt-5 max-w-6xl text-base leading-relaxed sm:text-lg" style={{ color: C.fresh }}>
            {t(
              "Nghiên cứu & sản xuất giống · Canh tác · Chế biến · Chuyển giao công nghệ · Phát triển thị trường · Đầu tư dự án · Khác"
            )}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-0 lg:overflow-hidden lg:rounded-3xl lg:shadow-[0_30px_70px_-25px_rgba(6,59,36,0.35)]">
          {/* Ảnh + điểm nổi bật */}
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src="/images/UNIFARM/DSC00385.jpg"
              alt={t("Nông trường Unifarm — sẵn sàng đồng hành cùng nông dân và đối tác")}
              fill
              sizes="35vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#063B24]/92 via-[#063B24]/55 to-[#063B24]/10" />
            <div className="relative flex h-full flex-col justify-end gap-5 p-8">
              <p className="text-2xl font-extrabold leading-snug text-white">
                {t("Đồng hành hơn một thập kỷ phát triển nông nghiệp bền vững")}
              </p>
              <ul className="space-y-3.5">
                {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-white/90">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    {t(text)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile-only ảnh compact phía trên form */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl lg:hidden">
            <Image
              src="/images/UNIFARM/16.JPG"
              alt={t("Nông trường Unifarm — sẵn sàng đồng hành cùng nông dân và đối tác")}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#063B24]/85 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-5 text-lg font-extrabold leading-snug text-white">
              {t("Đồng hành cùng hơn một thập kỷ phát triển nông nghiệp bền vững")}
            </p>
          </div>

          <div
            className="border bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,50,0,0.18)] sm:p-9 lg:border-0 lg:shadow-none"
            style={{ borderColor: `${C.forest}14` }}
          >
          {submitted ? (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-[#f2fbf2] px-4 py-10 text-center">
              <CheckCircle2 className="h-10 w-10" style={{ color: C.green }} />
              <p className="text-base font-semibold" style={{ color: C.green }}>
                {t("Đã gửi thông tin khảo sát thành công!")}
              </p>
              <p className="max-w-sm text-sm text-neutral-500">
                {t(
                  "Cảm ơn bạn đã quan tâm hợp tác cùng Unifarm. Đội ngũ chuyên gia sẽ liên hệ lại trong vòng 24h - 48h làm việc."
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              {/* Họ và tên / Tên doanh nghiệp */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("Họ và tên của bạn / Tên Doanh nghiệp – HTX")}
                </span>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                  <Building2 className="h-4 w-4 shrink-0 text-[#006400]/70" />
                  <input
                    type="text"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder={t("Nguyễn Văn A / Công ty TNHH ...")}
                    required
                    className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </label>

              {/* SĐT + Email */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                    {t("Số điện thoại liên hệ")}
                  </span>
                  <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                    <Phone className="h-4 w-4 shrink-0 text-[#006400]/70" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0901 234 567"
                      required
                      className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                    {t("Email liên hệ")}
                  </span>
                  <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                    <MessageSquare className="h-4 w-4 shrink-0 text-[#006400]/70" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ban@doanhnghiep.vn"
                      className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                    />
                  </div>
                </label>
              </div>

              {/* Vị trí khu đất */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("Vị trí khu đất / Tỉnh thành & Diện tích dự kiến (ha)")}
                </span>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                  <MapPinned className="h-4 w-4 shrink-0 text-[#006400]/70" />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder={t("VD: Bình Phước, dự kiến 20 ha")}
                    className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </label>

              {/* Nhu cầu hợp tác */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("Nhu cầu hợp tác chính")}
                </span>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                  <ClipboardList className="h-4 w-4 shrink-0 text-[#006400]/70" />
                  <select
                    name="need"
                    value={form.need}
                    onChange={handleChange}
                    className="w-full appearance-none bg-transparent text-sm text-neutral-800 focus:outline-none"
                  >
                    {NEEDS.map((n) => (
                      <option key={n} value={n}>
                        {t(n)}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              {/* Nội dung thêm */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {t("Nội dung thông tin thêm")}
                </span>
                <div className="flex gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 transition-colors focus-within:border-[#87cefa] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87cefa]/50">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#006400]/70" />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t("Chia sẻ thêm về khu đất, mô hình hiện tại hoặc mục tiêu hợp tác...")}
                    rows={4}
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
                {submitting ? t("Đang gửi...") : t("Gửi thông tin khảo sát")}
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
