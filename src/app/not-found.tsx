import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <Image
        src="/images/logo-unifarm.png"
        alt="Unifarm"
        width={72}
        height={72}
        className="h-16 w-16 object-contain opacity-90 sm:h-[72px] sm:w-[72px]"
      />
      <p className="mt-6 text-6xl font-extrabold text-[#006400] sm:text-7xl">404</p>
      <h1 className="mt-3 text-xl font-extrabold text-[#06301B] sm:text-2xl">
        Không tìm thấy trang bạn cần
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
        Trang này có thể đã bị xoá hoặc đường dẫn không còn chính xác. Hãy quay lại trang chủ để tiếp tục khám phá Unifarm.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#006400] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004d00]"
      >
        <Home size={16} /> Về trang chủ
      </Link>
    </div>
  );
}
