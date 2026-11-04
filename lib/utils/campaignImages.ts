import fs from "node:fs";
import path from "node:path";

/**
 * LƯU Ý: dùng `node:fs` — chỉ import từ Server Component (cùng nguyên tắc
 * như lib/utils/productImages.ts).
 */

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function listImages(baseDir: string, subDir: string): string[] {
  const folder = path.join(process.cwd(), "public", "images", baseDir, subDir);
  let files: string[];
  try {
    files = fs.readdirSync(folder);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort(naturalCompare)
    .map((f) => `/images/${baseDir}/${subDir}/${encodeURIComponent(f)}`);
}

/** Gộp ảnh từ cả 2 thư mục con (screenshots trước, photos sau) của 1 campaign. */
function getImagesFromCampaignFolder(baseDir: string): string[] {
  return [...listImages(baseDir, "screenshots"), ...listImages(baseDir, "photos")];
}

/** Campaign 1 (feedback khách hàng) — public/images/campaign/{screenshots,photos}/ */
export function getCampaignImages(): string[] {
  return getImagesFromCampaignFolder("campaign");
}

/** Campaign 2 — public/images/campaign2/{screenshots,photos}/ */
export function getCampaign2Images(): string[] {
  return getImagesFromCampaignFolder("campaign2");
}

/** Campaign 3 — public/images/campaign3/{screenshots,photos}/ */
export function getCampaign3Images(): string[] {
  return getImagesFromCampaignFolder("campaign3");
}
