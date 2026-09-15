"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <Image
        src="/images/logo-unifarm.png"
        alt="Unifarm"
        width={72}
        height={72}
        className="h-16 w-16 object-contain opacity-90 sm:h-[72px] sm:w-[72px]"
      />
      <h1 className="mt-6 text-xl font-extrabold text-[#06301B] sm:text-2xl">Đã có lỗi xảy ra</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
        Rất tiếc, trang gặp sự cố ngoài ý muốn. Vui lòng thử lại — nếu vẫn lỗi, hãy quay về trang chủ.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-[#006400] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
        >
          <RefreshCw size={16} /> Thử lại
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#06301B]/15 px-6 py-3 text-sm font-bold text-[#06301B] transition-colors hover:bg-gray-50"
        >
          <Home size={16} /> Về trang chủ
        </Link>
      </div>
    </div>
  );
}
