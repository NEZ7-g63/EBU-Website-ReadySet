import fs from "node:fs";
import path from "node:path";

/**
 * LƯU Ý: file này dùng `node:fs` — chỉ được import từ Server Component
 * (page.tsx, layout.tsx, hoặc component không có "use client"). Import từ một
 * file "use client" sẽ làm build lỗi vì trình duyệt không có `fs`.
 */

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Ảnh đại diện thật của 1 danh mục (Category tiles trang chủ, ảnh hover trong menu),
 * đọc từ public/images/collections/<handle>.<đuôi file> — ví dụ tops.jpg, bottoms.jpg
 * (xem public/images/collections/README.md). Trả về null nếu chưa có ảnh, lúc đó UI
 * tự rơi về placeholder màu.
 */
export function getCollectionCover(handle: string): string | null {
  const dir = path.join(process.cwd(), "public", "images", "collections");
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return null;
  }
  const match = files
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext) && f.slice(0, f.length - ext.length) === handle;
    })
    .sort(naturalCompare)[0];
  if (!match) return null;
  // "?v=<thời điểm sửa file>" — thay ảnh mới (giữ nguyên tên tops.jpg/bottoms.jpg...) vẫn
  // buộc trình duyệt tải lại bản mới thay vì dùng bản cũ đã cache theo URL cũ.
  const version = Math.floor(fs.statSync(path.join(dir, match)).mtimeMs);
  return `/images/collections/${encodeURIComponent(match)}?v=${version}`;
}

/** Gắn ảnh đại diện thật cho nhiều danh mục cùng lúc — trả về map handle -> url | null. */
export function getCollectionCovers(handles: string[]): Record<string, string | null> {
  return Object.fromEntries(handles.map((h) => [h, getCollectionCover(h)]));
}
