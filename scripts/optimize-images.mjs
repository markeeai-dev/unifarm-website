// Nén lại các ảnh gốc quá nặng trong /public (ảnh chụp thẳng từ máy ảnh,
// chưa qua xử lý — có file lên tới ~19MB). Ghi đè TẠI CHỖ cùng path/tên file
// nên không cần sửa bất kỳ chỗ nào khác trong code; cả next/image lẫn thẻ
// <img> thường đều tự động được lợi.
// Usage: node scripts/optimize-images.mjs [--dry-run]
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const SIZE_THRESHOLD = 800 * 1024; // 800KB — chỉ đụng tới ảnh thực sự nặng
const MAX_EDGE = 2400; // dư dả cho retina trên nội dung rộng nhất ~1600px
const DRY_RUN = process.argv.includes("--dry-run");

// Loop webp động (video-loops/*.webp) đã được tinh chỉnh kỹ fps/quality
// riêng ở phiên làm việc trước — không đụng vào để khỏi phá hoạt ảnh.
const SKIP_DIRS = new Set(["video-loops"]);
const EXT_HANDLERS = {
  ".jpg": "jpeg",
  ".jpeg": "jpeg",
  ".png": "png",
};

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(path.join(dir, entry.name));
    } else {
      yield path.join(dir, entry.name);
    }
  }
}

async function optimizeOne(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const kind = EXT_HANDLERS[ext];
  if (!kind) return null;

  const before = (await stat(filePath)).size;
  if (before < SIZE_THRESHOLD) return null;

  const original = await sharp(filePath, { failOn: "none" }).rotate().toBuffer();
  let pipeline = sharp(original).resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  pipeline = kind === "jpeg" ? pipeline.jpeg({ quality: 80, mozjpeg: true }) : pipeline.png({ compressionLevel: 9 });

  const output = await pipeline.toBuffer();
  // Giữ nguyên file gốc nếu nén lại không nhỏ hơn (ảnh vốn đã tối ưu tốt).
  if (output.length >= before) return { filePath, before, after: before, skipped: true };

  if (!DRY_RUN) {
    const fs = await import("node:fs/promises");
    // Ghi ra file tạm rồi rename đè lên — ghi trực tiếp vào filePath thất
    // bại trên Windows (sharp/libvips vẫn giữ tham chiếu mmap tới file vừa
    // đọc để encode, nên ghi đè tại chỗ bị deny; rename thì không sao).
    const tmpPath = `${filePath}.tmp`;
    await fs.writeFile(tmpPath, output);
    await fs.rename(tmpPath, filePath);
  }
  return { filePath, before, after: output.length, skipped: false };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for await (const filePath of walk(PUBLIC_DIR)) {
    const result = await optimizeOne(filePath).catch((err) => {
      console.error(`Lỗi xử lý ${filePath}:`, err.message);
      return null;
    });
    if (!result || result.skipped) continue;
    count += 1;
    totalBefore += result.before;
    totalAfter += result.after;
    const rel = path.relative(PUBLIC_DIR, result.filePath);
    console.log(
      `${rel}: ${(result.before / 1024 / 1024).toFixed(2)}MB -> ${(result.after / 1024 / 1024).toFixed(2)}MB`
    );
  }

  console.log(`\n${DRY_RUN ? "[dry-run] " : ""}Đã xử lý ${count} ảnh.`);
  console.log(`Tổng: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
