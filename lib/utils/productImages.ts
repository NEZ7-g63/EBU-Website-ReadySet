import fs from "node:fs";
import path from "node:path";
import type { Product } from "@/lib/types";

/**
 * LƯU Ý: file này dùng `node:fs` — chỉ được import từ Server Component
 * (page.tsx, hoặc component không có "use client"). Import từ một file
 * "use client" sẽ làm build lỗi vì trình duyệt không có `fs`.
 */

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/** Danh sách URL ảnh thật của 1 sản phẩm, đọc từ public/images/products/<handle>/. */
export function getProductPhotos(handle: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", "products", handle);
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort(naturalCompare)
    .map((f) => `/images/products/${handle}/${encodeURIComponent(f)}`);
}

/** Gắn `photos` thật vào 1 sản phẩm — ảnh admin đã chọn (lưu trong DB) được ưu tiên. */
export function withPhotos(product: Product): Product {
  return { ...product, photos: product.photos ?? getProductPhotos(product.handle) };
}

/** Gắn `photos` thật vào 1 danh sách sản phẩm. */
export function withPhotosList(products: Product[]): Product[] {
  return products.map(withPhotos);
}
