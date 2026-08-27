/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

/**
 * HeThongPhanPhoi — "Hệ thống phân phối".
 * Trang danh sách cửa hàng: breadcrumb, tiêu đề + divider lá cây, bộ lọc
 * Tỉnh/TP - Quận/Huyện, và bảng cửa hàng (STT / Cửa hàng / Thời gian
 * hoạt động / Điện thoại) — chuyển thành danh sách thẻ gọn trên mobile.
 * Giữ đúng tông thương hiệu Unifarm: nền kem, chữ forest/green, mono eyebrow.
 */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Home, Clock, Phone, MapPin, Leaf, ChevronDown } from "lucide-react";
import type { Distributor } from "@/lib/db";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

const C = {
  forest: "#063B24",
  green: "#006400",
  ink: "#12210F",
  muted: "#5B6B5F",
};

export default function HeThongPhanPhoi({ stores }: { stores: Distributor[] }) {
  const { t, tr } = useLanguage();
  const reduce = useReducedMotion();
  const [district, setDistrict] = useState<string>("");

  const provinces = useMemo(
    () => Array.from(new Set(stores.map((s) => s.province))),
    [stores]
  );
  const province = provinces[0] ?? "Hồ Chí Minh";

  const districts = useMemo(
    () => Array.from(new Set(stores.map((s) => s.district))),
    [stores]
  );

  const filtered = useMemo(
    () => (district ? stores.filter((s) => s.district === district) : stores),
    [stores, district]
  );

  return (
    <section className="relative w-full overflow-hidden bg-[#fffde7] bg-[url('/images/nen_vang.jpg')] bg-repeat py-14 font-body sm:py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#87cefa]/12 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#ffb08a]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={reduce ? false : { opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 border-b pb-4 text-sm"
          style={{ borderColor: `${C.forest}14` }}
        >
          <a
            href="/"
            className="flex items-center gap-1 font-semibold transition-colors hover:opacity-70"
            style={{ color: C.green }}
          >
            <Home size={13} strokeWidth={2.2} />
            {t("Trang chủ")}
          </a>
          <ChevronRight size={13} style={{ color: `${C.forest}55` }} />
          <span className="font-semibold" style={{ color: C.forest }}>
            {province}
          </span>
        </motion.nav>

        {/* Tiêu đề + divider */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          className="mx-auto mt-10 max-w-xl text-center sm:mt-12"
        >
          <h2 className="uppercase text-4xl font-extrabold leading-tight tracking-tight text-[#06301B] sm:text-5xl">
            {t("Hệ thống phân phối")}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-14 bg-[#006400]/30" />
            <Leaf size={18} style={{ color: C.green }} strokeWidth={1.8} />
            <span className="h-px w-14 bg-[#006400]/30" />
          </div>
        </motion.div>

        {/* Bộ lọc */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mx-auto mt-9 flex max-w-xl flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <FilterSelect
            label={t("Tỉnh/TP")}
            value={province}
            disabled
            options={provinces}
          />
          <FilterSelect
            label={t("Quận/Huyện")}
            value={district}
            placeholder={t("Chọn Quận/Huyện")}
            onChange={setDistrict}
            options={districts}
          />
        </motion.div>

        {/* Bảng cửa hàng — desktop */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-9 hidden overflow-hidden rounded-xl sm:mt-11 sm:block"
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr
                className="border-b-2 text-sm font-bold uppercase tracking-wide"
                style={{ borderColor: C.green, color: C.forest, background: "#f7f6ec" }}
              >
                <th className="w-16 py-3.5 pl-5 font-bold">{t("STT")}</th>
                <th className="py-3.5 font-bold">{t("Cửa hàng")}</th>
                <th className="py-3.5 font-bold">{t("Thời gian hoạt động")}</th>
                <th className="py-3.5 pr-5 font-bold">{t("Điện thoại")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((store, i) => (
                <tr
                  key={store.id}
                  className="group border-b transition-colors duration-200 hover:bg-[#006400]/[0.04]"
                  style={{ borderColor: `${C.forest}0f` }}
                >
                  <td className="py-4 pl-5 font-mono text-base" style={{ color: `${C.forest}80` }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-4 pr-4">
                    <p className="text-lg font-bold" style={{ color: C.ink }}>
                      {tr(store.translations, "name", store.name)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm" style={{ color: C.muted }}>
                      <MapPin size={12} strokeWidth={2} />
                      {store.address}
                    </p>
                  </td>
                  <td className="py-4 pr-4 text-base" style={{ color: C.ink }}>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} strokeWidth={2} style={{ color: C.green }} />
                      {store.hours}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-base font-semibold" style={{ color: C.forest }}>
                    <a
                      href={`tel:${store.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 transition-colors hover:opacity-70"
                    >
                      <Phone size={14} strokeWidth={2} style={{ color: C.green }} />
                      {store.phone}
                    </a>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm" style={{ color: C.muted }}>
                    {t("Chưa có cửa hàng tại khu vực này.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Danh sách cửa hàng — mobile */}
        <div className="mt-9 space-y-3 sm:hidden">
          {filtered.map((store, i) => (
            <motion.div
              key={store.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE }}
              className="rounded-xl border bg-white/70 p-4 shadow-[0_6px_18px_-12px_rgba(6,40,20,0.35)]"
              style={{ borderColor: `${C.forest}12` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-semibold" style={{ color: `${C.forest}80` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-0.5 text-base font-bold" style={{ color: C.ink }}>
                    {tr(store.translations, "name", store.name)}
                  </p>
                </div>
              </div>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm " style={{ color: C.muted }}>
                <MapPin size={13} strokeWidth={2} className="mt-[1px] shrink-0" />
                {store.address}
              </p>
              <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: `${C.forest}0f` }}>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: C.ink }}>
                  <Clock size={13} strokeWidth={2} style={{ color: C.green }} />
                  {store.hours}
                </span>
                <a
                  href={`tel:${store.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold"
                  style={{ color: C.forest }}
                >
                  <Phone size={13} strokeWidth={2} style={{ color: C.green }} />
                  {store.phone}
                </a>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: C.muted }}>
              {t("Chưa có cửa hàng tại khu vực này.")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FilterSelect — dropdown Tỉnh/TP, Quận/Huyện dùng chung               */
/* ------------------------------------------------------------------ */

function FilterSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="flex flex-1 items-center gap-3">
      <span
        className="w-24 shrink-0 text-base font-semibold sm:w-auto"
        style={{ color: C.forest }}
      >
        {label}
      </span>
      <span className="relative flex-1">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-base font-medium outline-none transition-colors focus:border-[#006400] disabled:cursor-not-allowed disabled:opacity-70"
          style={{ borderColor: `${C.forest}22`, color: C.ink }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: `${C.forest}70` }}
        />
      </span>
    </label>
  );
}
