import fs from "node:fs";
import path from "node:path";

/**
 * LƯU Ý: dùng `node:fs` — chỉ được import từ Server Component, không từ file
 * "use client" (xem lib/utils/productImages.ts, cùng nguyên tắc).
 */

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/**
 * Tìm file "<baseName>.<ext>" trong public/images/<dir>/, trả về URL hoặc null nếu chưa có.
 * URL kèm "?v=<thời điểm sửa file>" — để khi thay ảnh mới (giữ nguyên tên file), trình duyệt
 * (và bộ tối ưu ảnh của Next) buộc phải tải lại bản mới thay vì dùng bản cũ đã cache theo URL cũ.
 */
function findStaticImage(dir: string, baseName: string): string | null {
  const folder = path.join(process.cwd(), "public", "images", dir);
  for (const ext of IMAGE_EXTENSIONS) {
    const file = `${baseName}${ext}`;
    const fullPath = path.join(folder, file);
    if (fs.existsSync(fullPath)) {
      const version = Math.floor(fs.statSync(fullPath).mtimeMs);
      return `/images/${dir}/${file}?v=${version}`;
    }
  }
  return null;
}

export function getHeroImages(): { desktop: string | null; mobile: string | null } {
  return {
    desktop: findStaticImage("home", "hero-desktop"),
    mobile: findStaticImage("home", "hero-mobile"),
  };
}
