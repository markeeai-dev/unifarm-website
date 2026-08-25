"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, ImageOff } from "lucide-react";

async function uploadFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  return data.ok ? (data.url as string) : null;
}

/** Upload 1 ảnh duy nhất (VD: ảnh đại diện sản phẩm, ảnh bìa bài viết). */
export function SingleImageUploader({
  value,
  onChange,
  label,
  hint,
  aspect = "aspect-square",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-semibold text-[#06301B]">{label}</label>}
      <div
        onDragOver={(e: DragEvent) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`group relative flex ${aspect} w-full max-w-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-gray-50 transition-colors ${
          dragOver ? "border-[#006400] bg-[#f2f9ee]" : "border-black/10 hover:border-[#006400]/40"
        }`}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="220px" className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#06301B]">Đổi ảnh</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </>
        ) : uploading ? (
          <Loader2 size={22} className="animate-spin text-[#006400]" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-3 text-center">
            <UploadCloud size={22} className="text-[#006400]" />
            <span className="text-xs font-semibold text-gray-500">Kéo thả hoặc click để chọn ảnh</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

/** Upload nhiều ảnh (thư viện ảnh sản phẩm), kéo-thả để sắp xếp lại thứ tự. */
export function GalleryUploader({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const imgs = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setUploading(true);
    setPending(imgs.length);
    const urls: string[] = [];
    for (const file of imgs) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
      setPending((p) => p - 1);
    }
    onChange([...value, ...urls]);
    setUploading(false);
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const onDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const next = [...value];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(overIdx, 0, moved);
      onChange(next);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div>
      <div
        onDragOver={(e: DragEvent) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragOver ? "border-[#006400] bg-[#f2f9ee]" : "border-black/10 bg-gray-50 hover:border-[#006400]/40"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={22} className="animate-spin text-[#006400]" />
            <span className="text-xs font-semibold text-gray-500">Đang upload{pending > 0 ? ` — còn ${pending} ảnh` : ""}...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <UploadCloud size={22} className="text-[#006400]" />
            <span className="text-sm font-semibold text-[#06301B]">Kéo thả hoặc click để upload nhiều ảnh</span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP · Tối đa 5MB/ảnh · Chọn nhiều file cùng lúc</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />

      {value.length > 0 && (
        <>
          <p className="mb-2 mt-3.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {value.length} ảnh · kéo thả để sắp xếp · ảnh đầu = ảnh đại diện
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
            {value.map((url, i) => (
              <div
                key={`${url}-${i}`}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragEnter={() => setOverIdx(i)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border-2 bg-gray-50 transition-all ${
                  i === 0 ? "border-[#006400]" : overIdx === i ? "border-dashed border-[#006400]" : "border-black/10"
                } ${dragIdx === i ? "opacity-40" : ""}`}
              >
                {url ? (
                  <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><ImageOff size={20} className="text-gray-300" /></div>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
                {i === 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-[#006400] py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
                    Đại diện
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
