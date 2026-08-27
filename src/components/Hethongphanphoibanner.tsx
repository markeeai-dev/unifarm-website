/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useIntroReady } from "@/lib/use-intro-ready";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

/**
 * HeThongPhanPhoiBanner — banner đầu trang "Hệ thống phân phối".
 * Nav/logo dùng chung HomeTopHeader (render toàn site trong layout.tsx).
 * Cùng pattern các banner tĩnh khác của site: ảnh nền + gradient xanh
 * đậm phủ lên, tiêu đề căn giữa. Dùng useIntroReady() để đồng bộ hiệu
 * ứng xuất hiện với SiteIntro.
 */

export default function HeThongPhanPhoiBanner() {
  const [mounted, setMounted] = useState(false);
  const introReady = useIntroReady();
  const { t, locale } = useLanguage();

  useEffect(() => {
    if (introReady) setMounted(true);
  }, [introReady]);

  return (
    <section className="relative isolate w-full overflow-hidden">
      <div
        className="relative flex min-h-[62vh] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[74vh] sm:py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,48,27,0.15), rgba(6,48,27,0.15)), linear-gradient(90deg, rgba(6,48,27,0.82) 0%, rgba(6,48,27,0.28) 24%, rgba(6,48,27,0.28) 76%, rgba(6,48,27,0.82) 100%), url('/images/UNIFARM/UNIFARM/hinh-chinh/banner-phanphoi.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          className={`mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFFACD]/40 bg-[#FFFACD]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFFACD] transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="hpp-badge-dot h-1.5 w-1.5 rounded-full bg-[#FFFACD]" />
          {t("Unifarm trên toàn quốc")}
        </span>

        <h1
          className={`max-w-3xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.85)" }}
        >
          {locale === "vi" ? (
            <>
              Hệ thống <span className="text-[#FFFACD]">phân phối</span>
            </>
          ) : (
            t("Hệ thống phân phối")
          )}
        </h1>

        <p
          className={`mx-auto mt-5 max-w-2xl text-sm font-light text-white/85 transition-all delay-150 duration-700 sm:text-lg ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.85)" }}
        >
          {t(
            "Tìm cửa hàng Unifarm gần bạn nhất — nông sản sạch, an toàn, chuẩn truy xuất nguồn gốc, sẵn sàng phục vụ mỗi ngày."
          )}
        </p>
      </div>

      <style>{`
        @keyframes hpp-badge-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .hpp-badge-dot {
          animation: hpp-badge-blink 2s infinite;
        }
      `}</style>
    </section>
  );
}
